/* ================================================================
   PRICING.JS — Dynamic Connection Switching Logic
   ================================================================ */

const pricingData = {
  1: {
    '3m':  { price: 33,  period: '/3-months', months: 3  },
    '6m':  { price: 47,  period: '/6-months', months: 6  },
    '12m': { price: 75,  period: '/year',      months: 12 }
  },
  2: {
    '3m':  { price: 54,  period: '/3-months', months: 3  },
    '6m':  { price: 78,  period: '/6-months', months: 6  },
    '12m': { price: 124, period: '/year',      months: 12 }
  },
  3: {
    '3m':  { price: 76,  period: '/3-months', months: 3  },
    '6m':  { price: 108, period: '/6-months', months: 6  },
    '12m': { price: 173, period: '/year',      months: 12 }
  },
  4: {
    '3m':  { price: 97,  period: '/3-months', months: 3  },
    '6m':  { price: 139, period: '/6-months', months: 6  },
    '12m': { price: 221, period: '/year',      months: 12 }
  }
};

/* ── Helpers ─────────────────────────────────────────────────── */
function fmt(n) { return '€' + n; }

function perMonth(price, months) {
  return '€' + (price / months).toFixed(2) + '/mo';
}

function savings6m(data) {
  // Savings = what you'd pay at 3m rate for 6 months minus actual 6m price
  const rate3m = data['3m'].price / 3;        // per-month at 3m rate
  const wouldPay = rate3m * 6;                 // if you bought two 3m plans
  const saved = wouldPay - data['6m'].price;
  return saved > 0 ? 'Save €' + saved.toFixed(2) : '—';
}

function savings12m(data) {
  const rate3m = data['3m'].price / 3;
  const wouldPay = rate3m * 12;
  const saved = wouldPay - data['12m'].price;
  return saved > 0 ? 'Save €' + saved.toFixed(2) : '—';
}

/* ── Price flip animation (no forced reflow) ─────────────────── */
function animatePrice(el, newValue) {
  if (!el) return;
  // Read phase: remove class to reset animation state (no reflow triggered yet)
  el.classList.remove('animating');
  // Write phase in next rAF frame: avoids forced synchronous reflow
  requestAnimationFrame(() => {
    el.textContent = newValue;
    el.classList.add('animating');
    el.addEventListener('animationend', () => el.classList.remove('animating'), { once: true });
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ── Main update function ────────────────────────────────────── */
function updatePricing(connections) {
  connections = parseInt(connections, 10);
  const data = pricingData[connections];
  if (!data) return;

  const connLabel = connections === 1
    ? '1 connection = 1 device at the same time'
    : `${connections} connections = ${connections} devices at the same time`;

  // 1. DOM READS (Batch all reads at once — no writes yet)
  const plans = ['3m', '6m', '12m'];
  const priceEls = plans.map(p => document.getElementById(`price-${p}`));
  const periodEls = plans.map(p => document.getElementById(`period-${p}`));
  const connTextEls = document.querySelectorAll('.plan-conn-text');
  const connBtns = document.querySelectorAll('.conn-btn');
  const waLinks = document.querySelectorAll('.btn-whatsapp-order');
  const cryptoLinks = document.querySelectorAll('.btn-crypto-pay');

  // For links, read plan names from cards (read phase only)
  const linkData = [];
  waLinks.forEach(link => {
    const card = link.closest('.pricing-card');
    const planName = card ? (card.querySelector('.plan-name')?.textContent.trim() || '') : '';
    linkData.push({ link, planName, isWA: true });
  });
  cryptoLinks.forEach(link => {
    const card = link.closest('.pricing-card');
    const planName = card ? (card.querySelector('.plan-name')?.textContent.trim() || '') : '';
    const priceText = card ? (card.querySelector('.amount')?.textContent.trim() || '') : '';
    linkData.push({ link, planName, priceText, isCrypto: true });
  });

  // 2. DOM WRITES — all batched inside requestAnimationFrame (no mixed read/write)
  requestAnimationFrame(() => {
    // Update connection labels
    connTextEls.forEach(el => { el.textContent = connLabel; });

    // Update pricing with optimized animation:
    // Phase A — batch all classList.remove reads (resets animation state without reflow)
    priceEls.forEach((el) => { if (el) el.classList.remove('animating'); });

    // Phase B — batch all text + classList.add writes in next frame (clean separation)
    requestAnimationFrame(() => {
      priceEls.forEach((el, i) => {
        const plan = plans[i];
        if (el && data[plan]) {
          el.textContent = data[plan].price;
          el.classList.add('animating');
        }
      });
    });

    periodEls.forEach((el, i) => {
      const plan = plans[i];
      if (el && data[plan]) el.textContent = data[plan].period;
    });

    // Update buttons
    connBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.conn, 10) === connections);
    });

    // Update links
    linkData.forEach(item => {
      if (item.isWA) {
        const suffix = connections > 1 ? 's' : '';
        const msg = encodeURIComponent(`Hi, I'd like to order the ${item.planName} plan with ${connections} connection${suffix}.`);
        item.link.href = `https://wa.me/212763569826?text=${msg}`;
      } else if (item.isCrypto) {
        const suffix = connections > 1 ? ` (${connections} Conns)` : '';
        const fullPlanName = item.planName + suffix;
        item.link.href = `crypto-payment.html?plan=${encodeURIComponent(fullPlanName)}&price=${encodeURIComponent(item.priceText)}&v=${Date.now()}`;
      }
    });

    // Update Savings & Comparison Tables
    const p3  = data['3m'].price;
    const p6  = data['6m'].price;
    const p12 = data['12m'].price;

    setText('sv-total-3m',    fmt(p3));
    setText('sv-permonth-3m', perMonth(p3, 3));
    setText('sv-conn-3m',     connections);
    setText('sv-total-6m',    fmt(p6));
    setText('sv-permonth-6m', perMonth(p6, 6));
    setText('sv-saving-6m',   savings6m(data));
    setText('sv-conn-6m',     connections);
    setText('sv-total-12m',    fmt(p12));
    setText('sv-permonth-12m', perMonth(p12, 12));
    setText('sv-saving-12m',   savings12m(data));
    setText('sv-conn-12m',     connections);
    setText('cmp-price-3m',  fmt(p3));
    setText('cmp-price-6m',  fmt(p6));
    setText('cmp-price-12m', fmt(p12));
    setText('cmp-conn-3m',   connections);
    setText('cmp-conn-6m',   connections);
    setText('cmp-conn-12m',  connections);
  });
}

/* ── Boot ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.conn-btn').forEach(btn => {
    btn.addEventListener('click', () => updatePricing(btn.dataset.conn));
  });
  updatePricing(1);
});
