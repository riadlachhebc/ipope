const fs = require('fs');
const path = require('path');

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
  'refund.html'
];

filesToUpdate.forEach(fileName => {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Add to Navbar (Desktop)
  const blogNavLink = '\n        <li role="none"><a class="nav-link" href="blog.html" role="menuitem">Blog</a></li>';
  const blogNavLinkSimple = '\n        <li><a class="nav-link" href="blog.html">Blog</a></li>';

  if (!content.includes('href="blog.html"')) {
    if (content.includes('href="iptv-sports.html"')) {
      content = content.replace('href="iptv-sports.html" role="menuitem">Sports</a></li>', 'href="iptv-sports.html" role="menuitem">Sports</a></li>' + blogNavLink);
    } else if (content.includes('href="channels.html"')) {
       // For legal pages or others missing sports
       const channelsLink = content.includes('role="menuitem"') ? 
          'href="channels.html" role="menuitem">Channels</a></li>' : 
          'href="channels.html">Channels</a></li>';
       
       const linkToAdd = content.includes('role="menuitem"') ? blogNavLink : blogNavLinkSimple;
       content = content.replace(channelsLink, channelsLink + linkToAdd);
    }
  }

  // 2. Add to Mobile Menu
  const blogMobileLink = '\n  <a class="mobile-nav-link" href="blog.html">Blog</a>';
  if (!content.includes('href="blog.html"') && content.includes('class="mobile-nav-link"')) {
    if (content.includes('href="iptv-sports.html"')) {
       content = content.replace('href="iptv-sports.html">Sports</a>', 'href="iptv-sports.html">Sports</a>' + blogMobileLink);
    } else if (content.includes('href="support.html"')) {
       content = content.replace('href="support.html">Support</a>', 'href="support.html">Support</a>' + blogMobileLink);
    }
  }

  // 3. Add to Footer
  const blogFooterLink = '\n          <li><a class="footer-link" href="blog.html">Blog</a></li>';
  if (!content.includes('href="blog.html"') && content.includes('class="footer-link"')) {
    if (content.includes('href="iptv-sports.html"')) {
      content = content.replace('href="iptv-sports.html">Sports IPTV</a></li>', 'href="iptv-sports.html">Sports IPTV</a></li>' + blogFooterLink);
    } else if (content.includes('href="support.html"')) {
      content = content.replace('href="support.html">Support</a></li>', 'href="support.html">Support</a></li>' + blogFooterLink);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated links in ${fileName}`);
  }
});
