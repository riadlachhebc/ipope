/* ================================================================
   ANIMATIONS.JS — IntersectionObserver Scroll Fade-In
   IPTV Mate | IPTV Europe — Performance/Viewport Optimized
   ================================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!fadeEls.length) return;

    // Use a more permissive observer for immediate feedback
    const options = {
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px' 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Initial pass: Trigger items already in viewport immediately
    fadeEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const inViewport = (rect.top <= window.innerHeight && rect.bottom >= 0);
      
      if (inViewport) {
        // Delay slightly to ensure layout is stable
        setTimeout(() => el.classList.add('visible'), 100);
      } else {
        observer.observe(el);
      }
    });

    // Fallback: If after 800ms things are still invisible, force those in view
    setTimeout(() => {
        fadeEls.forEach(el => {
            if (!el.classList.contains('visible')) {
                const r = el.getBoundingClientRect();
                if (r.top <= window.innerHeight) el.classList.add('visible');
            }
        });
    }, 800);
  });
})();
