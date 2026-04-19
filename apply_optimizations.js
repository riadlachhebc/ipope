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

let criticalCss = '';
try {
  criticalCss = fs.readFileSync(path.join(__dirname, 'css', 'critical.css'), 'utf8').replace(/\s+/g, ' ');
} catch (e) {
  console.log('Error reading critical.css', e);
}

// Prepare head resource hints
const headHints = `
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://flagcdn.com" />
  <link rel="dns-prefetch" href="https://api.qrserver.com" />
`;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // 1. Render Blocking CSS
  // Inline critical CSS if not completely there
  if (!content.includes(criticalCss.substring(0, 50)) && criticalCss) {
    content = content.replace('</head>', `\n  <style>${criticalCss}</style>\n</head>`);
  }
  
  // Convert all blocking stylesheet links to preload (excluding Google Fonts which we handle separately, and inline styles)
  // Let's match <link rel="stylesheet" href="css/something.css" />
  const stylesheetRegex = /<link\s+rel=["']stylesheet["']\s+href=["'](css\/[^"']+)["'][^>]*>/gi;
  content = content.replace(stylesheetRegex, (match, href) => {
    return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="${href}"></noscript>`;
  });

  // 2. Head Resource Hints
  if (!content.includes('dns-prefetch" href="https://flagcdn.com"')) {
    // Inject before the first <link rel="stylesheet" or Google Fonts if missing
    // or just before </head>
    content = content.replace('</head>', `${headHints}\n</head>`);
  }

  // Ensure Google fonts have display=swap
  if (content.includes('fonts.googleapis.com/css') && !content.includes('display=swap')) {
    content = content.replace(/href=["'](https:\/\/fonts\.googleapis\.com\/css[^"']*)["']/, (match, url) => {
      let sep = url.includes('?') ? '&' : '?';
      return `href="${url}${sep}display=swap"`;
    });
  }

  // 3. Unused JavaScript Chunking
  // Replace bundle.min.js with individual deferred scripts
  // We'll inspect the HTML to see what's needed.
  if (content.includes('bundle.min.js')) {
    let newScripts = `<script src="js/main.js" defer></script>\n  <script src="js/animations.js" defer></script>`;
    if (content.includes('accordion') || content.includes('faq')) {
      newScripts += `\n  <script src="js/accordion.js" defer></script>`;
    }
    if (content.includes('pricing') || content.includes('plan')) {
      newScripts += `\n  <script src="js/pricing.js" defer></script>`;
    }
    content = content.replace(/<script[^>]+src=["']js\/bundle\.min\.js["'][^>]*><\/script>/gi, newScripts);
  }

  // Ensure ALL scripts have defer (except maybe inline structured data which doesn't have src anyway)
  const scriptRegex = /<script\s+src=["']([^"']+)["'](?![^>]*defer)[^>]*><\/script>/gi;
  content = content.replace(scriptRegex, '<script src="$1" defer></script>');

  // 4. Image Optimization
  // Add loading="lazy" to images that are below the fold.
  // Instead of a complex DOM parser, we'll try to identify above-the-fold images by their class or parent.
  // Specifically, Hero images generally have fetchpriority="high" or loading="eager" already from previous instructions,
  // or they are in a <section class="hero" or "page-hero".
  // For the sake of safety with regex, let's just make sure all SVGs/PNGs have width/height.
  
  // Fix flagcdn images missing height
  content = content.replace(/<img\s([^>]*src=["']https:\/\/flagcdn\.com\/[^"']+["'][^>]*width=["'](?:16|20)["'])(?![^>]*height=)[^>]*>/gi, '<img $1 height="12">');
  content = content.replace(/<img\s([^>]*src=["']https:\/\/flagcdn\.com\/[^"']+["'][^>]*width=["']18["'])(?![^>]*height=)[^>]*>/gi, '<img $1 height="13">');

  // Any non-hero images that don't have loading="lazy" or loading="eager" 
  // Let's just find <img ...> and ensure it has loading if it's not the hero.
  // We are using regex so we skip images that already have loading=
  let imgSplit = content.split(/<img\s/i);
  for (let i = 1; i < imgSplit.length; i++) {
    // Determine if it's in a hero section: just look at the last 1000 characters for 'hero'
    let preceding = imgSplit[i-1].toLowerCase();
    let isAboveTheFold = false;
    // Check if it's the logo in nav
    if (preceding.endsWith('class="nav-logo"') || preceding.includes('nav-logo"')) {
      isAboveTheFold = true;
    }
    // Check if hero image
    if (imgSplit[i].startsWith('src="assets/images/hero-mockup.png"')) {
        isAboveTheFold = true;
    }

    if (!imgSplit[i].includes('loading=')) {
        if (isAboveTheFold) {
             imgSplit[i] = 'loading="eager" fetchpriority="high" ' + imgSplit[i];
        } else {
             imgSplit[i] = 'loading="lazy" ' + imgSplit[i];
        }
    }
    // Image missing width/height heuristic: if it's hero-mockup, width=580 height=380
    if (imgSplit[i].includes('hero-mockup.png') && !imgSplit[i].includes('width=')) {
        imgSplit[i] = 'width="580" height="380" ' + imgSplit[i];
    }
  }
  content = imgSplit.join('<img ');

  // 5. Remove LCP Delaying animations from `.hero` -> specifically find `.hero-float-badge` styles in index.html
  if (file.endsWith('index.html')) {
    content = content.replace(/animation:\s*float[^;]+;/g, '');
    content = content.replace(/animation-delay[^;]+;/g, '');
  }

  // Preload hero image if there's a hero image on the page
  if (content.includes('hero-mockup.png') && !content.includes('rel="preload" as="image" href="assets/images/hero-mockup.png"')) {
    content = content.replace('</head>', `\n  <link rel="preload" as="image" href="assets/images/hero-mockup.png" />\n</head>`);
  }

  // We write the file back if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Optimized: ${file}`);
  }
});
console.log('Done.');
