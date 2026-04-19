const fs = require('fs');
const path = require('path');
const blogDir = path.join(__dirname, 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

for(const file of files) {
  const fp = path.join(blogDir, file);
  let content = fs.readFileSync(fp, 'utf-8');
  let original = content;

  // Replace ../index.html#faq and /#faq and just #faq (if any)
  content = content.replace(/href="\.\.\/index\.html#faq"/g, 'href="../faq.html"');
  content = content.replace(/href="\/#faq"/g, 'href="../faq.html"');
  content = content.replace(/href="#faq"/g, 'href="../faq.html"');

  if(content !== original) {
    fs.writeFileSync(fp, content, 'utf-8');
    console.log('Fixed ' + file);
  }
}
