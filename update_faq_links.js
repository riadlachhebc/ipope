const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const targetSection = `  <!-- ── FAQ ───────────────────────────────────────────────────────── -->
  <section class="section section-alt" id="faq" aria-labelledby="faqHeading">
    <div class="container">
      <header class="section-header fade-in">
        <div class="section-tag">❓ FAQ</div>
        <h2 id="faqHeading">Frequently Asked Questions</h2>
        <p>Everything you need to know before you buy IPTV subscription in Europe.</p>
      </header>
      <div id="faqAccordion" class="faq-grid" role="list">
        <div class="accordion-item" role="listitem">
          <button class="accordion-btn" aria-controls="faq1" id="faqBtn1">
            Best IPTV subscription for Europe sports channels?
            <span class="accordion-icon" aria-hidden="true">+</span>
          </button>
          <div id="faq1" class="accordion-body" role="region" aria-labelledby="faqBtn1">
            <div class="accordion-body-inner">Our service ranks as the absolute best for European sports fans. We
              provide thousands of dedicated, buffer-free channels covering the Premier League, Champions League,
              Formula 1, and exclusive international PPV events. With our high-speed servers, you are guaranteed
              uninterrupted live coverage so you never miss a critical play.</div>
          </div>
        </div>
        <div class="accordion-item" role="listitem">
          <button class="accordion-btn" aria-controls="faq2" id="faqBtn2">
            Is there a cheap IPTV Europe with free trial?
            <span class="accordion-icon" aria-hidden="true">+</span>
          </button>
          <div id="faq2" class="accordion-body" role="region" aria-labelledby="faqBtn2">
            <div class="accordion-body-inner">Yes! We offer a premium viewing experience at incredibly affordable rates,
              and we proudly provide a comprehensive free trial. You can thoroughly test our massive channel lineup, VOD
              library, and 4K server stability before spending a single penny. We want you to be 100% satisfied before
              you subscribe.</div>
          </div>
        </div>
        <div class="accordion-item" role="listitem">
          <button class="accordion-btn" aria-controls="faq3" id="faqBtn3">
            What is anti-freeze IPTV?
            <span class="accordion-icon" aria-hidden="true">+</span>
          </button>
          <div id="faq3" class="accordion-body" role="region" aria-labelledby="faqBtn3">
            <div class="accordion-body-inner">Anti-freeze IPTV utilizes advanced server load balancing and specialized
              Content Delivery Networks (CDNs) to dynamically route your video stream. This cutting-edge technology
              effectively eliminates stuttering, freezing, and buffering, giving you a remarkably smooth, uninterrupted
              broadcast, even during high-traffic global events.</div>
          </div>
        </div>
        <div class="accordion-item" role="listitem">
          <button class="accordion-btn" aria-controls="faq4" id="faqBtn4">
            Does your IPTV work in UK, Spain and France?
            <span class="accordion-icon" aria-hidden="true">+</span>
          </button>
          <div id="faq4" class="accordion-body" role="region" aria-labelledby="faqBtn4">
            <div class="accordion-body-inner">Absolutely. We have strategically placed, high-capacity local servers
              across all of Europe. Whether you are living in the UK, Spain, France, Germany, Italy, or anywhere else on
              the continent, you will enjoy localized channels, regional EPGs, multi-language subtitles, and
              lightning-fast connection speeds tailored to your exact location.</div>
          </div>
        </div>
        <div class="accordion-item" role="listitem">
          <button class="accordion-btn" aria-controls="faq5" id="faqBtn5">
            Do you offer 4K IPTV streaming in Europe?
            <span class="accordion-icon" aria-hidden="true">+</span>
          </button>
          <div id="faq5" class="accordion-body" role="region" aria-labelledby="faqBtn5">
            <div class="accordion-body-inner">Yes, we offer thousands of premium live channels and VOD titles in
              breathtaking true 4K, Ultra HD, and Full HD resolution. As long as you have a stable internet connection
              (we recommend a minimum download speed of 25-30 Mbps for 4K streaming), you can enjoy crystal-clear,
              theater-quality viewing from the comfort of your living room.</div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

const targetSchema = `  <!-- Schema.org: FAQPage -->
  <script type="application/ld+json">
  {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [ {"@type": "Question", "name": "Best IPTV subscription for Europe sports channels?", "acceptedAnswer": {"@type": "Answer", "text": "Our service provides thousands of dedicated buffer-free channels covering Premier League, Champions League, Formula 1, and international PPV events."}}, {"@type": "Question", "name": "Is there a cheap IPTV Europe with free trial?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, we offer a premium viewing experience at affordable rates with a comprehensive free trial before you spend a penny."}}, {"@type": "Question", "name": "What is anti-freeze IPTV?", "acceptedAnswer": {"@type": "Answer", "text": "Anti-freeze IPTV uses advanced server load balancing and CDNs to eliminate stuttering, freezing and buffering during high-traffic events."}}, {"@type": "Question", "name": "Does your IPTV work in UK, Spain and France?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, we have high-capacity local servers across all of Europe including UK, Spain, France, Germany and Italy."}}, {"@type": "Question", "name": "Do you offer 4K IPTV streaming in Europe?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, thousands of live channels and VOD titles are available in true 4K and Full HD. We recommend 25-30 Mbps for 4K streaming."}} ]}
  </script>`;

// 1. Remove FAQ section and schema from index.html
let indexContent = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');

// Replace using precise blocks avoiding newline mismatches by splitting and joining
const removeBlock = (content, block) => {
    // using a simple literal replace as fallback, or regex
    return content.replace(block, '')
        .replace(block.replace(/\r\n/g, '\n'), '')
        .replace(block.replace(/\n/g, '\r\n'), '');
};

indexContent = removeBlock(indexContent, targetSection);
indexContent = removeBlock(indexContent, targetSchema);

fs.writeFileSync(path.join(projectRoot, 'index.html'), indexContent, 'utf-8');
console.log('Removed FAQ section and Schema from index.html');

// 2. Replace href="#faq" globally in all root HTML files, and update_all_navs.js
const processDir = (dir, isRoot) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            let original = content;

            // Determine correct URL based on directory depth
            const faqUrl = isRoot ? 'faq.html' : '../faq.html';
            
            // Replace root level href="#faq" or index.html#faq
            content = content.replace(/href="#faq"/g, 'href="' + faqUrl + '"');
            content = content.replace(/href="index\.html#faq"/g, 'href="' + faqUrl + '"');
            content = content.replace(/href="\/#faq"/g, 'href="/faq.html"');
            
            if (content !== original) {
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log('Updated links in ' + file);
            }
        }
    }
};

processDir(projectRoot, true); // Root files
processDir(path.join(projectRoot, 'blog'), false); // Blog files

console.log('Successfully updated all FAQ links');
