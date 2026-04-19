# IPTV Mate EU - Project Overview

IPTV Mate EU is a premium IPTV subscription service website focused on the European market. It is built as a highly optimized static website using Vanilla HTML, CSS, and JavaScript, supported by a custom Node.js-based build and maintenance pipeline.

## 🚀 Technical Architecture

- **Frontend:** Vanilla HTML5, CSS3 (using CSS Variables/Design Tokens), and asynchronous Vanilla JavaScript.
- **Build Pipeline:** A collection of custom Node.js scripts in the root directory handle site-wide updates, SEO optimizations, and performance enhancements.
- **Performance Focus:** The project utilizes critical CSS inlining, resource preloading (DNS prefetch, preconnect, image preload), and lazy loading for images and scripts.
- **Content Management:** Blog articles are defined in JavaScript data files and processed into static HTML pages.

## 🛠️ Key Build & Maintenance Commands

The project does not use a standard framework or `package.json`. Instead, maintenance is performed via Node.js scripts:

| Command | Description |
|---------|-------------|
| `node apply_optimizations.js` | Main optimization script: inlines critical CSS, adds `loading="lazy"`, preloads hero images, and minifies assets. |
| `node seo_updater.js` | Updates SEO meta tags and Schema.org JSON-LD (FAQ, etc.) in `index.html`. |
| `node build_js.js` | Bundles core JS files (`main.js`, `accordion.js`, `animations.js`) into `js/bundle.min.js`. |
| `node update_all_navs.js` | Synchronizes the navigation bar across all HTML files in the project. |
| `node update_css.js` | Utility to update or sync CSS changes across the site. |
| `node build_articles_1.js` | Likely used to generate or refresh blog article HTML files from `articles_part1.js`. |

## 📂 Directory Structure

- `/assets/images/`: Optimized `.webp` and `.png` assets.
- `/blog/`: Contains the blog index and individual SEO-optimized articles.
- `/css/`: Modular CSS files (`base.css`, `layout.css`, `components.css`, etc.) and purged/minified versions.
- `/js/`: Client-side logic, including `pricing.js` for dynamic plan switching.
- Root: Main landing pages (`index.html`, `pricing.html`, `channels.html`, etc.) and build scripts.

## 🎨 Development Conventions

### Styling
- **Design Tokens:** Defined in `:root` within `css/base.css`. Always use these variables for colors, spacing, and border-radii to maintain consistency.
- **CLS Prevention:** Maintain `min-height` on major sections (hero, navbar) to prevent layout shifts.

### JavaScript
- Use `defer` for all script tags.
- Pricing logic is centralized in `js/pricing.js` and supports 1 to 4 simultaneous connections.

### SEO & Content
- All pages should have a canonical URL.
- Blog content is first defined in `articles_partX.js` files before being deployed to HTML.
- Use Semantic HTML and ARIA roles for accessibility (e.g., `role="navigation"`, `aria-label`).

## ⚠️ Important Notes
- **Do not** manually edit the navigation in every file; use `update_all_navs.js`.
- After making structural changes to HTML files, run `node apply_optimizations.js` to ensure performance tags are correctly injected.
- The project aims for a 2026 "future-dated" context for SEO relevance.
