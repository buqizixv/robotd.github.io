const fs = require('fs');
let b = fs.readFileSync('build.js', 'utf8');
let lines = b.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("xml += '  <url><loc>' + url + '</loc><lastmod>'")) {
    lines[i] = "  xml += '  <url><loc>' + url + '</loc><lastmod>' + a.date + '</lastmod><changefreq>weekly</changefreq><priority>0.9</priority>\\n  </url>\\n\\n';";
  }
}
b = lines.join('\n');
// Also fix the orphaned '; after
b = b.replace("';\nxml += '</urlset>\n'", "  });\nxml += '</urlset>'");
fs.writeFileSync('build.js', b);
console.log('Fixed');
