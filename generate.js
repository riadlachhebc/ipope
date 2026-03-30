const fs = require('fs');
const path = require('path');

let { headerPart, footerPart, sidebarHTML, targetDir, BASE_URL } = require('./build_articles_1');
const part1 = require('./articles_part1');
const part2 = require('./articles_part2');
const part3 = require('./articles_part3');

const allArticles = [...part1, ...part2, ...part3];

allArticles.forEach((article, index) => {
    let head = headerPart;

    // 1. Replace Meta Tags
    head = head.replace(/<title>.*<\/title>/s, `<title>${article.title}</title>`);
    head = head.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${article.metaDesc}"`);
    head = head.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${BASE_URL}${article.filename}"`);
    
    // Open Graph
    head = head.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${article.title}"`);
    head = head.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${article.metaDesc}"`);
    head = head.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${BASE_URL}${article.filename}"`);
    
    // Twitter Card
    head = head.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${article.title}"`);
    head = head.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${article.metaDesc}"`);

    // 2. Replace Schema
    const articleSchema = `
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${article.title}",
      "description": "${article.metaDesc}",
      "datePublished": "2025-${article.date.split(' ')[0]}-01",
      "author": {
        "@type": "Organization",
        "name": "IPTV Mate Editorial Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "IPTV Mate",
        "logo": {
          "@type": "ImageObject",
          "url": "https://iptv-mate.net/assets/images/hero-mockup.png"
        }
      }
    }
    `;
    // Replace the existing Blog schema entirely
    head = head.replace(/<script type="application\/ld\+json">\s*{[\s\S]*?"@type":\s*"Blog"[\s\S]*?}\s*<\/script>/s, `<script type="application/ld+json">${articleSchema}</script>`);

    // 3. Build Related Posts (pick 2 other different articles)
    let relatedHTML = '';
    const relatedPosts = allArticles.filter(a => a.filename !== article.filename).slice(0, 2);
    relatedPosts.forEach(rp => {
        relatedHTML += `
        <a href="${rp.filename}" class="related-card">
            <h4>${rp.title.split(' |')[0]}</h4>
            <p>${rp.category} • ${rp.readTime}</p>
        </a>`;
    });

    // 4. Build Body HTML
    const bodyHtml = `
<main class="container">
  <div class="article-container">
    <article class="article-main fade-in">
        <div class="breadcrumb">
            <a href="../index.html">Home</a> &gt; <a href="../blog.html">Blog</a> &gt; <span>${article.title.split(' |')[0]}</span>
        </div>
        
        <header class="article-hero">
            <span class="category-badge">${article.category}</span>
            <h1 class="article-title">${article.title.split(' |')[0]}</h1>
            <div class="article-meta">
                <span>📅 ${article.date}</span>
                <span>⏱️ ${article.readTime}</span>
            </div>
        </header>
        
        <div class="article-content">
            <p style="font-size:1.15rem; font-weight:500; margin-bottom:var(--sp-32); line-height:1.7; color:var(--text-muted); padding-left:15px; border-left:4px solid var(--primary);">${article.intro}</p>
            ${article.content}
        </div>
        
        <div class="author-box">
            <div class="author-avatar">EU</div>
            <div>
                <h4 style="margin-bottom:var(--sp-8); color:var(--text-heading); font-size:1.2rem;">IPTV Mate Editorial Team</h4>
                <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.5;">Passionate technical experts dedicated to bringing you the best IPTV hardware reviews, service analysis, and setup tutorials across Europe.</p>
            </div>
        </div>
        
        <div class="related-posts">
            <h3 style="font-size:1.4rem; margin-bottom:var(--sp-24); color:var(--text-heading);">Related Articles</h3>
            <div class="related-grid">
                ${relatedHTML}
            </div>
        </div>
    </article>
    
    ${sidebarHTML}
  </div>
</main>
`;

    // 5. Combine and Write
    const finalHtml = head + bodyHtml + footerPart;
    const outPath = path.join(targetDir, article.filename);
    
    fs.writeFileSync(outPath, finalHtml);
    console.log('Created: blog/' + article.filename);
});

console.log('Successfully generated all ' + allArticles.length + ' blog posts.');
