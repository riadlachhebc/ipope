const fs = require('fs');
const path = require('path');
const blogDir = path.join(__dirname, 'blog');

const filesToUpdate = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

filesToUpdate.forEach(fileName => {
  const filePath = path.join(blogDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. DESKTOP NAVBAR
  const navLinksRegex = /<ul class="nav-links"[\s\S]*?<\/ul>/;
  const newNavLinks = `<ul class="nav-links" role="menubar">
        <li role="none"><a class="nav-link" href="../features.html" role="menuitem">Features</a></li>
        <li role="none"><a class="nav-link" href="../pricing.html" role="menuitem">Plans</a></li>
        <li role="none"><a class="nav-link" href="../channels.html" role="menuitem">Channels</a></li>
        <li role="none"><a class="nav-link" href="../iptv-sports.html" role="menuitem">Sports</a></li>
        <li role="none"><a class="nav-link active" href="${fileName === 'index.html' ? 'index.html' : 'index.html'}" role="menuitem">Blog</a></li>
        <li role="none"><a class="nav-link" href="../faq.html" role="menuitem">FAQ</a></li>
        <li role="none"><a class="nav-link" href="../support.html" role="menuitem">Support</a></li>
      </ul>`;

  if (navLinksRegex.test(content)) {
    content = content.replace(navLinksRegex, newNavLinks);
  } else {
    console.warn(`Warning: nav-links not found in blog/${fileName}`);
  }

  // 2. NAV ACTIONS
  const navActionsRegex = /<div class="nav-actions">[\s\S]*?<\/div>/;
  const newNavActions = `<div class="nav-actions">
        <a href="../free-trial.html" class="btn btn-secondary btn-sm">Free Trial</a>
        <a href="../pricing.html" class="btn btn-primary btn-sm">Get Started</a>
      </div>`;

  if (navActionsRegex.test(content)) {
    content = content.replace(navActionsRegex, newNavActions);
  }

  // 3. MOBILE MENU
  const mobileMenuRegex = /<div id="mobileMenu"[\s\S]*?<div class="mobile-menu-actions"[\s\S]*?<\/div>\s*<\/div>/;
  const newMobileMenu = `<div id="mobileMenu" class="mobile-menu" role="dialog" aria-label="Mobile navigation">
  <a class="mobile-nav-link" href="../index.html">Home</a>
  <a class="mobile-nav-link" href="../features.html">Features</a>
  <a class="mobile-nav-link" href="../pricing.html">Plans</a>
  <a class="mobile-nav-link" href="../channels.html">Channels</a>
  <a class="mobile-nav-link" href="../iptv-sports.html">Sports</a>
  <a class="mobile-nav-link active" href="index.html">Blog</a>
  <a class="mobile-nav-link" href="../faq.html">FAQ</a>
  <a class="mobile-nav-link" href="../support.html">Support</a>
  <div class="mobile-menu-actions">
    <a href="../free-trial.html" class="btn btn-secondary">Free Trial</a>
    <a href="../pricing.html" class="btn btn-primary">Get Started</a>
  </div>
</div>`;

  if (mobileMenuRegex.test(content)) {
    content = content.replace(mobileMenuRegex, newMobileMenu);
  } else {
    console.warn(`Warning: mobileMenu not found in blog/${fileName}`);
  }

  // 4. FOOTER QUICK LINKS
  const footerQuickLinksRegex = /<div class="footer-col">\s*<h4>Quick Links<\/h4>\s*<ul class="footer-links">[\s\S]*?<\/ul>\s*<\/div>/;
  const newFooterQuickLinks = `<div class="footer-col">
        <h4>Quick Links</h4>
        <ul class="footer-links">
          <li><a class="footer-link" href="../features.html">Features</a></li>
          <li><a class="footer-link" href="../pricing.html">Plans &amp; Pricing</a></li>
          <li><a class="footer-link" href="../channels.html">All Channels</a></li>
          <li><a class="footer-link" href="../iptv-sports.html">Sports IPTV</a></li>
          <li><a class="footer-link" href="../free-trial.html">Free Trial</a></li>
          <li><a class="footer-link" href="../how-it-works.html">How It Works</a></li>
          <li><a class="footer-link" href="index.html">Blog</a></li>
          <li><a class="footer-link" href="../faq.html">FAQ</a></li>
          <li><a class="footer-link" href="../support.html">Support</a></li>
        </ul>
      </div>`;

  if (footerQuickLinksRegex.test(content)) {
    content = content.replace(footerQuickLinksRegex, newFooterQuickLinks);
  }

  // 5. NAV LOGO LINK
  content = content.replace(/<a href="\/" class="nav-logo"/g, '<a href="../index.html" class="nav-logo"');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated navigation in blog/${fileName}`);
  } else {
    console.log(`No changes needed in blog/${fileName}`);
  }
});

console.log('All blog navigation updated successfully.');
