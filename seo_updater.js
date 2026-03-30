const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'index.html');
let html = fs.readFileSync(target, 'utf8');

// 1. Head SEO tags
html = html.replace(
  /<title>.*?<\/title>\s*<meta name="description" content=".*?" \/>\s*<meta name="keywords" content=".*?" \/>\s*<meta name="author" content=".*?" \/>\s*<meta name="robots" content=".*?" \/>\s*<link rel="canonical" href=".*?" \/>/s,
  `<title>Best IPTV Subscriptions in Europe — 20,000+ Channels, 4K Streaming</title>
  <meta name='description' content='Get the best IPTV subscriptions in Europe. 20,000+ channels, 4K streaming, anti-freeze technology & free trial. Works on Firestick, Smart TV, Android & more.'>
  <link rel='canonical' href='https://yourdomain.com/'>`
);

// 2. FAQ Schema
const newSchema = `{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [ {"@type": "Question", "name": "Best IPTV subscription for Europe sports channels?", "acceptedAnswer": {"@type": "Answer", "text": "Our service provides thousands of dedicated buffer-free channels covering Premier League, Champions League, Formula 1, and international PPV events."}}, {"@type": "Question", "name": "Is there a cheap IPTV Europe with free trial?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, we offer a premium viewing experience at affordable rates with a comprehensive free trial before you spend a penny."}}, {"@type": "Question", "name": "What is anti-freeze IPTV?", "acceptedAnswer": {"@type": "Answer", "text": "Anti-freeze IPTV uses advanced server load balancing and CDNs to eliminate stuttering, freezing and buffering during high-traffic events."}}, {"@type": "Question", "name": "Does your IPTV work in UK, Spain and France?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, we have high-capacity local servers across all of Europe including UK, Spain, France, Germany and Italy."}}, {"@type": "Question", "name": "Do you offer 4K IPTV streaming in Europe?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, thousands of live channels and VOD titles are available in true 4K and Full HD. We recommend 25-30 Mbps for 4K streaming."}} ]}`;
html = html.replace(
  /<!-- Schema\.org: FAQPage -->\s*<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema\.org","@type":"FAQPage".*?\}\]\}\s*<\/script>/s,
  `<!-- Schema.org: FAQPage -->\n  <script type="application/ld+json">\n  ${newSchema}\n  </script>`
);

// 3. Hero
html = html.replace(
  /<h1 id="heroHeading">.*?<\/p>/s,
  `<h1 id="heroHeading">
          Best IPTV Subscriptions in Europe — 20,000+ Channels, 4K Streaming, No Buffering
        </h1>

        <p class="hero-desc">
          Are you tired of exorbitant cable bills, restrictive contracts, and limited viewing options? Experience the future of television with the most reliable IPTV subscriptions Europe has to offer. We provide instant, unrestricted access to over 20,000 premium live television channels, tens of thousands of on-demand movies, and exclusive blockbuster TV series—all broadcast in stunning 4K and Full HD resolution. Powered by cutting-edge anti-freeze technology, our robust European servers guarantee a seamless, buffer-free viewing experience no matter where you are located. Whether you want to catch every live sports match or binge-watch your favorite shows, our premium service is custom-built for you. Claim your free trial today and completely transform your home entertainment setup.
        </p>`
);

// 4. Features
html = html.replace(
  /<h2 id="featuresHeading">Why Choose Our IPTV Europe Service\?<\/h2>\s*<p>Everything you need for premium streaming across all EU markets — in one flexible subscription\.<\/p>/s,
  `<h2 id="featuresHeading">Why Choose Our IPTV Service in Europe?</h2>
      <p>Finding the best IPTV Europe market offers can feel like an overwhelming task, but our premium platform is deliberately engineered to stand out from the crowd. We prioritize absolute reliability above all else. Our state-of-the-art European server network is fortified with advanced anti-freeze technology and optimal load balancing. This ensures that your stream remains rock-solid and stable, even during peak evening viewing hours or highly anticipated live events.</p>
      <p style="margin-top:var(--sp-12);">You can finally say goodbye to frustrating buffering screens right in the middle of a crucial scene or match point. Furthermore, we deliver true 4K and crisp 1080p HD video quality that makes you feel like you are right in the action. Add in our built-in Electronic Program Guide (EPG) and 24/7 dedicated customer support, and you receive a comprehensive entertainment package tailored exactly to your viewing needs.</p>`
);

