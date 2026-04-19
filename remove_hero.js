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
console.log(`Checking ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
  if (!file.endsWith('index.html')) {
     let content = fs.readFileSync(file, 'utf8');
     if (content.includes('as="image" href="assets/images/hero-mockup.png"')) {
         content = content.replace(/<link rel="preload" as="image" href="assets\/images\/hero-mockup\.png" \/>[\s\r\n]*/g, '');
         fs.writeFileSync(file, content, 'utf8');
         console.log('Removed from ' + file);
     }
  }
});
console.log('Done.');
