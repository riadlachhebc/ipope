const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Critical CSS and non-critical CSS Loading
const criticalCss = fs.readFileSync('css/critical.css', 'utf8').replace(/\s+/g, ' ');
const cssMinified = `<style>${criticalCss}</style>\n  <link rel="preload" href="css/purged-index.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="css/purged-index.min.css"></noscript>`;

html = html.replace('<link rel="stylesheet" href="css/styles.min.css" />', cssMinified);

// 2. Preconnects, DNS Prefetch, and Image Preload for LCP
const newHeadLinks = `
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://flagcdn.com" />
  <link rel="dns-prefetch" href="https://api.qrserver.com" />
  <link rel="preload" as="image" href="assets/images/hero-mockup.png" />`;

const oldFontsRegex = /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>/;
if (oldFontsRegex.test(html)) {
  html = html.replace(oldFontsRegex, newHeadLinks.trim());
} else if (html.includes('<link rel="preconnect"')) {
   // Just in case
   html = html.replace('<link rel="preconnect" href="https://fonts.googleapis.com" />', newHeadLinks.trim() + '\n  <link rel="preconnect" href="https://fonts.googleapis.com" />');
}

// 3. Unused JS - Splitting the bundle into its constituents exactly
html = html.replace(
  '<script src="js/bundle.min.js" defer></script>',
  '<script src="js/main.js" defer></script>\n  <script src="js/accordion.js" defer></script>\n  <script src="js/animations.js" defer></script>'
);

// 4. Image Optimizations (Missing Dimensions & Lazy Loading)
// We will replace known below-the-fold flags with w/h and lazy.
// France, Germany, Spain, Italy, UK, Netherlands, Portugal flags in the hero DO NOT get lazy loading.
// So we just add width/height if missing there. (Wait, hero flags have 'width="16"'). 
// Actually I'll use regex to inject loading="lazy" into flags not in the hero-flag-row.
// But it's easier to just find specific sections.
// E.g. .testimonials-grid img and .author-location img.
html = html.replace(/<img src="https:\/\/flagcdn\.com\/((?!w20).)*?\.svg" width="18"/g, '<img src="https://flagcdn.com/$1.svg" width="18" height="13" loading="lazy"');

// 5. Hero Logo (already has loading='eager' fetchpriority='high' width/height)
// Check if missing dimensions on other SVGs? Trust Bar SVGs, Device Compatibility SVGs?
// They are inline <svg>s or <svg> with viewBox so dimensions aren't as much an issue as <img>.
// The logo in the navbar:
html = html.replace(/<img src="assets\/images\/logo\.png" alt="IPTV Mate Logo" height="48"/g, '<img src="assets/images/logo.png" alt="IPTV Mate Logo" width="48" height="48" loading="eager" fetchpriority="high"');

// The logo in the footer:
html = html.replace(/<img src="assets\/images\/logo\.png" alt="IPTV Mate Logo" height="48"/g, '<img src="assets/images/logo.png" alt="IPTV Mate Logo" width="48" height="48" loading="lazy"');

// Note: Replace will replace the first match for the first statement, then the second for the second statement!

fs.writeFileSync('index.html', html, 'utf8');
console.log('Optimizations applied to index.html successfully.');
