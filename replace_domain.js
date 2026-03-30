const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.xml') || f.endsWith('.txt') || f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace fully qualified URLs
  content = content.replace(/https:\/\/streameu\.pro/g, 'https://yourdomain.com');
  
  // Replace email addresses just in case they exist in legal pages
  content = content.replace(/@streameu\.pro/g, '@yourdomain.com');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
});
console.log('Domain replacement complete.');
