const fs = require('fs');
let b = fs.readFileSync('build.js', 'utf8');

// Fix sitemap: remove all lines with xhtml:hreflang
// and fix the broken </url> that ended up outside the string
let lines = b.split('\n');
let out = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Fix namespace line if broken
  if (line.includes('<urlset xmlns=') && line.includes('       >')) {
    out.push('let xml = \'<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\\n\';');
    continue;
  }

  // Skip hreflang lines
  if (line.includes('xhtml:link')) continue;

  // Fix the broken line where xml string has trailing ;  </url>
  if (line.includes("xml += '  <url><loc>' + url + '</loc><lastmod>'")) {
    // Remove any trailing garbage after the string
    let clean = line.replace(/;?\s*<\/url>.*$/, '');
    // Check if it ends properly
    if (!clean.endsWith("';")) {
      clean = clean.replace(/\\n'$/, "\\n  </url>\\n\\n'");
      if (!clean.endsWith("';")) {
        clean = "  xml += '  <url><loc>' + url + '</loc><lastmod>' + a.date + '</lastmod><changefreq>weekly</changefreq><priority>0.9</priority>\\n  </url>\\n\\n';";
      }
    }
    out.push(clean);
    continue;
  }

  // Skip empty lines that came from broken </url>
  if (line.trim() === '</url>') continue;
  if (line.trim() === '' && out.length > 0 && out[out.length-1].trim() === '});') continue;

  out.push(line);
}
b = out.join('\n');

// Add SEO tags
let t = "  h += '  <meta name=\"twitter:description\" content=\"' + escapeHtml(desc) + '\">\\\\n';";
let n = t + "\n" +
  "  h += '  <meta name=\"robots\" content=\"index, follow\">\\\\n';\n" +
  "  h += '  <meta name=\"theme-color\" content=\"#0284c7\">\\\\n';\n" +
  "  h += '  <meta property=\"og:site_name\" content=\"' + SITE_NAME + '\">\\\\n';\n" +
  "  h += '  <meta property=\"og:locale\" content=\"en_US\">\\\\n'";
b = b.replace(t, n);

fs.writeFileSync('build.js', b);
console.log('Fixed build.js');
