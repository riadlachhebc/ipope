/* ================================================================
   ACCORDION.JS — FAQ Accordion Open/Close
   StreamEU Pro | IPTV Europe  
   ================================================================ */
(function () {
  'use strict';

  function initAccordion(containerSelector) {
    const items = document.querySelectorAll(`${containerSelector} .accordion-item`);
    if (!items.length) return;

    items.forEach(item => {
      const btn  = item.querySelector('.accordion-btn');
      const body = item.querySelector('.accordion-body');
      if (!btn || !body) return;

      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all siblings
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBody = other.querySelector('.accordion-body');
            const otherBtn  = other.querySelector('.accordion-btn');
            if (otherBody) otherBody.style.maxHeight = null;
            if (otherBtn)  otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Open first by default
    if (items[0]) items[0].querySelector('.accordion-btn')?.click();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAccordion('#faqAccordion');
    initAccordion('#faqAccordion2');
  });
})();
