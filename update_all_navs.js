const fs = require('fs');
const path = require('path');

// Files in the root directory to update
const filesToUpdate = [
  'index.html',
  'pricing.html',
  'features.html',
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

  // 1. DESKTOP NAVBAR
  const navLinksRegex = /<ul class="nav-links"[\s\S]*?<\/ul>/;
  const newNavLinks = `<ul class="nav-links" role="menubar">
        <li role="none"><a class="nav-link${fileName === 'features.html' ? ' active' : ''}" href="features.html" role="menuitem">Features</a></li>
        <li role="none"><a class="nav-link${fileName === 'pricing.html' ? ' active' : ''}" href="pricing.html" role="menuitem">Plans</a></li>
        <li role="none"><a class="nav-link${fileName === 'channels.html' ? ' active' : ''}" href="channels.html" role="menuitem">Channels</a></li>
        <li role="none"><a class="nav-link${fileName === 'iptv-sports.html' ? ' active' : ''}" href="iptv-sports.html" role="menuitem">Sports</a></li>
        <li role="none"><a class="nav-link" href="blog/index.html" role="menuitem">Blog</a></li>
        <li role="none"><a class="nav-link${fileName === 'faq.html' ? ' active' : ''}" href="faq.html" role="menuitem">FAQ</a></li>
        <li role="none"><a class="nav-link${fileName === 'support.html' ? ' active' : ''}" href="support.html" role="menuitem">Support</a></li>
      </ul>`;

  if (navLinksRegex.test(content)) {
    content = content.replace(navLinksRegex, newNavLinks);
  } else if (content.includes('<div class="nav-actions">')) {
    content = content.replace('<div class="nav-actions">', `${newNavLinks}\n      <div class="nav-actions">`);
  } else {
    console.warn(`Warning: nav-links not found in ${fileName}`);
  }

  // 2. NAV ACTIONS
  const navActionsRegex = /<div class="nav-actions">[\s\S]*?<\/div>/;
  const newNavActions = `<div class="nav-actions">
        <a href="free-trial.html" class="btn btn-secondary btn-sm">Free Trial</a>
        <a href="pricing.html" class="btn btn-primary btn-sm">Get Started</a>
      </div>`;

  if (navActionsRegex.test(content)) {
    content = content.replace(navActionsRegex, newNavActions);
  }

  // 3. MOBILE MENU
  const mobileMenuRegex = /<div id="mobileMenu"[\s\S]*?<div class="mobile-menu-actions"[\s\S]*?<\/div>\s*<\/div>/;
  const newMobileMenu = `<div id="mobileMenu" class="mobile-menu" role="dialog" aria-label="Mobile navigation">
  <a class="mobile-nav-link${fileName === 'index.html' ? ' active' : ''}" href="index.html">Home</a>
  <a class="mobile-nav-link${fileName === 'features.html' ? ' active' : ''}" href="features.html">Features</a>
  <a class="mobile-nav-link${fileName === 'pricing.html' ? ' active' : ''}" href="pricing.html">Plans</a>
  <a class="mobile-nav-link${fileName === 'channels.html' ? ' active' : ''}" href="channels.html">Channels</a>
  <a class="mobile-nav-link${fileName === 'iptv-sports.html' ? ' active' : ''}" href="iptv-sports.html">Sports</a>
  <a class="mobile-nav-link" href="blog/index.html">Blog</a>
  <a class="mobile-nav-link${fileName === 'faq.html' ? ' active' : ''}" href="faq.html">FAQ</a>
  <a class="mobile-nav-link${fileName === 'support.html' ? ' active' : ''}" href="support.html">Support</a>
  <div class="mobile-menu-actions">
    <a href="free-trial.html" class="btn btn-secondary">Free Trial</a>
    <a href="pricing.html" class="btn btn-primary">Get Started</a>
  </div>
</div>`;

  if (mobileMenuRegex.test(content)) {
    content = content.replace(mobileMenuRegex, newMobileMenu);
  } else {
    console.warn(`Warning: mobileMenu not found in ${fileName}`);
  }

  // 4. FOOTER QUICK LINKS (where present)
  const footerQuickLinksRegex = /<div class="footer-col">\s*<h4>Quick Links<\/h4>\s*<ul class="footer-links">[\s\S]*?<\/ul>\s*<\/div>/;
  const newFooterQuickLinks = `<div class="footer-col">
        <h4>Quick Links</h4>
        <ul class="footer-links">
          <li><a class="footer-link" href="features.html">Features</a></li>
          <li><a class="footer-link" href="pricing.html">Plans &amp; Pricing</a></li>
          <li><a class="footer-link" href="channels.html">All Channels</a></li>
          <li><a class="footer-link" href="iptv-sports.html">Sports IPTV</a></li>
          <li><a class="footer-link" href="free-trial.html">Free Trial</a></li>
          <li><a class="footer-link" href="how-it-works.html">How It Works</a></li>
          <li><a class="footer-link" href="blog/index.html">Blog</a></li>
          <li><a class="footer-link" href="faq.html">FAQ</a></li>
          <li><a class="footer-link" href="support.html">Support</a></li>
        </ul>
      </div>`;

  if (footerQuickLinksRegex.test(content)) {
    content = content.replace(footerQuickLinksRegex, newFooterQuickLinks);
  }

  // 5. NAV LOGO LINK (standardize)
  content = content.replace(/<a href="\/" class="nav-logo"/g, '<a href="index.html" class="nav-logo"');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated navigation in ${fileName}`);
  } else {
    console.log(`No changes needed in ${fileName}`);
  }
});

console.log('All root navigation updated successfully.');
