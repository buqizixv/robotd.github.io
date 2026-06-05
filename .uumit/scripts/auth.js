#!/usr/bin/env node
/**
 * UUMit Skill — Auth Script (Node.js version)
 *
 * Usage:
 *   node auth.js --start [--platform <type>]  # 发起设备授权；platform 见 API_REFERENCE.md（默认 openclaw）
 *   node auth.js --wait <device_code>         # Agent 友好：单次轮询并返回结构化 JSON
 *   node auth.js --check                      # 检查现有凭证
 *   node auth.js --reset            # Clear credentials and re-auth
 *   node auth.js --cron-active      # Mark cruise schedule as active
 *   node auth.js --cruise-unavailable  # Mark cruise as unavailable
 *
 * Design: auth.js is optimized for Agent tool calls. Commands are short-lived,
 * deterministic, and return machine-readable JSON on stdout.
 *
 * Output: JSON to stdout, diagnostics to stderr
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SKILL_DIR_AUTH = path.resolve(__dirname, '..');
function _resolveBaseUrl() {
  if (process.env.UUMIT_BASE_URL) return process.env.UUMIT_BASE_URL;
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(SKILL_DIR_AUTH, 'memory', 'uumit-config.json'), 'utf8'));
    if (cfg.base_url) return cfg.base_url;
  } catch (_) {}
  return 'https://api.uumit.com';
}
const BASE_URL = _resolveBaseUrl();
const TIMEOUT = 15000;
const DEFAULT_AUTH_TIMEOUT_SECONDS = 600; // 10 minutes
const CRUISE_INTERVAL_SECONDS = 30 * 60;       // 30 分钟：状态对账巡航
const INBOX_CRUISE_INTERVAL_SECONDS = 5 * 60;  // 5 分钟：收件箱（申请+推送）
const APPLY_CRUISE_INTERVAL_SECONDS = 15 * 60; // 15 分钟：任务大厅申请
const DELIVER_CRUISE_INTERVAL_SECONDS = 10 * 60; // 10 分钟：已承接任务交付
// 兼容旧字段，保留引用不报错
const WORK_CRUISE_INTERVAL_SECONDS = APPLY_CRUISE_INTERVAL_SECONDS;

const SKILL_DIR = path.resolve(__dirname, '..');
const AUTH_FILE = path.join(SKILL_DIR, 'memory', 'uumit-auth.json');
const STATE_FILE = path.join(SKILL_DIR, 'memory', 'uumit-state.json');

/** 须与 API_REFERENCE.md「认证与互通」中 `agent_platform_type` 枚举一致 */
const ALLOWED_AGENT_PLATFORM_TYPES = new Set([
  'openclaw',
  'claude_desktop',
  'cursor',
  'custom_mcp',
  'hermes_agent',
]);

const baseUrlObj = new URL(BASE_URL);
const isHttps = baseUrlObj.protocol === 'https:';

function log(msg) {
  console.error(msg);
}

function emitJson(payload) {
  process.stdout.write(JSON.stringify(payload) + '\n');
}

function makeRequest(method, urlPath, headers = null, bodyData = null) {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + urlPath;
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method,
      headers: headers || { 'Content-Type': 'application/json' },
      timeout: TIMEOUT,
    };

    const mod = isHttps ? https : http;
    const req = mod.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf-8');
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error(`invalid JSON: ${raw.slice(0, 200)}`));
        }
      });
    });
    req.on('error', (e) => reject(e));
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

function apiRequest(method, urlPath, body = null, headers = null) {
  const h = headers || { 'Content-Type': 'application/json' };
  const bodyStr = body ? JSON.stringify(body) : null;
  return makeRequest(method, urlPath, h, bodyStr);
}

/** 解析授权绑定的宿主类型：CLI `--platform` 优先，其次 UUMIT_AGENT_PLATFORM_TYPE，默认 openclaw */
function resolveAgentPlatformType(argv) {
  const platIdx = argv.indexOf('--platform');
  const next = platIdx !== -1 ? argv[platIdx + 1] : '';
  const fromCli = next && !next.startsWith('--') ? next : '';
  const raw = (fromCli || process.env.UUMIT_AGENT_PLATFORM_TYPE || 'openclaw').trim();
  if (ALLOWED_AGENT_PLATFORM_TYPES.has(raw)) return raw;
  log(`警告: agent_platform_type="${raw}" 不在白名单，改用 custom_mcp`);
  return 'custom_mcp';
}

