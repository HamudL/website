/* ============================================================
   PeptideLab – Main Application Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // Always init
  initNav();
  initMobileMenu();
  initScrollAnimations();
  initAgeVerification();
  initToasts();
  initCartEvents();

  // Page-specific init based on filename
  var path = window.location.pathname;
  var page = path.split('/').pop() || 'index.html';

  if (page === '' || page === 'index.html') {
    initHeroCounters();
    initCounters();
    initIndexFeatured();
  } else if (page === 'shop.html') {
    initShopPage();
  } else if (page === 'product.html') {
    initProductPage();
  } else if (page === 'cart.html') {
    initCartPage();
    window.CartPage = { render: initCartPageRender };
    initCartPage();
  } else if (page === 'about.html') {
    initCounters();
  } else if (page === 'contact.html') {
    initContactForm();
    initFAQ();
  }

  // Render cart badges everywhere
  Cart.render();
});

/* ============================================================
   NAV
   ============================================================ */
function initNav() {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link
  var path = window.location.pathname;
  var page = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (
      (href === 'index.html' && (page === 'index.html' || page === '')) ||
      (href !== 'index.html' && href !== '' && page === href)
    ) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });
}

/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-up, .fade-in, .stagger').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('stagger')) {
          var children = entry.target.querySelectorAll(':scope > *');
          children.forEach(function (child) {
            child.classList.add('fade-up');
          });
          setTimeout(function () {
            children.forEach(function (child) {
              child.classList.add('visible');
            });
          }, 50);
        } else {
          entry.target.classList.add('visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-in, .stagger').forEach(function (el) {
    observer.observe(el);
  });
}

/* ============================================================
   COUNTER ANIMATION (IntersectionObserver)
   ============================================================ */
function initCounters() {
  var counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}

