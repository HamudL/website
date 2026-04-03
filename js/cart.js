/* ============================================================
   PeptideLab – Cart Module
   ============================================================ */

window.Cart = (function () {

  var STORAGE_KEY = 'peptidelab_cart';

  /* ── State ─────────────────────────────────────────── */
  var state = {
    items: []
  };

  /* ── Persistence ────────────────────────────────────── */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.warn('Cart save failed', e);
    }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state.items = JSON.parse(raw);
    } catch (e) {
      state.items = [];
    }
  }

  /* ── Helpers ────────────────────────────────────────── */
  function findProduct(productId) {
    if (!window.PRODUCTS) return null;
    return window.PRODUCTS.find(function (p) { return p.id === productId; }) || null;
  }

  function findItem(productId) {
    return state.items.find(function (i) { return i.productId === productId; }) || null;
  }

  function formatPrice(amount) {
    return '€' + amount.toFixed(2);
  }

  /* ── Core operations ────────────────────────────────── */
  function add(productId, quantity) {
    quantity = quantity || 1;
    var existing = findItem(productId);
    if (existing) {
      existing.qty += quantity;
    } else {
      state.items.push({ productId: productId, qty: quantity });
    }
    save();
    render();
    var product = findProduct(productId);
    if (product && window.showToast) {
      window.showToast(product.name + ' zum Warenkorb hinzugefügt', 'success');
    }
  }

  function remove(productId) {
    state.items = state.items.filter(function (i) { return i.productId !== productId; });
    save();
    render();
  }

  function updateQty(productId, qty) {
    if (qty <= 0) {
      remove(productId);
      return;
    }
    var item = findItem(productId);
    if (item) {
      item.qty = qty;
      save();
      render();
    }
  }

  function getSubtotal() {
    return state.items.reduce(function (sum, item) {
      var p = findProduct(item.productId);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function getTotal() {
    return formatPrice(getSubtotal());
  }

  function getCount() {
    return state.items.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function clear() {
    state.items = [];
    save();
    render();
  }

  /* ── UI Updates ─────────────────────────────────────── */
  function updateCountBadges() {
    var count = getCount();
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  function renderDrawerItems() {
    var body = document.getElementById('cart-drawer-body');
    if (!body) return;

    if (state.items.length === 0) {
      body.innerHTML = '<div class="cart-empty">' +
        '<div class="cart-empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>' +
        '<p class="cart-empty-title">Ihr Warenkorb ist leer</p>' +
        '<p class="cart-empty-text">Entdecken Sie unsere Research-Peptide und fügen Sie Produkte hinzu.</p>' +
        '<a href="shop.html" class="btn btn-primary btn-sm">Zum Shop</a>' +
        '</div>';
      return;
    }

    var html = '';
    state.items.forEach(function (item) {
      var p = findProduct(item.productId);
      if (!p) return;
      var lineTotal = p.price * item.qty;
      html += '<div class="cart-item" data-id="' + p.id + '">' +
        '<div class="cart-item-visual" style="background:' + p.gradient + '">' + p.emoji + '</div>' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + p.name + '</div>' +
          '<div class="cart-item-format">' + p.format + ' | ' + p.purity + ' Reinheit</div>' +
          '<div class="cart-item-controls">' +
            '<div class="qty-controls">' +
              '<button class="qty-btn" aria-label="Weniger" onclick="Cart.updateQty(' + p.id + ',' + (item.qty - 1) + ')"><i class="fa-solid fa-minus"></i></button>' +
              '<span class="qty-value">' + item.qty + '</span>' +
              '<button class="qty-btn" aria-label="Mehr" onclick="Cart.updateQty(' + p.id + ',' + (item.qty + 1) + ')"><i class="fa-solid fa-plus"></i></button>' +
            '</div>' +
            '<button class="remove-item-btn" aria-label="Entfernen" onclick="Cart.remove(' + p.id + ')"><i class="fa-solid fa-trash-can"></i> Entfernen</button>' +
          '</div>' +
        '</div>' +
        '<div class="cart-item-price">' + formatPrice(lineTotal) + '</div>' +
        '</div>';
    });
    body.innerHTML = html;
  }

  function renderDrawerFooter() {
    var subtotalEl = document.getElementById('cart-subtotal-val');
    var totalEl    = document.getElementById('cart-total-val');
    var footer = document.querySelector('.cart-drawer-footer');
    if (!footer) return;

    var subtotal = getSubtotal();
    var shipping = subtotal >= 100 ? 0 : 4.99;
    var total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (totalEl)    totalEl.textContent    = formatPrice(total);

    var shippingEl = document.getElementById('cart-shipping-val');
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Kostenlos' : formatPrice(shipping);
  }

  function render() {
    updateCountBadges();
    renderDrawerItems();
    renderDrawerFooter();

    // If cart page is loaded, update it too
    if (window.CartPage && typeof window.CartPage.render === 'function') {
      window.CartPage.render();
    }
  }

  /* ── Drawer open/close ──────────────────────────────── */
  function open() {
    var drawer  = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (drawer)  drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    var drawer  = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (drawer)  drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Init ───────────────────────────────────────────── */
  load();

  return {
    state:     state,
    save:      save,
    add:       add,
    remove:    remove,
    updateQty: updateQty,
    getTotal:  getTotal,
    getSubtotal: getSubtotal,
    getCount:  getCount,
    clear:     clear,
    render:    render,
    open:      open,
    close:     close,
  };

}());