async function deviceAuth(agentPlatformType) {
  const resp = await apiRequest('POST', '/api/v1/auth/device-auth', {
    agent_platform_type: agentPlatformType,
  });
  if (resp.code !== 0) {
    log(`授权失败: ${resp.message}`);
    return null;
  }
  return resp.data;
}

async function pollAuth(deviceCode) {
  const resp = await apiRequest('POST', '/api/v1/auth/device-auth/poll', { device_code: deviceCode });
  const data = resp.data || {};
  const status = data.status || '';
  if (status === 'approved') return { status: 'approved', ...data };
  if (status === 'expired') { log('授权码已过期'); return { status: 'expired' }; }
  if (status === 'denied') { log('用户拒绝授权'); return { status: 'denied' }; }
  return { status: 'pending' }; // still waiting
}

async function handleApprovedAuth(result, agentPlatformType = process.env.UUMIT_AGENT_PLATFORM_TYPE || 'openclaw') {
  const apiKey = result.api_key;
  const userId = result.user_id;
  saveCredentials(apiKey, userId);
  const scheduleRequest = registerCruiseSchedule();
  const inboxScheduleRequest = buildInboxCruiseScheduleRequest();
  const applyScheduleRequest = buildApplyCruiseScheduleRequest();
  const deliverScheduleRequest = buildDeliverCruiseScheduleRequest();
  const mcpRequest = buildMcpRegistrationRequest(apiKey, userId);
  const runtimeConnectRequest = buildRuntimeConnectRequest();
  const postAuth = buildPostAuthOnboarding(apiKey, userId, agentPlatformType);
  savePostAuthOnboarding(postAuth);

  log('获取账户信息...');
  let wallet = {};
  let cruise = {};
  let snapshotError = null;
  try {
    ({ wallet, cruise } = await getAccountInfo(apiKey, userId));
  } catch (e) {
    snapshotError = e.message;
    log(`账户快照获取失败，但授权凭证已保存: ${snapshotError}`);
  }
  const ut = (wallet && wallet.ut) || {};
  const profile = (cruise && cruise.profile && cruise.profile.profile) || {};
  return {
    ok: true,
    status: snapshotError ? 'authorized_with_snapshot_error' : 'authorized',
    user_id: userId,
    wallet: { ut },
    profile: {
      nickname: profile.nickname || 'unknown',
      completeness: profile.completeness || 0,
    },
    cruise: {
      registered: true,
      host_schedule_required: true,
      host_schedule_status: 'pending',
      interval_seconds: CRUISE_INTERVAL_SECONDS,
      schedule_name: 'uumit-account-cruise',
      schedule_request: scheduleRequest,
    },
    inbox_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: INBOX_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-inbox-cruise', schedule_request: inboxScheduleRequest },
    apply_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: APPLY_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-apply-cruise', schedule_request: applyScheduleRequest },
    deliver_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: DELIVER_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-deliver-cruise', schedule_request: deliverScheduleRequest },
    runtime_connect: {
      ...runtimeConnectRequest,
      auto_started: false,
      skipped_auto_start: true,
      agent_must_start_explicitly: true,
    },
    mcp_request: mcpRequest,
    schedule_request: scheduleRequest,
    work_schedule_request: applyScheduleRequest,
    schedule_requests: [scheduleRequest, inboxScheduleRequest, applyScheduleRequest, deliverScheduleRequest],
    post_auth: postAuth,
    next_actions: postAuth.next_actions,
    snapshot_error: snapshotError,
  };
}

async function waitForApprovedAuth(deviceCode, agentPlatformType) {
  log('单次轮询授权状态；Agent 应按 retry_after_seconds 重复调用 --wait。');
  const result = await pollAuth(deviceCode);
  if (result.status === 'approved') {
    return handleApprovedAuth(result, agentPlatformType);
  }
  if (result.status === 'expired' || result.status === 'denied') {
    return {
      ok: false,
      status: result.status,
      error: 'authorization_failed',
      retryable: false,
      next_command: `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --start`,
    };
  }
  return {
    ok: true,
    status: 'pending',
    retryable: true,
    retry_after_seconds: 5,
    required_next_command: `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --wait ${deviceCode}`,
    agent_loop_instruction: 'Run required_next_command again after retry_after_seconds until status is authorized, authorized_with_snapshot_error, expired, or denied.',
  };
}