function animateCounter(el) {
  var target  = parseFloat(el.getAttribute('data-target')) || 0;
  var suffix  = el.getAttribute('data-suffix') || '';
  var prefix  = el.getAttribute('data-prefix') || '';
  var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
  var duration = 1800;
  var start    = performance.now();

  function step(now) {
    var progress = Math.min((now - start) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3);
    var current = target * ease;
    el.textContent = prefix + current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   HERO COUNTERS
   ============================================================ */
function initHeroCounters() {
  // Hero stat values are already in DOM, just animate them
  var stats = document.querySelectorAll('.hero-stat-value[data-target]');
  if (!stats.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(function (s) { observer.observe(s); });
}

/* ============================================================
   AGE VERIFICATION
   ============================================================ */
function initAgeVerification() {
  var modal = document.getElementById('age-modal');
  if (!modal) return;

  if (!sessionStorage.getItem('ageVerified')) {
    modal.classList.add('open');
  }

  document.getElementById('age-confirm-btn').addEventListener('click', function () {
    sessionStorage.setItem('ageVerified', '1');
    modal.classList.remove('open');
  });

  document.getElementById('age-decline-btn').addEventListener('click', function () {
    window.location.href = 'https://www.google.de';
  });
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function initToasts() {
  // Create container if missing
  if (!document.getElementById('toast-container')) {
    var container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

window.showToast = function (message, type, title) {
  type = type || 'info';
  var icons = {
    success: 'fa-circle-check',
    error:   'fa-circle-xmark',
    info:    'fa-circle-info'
  };
  var titles = {
    success: 'Erfolgreich',
    error:   'Fehler',
    info:    'Information'
  };
  var container = document.getElementById('toast-container');
  if (!container) return;

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML =
    '<div class="toast-icon"><i class="fa-solid ' + (icons[type] || icons.info) + '"></i></div>' +
    '<div class="toast-content">' +
      '<div class="toast-title">' + (title || titles[type] || 'Hinweis') + '</div>' +
      '<div class="toast-msg">' + message + '</div>' +
    '</div>' +
    '<button class="toast-close" aria-label="Schließen"><i class="fa-solid fa-xmark"></i></button>';

  container.appendChild(toast);

  toast.querySelector('.toast-close').addEventListener('click', function () {
    dismissToast(toast);
  });

  setTimeout(function () { dismissToast(toast); }, 4000);
};

function dismissToast(toast) {
  toast.classList.add('hiding');
  setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
}

/* ============================================================
   CART EVENTS
   ============================================================ */
function initCartEvents() {
  // Open cart
  document.querySelectorAll('.cart-btn, [data-open-cart]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      Cart.open();
    });
  });

  // Close cart
  var closeBtn = document.getElementById('cart-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', Cart.close);

  var overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', Cart.close);
}

/* ============================================================
   INDEX PAGE – FEATURED PRODUCTS
   ============================================================ */
function initIndexFeatured() {
  var grid = document.getElementById('featured-products-grid');
  if (!grid || !window.PRODUCTS) return;
  // IDs: BPC-157, TB-500, Semaglutid, Epithalon (repräsentative Auswahl)
  var featured = [1, 2, 21, 24];
  var products = window.PRODUCTS.filter(function (p) { return featured.includes(p.id); });
  renderProducts(products, grid);
}

/* ============================================================
   SHOP PAGE
   ============================================================ */
function initShopPage() {
  if (!window.PRODUCTS) return;

  var state = {
    search:   '',
    category: 'all',
    sort:     'popular'
  };

  var grid         = document.getElementById('products-grid');
  var countEl      = document.getElementById('results-count');
  var searchInput  = document.getElementById('shop-search');
  var sortSelect   = document.getElementById('shop-sort');
  var filterTabs   = document.querySelectorAll('.filter-tab');

  function getFiltered() {
    var products = window.PRODUCTS.slice();

    // Category filter
    if (state.category !== 'all') {
      products = products.filter(function (p) { return p.category === state.category; });
    }

    // Search filter
    if (state.search.trim()) {
      var q = state.search.trim().toLowerCase();
      products = products.filter(function (p) {
        return p.name.toLowerCase().includes(q) ||
               p.fullName.toLowerCase().includes(q) ||
               p.description.toLowerCase().includes(q) ||
               p.categoryLabel.toLowerCase().includes(q);
      });
    }

    // Sort
    if (state.sort === 'price-asc') {
      products.sort(function (a, b) { return a.price - b.price; });
    } else if (state.sort === 'price-desc') {
      products.sort(function (a, b) { return b.price - a.price; });
    } else if (state.sort === 'new') {
      products = products.filter(function (p) { return p.badgeType === 'new'; }).concat(
        products.filter(function (p) { return p.badgeType !== 'new'; })
      );
    } else {
      // popular: by reviews desc
      products.sort(function (a, b) { return b.reviews - a.reviews; });
    }
    return products;
  }

  function update() {
    var filtered = getFiltered();
    if (grid) renderProducts(filtered, grid);
    if (countEl) {
      countEl.innerHTML = '<strong>' + filtered.length + '</strong> Produkte gefunden';
    }
    // Re-run scroll animation for new elements
    setTimeout(initScrollAnimations, 50);
  }

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.search = searchInput.value;
      update();
    });
  }

  // Sort
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      update();
    });
  }

  // Filter tabs
  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.category = tab.getAttribute('data-category') || 'all';
      update();
    });
  });

  // Check URL param for category
  var urlParams = new URLSearchParams(window.location.search);
  var catParam  = urlParams.get('category');
  if (catParam) {
    filterTabs.forEach(function (tab) {
      if (tab.getAttribute('data-category') === catParam) {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        state.category = catParam;
      }
    });
  }

  update();
}

/* ============================================================
   RENDER PRODUCTS (reusable)
   ============================================================ */
