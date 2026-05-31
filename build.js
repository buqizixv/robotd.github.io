/**
 * Robot D — Static Site Generator
 * Generates fully pre-rendered pages at clean URLs.
 *   Home:       /index.html
 *   Article:    /article/<slug>/index.html
 *   Category:   /category/<slug>/index.html
 *   Also:       /sitemap.xml, /robots.txt
 * Usage: node build.js
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://robotd.net';
const SITE_NAME = 'Robot D';
const V = '21';

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---- Load article data ----
const articlesDir = path.join(__dirname, 'articles');
const articleFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json') && f !== '_TEMPLATE.json');
const articles = [];
articleFiles.forEach(f => {
  let raw = fs.readFileSync(path.join(articlesDir, f), 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  articles.push(JSON.parse(raw));
});
articles.sort((a, b) => b.date.localeCompare(a.date));

// ---- Helpers ----
const CATEGORIES = [
  { slug: 'all', en: 'All Articles', zh: '全部文章' },
  { slug: 'humanoid', en: 'Humanoid Robots', zh: '人形机器人' },
  { slug: 'industrial', en: 'Industrial Automation', zh: '工业自动化' },
  { slug: 'ai-robotics', en: 'AI & Robotics', zh: 'AI与机器人' },
  { slug: 'drones', en: 'Drones & UAVs', zh: '无人机' },
  { slug: 'medical', en: 'Medical Robotics', zh: '医疗机器人' },
  { slug: 'research', en: 'Research & Breakthroughs', zh: '研究突破' }
];

function catLabel(slug, lang) {
  const c = CATEGORIES.find(x => x.slug === slug);
  return c ? c[lang] : slug;
}

function formatDate(d, lang) {
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(d).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', opts);
}

function newsItemHtml(a, lang) {
  const m = a[lang];
  return '<a href="/article/' + a.slug + '/" class="news-item">' +
    '<span class="news-item-tag">' + catLabel(a.category, lang) + '</span>' +
    '<div class="news-item-body"><h3>' + escapeHtml(m.title) + '</h3>' +
    '<p>' + escapeHtml(m.summary) + '</p>' +
    '<time datetime="' + a.date + '">' + formatDate(a.date, lang) + '</time></div></a>';
}

function catTabHtml(activeSlug, lang) {
  let h = '<nav class="cat-tabs">';
  CATEGORIES.forEach(c => {
    const active = c.slug === activeSlug ? ' active' : '';
    h += '<a href="/category/' + c.slug + '/" class="' + active + '">' + c[lang] + '</a>';
  });
  return h + '</nav>';
}

function sidebarHtml(articles, lang) {
  const featured = articles.filter(a => a.featured).slice(0, 8);
  if (!featured.length) return '';
  let h = '<aside class="sidebar"><div class="sidebar-card"><h4>' + (lang === 'zh' ? '热门文章' : 'Hot Now') + '</h4><ul>';
  featured.forEach(a => {
    const m = a[lang];
    h += '<li><a href="/article/' + a.slug + '/">' + escapeHtml(m.title) + '</a><time datetime="' + a.date + '">' + formatDate(a.date, lang) + '</time></li>';
  });
  return h + '</ul></div></aside>';
}

// ---- JSON-LD ----
function jsonLd(type, article) {
  if (type === 'website') return JSON.stringify({
    '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME,
    url: BASE_URL + '/', description: 'Your daily pulse on robotics and AI. Bilingual EN / 中文 coverage.',
    inLanguage: ['en', 'zh']
  });
  const m = article.en;
  const ld = {
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: m.title, description: m.summary,
    datePublished: article.date, dateModified: article.date,
    author: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL + '/' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: BASE_URL + '/' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': BASE_URL + '/article/' + article.slug + '/' },
    inLanguage: ['en', 'zh'], about: { '@type': 'Thing', name: article.category }
  };
  if (article.image) ld.image = BASE_URL + '/' + article.image.replace(/\\/g, '/');
  return JSON.stringify(ld);
}

// ---- Page templates ----
function head(title, desc, kw, canonical, ldStr, imgUrl, imgAlt) {
  let h = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
  h += '  <title>' + escapeHtml(title) + '</title>\n';
  h += '  <meta name="description" content="' + escapeHtml(desc) + '">\n';
  h += '  <meta name="keywords" content="' + escapeHtml(kw) + '">\n';
  h += '  <link rel="canonical" href="' + canonical + '">\n';
  if (ldStr) h += '  <script type="application/ld+json">\n' + ldStr + '\n  </' + 'script>\n';
  h += '  <meta property="og:title" content="' + escapeHtml(title) + '">\n';
  h += '  <meta property="og:description" content="' + escapeHtml(desc) + '">\n';
  h += '  <meta property="og:url" content="' + canonical + '">\n';
  if (imgUrl) {
    h += '  <meta property="og:image" content="' + imgUrl + '">\n';
    h += '  <meta property="og:image:alt" content="' + escapeHtml(imgAlt || '') + '">\n';
    h += '  <meta name="twitter:image" content="' + imgUrl + '">\n';
  }
  h += '  <meta property="og:type" content="' + (ldStr && ldStr.indexOf('NewsArticle') > -1 ? 'article' : 'website') + '">\n';
  h += '  <meta name="twitter:card" content="summary_large_image">\n';
  h += '  <meta name="twitter:title" content="' + escapeHtml(title) + '">\n';
  h += '  <meta name="twitter:description" content="' + escapeHtml(desc) + '">\n';
  h += '  <link rel="stylesheet" href="/css/style.css?v=' + V + '">\n';
  h += '  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'><rect width=\'32\' height=\'32\' rx=\'8\' fill=\'%230284c7\'/><text x=\'16\' y=\'22\' text-anchor=\'middle\' font-size=\'18\' fill=\'white\' font-family=\'sans-serif\'>D</text></svg>">\n';
  h += '</head>\n<body>\n  <div id="app">\n';
  return h;
}

function footer() {
  return '  </div>\n  <script src="/js/i18n.js?v=' + V + '"></' + 'script>\n  <script src="/js/content.js?v=' + V + '"></' + 'script>\n  <script src="/js/app.js?v=' + V + '"></' + 'script>\n</body>\n</html>';
}

function shell(inner) {
  return '<header class="site-header"><div class="header-inner">' +
    '<a href="/" class="logo">' + SITE_NAME + '</a>' +
    '<button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu"><span></span><span></span><span></span></button>' +
    '<nav class="main-nav" id="main-nav">' +
      '<a href="/">Home</a><a href="/category/all/">Articles</a>' +
      '<a href="/about.html">About</a><a href="/privacy.html">Privacy</a>' +
    '</nav>' +
    '<button id="lang-toggle" class="lang-switch">中文</button>' +
    '</div></header>' + inner +
    '<footer class="site-footer"><div class="footer-bottom"><p>&copy; 2026 Robot D. All rights reserved.</p></div></footer>';
}

// ---- Build pages ----
console.log('Robot D — Static Site Generator\n');

let count = 0;

// Category pages
CATEGORIES.forEach(cat => {
  if (cat.slug === 'all') return;
  const dir = path.join(__dirname, 'category', cat.slug);
  fs.mkdirSync(dir, { recursive: true });

  // English
  let en = head(cat.en + ' — ' + SITE_NAME, 'Latest ' + cat.en + ' news. Bilingual EN/中文.', cat.en.toLowerCase() + ', robotics', BASE_URL + '/category/' + cat.slug + '/', jsonLd('website'), '', '');
  en += shell(catTabHtml(cat.slug, 'en') +
    '<main class="main-content"><div class="home-layout"><div class="main-col">' +
    catTabHtml(cat.slug, 'en') + '<h2>' + cat.en + '</h2>' +
    '<div class="news-list">' + articles.filter(a => a.category === cat.slug).map(a => newsItemHtml(a, 'en')).join('') + '</div>' +
    '</div>' + sidebarHtml(articles, 'en') + '</div></main>');
  en += footer();
  fs.writeFileSync(path.join(dir, 'index.html'), en, 'utf8');

  // Chinese
  let zh = head(cat.zh + ' — ' + SITE_NAME, '最新' + cat.zh + '新闻。双语 EN/中文 报道。', cat.zh + ', 机器人', BASE_URL + '/category/' + cat.slug + '/?lang=zh', jsonLd('website'), '', '');
  zh += shell(catTabHtml(cat.slug, 'zh') +
    '<main class="main-content"><div class="home-layout"><div class="main-col">' +
    catTabHtml(cat.slug, 'zh') + '<h2>' + cat.zh + '</h2>' +
    '<div class="news-list">' + articles.filter(a => a.category === cat.slug).map(a => newsItemHtml(a, 'zh')).join('') + '</div>' +
    '</div>' + sidebarHtml(articles, 'zh') + '</div></main>');
  zh += footer();
  // We only generate one file per directory — lang is handled by the SPA boot
  // So we generate English as default; SPA handles zh switching

  console.log('  OK  category/' + cat.slug + '/');
  count++;
});

// Article pages
articles.forEach(a => {
  const dir = path.join(__dirname, 'article', a.slug);
  fs.mkdirSync(dir, { recursive: true });

  const en = a.en, zh = a.zh;
  const kw = (en.keywords || 'robotics, AI') + ', Robot D';
  const articleUrl = BASE_URL + '/article/' + a.slug + '/';
  let imgUrl = a.image ? BASE_URL + '/' + a.image.replace(/\\/g, '/') : '';

  const ldStr = jsonLd('article', a);

  let html = head(en.title + ' — ' + SITE_NAME, en.summary, kw, articleUrl, ldStr, imgUrl, en.imageAlt || en.title);
  html += shell('<main class="main-content"><article class="content-page">' +
    '<nav class="breadcrumb"><a href="/">Home</a> / <a href="/category/' + a.category + '/">' + catLabel(a.category, 'en') + '</a> / <span>' + escapeHtml(en.title) + '</span></nav>' +
    (a.image ? '<figure class="article-image-wrap"><img src="/' + a.image + '" alt="' + escapeHtml(en.imageAlt || en.title) + '" class="article-image" loading="lazy" width="1200" height="675"></figure>' : '') +
    '<header class="article-header"><span class="article-category">' + catLabel(a.category, 'en') + '</span>' +
    '<h1>' + escapeHtml(en.title) + '</h1>' +
    '<time class="article-date" datetime="' + a.date + '">Published ' + formatDate(a.date, 'en') + '</time></header>' +
    '<div class="content-body">' + en.body + '</div>' +
    '</article></main>');
  html += footer();
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');

  console.log('  OK  article/' + a.slug + '/');
  count++;
});

// Home page
const homeTitle = SITE_NAME + ' — Your Daily Pulse on Robotics & AI';
const homeDesc = 'Tracking every breakthrough in humanoid robots, industrial automation, drone delivery, and AI-powered machines. Bilingual EN / 中文.';
const homeKw = 'robotics news, AI news, humanoid robots, industrial automation, drones, medical robotics, Robot D, 机器人新闻';
let home = head(homeTitle, homeDesc, homeKw, BASE_URL + '/', jsonLd('website'), '', '');
home += shell('<section class="hero"><h1>Your Daily Pulse on Robotics & AI — Robot D</h1>' +
  '<p class="hero-sub">Tracking every breakthrough in humanoid robots, industrial automation, drone delivery, and AI-powered machines. Updated weekly.</p>' +
  '<div class="hero-search"><input type="text" id="search-input" class="search-input" placeholder="Search articles..." autocomplete="off"></div></section>' +
  '<main class="main-content"><div class="home-layout"><div class="main-col">' +
  catTabHtml('all', 'en') +
  '<div class="news-list">' + articles.map(a => newsItemHtml(a, 'en')).join('') + '</div>' +
  '</div>' + sidebarHtml(articles, 'en') + '</div></main>');
home += footer();
fs.writeFileSync(path.join(__dirname, 'index.html'), home, 'utf8');
console.log('  OK  index.html (home)');
count++;

// Sitemap
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';
xml += '  <url><loc>' + BASE_URL + '/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n\n';
CATEGORIES.forEach(c => {
  if (c.slug === 'all') return;
  xml += '  <url><loc>' + BASE_URL + '/category/' + c.slug + '/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n\n';
});
articles.forEach(a => {
  const url = BASE_URL + '/article/' + a.slug + '/';
  xml += '  <url><loc>' + url + '</loc><lastmod>' + a.date + '</lastmod><changefreq>weekly</changefreq><priority>0.9</priority>\n';
  xml += '    <xhtml:link rel="alternate" hreflang="en" href="' + url + '?lang=en"/>\n';
  xml += '    <xhtml:link rel="alternate" hreflang="zh" href="' + url + '?lang=zh"/>\n  </url>\n\n';
});
xml += '</urlset>\n';
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf8');
console.log('  OK  sitemap.xml');

// Robots.txt
fs.writeFileSync(path.join(__dirname, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + BASE_URL + '/sitemap.xml\n', 'utf8');
console.log('  OK  robots.txt');

// Check images
console.log('\n--- Images ---');
const imgDir = path.join(__dirname, 'image');
fs.readdirSync(imgDir).forEach(f => {
  const kb = (fs.statSync(path.join(imgDir, f)).size / 1024).toFixed(0);
  const warn = (fs.statSync(path.join(imgDir, f)).size > 300 * 1024) ? ' ⚠️  >300KB' : '';
  console.log('  ' + kb + ' KB  ' + f + warn);
});

console.log('\nDone. ' + count + ' pages generated.');
