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
console.log(`Found ${htmlFiles.length} HTML files.`);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('styles.min.css')) {
     content = content.replace(/styles\.min\.css/g, 'purged-styles.min.css');
     fs.writeFileSync(file, content, 'utf8');
     console.log('Updated ' + file);
  }
});