function renderProducts(products, container) {
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:4rem 0;color:var(--color-text-muted)">' +
      '<i class="fa-solid fa-search" style="font-size:2.5rem;opacity:0.3;margin-bottom:1rem;display:block"></i>' +
      '<p>Keine Produkte gefunden.</p>' +
      '<a href="shop.html" class="btn btn-outline btn-sm" style="margin-top:1rem">Alle anzeigen</a>' +
      '</div>';
    return;
  }

  var html = '';
  products.forEach(function (p) {
    var badgeHtml = p.badge
      ? '<span class="product-badge badge-' + p.badgeType + '">' + p.badge + '</span>'
      : '';
    var origPriceHtml = p.originalPrice
      ? '<span class="product-price-original">€' + p.originalPrice.toFixed(2) + '</span>'
      : '';
    var stars = starsHtml(p.rating);

    html += '<article class="product-card fade-up" role="article" onclick="window.location.href=\'product.html?id=' + p.id + '\'">' +
      '<div class="product-card-visual" style="background:' + p.gradient + '">' +
        badgeHtml +
        '<span style="position:relative;z-index:1">' + p.emoji + '</span>' +
      '</div>' +
      '<div class="product-card-body">' +
        '<div class="product-category">' + p.categoryLabel + '</div>' +
        '<h3 class="product-name">' + p.name + '</h3>' +
        '<p class="product-desc">' + p.description + '</p>' +
        '<div class="product-rating">' +
          '<span class="stars" aria-label="Bewertung: ' + p.rating + ' von 5">' + stars + '</span>' +
          '<span class="rating-value">' + p.rating + '</span>' +
          '<span class="rating-count">(' + p.reviews + ' Bewertungen)</span>' +
        '</div>' +
        '<div class="product-card-footer">' +
          '<div class="product-price-group">' +
            '<span class="product-price">€' + p.price.toFixed(2) + '</span>' +
            origPriceHtml +
          '</div>' +
          '<button class="add-to-cart-btn" aria-label="In den Warenkorb" onclick="event.stopPropagation();Cart.add(' + p.id + ',1)">' +
            '<i class="fa-solid fa-cart-plus"></i> Kaufen' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  });

  container.innerHTML = html;
}

function starsHtml(rating) {
  var html = '';
  for (var i = 1; i <= 5; i++) {
    if (rating >= i) {
      html += '<i class="fa-solid fa-star"></i>';
    } else if (rating >= i - 0.5) {
      html += '<i class="fa-solid fa-star-half-stroke"></i>';
    } else {
      html += '<i class="fa-regular fa-star"></i>';
    }
  }
  return html;
}

/* ============================================================
   PRODUCT DETAIL PAGE
   ============================================================ */
