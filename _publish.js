/**
 * Robot D — Article Publish Script
 * One command to: clean & validate JSON → insert manifest entry → bump cache → rebuild
 *
 * Usage: node _publish.js <slug>
 * Example: node _publish.js agility-digit-warehouse-2026
 *
 * Prerequisite: articles/<slug>.json must already exist.
 * The JSON can contain HTML entities (&lt; etc.) from agent output — they get decoded automatically.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const slug = process.argv[2];

if (!slug) {
  console.error('Usage: node _publish.js <slug>');
  console.error('Example: node _publish.js agility-digit-warehouse-2026');
  process.exit(1);
}

// ── 0. HTML entity decoding ────────────────────────────────────────
function decodeEntities(str) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'");
}

function cleanStrings(obj) {
  if (typeof obj === 'string') return decodeEntities(obj);
  if (Array.isArray(obj)) return obj.map(cleanStrings);
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      obj[key] = cleanStrings(obj[key]);
    }
  }
  return obj;
}

const VALID_CATEGORIES = ['humanoid', 'industrial', 'ai-robotics', 'drones', 'medical', 'research'];

// ── 1. Load & clean article JSON ───────────────────────────────────
const jsonPath = path.join(root, 'articles', slug + '.json');
if (!fs.existsSync(jsonPath)) {
  console.error('ERROR: Article JSON not found: ' + jsonPath);
  console.error('Make sure the writing agent has saved the JSON file first.');
  process.exit(1);
}

let article;
try {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  article = JSON.parse(raw);
} catch (e) {
  console.error('ERROR: Invalid JSON in ' + jsonPath);
  console.error(e.message);
  process.exit(1);
}

// Clean HTML entities from all string fields
article = cleanStrings(article);

// Validate structure
const errors = [];
if (!article.slug) errors.push('Missing: slug');
if (!article.date || !/^\d{4}-\d{2}-\d{2}$/.test(article.date)) errors.push('Missing or invalid: date (YYYY-MM-DD)');
if (!article.category || !VALID_CATEGORIES.includes(article.category)) errors.push('Invalid category: ' + article.category + ' (must be one of: ' + VALID_CATEGORIES.join(', ') + ')');
if (!article.en || !article.en.title || !article.en.summary || !article.en.body) errors.push('Missing required en fields (title, summary, body)');
if (!article.zh || !article.zh.title || !article.zh.summary || !article.zh.body) errors.push('Missing required zh fields (title, summary, body)');

// Word count check (strip HTML tags)
if (article.en && article.en.body) {
  const enText = article.en.body.replace(/<[^>]+>/g, '').trim();
  const enWords = enText.split(/\s+/).length;
  if (enWords < 1000) errors.push('EN body too short: ' + enWords + ' words (need 1000+)');
  else console.log('EN words: ' + enWords);
}
if (article.zh && article.zh.body) {
  const zhText = article.zh.body.replace(/<[^>]+>/g, '').trim();
  if (zhText.length < 500) errors.push('ZH body too short: ' + zhText.length + ' chars (need 500+)');
  else console.log('ZH chars: ' + zhText.length);
}

if (errors.length > 0) {
  console.error('─── VALIDATION ERRORS ───');
  errors.forEach(e => console.error('  ✗ ' + e));
  console.error('─────────────────────────');
  console.error('Fix the errors above in ' + jsonPath + ' and re-run.');
  process.exit(1);
}

// Write back cleaned JSON
fs.writeFileSync(jsonPath, JSON.stringify(article, null, 2));
console.log('✓ Cleaned & validated JSON');

const { date, category, featured } = article;
const image = article.image || '';
const enTitle = article.en.title;
const enSummary = article.en.summary;
const zhTitle = article.zh.title;
const zhSummary = article.zh.summary;

console.log('Article:  ' + slug);
console.log('Date:     ' + date);
console.log('Category: ' + category + (featured ? ' (featured)' : ''));

// ── 2. Build content.js entry ─────────────────────────────────────
function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

const imageLine = image ? `\n    image: "${esc(image)}",` : '';

const entryText = `
  {
    slug: "${esc(slug)}",
    date: "${esc(date)}",
    category: "${esc(category)}",
    featured: ${featured || false},${imageLine}
    en: {
      title: "${esc(enTitle)}",
      summary: "${esc(enSummary)}"
    },
    zh: {
      title: "${esc(zhTitle)}",
      summary: "${esc(zhSummary)}"
    }
  },`;

// ── 3. Insert into content.js at correct date position ────────────
const contentPath = path.join(root, 'js', 'content.js');
let content = fs.readFileSync(contentPath, 'utf8');

// Normalize line endings to LF for consistent processing, but preserve CRLF in final output
const hasCRLF = content.includes('\r\n');
let normalized = content.replace(/\r\n/g, '\n');

// Remove existing entry for this slug if it already exists (update, not duplicate)
const slugEscaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const existingPattern = new RegExp('\\n  \\{[^}]*?slug: "' + slugEscaped + '"[\\s\\S]*?\\n  \\},?');
const existingMatch = normalized.match(existingPattern);
if (existingMatch) {
  normalized = normalized.replace(existingMatch[0], '');
  console.log('✓ Removed existing entry for: ' + slug);
}

// Find all entry positions and their dates
const entryRegex = /    slug: "([^"]+)",\n    date: "([^"]+)"/g;
const entries = [];
let match;
while ((match = entryRegex.exec(normalized)) !== null) {
  entries.push({ slug: match[1], date: match[2], pos: match.index });
}

// Find insertion point — insert before the first entry with an EARLIER date
let insertPos = null;
for (const entry of entries) {
  if (entry.date < date) {
    insertPos = entry.pos;
    break;
  }
}

if (insertPos === null) {
  // New article is the oldest — append before ];
  insertPos = normalized.lastIndexOf('];');
  console.log('Inserting at end (oldest article)');
} else {
  // Go back to the start of this entry's block (the opening `{`)
  const blockStart = normalized.lastIndexOf('\n  {', insertPos);
  if (blockStart !== -1) insertPos = blockStart;
  // Find which entry we're inserting before
  const nextSlug = normalized.substring(insertPos).match(/slug: "([^"]+)"/);
  console.log('Inserting before: ' + (nextSlug ? nextSlug[1] : '?'));
}

// Ensure we start on a newline
if (normalized[insertPos] !== '\n') {
  const nl = normalized.lastIndexOf('\n', insertPos);
  if (nl !== -1) insertPos = nl;
}

content = normalized.slice(0, insertPos) + entryText + '\n' + normalized.slice(insertPos);

// Restore CRLF if original file used it
if (hasCRLF) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync(contentPath, content);
console.log('✓ Inserted into js/content.js');

// ── 4. Bump cache version in build.js ─────────────────────────────
const buildPath = path.join(root, 'build.js');
let build = fs.readFileSync(buildPath, 'utf8');
const vMatch = build.match(/const V = '(\d+)'/);
if (!vMatch) {
  console.error('ERROR: Could not find V constant in build.js');
  process.exit(1);
}
const oldV = parseInt(vMatch[1]);
const newV = oldV + 1;
build = build.replace(/const V = '\d+'/, "const V = '" + newV + "'");
fs.writeFileSync(buildPath, build);
console.log('✓ Bumped cache version: v' + oldV + ' → v' + newV);

// ── 5. Rebuild static site ────────────────────────────────────────
console.log('Building...');
try {
  execSync('node build.js', { cwd: root, stdio: 'inherit' });
} catch (e) {
  console.error('ERROR: Build failed');
  process.exit(1);
}

console.log('');
console.log('✅ Published: ' + slug);
console.log('   https://robotd.net/article/' + slug + '/');