function saveCredentials(apiKey, userId) {
  const dir = path.dirname(AUTH_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify({
    cached_api_key: apiKey,
    cached_user_id: userId,
    updated_at: new Date().toISOString(),
  }, null, 2), 'utf-8');
  process.env.UUMIT_API_KEY = apiKey;
  process.env.UUMIT_USER_ID = userId;
  log('凭证已保存');
}

function buildCruiseScheduleRequest() {
  return {
    action: 'register_schedule',
    name: 'UUMit 状态巡航',
    dedupe_key: 'uumit-account-cruise',
    interval_seconds: CRUISE_INTERVAL_SECONDS,
    run_immediately: false,
    description: 'UUMit 每半小时自动状态对账巡航，由 Agent 按 SKILL.md §4.1 执行。',
    agent_prompt: [
      '请每 30 分钟执行一次 UUMit 状态巡航任务。',
      '第一步：运行 node {UUMIT_SKILL_DIR}/scripts/cruise_tick.js，并只在内部解析返回的 JSON，不要把原始 JSON、stdout、stderr 或完整快照直接发给用户。',
      '第二步：cruise_tick.js 只负责账户、钱包、订单、交易、审核、资料完整度等状态对账，以及 Skill 更新检查；不要在此任务里主动找可接任务。',
      '第三步：只有状态变化且需要用户行动时才通知用户；没有需要处理或值得用户知道的变化时保持静默。',
      '不得暴露密码、API Key、私有文件、浏览器会话、私有仓库、shell 访问或原始本地数据。',
    ].join(' '),
  };
}

function buildInboxCruiseScheduleRequest() {
  return {
    action: 'register_schedule',
    name: 'UUMit 收件箱巡航',
    dedupe_key: 'uumit-inbox-cruise',
    interval_seconds: INBOX_CRUISE_INTERVAL_SECONDS,
    run_immediately: false,
    description: 'UUMit 每 5 分钟检查别人对用户任务的申请和平台推送，时效性最强。',
    agent_prompt: [
      '请每 5 分钟执行一次 UUMit 收件箱巡航。',
      '第一步：运行 node {UUMIT_SKILL_DIR}/scripts/cruise_inbox_tick.js，内部解析 JSON，不要把原始输出发给用户。',
      '第二步：若 inbox.auto_review_executed=true，脚本已完成 accept/reject，读取 inbox.review_results 向用户汇报审核摘要（哪个任务接受了谁、原因）。',
      '第三步：对 inbox.push_candidates 中的推送，判断是否与用户技能匹配，匹配则调用 rest_request.js POST /api/v1/tasks/pushes/{push_id}/respond 接受。',
      '无新申请和推送时保持静默。不得暴露密码、API Key、私有文件或原始数据。',
    ].join(' '),
  };
}

function buildApplyCruiseScheduleRequest() {
  return {
    action: 'register_schedule',
    name: 'UUMit 申请巡航',
    dedupe_key: 'uumit-apply-cruise',
    interval_seconds: APPLY_CRUISE_INTERVAL_SECONDS,
    run_immediately: false,
    description: 'UUMit 每 15 分钟浏览任务大厅，技能匹配后主动申请。',
    agent_prompt: [
      '请每 15 分钟执行一次 UUMit 申请巡航。',
      '第一步：运行 node {UUMIT_SKILL_DIR}/scripts/cruise_apply_tick.js，内部解析 JSON。',
      '第二步：调用 GET /api/v1/skills?page_size=50 获取用户技能列表，对 task_market.candidates 做语义匹配。',
      '第三步：no_confirm_apply=true 时，匹配的候选直接调用 rest_request.js POST /api/v1/tasks/{task_id}/applications，不询问用户，事后通知申请摘要。',
      '已申请（already_done=true）的任务跳过。无合适任务时保持静默。',
    ].join(' '),
  };
}

function buildDeliverCruiseScheduleRequest() {
  return {
    action: 'register_schedule',
    name: 'UUMit 交付巡航',
    dedupe_key: 'uumit-deliver-cruise',
    interval_seconds: DELIVER_CRUISE_INTERVAL_SECONDS,
    run_immediately: false,
    description: 'UUMit 每 10 分钟检查已承接任务进度和待发布资产。',
    agent_prompt: [
      '请每 10 分钟执行一次 UUMit 交付巡航。',
      '第一步：运行 node {UUMIT_SKILL_DIR}/scripts/cruise_deliver_tick.js，内部解析 JSON。',
      '第二步：对每个 delivery_ready=true 的候选，必须完成：①根据 description 生成交付内容，②写入 memory/sessions/{SESSION_ID}/request-delivery.json，③立即运行 required_action.step2 的 Bash 命令（rest_request.js POST /api/v1/orders/{order_id}/deliverables）。',
      '第三步：每个订单执行完后通知用户任务名和交付摘要。必须实际运行 rest_request.js，只分析不执行不算完成。无待交付订单时保持静默。',
    ].join(' '),
  };
}