function initProductPage() {
  var urlParams = new URLSearchParams(window.location.search);
  var id = parseInt(urlParams.get('id'));

  if (!id || !window.PRODUCTS) {
    document.querySelector('main') && (document.querySelector('main').innerHTML =
      '<div class="container" style="padding:8rem 0;text-align:center">' +
      '<h2>Produkt nicht gefunden</h2>' +
      '<a href="shop.html" class="btn btn-primary" style="margin-top:2rem">Zurück zum Shop</a>' +
      '</div>');
    return;
  }

  var product = window.PRODUCTS.find(function (p) { return p.id === id; });
  if (!product) {
    document.querySelector('main') && (document.querySelector('main').innerHTML =
      '<div class="container" style="padding:8rem 0;text-align:center">' +
      '<h2>Produkt nicht gefunden</h2>' +
      '<a href="shop.html" class="btn btn-primary" style="margin-top:2rem">Zurück zum Shop</a>' +
      '</div>');
    return;
  }

  // Set page title
  document.title = product.fullName + ' – PeptideLab';

  // Breadcrumb
  var breadcrumb = document.getElementById('product-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML =
      '<a href="index.html">Startseite</a>' +
      '<span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>' +
      '<a href="shop.html">Shop</a>' +
      '<span class="breadcrumb-sep"><i class="fa-solid fa-chevron-right"></i></span>' +
      '<span class="breadcrumb-current">' + product.name + '</span>';
  }

  // Main visual
  var mainVisual = document.getElementById('product-main-visual');
  if (mainVisual) {
    mainVisual.style.background = product.gradient;
    mainVisual.innerHTML = '<span style="position:relative;z-index:1;font-size:8rem">' + product.emoji + '</span>' +
      '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at center, transparent 40%, rgba(5,8,16,0.4) 100%)"></div>';
  }

  // Thumbnails
  var thumbsContainer = document.getElementById('product-thumbnails');
  if (thumbsContainer) {
    var thumbGradients = [product.gradient,
      'linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg-3) 100%)',
      'linear-gradient(135deg, #0e1530 0%, #1a2a50 100%)'];
    var thumbHtml = '';
    for (var i = 0; i < 3; i++) {
      thumbHtml += '<div class="product-thumb ' + (i === 0 ? 'active' : '') + '" style="background:' + thumbGradients[i] + '">' +
        '<span style="font-size:1.5rem;opacity:' + (i === 0 ? '1' : '0.5') + '">' + product.emoji + '</span></div>';
    }
    thumbsContainer.innerHTML = thumbHtml;
    thumbsContainer.querySelectorAll('.product-thumb').forEach(function (thumb, idx) {
      thumb.addEventListener('click', function () {
        thumbsContainer.querySelectorAll('.product-thumb').forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        if (mainVisual) {
          mainVisual.style.background = thumbGradients[idx];
        }
      });
    });
  }

  // Category label
  var catLabel = document.getElementById('product-category-label');
  if (catLabel) catLabel.textContent = product.categoryLabel;

  // Name & subtitle
  var nameEl = document.getElementById('product-name');
  if (nameEl) nameEl.textContent = product.fullName;

  var subtitleEl = document.getElementById('product-subtitle');
  if (subtitleEl) subtitleEl.textContent = product.molecular;

  // Rating
  var ratingEl = document.getElementById('product-rating');
  if (ratingEl) {
    ratingEl.innerHTML =
      '<span class="stars" aria-label="Bewertung: ' + product.rating + ' von 5">' + starsHtml(product.rating) + '</span>' +
      '<span class="rating-value">' + product.rating + '</span>' +
      '<span class="rating-count">(' + product.reviews + ' Bewertungen)</span>' +
      '<span class="stock-badge in-stock"><span class="stock-dot"></span> Auf Lager</span>';
  }

  // Price
  var priceEl = document.getElementById('product-price');
  if (priceEl) priceEl.textContent = '€' + product.price.toFixed(2);

  var origPriceEl = document.getElementById('product-original-price');
  if (origPriceEl) {
    if (product.originalPrice) {
      origPriceEl.textContent = '€' + product.originalPrice.toFixed(2);
      origPriceEl.style.display = '';
    } else {
      origPriceEl.style.display = 'none';
    }
  }

  // Specs
  var specsEl = document.getElementById('product-specs');
  if (specsEl) {
    specsEl.innerHTML =
      '<div class="product-spec"><div class="product-spec-label">Reinheit</div><div class="product-spec-value">' + product.purity + '</div></div>' +
      '<div class="product-spec"><div class="product-spec-label">Format</div><div class="product-spec-value">' + product.format + '</div></div>' +
      '<div class="product-spec"><div class="product-spec-label">Mol. Gewicht</div><div class="product-spec-value">' + product.weight + '</div></div>' +
      '<div class="product-spec"><div class="product-spec-label">Lagerung</div><div class="product-spec-value">' + product.storage + '</div></div>';
  }

  // Add to cart
  var qty = 1;
  var qtyDisplay = document.getElementById('qty-display');
  if (qtyDisplay) qtyDisplay.textContent = qty;

  var qtyMinus = document.getElementById('qty-minus');
  var qtyPlus  = document.getElementById('qty-plus');
  if (qtyMinus) {
    qtyMinus.addEventListener('click', function () {
      if (qty > 1) { qty--; if (qtyDisplay) qtyDisplay.textContent = qty; }
    });
  }
  if (qtyPlus) {
    qtyPlus.addEventListener('click', function () {
      qty++; if (qtyDisplay) qtyDisplay.textContent = qty;
    });
  }

  var addBtn = document.getElementById('add-to-cart-detail');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      Cart.add(product.id, qty);
    });
  }

  // Wishlist
  var wishBtn = document.getElementById('wishlist-btn');
  if (wishBtn) {
    wishBtn.addEventListener('click', function () {
      wishBtn.classList.toggle('active');
      var isActive = wishBtn.classList.contains('active');
      window.showToast(isActive ? product.name + ' zur Wunschliste hinzugefügt' : product.name + ' von Wunschliste entfernt', isActive ? 'success' : 'info');
    });
  }

  // Tabs
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabPanels.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  // Tab content
  var descPanel = document.getElementById('tab-description');
  if (descPanel) descPanel.innerHTML = product.longDescription;

  var resPanel = document.getElementById('tab-research');
  if (resPanel) resPanel.innerHTML = product.researchInfo;

  var dosPanel = document.getElementById('tab-dosage');
  if (dosPanel) dosPanel.innerHTML = product.dosageInfo;

  // Related products
  var relatedGrid = document.getElementById('related-products-grid');
  if (relatedGrid) {
    var related = window.PRODUCTS.filter(function (p) {
      return p.id !== product.id && (p.category === product.category);
    }).slice(0, 3);
    if (related.length < 3) {
      var extra = window.PRODUCTS.filter(function (p) {
        return p.id !== product.id && !related.find(function (r) { return r.id === p.id; });
      }).slice(0, 3 - related.length);
      related = related.concat(extra);
    }
    renderProducts(related, relatedGrid);
  }
}

