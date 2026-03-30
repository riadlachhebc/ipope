const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.xml') || f.endsWith('.txt') || f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace fully qualified URLs
  content = content.replace(/https:\/\/IPTV Mate\.pro/g, 'https://iptv-mate.net');
  
  // Replace email addresses just in case they exist in legal pages
  content = content.replace(/@IPTV Mate\.pro/g, '@iptv-mate.net');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
});
console.log('Domain replacement complete.');
