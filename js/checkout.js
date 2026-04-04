/* ============================================================
   PeptideLab – Checkout Logic
   Communicates with backend API at /api/*
   Falls back to localStorage-only mode if backend unavailable.
   ============================================================ */

(function () {
  'use strict';

  var API_BASE = '';  // same origin as backend
  var appliedPromo = null;
  var shippingCost = 0;
  var FREE_SHIPPING_THRESHOLD = 150;

  document.addEventListener('DOMContentLoaded', function () {
    var items = Cart.state.items;
    if (!items || items.length === 0) {
      document.getElementById('checkout-layout').style.display = 'none';
      document.getElementById('empty-cart-msg').style.display = 'block';
      return;
    }
    renderOrderSummary();
    initPaymentOptions();
    initPromoCode();
    initConfirmCheckboxes();
    initPlaceOrder();
    updateCartBadges();
  });

  /* ── Cart badges ── */
  function updateCartBadges() {
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = Cart.getCount();
    });
  }

  /* ── Order summary render ── */
  function renderOrderSummary() {
    var items = Cart.state.items;
    var itemsEl = document.getElementById('co-items-list');
    if (!itemsEl) return;

    var subtotal = 0;
    itemsEl.innerHTML = items.map(function (it) {
      var product = (window.PRODUCTS || []).find(function (p) { return p.id === it.productId; });
      var name    = product ? product.name : ('Produkt #' + it.productId);
      var emoji   = product ? product.emoji : '🧪';
      var gradient = product ? product.gradient : '#0a1628';
      var price   = product ? product.price : 0;
      subtotal   += price * it.qty;
      return '<div class="order-summary-item">' +
        '<div class="order-summary-item-emoji" style="background:' + gradient + '">' + emoji + '</div>' +
        '<div class="order-summary-item-name">' + name + '</div>' +
        '<span class="order-summary-item-qty">× ' + it.qty + '</span>' +
        '<span class="order-summary-item-price">€' + (price * it.qty).toFixed(2) + '</span>' +
        '</div>';
    }).join('');

    shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6.90;
    updateTotals(subtotal);
  }

  function updateTotals(subtotal) {
    if (subtotal === undefined) {
      subtotal = Cart.state.items.reduce(function (acc, it) {
        var p = (window.PRODUCTS || []).find(function (p) { return p.id === it.productId; });
        return acc + (p ? p.price * it.qty : 0);
      }, 0);
    }
    shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6.90;

    var discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') {
        discount = subtotal * (appliedPromo.value / 100);
      } else if (appliedPromo.type === 'fixed') {
        discount = Math.min(appliedPromo.value, subtotal);
      }
    }

    var total = Math.max(0, subtotal - discount + shippingCost);

    var subtotalEl = document.getElementById('co-subtotal');
    var shippingEl = document.getElementById('co-shipping-val');
    var totalEl    = document.getElementById('co-total');
    var discLine   = document.getElementById('co-discount-line');
    var discLabel  = document.getElementById('co-discount-label');
    var discVal    = document.getElementById('co-discount-val');

    if (subtotalEl) subtotalEl.textContent = '€' + subtotal.toFixed(2);
    if (shippingEl) shippingEl.textContent = shippingCost === 0 ? 'Kostenlos 🎉' : '€' + shippingCost.toFixed(2);
    if (totalEl) totalEl.textContent = '€' + total.toFixed(2);

    if (discLine) {
      if (discount > 0 && appliedPromo) {
        discLine.style.display = 'flex';
        if (discLabel) discLabel.textContent = 'Rabatt (' + appliedPromo.code + ')';
        if (discVal) discVal.textContent = '-€' + discount.toFixed(2);
      } else {
        discLine.style.display = 'none';
      }
    }

    return total;
  }

  /* ── Payment options ── */
  function initPaymentOptions() {
    document.querySelectorAll('.payment-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        document.querySelectorAll('.payment-option').forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        var radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });
  }

  /* ── Promo code ── */
  function initPromoCode() {
    var btn = document.getElementById('apply-promo-btn');
    var input = document.getElementById('co-promo');
    var feedback = document.getElementById('promo-feedback');
    if (!btn || !input) return;

    btn.addEventListener('click', function () {
      var code = (input.value || '').trim().toUpperCase();
      if (!code) return;

      btn.disabled = true;
      btn.textContent = '...';

      // Try API first
      fetchJson('/api/promo/validate', 'POST', { code: code })
        .then(function (data) {
          if (data && data.valid) {
            appliedPromo = data.promo;
            feedback.style.display = 'block';
            feedback.style.color = '#10b981';
            feedback.innerHTML = '<i class="fa-solid fa-check"></i> Code "' + code + '" angewendet – ' +
              (data.promo.type === 'percent' ? data.promo.value + '% Rabatt' : '€' + data.promo.value.toFixed(2) + ' Rabatt');
            updateTotals();
          } else {
            tryLocalPromo(code, feedback);
          }
        })
        .catch(function () { tryLocalPromo(code, feedback); })
        .finally(function () { btn.disabled = false; btn.textContent = 'Einlösen'; });
    });
  }

  function tryLocalPromo(code, feedback) {
    var stored = [];
    try { stored = JSON.parse(localStorage.getItem('peptidelab_promos') || '[]'); } catch (e) {}
    var found = stored.find(function (p) { return p.code === code && p.active; });
    feedback.style.display = 'block';
    if (found) {
      appliedPromo = found;
      feedback.style.color = '#10b981';
      feedback.innerHTML = '<i class="fa-solid fa-check"></i> Code "' + code + '" angewendet – ' +
        (found.type === 'percent' ? found.value + '% Rabatt' : '€' + found.value.toFixed(2) + ' Rabatt');
      updateTotals();
    } else {
      appliedPromo = null;
      feedback.style.color = '#ef4444';
      feedback.innerHTML = '<i class="fa-solid fa-times"></i> Ungültiger oder abgelaufener Code.';
      updateTotals();
    }
  }

  /* ── Confirm checkboxes ── */
  function initConfirmCheckboxes() {
    var researchCb = document.getElementById('co-research-confirm');
    var agbCb      = document.getElementById('co-agb-confirm');
    var placeBtn   = document.getElementById('place-order-btn');

    function check() {
      if (placeBtn) placeBtn.disabled = !(researchCb && researchCb.checked && agbCb && agbCb.checked);
    }

    if (researchCb) researchCb.addEventListener('change', check);
    if (agbCb)      agbCb.addEventListener('change', check);
  }

  /* ── Place order ── */
  function initPlaceOrder() {
    var btn = document.getElementById('place-order-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (!validateForm()) return;

      var labelEl = document.getElementById('place-order-label');
      btn.disabled = true;
      if (labelEl) labelEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Bestellung wird aufgegeben...';

      var orderData = buildOrder();

      fetchJson('/api/orders', 'POST', orderData)
        .then(function (res) {
          if (res && res.success) {
            finalizeOrder(res.order || orderData);
          } else {
            saveOrderLocally(orderData);
          }
        })
        .catch(function () {
          saveOrderLocally(orderData);
        });
    });
  }

  function buildOrder() {
    var items = Cart.state.items.map(function (it) {
      var p = (window.PRODUCTS || []).find(function (pr) { return pr.id === it.productId; });
      return {
        productId: it.productId,
        name: p ? p.name : 'Produkt #' + it.productId,
        emoji: p ? p.emoji : '🧪',
        price: p ? p.price : 0,
        qty: it.qty,
      };
    });

    var subtotal = items.reduce(function (s, it) { return s + it.price * it.qty; }, 0);
    var discount = 0;
    if (appliedPromo) {
      discount = appliedPromo.type === 'percent'
        ? subtotal * (appliedPromo.value / 100)
        : Math.min(appliedPromo.value, subtotal);
    }
    var shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6.90;
    var total        = Math.max(0, subtotal - discount + shippingCost);

    return {
      id:        generateOrderId(),
      createdAt: new Date().toISOString(),
      status:    'Ausstehend',
      customer: {
        firstName: val('co-first-name'),
        lastName:  val('co-last-name'),
        email:     val('co-email'),
        company:   val('co-company'),
      },
      shipping: {
        street:  val('co-street'),
        zip:     val('co-zip'),
        city:    val('co-city'),
        country: val('co-country'),
        notes:   val('co-notes'),
      },
      payment:      selectedPayment(),
      promo:        appliedPromo ? appliedPromo.code : null,
      items:        items,
      subtotal:     subtotal,
      discount:     discount,
      shippingCost: shippingCost,
      total:        total,
    };
  }

  function saveOrderLocally(order) {
    var orders = [];
    try { orders = JSON.parse(localStorage.getItem('peptidelab_orders') || '[]'); } catch (e) {}
    orders.unshift(order);
    localStorage.setItem('peptidelab_orders', JSON.stringify(orders));
    finalizeOrder(order);
  }

  function finalizeOrder(order) {
    sessionStorage.setItem('peptidelab_last_order', JSON.stringify(order));
    window.location.href = 'order-success.html';
  }

  /* ── Form validation ── */
  function validateForm() {
    var valid = true;
    var requiredIds = ['co-first-name', 'co-last-name', 'co-email', 'co-street', 'co-zip', 'co-city', 'co-country'];
    requiredIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var empty = !el.value.trim();
      var emailInvalid = id === 'co-email' && el.value && !el.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      if (empty || emailInvalid) {
        el.classList.add('error');
        valid = false;
      } else {
        el.classList.remove('error');
      }
    });

    if (!document.getElementById('co-research-confirm')?.checked) valid = false;
    if (!document.getElementById('co-agb-confirm')?.checked) valid = false;

    if (!valid) window.showToast && window.showToast('Bitte alle Pflichtfelder ausfüllen.', 'error');
    return valid;
  }

  /* ── Helpers ── */
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function selectedPayment() {
    var sel = document.querySelector('input[name="payment"]:checked');
    return sel ? sel.value : 'bankueberweisung';
  }

  function generateOrderId() {
    return 'PL-' + Date.now().toString(36).toUpperCase() + '-' +
      Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  function fetchJson(url, method, body) {
    return fetch(url, {
      method: method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (res) { return res.json(); });
  }

})();
