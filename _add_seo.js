const fs = require('fs');
let b = fs.readFileSync('build.js', 'utf8');

const target = '  h += \'  <meta name="twitter:description" content="\' + escapeHtml(desc) + \'">\\n\';';
const seoBlock = target + '\n' +
  '  h += \'  <meta name="robots" content="index, follow">\\n\';\n' +
  '  h += \'  <meta name="theme-color" content="#0284c7">\\n\';\n' +
  '  h += \'  <meta property="og:site_name" content="\' + SITE_NAME + \'">\\n\';\n' +
  '  h += \'  <meta property="og:locale" content="en_US">\\n\'';

b = b.replace(target, seoBlock);
fs.writeFileSync('build.js', b);
console.log('SEO tags added to build.js');