// 兼容旧调用，返回申请巡航请求（cruise_work_tick.js 已废弃）
function buildWorkCruiseScheduleRequest() {
  return buildApplyCruiseScheduleRequest();
}

function buildMcpRegistrationRequest(apiKey, userId) {
  return {
    action: 'register_mcp',
    name: 'UUMit',
    url: `${BASE_URL}/mcp/sse`,
    bridge_url: `${BASE_URL}/api/v1/mcp/bridge`,
    headers: {
      'X-Api-Key': apiKey,
      'X-Platform-User-Id': userId,
    },
  };
}

function buildRuntimeConnectRequest() {
  return {
    action: 'start_runtime_connection_if_supported',
    name: 'UUMit 实时通道',
    description: '启动 SSE 长连接，接收实时 Job 分发和 Agent 间消息。与巡航独立并存。',
    command: `node "${path.join(SKILL_DIR, 'scripts', 'runtime_connect.js')}"`,
    command_with_file_output: `node "${path.join(SKILL_DIR, 'scripts', 'runtime_connect.js')}" --output-dir "${path.join(SKILL_DIR, 'memory', 'runtime')}"`,
    background: true,
    priority: 'high',
    coexists_with: ['cruise_schedule'],
  };
}

function buildPostAuthOnboarding(apiKey, userId, agentPlatformType) {
  return {
    required: true,
    blocking_after_auth: true,
    final_response_allowed_after: 'monetizable candidate scan is completed and candidate summaries are shown to the user, or a clear scan blocker is reported',
    action: 'continue_post_auth_onboarding',
    description: '授权成功后 Agent 必须在同一工作流继续执行宿主能力与可变现资产扫描、A2A/MCP 接入信息读取；不得只回复“已授权”就停止。扫描只生成隔离候选清单，并输出给用户选择。用户逐项选择并确认后，才可上架知识商店、技能、能力或数据 API。',
    interop_debug_request: {
      action: 'fetch_interop_debug',
      command: `node "${path.join(SKILL_DIR, 'scripts', 'rest_request.js')}" GET /api/v1/interop/debug`,
      endpoint: '/api/v1/interop/debug',
    },
    host_capability_scan_request: {
      action: 'scan_host_capabilities',
      agent_platform_type: agentPlatformType,
      required: true,
      required_before_final_user_reply: true,
      scan_targets: [
        'host_tools',
        'installed_non_basic_skills',
        'mcp_servers',
        'agent_card_or_public_url',
        'safe_workflows',
        'local_documents_metadata',
        'local_reports_metadata',
        'local_templates_metadata',
        'local_datasets_metadata',
        'project_docs_metadata',
        'public_templates_or_datasets',
        'digital_assets_or_templates',
        'credential_backed_account_assets_metadata_only',
      ],
      scan_goal: 'Discover monetizable skills and documents/assets owned by the user, including but not limited to reports, documents, templates, datasets, playbooks, guides, reusable workflows, public APIs, MCP servers, and non-basic agent skills.',
      isolation_policy: {
        metadata_only: true,
        session_scoped_candidates_file: 'memory/sessions/<session_id>/monetizable-candidates.json',
        never_store_secret_values: true,
        require_user_selection_before_publish: true,
        show_candidates_to_user: true,
      },
      basic_skill_filters: [
        'generic_chat',
        'generic_search',
        'local_shell',
        'filesystem_read_write',
        'browser_control',
        'terminal_operations',
        'package_management',
        'git_operations',
        'mcp_bridge_itself',
        'system_or_debug_tools',
        'uumit_skill_self',
      ],
      basic_skill_judgement_rule: 'Agent must judge basic skills by capability boundary, not by name alone. Exclude generic host abilities such as chat, search, shell, filesystem, browser, package/git operations, system/debug helpers, and wrapper-only MCP bridges. Keep only differentiated, user-owned, auditable abilities with a clear buyer value and deliverable boundary.',
      safety_exclusions: [
        'local_shell',
        'private_files',
        'private_repositories',
        'secrets',
        'credentials',
        'passwords',
        'api_keys',
        'cookies',
        'oauth_tokens',
        'private_keys',
        'environment_variables',
        'browser_session',
        'personal_identity_information',
        'contacts_or_chat_history',
        'unredacted_customer_data',
      ],
      candidate_schema: {
        id: '<stable-local-candidate-id>',
        title: '<short user-facing name>',
        type: 'skill|knowledge_store_asset|data_api|capability|workflow|account_asset',
        source: '<host|mcp|local_metadata|public_url|user_provided>',
        suggested_listing_path: 'knowledge_store|skill|capability|data_marketplace|do_not_list',
        summary: '<what can be sold or delivered>',
        buyer_value: '<why someone would pay>',
        deliverable_boundary: '<exact output buyer receives>',
        agent_can_self_complete: true,
        agent_can_self_deliver: true,
        self_completion_reason: '<tools/data/permissions that make it feasible, or blocker>',
        privacy_risk: 'low|medium|high',
        needs_desensitization: false,
        needs_user_file_selection: false,
        suggested_price_ut: '<required market-based suggestion when listing path is not do_not_list>',
        suggested_price_range_ut: { low: '<optional>', high: '<optional>' },
        pricing_model: '<fixed|per_hour|per_day|per_use|per_query|negotiable>',
        pricing_basis: '<market samples, comparable listings, delivery cost, or insufficient market data>',
        excluded_reason: '<only when filtered or unsafe>',
      },
      user_output_requirement: 'After scanning, present a short candidate list to the user with title, type, suggested listing path, privacy risk, whether the Agent can self-complete and self-deliver, market-based suggested price/range, and next required confirmation. Prefer Knowledge Store for monetizable documents/assets. Do not publish anything automatically.',
      after_scan: 'Show only non-sensitive candidate summaries, filter out basic skills by judgement rule, mark agent_can_self_complete/agent_can_self_deliver for each candidate, call /api/v1/pricing/suggestion or inspect comparable listings to produce suggested_price_ut, and ask the user which discovered capabilities/assets may be listed on UUMit before any publish/register write call.',
    },
    a2a_onboarding_request: {
      action: 'inspect_a2a_and_mcp_entrypoints',
      a2a_url: `${BASE_URL}/a2a`,
      agent_card_url: `${BASE_URL}/.well-known/agent.json`,
      mcp_sse_url: `${BASE_URL}/mcp/sse`,
      mcp_bridge_url: `${BASE_URL}/api/v1/mcp/bridge`,
      auth_headers: {
        'X-Api-Key': apiKey,
        'X-Platform-User-Id': userId,
      },
    },
    publish_options: {
      capabilities_endpoint: '/api/v1/capabilities',
      skills_endpoint: '/api/v1/skills',
      knowledge_store_endpoint: '/api/v1/digital-assets/quick-upload',
      data_apis_endpoint: '/api/v1/data-marketplace/apis',
      require_user_confirmation: true,
      default_document_listing_path: 'knowledge_store',
    },
    next_actions: [
      'register_cruise_schedules_from_schedule_requests',
      'start_runtime_connection_if_supported',
      'register_mcp_from_mcp_request',
      'fetch_interop_debug',
      'scan_host_capabilities',
      'inspect_a2a_and_mcp_entrypoints',
      'present_monetizable_candidate_summaries_to_user',
      'ask_user_which_candidates_to_publish_or_skip',
    ],
  };
}

