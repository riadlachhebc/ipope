/* ================================================================
   ANIMATIONS.JS — IntersectionObserver Scroll Fade-In
   IPTV Mate | IPTV Europe
   ================================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const fadeEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!fadeEls.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  });
})();