// 5. Pricing
html = html.replace(
  /<h2 id="pricingHeading">Subscription Plans &amp; Pricing<\/h2>\s*<p>Flexible IPTV subscription plans for Europe — no contract, cancel anytime\. All plans include 25,000\+ channels &amp; VOD\.<\/p>/s,
  `<h2 id="pricingHeading">Our IPTV Subscription Plans</h2>
      <p>We firmly believe that top-tier home entertainment should not break the bank. As a leading premium IPTV provider, we offer highly flexible, transparent pricing tiers designed to fit any budget without ever compromising on broadcast quality.</p>
      <p style="margin-top:var(--sp-12);">When you are ready to buy IPTV subscription packages from us, you can choose between flexible 1-month, cost-effective 3-month, or our highly discounted 12-month annual plans. By choosing our longer-term options, you secure incredibly cheap IPTV subscriptions while retaining all the high-end features, massive Video on Demand (VOD) libraries, and exceptional customer service that define our platform. There are no hidden fees, no binding long-term contracts, and no activation charges—just straightforward, high-quality television at a fraction of the cost of traditional satellite providers.</p>`
);

// 6. Channels Highlights
html = html.replace(
  /<h2 id="channelsHeading">25,000\+ Channels Including Live Sports<\/h2>\s*<p>From Premier League football to F1, from blockbusters to kids' cartoons — all your favourite content in one place\.<\/p>/s,
  `<h2 id="channelsHeading">IPTV Sports Channels — Live Football, PPV & More</h2>
      <p>Missing a crucial match or a championship fight is no longer an option. Our platform boasts an unparalleled selection of dedicated IPTV sports channels, making it the absolute ultimate destination for die-hard sports fans across the continent.</p>
      <p style="margin-top:var(--sp-12);">Watch every single thrilling moment of live football from the English Premier League, Spanish La Liga, Italian Serie A, the German Bundesliga, and the UEFA Champions League. Beyond European football, you will have exclusive, buffer-free access to global Pay-Per-View (PPV) events, Formula 1 racing, NFL, NBA basketball, tennis grand slams, boxing, and MMA. All critical sports networks are prioritized on our highest-bandwidth, low-latency servers to ensure zero delay and absolute visual clarity when the stakes are highest.</p>`
);

// 7. Devices
html = html.replace(
  /<h2 id="devicesHeading">Compatible with Firestick, Smart TV &amp; More<\/h2>\s*<p>One subscription — every screen\. Set up StreamEU Pro on any device you own in minutes\.<\/p>/s,
  `<h2 id="devicesHeading">Compatible With All Your Devices</h2>
      <p>Flexibility and ease of use are at the very core of our service. You can watch your favorite content anytime, anywhere, on virtually any screen you own.</p>
      <p style="margin-top:var(--sp-12);">Setting up our service is incredibly simple, particularly if you are looking for the best IPTV for Firestick. Within just a few minutes, you can load our dedicated application or utilize popular third-party players like TiviMate, IPTV Smarters Pro, or XCIPTV. Beyond Amazon devices, our service integrates seamlessly with Samsung (Tizen) and LG (WebOS) Smart TVs, Android TV boxes, MAG boxes, Apple TV, iOS smartphones, tablets, and desktop computers. You simply provide the device and an internet connection; we will provide the world-class, uninterrupted entertainment.</p>`
);

// 8. Free Trial
html = html.replace(
  /<h2 id="trialHeading">Free Trial – No Commitment<\/h2>\s*<p>Try StreamEU Pro free for 24 hours\. 25,000\+ channels, full 4K quality — no credit card, no strings attached\.<\/p>/s,
  `<h2 id="trialHeading">Free IPTV Trial — Try Before You Buy</h2>
      <p>We are so confident in the unmatched quality, speed, and reliability of our streaming service that we want you to test it out completely risk-free. If you are searching for a highly reliable yet cheap IPTV Europe with free trial, you are in exactly the right place.</p>
      <p style="margin-top:var(--sp-12);">Grab your IPTV trial Europe today and take the time to deeply explore our extensive channel list, test the flawless 4K picture quality, and browse our massive, regularly updated Video on Demand (VOD) library. We actively encourage you to take a full test drive during a live sporting event or a weekend movie night. This allows you to experience our superior anti-freeze technology firsthand, ensuring total satisfaction before making any financial commitments.</p>`
);

