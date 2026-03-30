const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'blog');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
}

// 1. Read existing HTML components to keep DRY
let baseHtml = fs.readFileSync(path.join(__dirname, 'blog.html'), 'utf8');

// The strategy is to slice the HTML from top to <main class="container">, then inject content, then slice from <section class="section"> (the CTA) to the end.
const mainStart = baseHtml.indexOf('<main class="container">');
const ctaStart = baseHtml.indexOf('<!-- ── Upgrade CTA');

let headerPart = baseHtml.substring(0, mainStart);
let footerPart = baseHtml.substring(ctaStart);

// 2. Adjust paths to ../ inside the header and footer because these files live in /blog/
function fixPaths(html) {
    let replaced = html;
    replaced = replaced.replace(/href="css\/styles\.min\.css"/g, 'href="../css/styles.min.css"');
    replaced = replaced.replace(/src="js\/bundle\.min\.js"/g, 'src="../js/bundle.min.js"');
    replaced = replaced.replace(/src="assets\//g, 'src="../assets/');
    replaced = replaced.replace(/href="https:\/\/IPTV Mate\.pro\/assets\//g, 'href="../assets/');
    replaced = replaced.replace(/content="https:\/\/IPTV Mate\.pro\/assets\//g, 'content="../assets/');
    replaced = replaced.replace(/url\("assets\//g, 'url("../assets/');
    replaced = replaced.replace(/href="\/"/g, 'href="../index.html"');
    // Pages
    replaced = replaced.replace(/href="pricing\.html"/g, 'href="../pricing.html"');
    replaced = replaced.replace(/href="channels\.html"/g, 'href="../channels.html"');
    replaced = replaced.replace(/href="iptv-sports\.html"/g, 'href="../iptv-sports.html"');
    replaced = replaced.replace(/href="blog\.html"/g, 'href="../blog.html"');
    replaced = replaced.replace(/href="support\.html"/g, 'href="../support.html"');
    replaced = replaced.replace(/href="free-trial\.html"/g, 'href="../free-trial.html"');
    replaced = replaced.replace(/href="terms\.html"/g, 'href="../terms.html"');
    replaced = replaced.replace(/href="privacy\.html"/g, 'href="../privacy.html"');
    replaced = replaced.replace(/href="refund\.html"/g, 'href="../refund.html"');
    replaced = replaced.replace(/href="blog\//g, 'href="');
    replaced = replaced.replace(/href="sitemap\.xml"/g, 'href="../sitemap.xml"');
    
    // Also remove the original blog header since an article requires its own semantic layout
    replaced = replaced.replace(/<!-- ── Blog Header([^]*?)<!-- ── Blog Main Layout/g, '<!-- ── Blog Main Layout');
    
    return replaced;
}

headerPart = fixPaths(headerPart);
footerPart = fixPaths(footerPart);

// Generate article layout CSS to append to header
const articleCSS = `
    <style>
      .article-container { display: grid; grid-template-columns: 1fr 340px; gap: var(--sp-40); margin: var(--sp-64) auto; align-items: start; max-width: 1200px; }
      @media (max-width: 991px) { .article-container { grid-template-columns: 1fr; } }
      .breadcrumb { font-size: 0.9rem; margin-bottom: var(--sp-24); color: var(--text-muted); }
      .breadcrumb a { color: var(--primary); text-decoration: none; }
      .breadcrumb a:hover { text-decoration: underline; }
      .article-hero { margin-bottom: var(--sp-40); padding-bottom: var(--sp-32); border-bottom: 1px solid var(--border-color); }
      .category-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; background: var(--primary); color: white; font-size: 0.8rem; text-transform: uppercase; font-weight: 600; margin-bottom: var(--sp-16); }
      .article-title { font-size: clamp(2rem, 4vw, 3.2rem); line-height: 1.2; margin-bottom: var(--sp-16); color: var(--text-heading); }
      .article-meta { display: flex; gap: var(--sp-16); color: var(--text-muted); font-size: 0.9rem; align-items: center; }
      .article-content { line-height: 1.8; font-size: 1.05rem; color: var(--text-body); }
      .article-content h2 { margin-top: var(--sp-40); margin-bottom: var(--sp-16); font-size: 1.8rem; color: var(--text-heading); }
      .article-content h3 { margin-top: var(--sp-32); margin-bottom: var(--sp-12); font-size: 1.4rem; color: var(--text-heading); }
      .article-content p { margin-bottom: var(--sp-20); }
      .article-content ul, .article-content ol { margin-bottom: var(--sp-20); padding-left: var(--sp-24); }
      .article-content li { margin-bottom: var(--sp-8); }
      .author-box { display: flex; gap: var(--sp-20); background: var(--bg-surface); padding: var(--sp-24); border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-top: var(--sp-64); align-items: center; }
      .author-avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white; flex-shrink: 0; }
      .related-posts { margin-top: var(--sp-64); border-top: 1px solid var(--border-color); padding-top: var(--sp-40); }
      .related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-24); margin-top: var(--sp-24); }
      @media (max-width: 600px) { .related-grid { grid-template-columns: 1fr; } }
      .related-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--sp-20); transition: transform 0.2s; display: block; text-decoration: none; }
      .related-card:hover { transform: translateY(-3px); border-color: var(--primary); }
      .related-card h4 { color: var(--text-heading); margin-bottom: 8px; font-size: 1.1rem; line-height: 1.4;}
      .related-card p { color: var(--text-muted); font-size: 0.9rem; }
    </style>
  </head>`;

headerPart = headerPart.replace('</head>', articleCSS);

// We will fetch the sidebar from blog.html explicitly to reuse it
const sidebarStart = baseHtml.indexOf('<aside class="sidebar fade-in">');
const sidebarEnd = baseHtml.indexOf('</aside>') + '</aside>'.length;
let sidebarHTML = fixPaths(baseHtml.substring(sidebarStart, sidebarEnd));

// Base URL for structured data
const BASE_URL = 'http://localhost:8080/blog/'; // Localhost for now

const articles = []; // Array of posts

module.exports = { headerPart, footerPart, sidebarHTML, articles, targetDir, BASE_URL };
