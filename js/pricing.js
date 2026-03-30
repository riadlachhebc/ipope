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

/* ── Price flip animation ────────────────────────────────────── */
function animatePrice(el, newValue) {
  if (!el) return;
  el.classList.remove('animating');
  void el.offsetWidth; // force reflow
  el.textContent = newValue;
  el.classList.add('animating');
  el.addEventListener('animationend', () => el.classList.remove('animating'), { once: true });
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

  /* 1. Pricing Cards */
  document.querySelectorAll('.plan-conn-text').forEach(el => {
    el.textContent = connLabel;
  });

  ['3m', '6m', '12m'].forEach(plan => {
    const priceEl  = document.getElementById(`price-${plan}`);
    const periodEl = document.getElementById(`period-${plan}`);
    if (priceEl && data[plan]) animatePrice(priceEl, data[plan].price);
    if (periodEl && data[plan]) periodEl.textContent = data[plan].period;
  });

  /* 2. Connection switcher buttons */
  document.querySelectorAll('.conn-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.conn, 10) === connections);
  });

  /* 3. WhatsApp links */
  document.querySelectorAll('.btn-whatsapp-order').forEach(link => {
    const card = link.closest('.pricing-card');
    if (!card) return;
    const planName = card.querySelector('.plan-name')?.textContent.trim() || '';
    const suffix = connections > 1 ? 's' : '';
    link.href = `https://wa.me/33600000000?text=I'd like to order the ${planName} plan with ${connections} connection${suffix}.`;
  });

  /* 3.5 Crypto payment links */
  document.querySelectorAll('.btn-crypto-pay').forEach(link => {
    const card = link.closest('.pricing-card');
    if (!card) return;
    const planName = card.querySelector('.plan-name')?.textContent.trim() || '';
    const suffix = connections > 1 ? ` (${connections} Conns)` : '';
    const priceText = card.querySelector('.amount')?.textContent.trim() || '';
    const fullPlanName = planName + suffix;
    link.href = `crypto-payment.html?plan=${encodeURIComponent(fullPlanName)}&price=${encodeURIComponent(priceText)}&v=${Date.now()}`;
  });

  /* 4. Savings Table */
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

  /* 5. Feature Comparison Table */
  setText('cmp-price-3m',  fmt(p3));
  setText('cmp-price-6m',  fmt(p6));
  setText('cmp-price-12m', fmt(p12));
  setText('cmp-conn-3m',   connections);
  setText('cmp-conn-6m',   connections);
  setText('cmp-conn-12m',  connections);
}

/* ── Boot ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.conn-btn').forEach(btn => {
    btn.addEventListener('click', () => updatePricing(btn.dataset.conn));
  });
  updatePricing(1);
});