// 9. FAQ
html = html.replace(
  /<div id="faqAccordion" class="faq-grid" role="list">.*?<\/div>\s*<\/div>\s*<\/section>/s,
  `<div id="faqAccordion" class="faq-grid" role="list">
      <div class="accordion-item" role="listitem">
        <button class="accordion-btn" aria-controls="faq1" id="faqBtn1">
          Best IPTV subscription for Europe sports channels?
          <span class="accordion-icon" aria-hidden="true">+</span>
        </button>
        <div id="faq1" class="accordion-body" role="region" aria-labelledby="faqBtn1"><div class="accordion-body-inner">Our service ranks as the absolute best for European sports fans. We provide thousands of dedicated, buffer-free channels covering the Premier League, Champions League, Formula 1, and exclusive international PPV events. With our high-speed servers, you are guaranteed uninterrupted live coverage so you never miss a critical play.</div></div>
      </div>
      <div class="accordion-item" role="listitem">
        <button class="accordion-btn" aria-controls="faq2" id="faqBtn2">
          Is there a cheap IPTV Europe with free trial?
          <span class="accordion-icon" aria-hidden="true">+</span>
        </button>
        <div id="faq2" class="accordion-body" role="region" aria-labelledby="faqBtn2"><div class="accordion-body-inner">Yes! We offer a premium viewing experience at incredibly affordable rates, and we proudly provide a comprehensive free trial. You can thoroughly test our massive channel lineup, VOD library, and 4K server stability before spending a single penny. We want you to be 100% satisfied before you subscribe.</div></div>
      </div>
      <div class="accordion-item" role="listitem">
        <button class="accordion-btn" aria-controls="faq3" id="faqBtn3">
          What is anti-freeze IPTV?
          <span class="accordion-icon" aria-hidden="true">+</span>
        </button>
        <div id="faq3" class="accordion-body" role="region" aria-labelledby="faqBtn3"><div class="accordion-body-inner">Anti-freeze IPTV utilizes advanced server load balancing and specialized Content Delivery Networks (CDNs) to dynamically route your video stream. This cutting-edge technology effectively eliminates stuttering, freezing, and buffering, giving you a remarkably smooth, uninterrupted broadcast, even during high-traffic global events.</div></div>
      </div>
      <div class="accordion-item" role="listitem">
        <button class="accordion-btn" aria-controls="faq4" id="faqBtn4">
          Does your IPTV work in UK, Spain and France?
          <span class="accordion-icon" aria-hidden="true">+</span>
        </button>
        <div id="faq4" class="accordion-body" role="region" aria-labelledby="faqBtn4"><div class="accordion-body-inner">Absolutely. We have strategically placed, high-capacity local servers across all of Europe. Whether you are living in the UK, Spain, France, Germany, Italy, or anywhere else on the continent, you will enjoy localized channels, regional EPGs, multi-language subtitles, and lightning-fast connection speeds tailored to your exact location.</div></div>
      </div>
      <div class="accordion-item" role="listitem">
        <button class="accordion-btn" aria-controls="faq5" id="faqBtn5">
          Do you offer 4K IPTV streaming in Europe?
          <span class="accordion-icon" aria-hidden="true">+</span>
        </button>
        <div id="faq5" class="accordion-body" role="region" aria-labelledby="faqBtn5"><div class="accordion-body-inner">Yes, we offer thousands of premium live channels and VOD titles in breathtaking true 4K, Ultra HD, and Full HD resolution. As long as you have a stable internet connection (we recommend a minimum download speed of 25-30 Mbps for 4K streaming), you can enjoy crystal-clear, theater-quality viewing from the comfort of your living room.</div></div>
      </div>
    </div>
  </div>
</section>

<!-- ── Upgrade CTA ───────────────────────────────────────────────── -->
<section class="section">
  <div class="container">
    <div class="cta-banner fade-in">
      <h2>Ready to Upgrade Your Entertainment?</h2>
      <p>Stop overpaying for limited, overpriced cable packages and start watching premium television on your own terms. Join the thousands of satisfied European viewers who have already made the switch to the ultimate cord-cutting solution.</p>
      <div class="cta-banner-actions" style="margin-top:var(--sp-24);">
        <a href="free-trial.html" class="btn btn-primary btn-lg">Start Your Free Trial Now</a>
        <a href="pricing.html" class="btn btn-secondary btn-lg">View Our Subscription Plans</a>
      </div>
    </div>
  </div>
</section>`
);


fs.writeFileSync(target, html, 'utf8');
console.log('SEO update completed.');
