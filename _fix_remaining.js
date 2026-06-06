const fs = require('fs');

// === 1. Fix build.js sitemap + SEO ===
let b = fs.readFileSync('build.js', 'utf8');

// Remove xhtml namespace
b = b.replace(' xmlns:xhtml="http://www.w3.org/1999/xhtml"', '');

// Remove hreflang lines from sitemap
b = b.replace(/  xml \+= '    <xhtml:link rel="alternate" hreflang="en" href="' \+ url \+ '\?lang=en"\/>\\n';/g, '');
b = b.replace(/  xml \+= '    <xhtml:link rel="alternate" hreflang="zh" href="' \+ url \+ '\?lang=zh"\/>\\n  <\/url>\\n\\n';/g, '  <\/url>\n\n');

// Add SEO meta tags after twitter:description line
const seoMeta = `
  h += '  <meta name="robots" content="index, follow">\\n';
  h += '  <meta name="theme-color" content="#0284c7">\\n';
  h += '  <meta property="og:site_name" content="' + SITE_NAME + '">\\n';
  h += '  <meta property="og:locale" content="en_US">\\n'`;

b = b.replace(
  "h += '  <meta name=\\\"twitter:description\\\" content=\\\"' + escapeHtml(desc) + '\\\">\\\\n';",
  "h += '  <meta name=\\\"twitter:description\\\" content=\\\"' + escapeHtml(desc) + '\\\">\\\\n';" + seoMeta
);

fs.writeFileSync('build.js', b);
console.log('✓ build.js: sitemap cleaned, SEO meta tags added');

// === 2. Run build ===
const { execSync } = require('child_process');
try {
  execSync('node build.js', { stdio: 'inherit' });
  console.log('✓ Build successful');
} catch (e) {
  console.error('Build failed, check output above');
  process.exit(1);
}

// === 3. Commit and push ===
try {
  execSync('git add -A', { stdio: 'inherit' });
  execSync('git commit -m "Fix hreflang sitemap, add SEO meta tags (robots, theme-color, og:site_name, og:locale)"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('✓ Pushed to GitHub');
} catch (e) {
  console.log('Git step needs manual handling, run: git add -A && git commit -m "SEO fixes" && git push');
}

console.log('\\n✅ All done!');
