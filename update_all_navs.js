const fs = require('fs');
const path = require('path');

// Files in the root directory to update
const filesToUpdate = [
  'index.html',
  'pricing.html',
  'channels.html',
  'iptv-sports.html',
  'free-trial.html',
  'support.html',
  'how-it-works.html',
  'terms.html',
  'privacy.html',
  'refund.html',
  'faq.html',
  'crypto-payment.html'
];

filesToUpdate.forEach(fileName => {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${fileName}: file not found.`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. GLOBAL REPLACE OF ANY REMAINING blog.html
  // This handles simple links outside the main structures
  content = content.replace(/href="blog\.html"/g, 'href="blog/index.html"');

  // 2. NAVBAR (Desktop) - Ensure Blog link exists and is correct
  const navLinksMatch = content.match(/<ul class="nav-links"[\s\S]*?<\/ul>/);
  if (navLinksMatch) {
    let navLinksHtml = navLinksMatch[0];
    
    if (navLinksHtml.includes('href="blog/index.html"')) {
      // Already has it, but let's make sure it's in the right format
      // No action needed if it matches
    } else if (navLinksHtml.includes('href="blog.html"')) {
      // Should have been handled by global replace, but just in case
      navLinksHtml = navLinksHtml.replace('href="blog.html"', 'href="blog/index.html"');
    } else {
      // MISSING - Insert it
      const blogLink = '\n          <li role="none"><a class="nav-link" href="blog/index.html" role="menuitem">Blog</a></li>';
      if (navLinksHtml.includes('href="support.html"')) {
        navLinksHtml = navLinksHtml.replace(/(<li[\s\S]*?href="support.html")/, `${blogLink}\n          $1`);
      } else {
        navLinksHtml = navLinksHtml.replace('</ul>', `${blogLink}\n        </ul>`);
      }
    }
    content = content.replace(navLinksMatch[0], navLinksHtml);
  }

  // 3. MOBILE MENU - Ensure Blog link exists and is correct
  const mobileMenuMatch = content.match(/<div id="mobileMenu"[\s\S]*?<\/div>/);
  if (mobileMenuMatch) {
    let mobileMenuHtml = mobileMenuMatch[0];
    
    if (!mobileMenuHtml.includes('href="blog/index.html"')) {
      const blogMobileLink = '\n    <a class="mobile-nav-link" href="blog/index.html">Blog</a>';
      if (mobileMenuHtml.includes('href="support.html"')) {
        mobileMenuHtml = mobileMenuHtml.replace(/(<a class="mobile-nav-link" href="support.html")/, `${blogMobileLink}\n    $1`);
      } else {
        mobileMenuHtml = mobileMenuHtml.replace(/<div class="mobile-menu-actions"/, `${blogMobileLink}\n  <div class="mobile-menu-actions"`);
      }
    }
    content = content.replace(mobileMenuMatch[0], mobileMenuHtml);
  }

  // 4. FOOTER - Ensure Blog link exists and is correct
  const footerLinksMatch = content.match(/<ul class="footer-links"[\s\S]*?<\/ul>/);
  if (footerLinksMatch) {
    let footerLinksHtml = footerLinksMatch[0];
    if (!footerLinksHtml.includes('href="blog/index.html"')) {
      const blogFooterLink = '\n          <li><a class="footer-link" href="blog/index.html">Blog</a></li>';
      if (footerLinksHtml.includes('href="support.html"')) {
         footerLinksHtml = footerLinksHtml.replace(/(<li><a class="footer-link" href="support.html")/, `${blogFooterLink}\n          $1`);
      } else {
         footerLinksHtml = footerLinksHtml.replace('</ul>', `${blogFooterLink}\n        </ul>`);
      }
    }
    content = content.replace(footerLinksMatch[0], footerLinksHtml);
  }

  // 5. NAVBAR (Desktop) - Ensure FAQ link exists
  const navLinksMatchFaq = content.match(/<ul class="nav-links"[\s\S]*?<\/ul>/);
  if (navLinksMatchFaq) {
    let navLinksHtml = navLinksMatchFaq[0];
    if (!navLinksHtml.includes('href="faq.html"')) {
      const faqLink = '\n          <li role="none"><a class="nav-link" href="faq.html" role="menuitem">FAQ</a></li>';
      if (navLinksHtml.includes('href="support.html"')) {
         navLinksHtml = navLinksHtml.replace(/(<li[\s\S]*?href="support.html")/, `${faqLink}\n          $1`);
      } else {
         navLinksHtml = navLinksHtml.replace('</ul>', `${faqLink}\n        </ul>`);
      }
    }
    content = content.replace(navLinksMatchFaq[0], navLinksHtml);
  }

  // 6. MOBILE MENU - Ensure FAQ link exists
  const mobileMenuMatchFaq = content.match(/<div id="mobileMenu"[\s\S]*?<\/div>/);
  if (mobileMenuMatchFaq) {
    let mobileMenuHtml = mobileMenuMatchFaq[0];
    if (!mobileMenuHtml.includes('href="faq.html"')) {
      const faqMobileLink = '\n  <a class="mobile-nav-link" href="faq.html">FAQ</a>';
      if (mobileMenuHtml.includes('href="support.html"')) {
         mobileMenuHtml = mobileMenuHtml.replace(/(<a class="mobile-nav-link" href="support.html")/, `${faqMobileLink}\n  $1`);
      } else {
         mobileMenuHtml = mobileMenuHtml.replace(/<div class="mobile-menu-actions"/, `${faqMobileLink}\n  <div class="mobile-menu-actions"`);
      }
    }
    content = content.replace(mobileMenuMatchFaq[0], mobileMenuHtml);
  }

  // 7. FOOTER - Ensure FAQ link exists
  const footerLinksMatchFaq = content.match(/<ul class="footer-links"[\s\S]*?<\/ul>/);
  if (footerLinksMatchFaq) {
    let footerLinksHtml = footerLinksMatchFaq[0];
    if (!footerLinksHtml.includes('href="faq.html"')) {
      const faqFooterLink = '\n          <li><a class="footer-link" href="faq.html">FAQ</a></li>';
      if (footerLinksHtml.includes('href="support.html"')) {
         footerLinksHtml = footerLinksHtml.replace(/(<li><a class="footer-link" href="support.html")/, `${faqFooterLink}\n          $1`);
      } else {
         footerLinksHtml = footerLinksHtml.replace('</ul>', `${faqFooterLink}\n        </ul>`);
      }
    }
    content = content.replace(footerLinksMatchFaq[0], footerLinksHtml);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated links in ${fileName}`);
  }
});

console.log('Final Navigation Synchronize completed.');
