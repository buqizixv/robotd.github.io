const fs = require('fs');
let b = fs.readFileSync('build.js', 'utf8');

// Fix 1: Remove xhtml namespace from sitemap
b = b.replace(' xmlns:xhtml="http://www.w3.org/1999/xhtml"', '');

// Fix 2: Nuke all hreflang and fix broken </url> lines
// The current code has 3 lines per article in the sitemap:
//   xml += '  <url><loc>' + url + ...
//   xml += '    <xhtml:link...'
//   xml += '    <xhtml:link...\n  </url>\n\n';

// Remove EVERYTHING between the priority line and xml += '</urlset>'
// This is safer than trying to match specific lines
let lines = b.split('\n');
let newLines = [];
let inSitemapArticle = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Start of article loop in sitemap
  if (line.includes("articles.forEach(a => {")) {
    newLines.push(line);
    inSitemapArticle = true;
    continue;
  }

  // Replace the xml line and skip hreflang lines
  if (inSitemapArticle && line.includes("xml += '  <url><loc>' + url + '</loc><lastmod>'")) {
    newLines.push("  xml += '  <url><loc>' + url + '</loc><lastmod>' + a.date + '</lastmod><changefreq>weekly</changefreq><priority>0.9</priority>\\n  </url>\\n\\n';");
    // Skip hreflang lines and the broken </url>
    while (i + 1 < lines.length && (lines[i+1].includes('xhtml:link') || lines[i+1].includes('</url>'))) {
      i++;
    }
    continue;
  }

  newLines.push(line);
}
b = newLines.join('\n');

// Fix 3: Add SEO meta tags after twitter:description
const seoTagBlock = `  h += '  <meta name="twitter:description" content="' + escapeHtml(desc) + '">\\n';
  h += '  <meta name="robots" content="index, follow">\\n';
  h += '  <meta name="theme-color" content="#0284c7">\\n';
  h += '  <meta property="og:site_name" content="' + SITE_NAME + '">\\n';
  h += '  <meta property="og:locale" content="en_US">\\n'`;

b = b.replace(
  '  h += \'  <meta name="twitter:description" content="\' + escapeHtml(desc) + \'">\\\\n\';',
  seoTagBlock
);

fs.writeFileSync('build.js', b);
console.log('✓ build.js fixed, trying build...');

// Run build
try {
  const { execSync } = require('child_process');
  execSync('node build.js', { stdio: 'inherit' });
  console.log('\n✓ Build successful!');
  execSync('git add build.js', { stdio: 'inherit' });
  execSync('git commit -m "Fix sitemap hreflang, add SEO meta tags"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log('✓ Pushed to GitHub');
} catch(e) {
  console.log('\nBuild or git issue. Run manually:');
  console.log('  node build.js');
  console.log('  git add -A && git commit -m "SEO fixes" && git push');
}
