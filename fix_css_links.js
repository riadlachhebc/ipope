const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(getAllHtmlFiles(file));
      }
    } else {
      if (file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const htmlFiles = getAllHtmlFiles(__dirname);
console.log(`Checking ${htmlFiles.length} HTML files for nested noscripts...`);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace <noscript><link rel="preload" ... onload...><noscript>...
  // basically we want to extract just ONE <link rel="preload"...> and ONE <noscript><link rel="stylesheet"...></noscript>
  // Let's use string replace for the specific messed up pattern:
  
  const messupRegex = /<noscript><link\s+rel=["']preload["']\s+href=["']([^"']+)["'][^>]*>\s*<noscript><link\s+rel=["']stylesheet["']\s+href=["'][^"']+["']><\/noscript><\/noscript>/gi;
  
  content = content.replace(messupRegex, '<noscript><link rel="stylesheet" href="$1"></noscript>');

  // Let's also verify we don't have:  <link rel="preload" ...> \n <noscript><link rel="preload" ....
  // For the exact output on index.html:
  // <link rel="preload" href="css/purged-index.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  // <noscript><link rel="preload" href="css/purged-index.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  // <noscript><link rel="stylesheet" href="css/purged-index.min.css"></noscript></noscript>
  const exactMessup = /<link rel="preload" href="([^"]+)" as="style" onload="this\.onload=null;this\.rel='stylesheet'">\s*<noscript><link rel="preload" href="\1" as="style" onload="this\.onload=null;this\.rel='stylesheet'">\s*<noscript><link rel="stylesheet" href="\1"><\/noscript><\/noscript>/g;
  
  content = content.replace(exactMessup, `<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="$1"></noscript>`);

  // Same for pricing.css
  content = content.replace(/<link rel="preload" href="css\/pricing\.css" as="style" onload="this\.onload=null;this\.rel='stylesheet'">\s*<noscript><link rel="preload" href="css\/pricing\.css" as="style" onload="this\.onload=null;this\.rel='stylesheet'">\s*<noscript><link rel="stylesheet" href="css\/pricing\.css"><\/noscript><\/noscript>/g, `<link rel="preload" href="css/pricing.css" as="style" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="css/pricing.css"></noscript>`);

  if (content !== originalContent) {
     fs.writeFileSync(file, content, 'utf8');
     console.log('Fixed nested noscript in ' + file);
  }
});
console.log('Done.');
