const fs = require('fs');
const path = require('path');
const blogDir = path.join(__dirname, 'blog');

const filesToUpdate = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

filesToUpdate.forEach(fileName => {
  const filePath = path.join(blogDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. NAVBAR (Desktop) - Ensure FAQ link exists
  const navLinksMatchFaq = content.match(/<ul class="nav-links"[\s\S]*?<\/ul>/);
  if (navLinksMatchFaq) {
    let navLinksHtml = navLinksMatchFaq[0];
    if (!navLinksHtml.includes('href="../faq.html"')) {
      const faqLink = '\n          <li role="none"><a class="nav-link" href="../faq.html" role="menuitem">FAQ</a></li>';
      if (navLinksHtml.includes('href="../support.html"')) {
         navLinksHtml = navLinksHtml.replace(/(<li[\s\S]*?href="\.\.\/support\.html")/, `${faqLink}\n          $1`);
      } else {
         navLinksHtml = navLinksHtml.replace('</ul>', `${faqLink}\n        </ul>`);
      }
    }
    content = content.replace(navLinksMatchFaq[0], navLinksHtml);
  }

  // 2. MOBILE MENU - Ensure FAQ link exists
  const mobileMenuMatchFaq = content.match(/<div id="mobileMenu"[\s\S]*?<\/div>/);
  if (mobileMenuMatchFaq) {
    let mobileMenuHtml = mobileMenuMatchFaq[0];
    if (!mobileMenuHtml.includes('href="../faq.html"')) {
      const faqMobileLink = '\n  <a class="mobile-nav-link" href="../faq.html">FAQ</a>';
      if (mobileMenuHtml.includes('href="../support.html"')) {
         mobileMenuHtml = mobileMenuHtml.replace(/(<a class="mobile-nav-link" href="\.\.\/support\.html")/, `${faqMobileLink}\n  $1`);
      } else {
         mobileMenuHtml = mobileMenuHtml.replace(/<div class="mobile-menu-actions"/, `${faqMobileLink}\n  <div class="mobile-menu-actions"`);
      }
    }
    content = content.replace(mobileMenuMatchFaq[0], mobileMenuHtml);
  }

  // 3. FOOTER - Ensure FAQ link exists
  const footerLinksMatchFaq = content.match(/<ul class="footer-links"[\s\S]*?<\/ul>/);
  if (footerLinksMatchFaq) {
    let footerLinksHtml = footerLinksMatchFaq[0];
    if (!footerLinksHtml.includes('href="../faq.html"')) {
      const faqFooterLink = '\n          <li><a class="footer-link" href="../faq.html">FAQ</a></li>';
      if (footerLinksHtml.includes('href="../support.html"')) {
         footerLinksHtml = footerLinksHtml.replace(/(<li><a class="footer-link" href="\.\.\/support\.html")/, `${faqFooterLink}\n          $1`);
      } else {
         footerLinksHtml = footerLinksHtml.replace('</ul>', `${faqFooterLink}\n        </ul>`);
      }
    }
    content = content.replace(footerLinksMatchFaq[0], footerLinksHtml);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated FAQ links in blog/${fileName}`);
  }
});
console.log('Blog navigation synchronize completed.');