function savePostAuthOnboarding(postAuth) {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let state = {};
  try {
    if (fs.existsSync(STATE_FILE)) {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (e) { /* ignore */ }

  state.post_auth = {
    ...postAuth,
    status: 'pending',
    updated_at: new Date().toISOString(),
  };
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function registerCruiseSchedule() {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let state = {};
  try {
    if (fs.existsSync(STATE_FILE)) {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (e) { /* ignore */ }

  const scheduleRequest = buildCruiseScheduleRequest();
  const inboxScheduleRequest = buildInboxCruiseScheduleRequest();
  const applyScheduleRequest = buildApplyCruiseScheduleRequest();
  const deliverScheduleRequest = buildDeliverCruiseScheduleRequest();
  const allScheduleRequests = [scheduleRequest, inboxScheduleRequest, applyScheduleRequest, deliverScheduleRequest];

  state.cruise = {
    registered: true,
    local_state_registered: true,
    host_schedule_required: true,
    host_schedule_status: 'pending',
    schedule_name: 'UUMit 状态巡航',
    interval_seconds: CRUISE_INTERVAL_SECONDS,
    schedule_request: scheduleRequest,
    updated_at: new Date().toISOString(),
  };
  state.inbox_cruise = {
    registered: true,
    local_state_registered: true,
    host_schedule_required: true,
    host_schedule_status: 'pending',
    schedule_name: 'UUMit 收件箱巡航',
    interval_seconds: INBOX_CRUISE_INTERVAL_SECONDS,
    schedule_request: inboxScheduleRequest,
    updated_at: new Date().toISOString(),
  };
  state.apply_cruise = {
    registered: true,
    local_state_registered: true,
    host_schedule_required: true,
    host_schedule_status: 'pending',
    schedule_name: 'UUMit 申请巡航',
    interval_seconds: APPLY_CRUISE_INTERVAL_SECONDS,
    schedule_request: applyScheduleRequest,
    updated_at: new Date().toISOString(),
  };
  state.deliver_cruise = {
    registered: true,
    local_state_registered: true,
    host_schedule_required: true,
    host_schedule_status: 'pending',
    schedule_name: 'UUMit 交付巡航',
    interval_seconds: DELIVER_CRUISE_INTERVAL_SECONDS,
    schedule_request: deliverScheduleRequest,
    updated_at: new Date().toISOString(),
  };
  state.schedule_requests = allScheduleRequests;

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  log('已生成巡航定时任务注册元信息：状态巡航 30 分钟，收件箱巡航 5 分钟，申请巡航 15 分钟，交付巡航 10 分钟。');
  return scheduleRequest;
}

function updateCruiseStatus(status) {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let state = {};
  try {
    if (fs.existsSync(STATE_FILE)) {
      state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (e) { /* ignore */ }

  state.cruise = state.cruise || {};
  state.cruise.host_schedule_status = status;
  state.cruise.updated_at = new Date().toISOString();

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  const label = { active: '已激活', unavailable: '不可用' }[status] || status;
  log(`巡航定时任务状态已更新: ${label} (${status})`);
  emitJson({ ok: true, cruise: { host_schedule_status: status } });
}

async function getAccountInfo(apiKey, userId) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey,
    'X-Platform-User-Id': userId,
  };
  const wallet = await apiRequest('GET', '/api/v1/wallet', null, headers);
  const cruise = await apiRequest('GET', '/api/v1/agent/cruise?include=all', null, headers);
  return { wallet: wallet.data || {}, cruise: cruise.data || {} };
}

async function main() {
  log('UUMit 授权流程');

  const args = process.argv.slice(2);

  // --cron-active
  if (args.includes('--cron-active') || args.includes('--cruise-registered')) {
    updateCruiseStatus('active');
    return 0;
  }

  // --cruise-unavailable
  if (args.includes('--cruise-unavailable')) {
    updateCruiseStatus('unavailable');
    return 0;
  }

  if (args.includes('--poll') || args.includes('--no-wait') || args.includes('--code-only')) {
    emitJson({
      ok: false,
      status: 'unsupported_auth_mode',
      error: 'deprecated_auth_mode',
      retryable: false,
      supported_commands: [
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --start`,
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --wait <device_code>`,
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --check`,
      ],
      next_command: `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --start`,
    });
    return 1;
  }

  // --wait <device_code>
  const waitIdx = args.indexOf('--wait');
  if (waitIdx !== -1 && args[waitIdx + 1]) {
    const deviceCode = args[waitIdx + 1];
    const agentPlatformType = resolveAgentPlatformType(args);
    const output = await waitForApprovedAuth(deviceCode, agentPlatformType);
    emitJson(output);
    return output.ok === false ? 1 : 0;
  }

  // --check
  if (args.includes('--check')) {
    if (fs.existsSync(AUTH_FILE)) {
      const auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      log(`已有凭证: ${auth.cached_user_id || 'unknown'}`);
      const apiKey = auth.cached_api_key;
      const userId = auth.cached_user_id;
      if (apiKey && userId) {
        try {
          const { wallet, cruise } = await getAccountInfo(apiKey, userId);
          if (wallet && wallet.ut) {
            const agentPlatformType = resolveAgentPlatformType(args);
            const scheduleRequest = registerCruiseSchedule();
            const inboxScheduleRequest = buildInboxCruiseScheduleRequest();
            const applyScheduleRequest = buildApplyCruiseScheduleRequest();
            const deliverScheduleRequest = buildDeliverCruiseScheduleRequest();
            const mcpRequest = buildMcpRegistrationRequest(apiKey, userId);
            const runtimeConnectRequest = buildRuntimeConnectRequest();
            const postAuth = buildPostAuthOnboarding(apiKey, userId, agentPlatformType);
            savePostAuthOnboarding(postAuth);
            const ut = wallet.ut || {};
            const profile = (cruise.profile && cruise.profile.profile) || {};
            emitJson({
              ok: true,
              status: 'already_authorized',
              user_id: userId,
              wallet: { ut },
              profile: {
                nickname: profile.nickname || 'unknown',
                completeness: profile.completeness || 0,
              },
              cruise: {
                registered: true,
                host_schedule_required: true,
                host_schedule_status: 'pending',
                interval_seconds: CRUISE_INTERVAL_SECONDS,
                schedule_name: 'uumit-account-cruise',
                schedule_request: scheduleRequest,
              },
              inbox_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: INBOX_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-inbox-cruise', schedule_request: inboxScheduleRequest },
              apply_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: APPLY_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-apply-cruise', schedule_request: applyScheduleRequest },
              deliver_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: DELIVER_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-deliver-cruise', schedule_request: deliverScheduleRequest },
              runtime_connect: {
                ...runtimeConnectRequest,
                auto_started: false,
                skipped_auto_start: true,
                agent_must_start_explicitly: true,
              },
              mcp_request: mcpRequest,
              schedule_request: scheduleRequest,
              work_schedule_request: applyScheduleRequest,
              schedule_requests: [scheduleRequest, inboxScheduleRequest, applyScheduleRequest, deliverScheduleRequest],
              post_auth: postAuth,
              next_actions: postAuth.next_actions,
            });
            return 0;
          }
        } catch (e) {
          log(`凭证验证失败: ${e.message}`);
          emitJson({ ok: false, error: 'credential_check_failed', retryable: true });
          return 1;
        }
      }
    } else {
      log('未找到凭证');
      emitJson({ ok: false, error: 'no_credentials', retryable: false, next_command: `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --start` });
      return 1;
    }
  }

  // --reset / --force / --reauth
  if (args.some(a => ['--reset', '--force', '--reauth'].includes(a))) {
    if (fs.existsSync(AUTH_FILE)) {
      fs.unlinkSync(AUTH_FILE);
      log('已清除旧凭证，开始重新授权');
    }
  }

  if (!args.some(a => ['--start', '--reset', '--force', '--reauth'].includes(a))) {
    emitJson({
      ok: false,
      error: 'missing_auth_command',
      retryable: false,
      supported_commands: [
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --start`,
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --wait <device_code>`,
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --check`,
      ],
      next_command: `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --start`,
    });
    return 1;
  }

  // Check existing credentials first (unless --reset was used)
  if (fs.existsSync(AUTH_FILE) && !args.some(a => ['--reset', '--force', '--reauth'].includes(a))) {
    const auth = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    log(`已有凭证: ${auth.cached_user_id || 'unknown'}`);
    log('如需重新授权，请运行 node scripts/auth.js --reset');

    const apiKey = auth.cached_api_key;
    const userId = auth.cached_user_id;
    if (apiKey && userId) {
      try {
        const { wallet, cruise } = await getAccountInfo(apiKey, userId);
        if (wallet && wallet.ut) {
          const agentPlatformType = resolveAgentPlatformType(args);
          const scheduleRequest = registerCruiseSchedule();
          const workScheduleRequest = buildWorkCruiseScheduleRequest();
          const mcpRequest = buildMcpRegistrationRequest(apiKey, userId);
          const runtimeConnectRequest = buildRuntimeConnectRequest();
          const postAuth = buildPostAuthOnboarding(apiKey, userId, agentPlatformType);
          savePostAuthOnboarding(postAuth);
          const ut = wallet.ut || {};
          const profile = (cruise.profile && cruise.profile.profile) || {};
          emitJson({
            ok: true,
            status: 'already_authorized',
            user_id: userId,
            wallet: { ut },
            profile: {
              nickname: profile.nickname || 'unknown',
              completeness: profile.completeness || 0,
            },
            cruise: {
              registered: true,
              host_schedule_required: true,
              host_schedule_status: 'pending',
              interval_seconds: CRUISE_INTERVAL_SECONDS,
              schedule_name: 'uumit-account-cruise',
              schedule_request: scheduleRequest,
            },
            inbox_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: INBOX_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-inbox-cruise', schedule_request: inboxScheduleRequest },
            apply_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: APPLY_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-apply-cruise', schedule_request: applyScheduleRequest },
            deliver_cruise: { registered: true, host_schedule_required: true, host_schedule_status: 'pending', interval_seconds: DELIVER_CRUISE_INTERVAL_SECONDS, schedule_name: 'uumit-deliver-cruise', schedule_request: deliverScheduleRequest },
            runtime_connect: {
              ...runtimeConnectRequest,
              auto_started: false,
              skipped_auto_start: true,
              agent_must_start_explicitly: true,
            },
            mcp_request: mcpRequest,
            schedule_request: scheduleRequest,
            work_schedule_request: applyScheduleRequest,
            schedule_requests: [scheduleRequest, inboxScheduleRequest, applyScheduleRequest, deliverScheduleRequest],
            post_auth: postAuth,
            next_actions: postAuth.next_actions,
          });
          return 0;
        }
      } catch (e) {
        log(`凭证验证失败: ${e.message}，重新授权`);
      }
    }
  }

  const agentPlatformType = resolveAgentPlatformType(args);

  const supportedStartArgs = new Set(['--start', '--reset', '--force', '--reauth', '--platform']);
  const unknownArgs = args.filter((arg, idx) => {
    if (arg === '--platform') return false;
    if (idx > 0 && args[idx - 1] === '--platform') return false;
    return arg.startsWith('--') && !supportedStartArgs.has(arg);
  });
  if (unknownArgs.length) {
    emitJson({
      ok: false,
      error: 'unsupported_auth_mode',
      unsupported_args: unknownArgs,
      supported_commands: [
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --start`,
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --wait <device_code>`,
        `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --check`,
      ],
      next_command: `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --start`,
    });
    return 1;
  }

  // Initiate device auth. Agent mode never blocks here; Agent should repeatedly
  // run --wait after retry_after_seconds until an authorization terminal state.
  const authData = await deviceAuth(agentPlatformType);
  if (!authData) {
    emitJson({ ok: false, error: 'device_auth_failed', retryable: true });
    return 1;
  }

  log('请完成授权:');
  log(`1. 打开: ${authData.verification_url}`);
  log(`2. 输入授权码: ${authData.user_code}`);
  log(`有效期 ${authData.expires_in || DEFAULT_AUTH_TIMEOUT_SECONDS} 秒`);
  log('授权码展示后，Agent 应按 required_next_command 进行短轮询；不要等待用户回复“已授权”。');

  // Output device code for Agent short polling.
  emitJson({
    ok: true,
    status: 'awaiting_approval',
    agent_platform_type: agentPlatformType,
    device_code: authData.device_code,
    user_code: authData.user_code,
    verification_url: authData.verification_url,
    expires_in: authData.expires_in || DEFAULT_AUTH_TIMEOUT_SECONDS,
    interval: authData.interval || 5,
    polling_mode: 'agent_short_poll',
    auto_poll_required: true,
    agent_must_poll_in_same_turn: true,
    do_not_final_reply_before_polling: true,
    poll_interval_seconds: authData.interval || 5,
    must_continue_post_auth: true,
    next_step: 'Show verification_url and user_code as an interim message only, then repeatedly run required_next_command after retry_after_seconds until authorized, expired, denied, or timeout. Execute post_auth.next_actions from the authorized result before giving a final user reply.',
    interim_user_message_template: '请打开 {verification_url} 并输入授权码 {user_code}。我会在这里自动轮询授权状态，然后继续扫描可上架的技能和文档候选。',
    retry_after_seconds: authData.interval || 5,
    wait_command: `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --wait ${authData.device_code}`,
    required_next_command: `node "${path.join(SKILL_DIR, 'scripts', 'auth.js')}" --wait ${authData.device_code}`,
    required_next_command_purpose: 'Run this after retry_after_seconds. It performs one short poll and returns pending or an authorized result with post_auth.next_actions.',
  });

  return 0;
}

main().catch(err => {
  emitJson({ ok: false, error: err.message, retryable: true });
  process.exit(1);
});