/* ============================================================
   CART PAGE
   ============================================================ */
function initCartPage() {
  initCartPageRender();
}

function initCartPageRender() {
  var listEl  = document.getElementById('cart-items-list');
  var summaryEl = document.getElementById('cart-summary-section');

  if (!listEl || !window.Cart) return;

  var items = Cart.state.items;

  if (items.length === 0) {
    listEl.innerHTML =
      '<div class="cart-empty-page">' +
        '<div class="cart-empty-page-icon"><i class="fa-solid fa-cart-shopping"></i></div>' +
        '<h2>Ihr Warenkorb ist leer</h2>' +
        '<p>Entdecken Sie unsere forschungsgeprüften Peptide.</p>' +
        '<a href="shop.html" class="btn btn-primary">Zum Shop</a>' +
      '</div>';
    if (summaryEl) summaryEl.style.opacity = '0.4';
    return;
  }

  if (summaryEl) summaryEl.style.opacity = '1';

  var html = '';
  items.forEach(function (item) {
    var p = window.PRODUCTS && window.PRODUCTS.find(function (pr) { return pr.id === item.productId; });
    if (!p) return;
    var lineTotal = p.price * item.qty;
    html +=
      '<div class="cart-page-item">' +
        '<div class="cart-page-item-visual" style="background:' + p.gradient + '">' + p.emoji + '</div>' +
        '<div class="cart-page-item-info">' +
          '<div class="cart-page-item-cat">' + p.categoryLabel + '</div>' +
          '<div class="cart-page-item-name"><a href="product.html?id=' + p.id + '" style="color:inherit">' + p.name + '</a></div>' +
          '<div class="cart-page-item-format">' + p.format + ' | Reinheit: ' + p.purity + '</div>' +
          '<div class="cart-page-item-controls">' +
            '<div class="qty-controls">' +
              '<button class="qty-btn" aria-label="Weniger" onclick="Cart.updateQty(' + p.id + ',' + (item.qty - 1) + ')"><i class="fa-solid fa-minus"></i></button>' +
              '<span class="qty-value">' + item.qty + '</span>' +
              '<button class="qty-btn" aria-label="Mehr" onclick="Cart.updateQty(' + p.id + ',' + (item.qty + 1) + ')"><i class="fa-solid fa-plus"></i></button>' +
            '</div>' +
            '<button class="remove-item-btn" onclick="Cart.remove(' + p.id + ')"><i class="fa-solid fa-trash-can"></i> Entfernen</button>' +
          '</div>' +
        '</div>' +
        '<div class="cart-page-item-price">€' + lineTotal.toFixed(2) + '</div>' +
      '</div>';
  });
  listEl.innerHTML = html;

  // Update summary
  var subtotal = Cart.getSubtotal();
  var shipping = subtotal >= 100 ? 0 : 4.99;
  var total = subtotal + shipping;

  var subtotalEl = document.getElementById('page-subtotal');
  var shippingEl = document.getElementById('page-shipping');
  var totalEl    = document.getElementById('page-total');

  if (subtotalEl) subtotalEl.textContent = '€' + subtotal.toFixed(2);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Kostenlos' : '€' + shipping.toFixed(2);
  if (totalEl)    totalEl.textContent    = '€' + total.toFixed(2);
}

window.CartPage = { render: initCartPageRender };

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  var form = document.getElementById('contact-form');
  var successEl = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple validation
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--color-error)';
      } else {
        field.style.borderColor = '';
      }
    });

    var emailField = form.querySelector('input[type="email"]');
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      valid = false;
      emailField.style.borderColor = 'var(--color-error)';
    }

    if (!valid) {
      window.showToast('Bitte füllen Sie alle Pflichtfelder korrekt aus.', 'error');
      return;
    }

    // Success
    form.style.display = 'none';
    if (successEl) successEl.style.display = 'block';
    window.showToast('Ihre Nachricht wurde erfolgreich gesendet!', 'success');
  });

  // Reset field error on input
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      field.style.borderColor = '';
    });
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}
