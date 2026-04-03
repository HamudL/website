/* ============================================================
   PeptideLab – Admin Panel Logic
   Password: PeptideLab2024
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ── */
  var ADMIN_PASSWORD = 'PeptideLab2024';
  var SESSION_KEY    = 'peptidelab_admin_auth';
  var STORAGE_KEY    = 'peptidelab_products';

  var CATEGORY_LABELS = {
    healing:    'Heilung & Regeneration',
    growth:     'Wachstum & Sport',
    'weight-loss': 'Gewichtsabnahme',
    'anti-aging': 'Anti-Aging',
    cognitive:  'Kognitiv',
    hormones:   'Hormone & Forschung',
  };

  var CATEGORY_COLORS = {
    healing:    '#00d4ff',
    growth:     '#10b981',
    'weight-loss': '#ef4444',
    'anti-aging': '#8b5cf6',
    cognitive:  '#6366f1',
    hormones:   '#f59e0b',
  };

  /* ── State ── */
  var currentProducts = [];
  var deleteTargetId  = null;
  var currentSection  = 'dashboard';

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') {
      showApp();
    } else {
      showLogin();
    }
    initLoginForm();
  });

  /* ══════════════════════════════════════════
     AUTH
  ══════════════════════════════════════════ */
  function initLoginForm() {
    var form   = document.getElementById('login-form');
    var pwInput = document.getElementById('login-password');
    var errBox  = document.getElementById('login-error');
    var togglePw = document.getElementById('toggle-pw');

    if (togglePw) {
      togglePw.addEventListener('click', function () {
        var type = pwInput.getAttribute('type') === 'password' ? 'text' : 'password';
        pwInput.setAttribute('type', type);
        togglePw.querySelector('i').className = type === 'text' ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var pw = pwInput.value.trim();
        if (pw === ADMIN_PASSWORD) {
          sessionStorage.setItem(SESSION_KEY, 'true');
          errBox.style.display = 'none';
          showApp();
        } else {
          errBox.style.display = 'block';
          pwInput.value = '';
          pwInput.focus();
        }
      });
    }
  }

  function showLogin() {
    document.getElementById('admin-login').style.display = 'flex';
    document.getElementById('admin-app').style.display   = 'none';
    document.body.style.overflow = '';
  }

  function showApp() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-app').style.display   = 'flex';
    document.body.style.overflow = 'hidden';
    initApp();
  }

  /* ══════════════════════════════════════════
     APP INIT
  ══════════════════════════════════════════ */
  function initApp() {
    currentProducts = loadProducts();
    initSidebar();
    initTopbar();
    initNavItems();
    initModals();
    initProductSearch();
    initSystemButtons();
    initAddProductForm();

    navigateTo('dashboard');
  }

  /* ── Sidebar collapse ── */
  function initSidebar() {
    var sidebar        = document.getElementById('admin-sidebar');
    var sidebarToggle  = document.getElementById('sidebar-toggle');
    var topbarToggle   = document.getElementById('topbar-sidebar-toggle');

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
      });
    }

    if (topbarToggle) {
      topbarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('mobile-open');
      });
    }
  }

  function initTopbar() {
    // update title when section changes — done in navigateTo
  }

  /* ── Navigation ── */
  function initNavItems() {
    document.querySelectorAll('.admin-nav-item[data-section]').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        navigateTo(item.getAttribute('data-section'));
        // close mobile sidebar
        var sidebar = document.getElementById('admin-sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');
      });
    });

    // section buttons (e.g. "Alle anzeigen" in dashboard)
    document.querySelectorAll('[data-section]').forEach(function (el) {
      if (el.tagName === 'BUTTON') {
        el.addEventListener('click', function () {
          navigateTo(el.getAttribute('data-section'));
        });
      }
    });

    // Logout
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        sessionStorage.removeItem(SESSION_KEY);
        showLogin();
      });
    }
  }

  function navigateTo(section) {
    currentSection = section;

    // update nav active state
    document.querySelectorAll('.admin-nav-item').forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-section') === section);
    });

    // hide all sections, show target
    document.querySelectorAll('.admin-section').forEach(function (s) { s.classList.remove('active'); });
    var target = document.getElementById('section-' + section.replace('-', '-'));
    if (target) target.classList.add('active');

    // Update topbar title
    var titles = { dashboard: 'Dashboard', products: 'Alle Produkte', 'add-product': 'Produkt hinzufügen' };
    var titleEl = document.getElementById('admin-page-title');
    if (titleEl) titleEl.textContent = titles[section] || section;

    // Render
    if (section === 'dashboard') renderDashboard();
    if (section === 'products') renderProductsTable(currentProducts);
    if (section === 'add-product') renderAddProductForm();
  }

  /* ══════════════════════════════════════════
     DATA MANAGEMENT
  ══════════════════════════════════════════ */
  function loadProducts() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        var p = JSON.parse(stored);
        if (Array.isArray(p) && p.length > 0) return p;
      } catch (e) {}
    }
    return JSON.parse(JSON.stringify(window.DEFAULT_PRODUCTS));
  }

  function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentProducts));
    // also update live window.PRODUCTS
    window.PRODUCTS = currentProducts;
    showAdminToast('Änderungen gespeichert!', 'success');
  }

  function generateId() {
    return currentProducts.length > 0 ? Math.max.apply(null, currentProducts.map(function (p) { return p.id; })) + 1 : 1;
  }

  /* ── System buttons ── */
  function initSystemButtons() {
    // Export
    var exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var data = JSON.stringify(currentProducts, null, 2);
        var blob = new Blob([data], { type: 'application/json' });
        var url  = URL.createObjectURL(blob);
        var a    = document.createElement('a');
        a.href = url;
        a.download = 'peptidelab_products_' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        showAdminToast('Daten exportiert!', 'success');
      });
    }

    // Reset to defaults
    var resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Alle Änderungen zurücksetzen und Standardprodukte laden?\nDiese Aktion kann nicht rückgängig gemacht werden.')) {
          localStorage.removeItem(STORAGE_KEY);
          currentProducts = JSON.parse(JSON.stringify(window.DEFAULT_PRODUCTS));
          showAdminToast('Auf Standardprodukte zurückgesetzt.', 'info');
          navigateTo(currentSection);
        }
      });
    }
  }

  /* ══════════════════════════════════════════
     DASHBOARD
  ══════════════════════════════════════════ */
  function renderDashboard() {
    var total   = currentProducts.length;
    var inStock = currentProducts.filter(function (p) { return p.inStock; }).length;
    var outStock = total - inStock;

    // Count categories
    var cats = {};
    currentProducts.forEach(function (p) {
      cats[p.category] = (cats[p.category] || 0) + 1;
    });
    var catCount = Object.keys(cats).length;

    // Stats
    var statsEl = document.getElementById('dashboard-stats');
    if (statsEl) {
      statsEl.innerHTML = [
        statCard('fa-box-open', '#00d4ff', 'rgba(0,212,255,0.1)', total, 'Gesamtprodukte'),
        statCard('fa-circle-check', '#10b981', 'rgba(16,185,129,0.1)', inStock, 'Auf Lager'),
        statCard('fa-circle-xmark', '#ef4444', 'rgba(239,68,68,0.1)', outStock, 'Nicht vorrätig'),
        statCard('fa-tag', '#8b5cf6', 'rgba(139,92,246,0.1)', catCount, 'Kategorien'),
      ].join('');
    }

    // Recent products table
    var tbody = document.querySelector('#recent-products-table tbody');
    if (tbody) {
      var recent = currentProducts.slice(-6).reverse();
      tbody.innerHTML = recent.map(function (p) {
        return '<tr>' +
          '<td style="font-weight:700;color:var(--text-primary)">' + p.id + '</td>' +
          '<td><div style="display:flex;align-items:center;gap:8px"><div class="admin-product-emoji" style="background:' + p.gradient + '">' + p.emoji + '</div><span class="admin-product-name">' + escHtml(p.name) + '</span></div></td>' +
          '<td><span class="cat-badge">' + escHtml(CATEGORY_LABELS[p.category] || p.category) + '</span></td>' +
          '<td style="font-weight:700;color:var(--text-primary)">€' + p.price.toFixed(2) + '</td>' +
          '<td>' + stockBadge(p.inStock) + '</td>' +
          '</tr>';
      }).join('');
    }

    // Category chart
    var chartEl = document.getElementById('category-chart');
    if (chartEl) {
      var sorted = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; });
      chartEl.innerHTML = sorted.map(function (cat) {
        var pct = Math.round((cats[cat] / total) * 100);
        var color = CATEGORY_COLORS[cat] || 'var(--accent)';
        return '<div class="cat-chart-row">' +
          '<div class="cat-chart-label"><span>' + escHtml(CATEGORY_LABELS[cat] || cat) + '</span><span>' + cats[cat] + ' (' + pct + '%)</span></div>' +
          '<div class="cat-chart-bar-wrap"><div class="cat-chart-bar" style="width:' + pct + '%;background:' + color + '"></div></div>' +
          '</div>';
      }).join('');
    }
  }

  function statCard(icon, color, bg, value, label) {
    return '<div class="admin-stat-card">' +
      '<div class="admin-stat-icon" style="background:' + bg + ';color:' + color + '"><i class="fa-solid ' + icon + '"></i></div>' +
      '<div><div class="admin-stat-value">' + value + '</div><div class="admin-stat-label">' + escHtml(label) + '</div></div>' +
      '</div>';
  }

  /* ══════════════════════════════════════════
     PRODUCTS TABLE
  ══════════════════════════════════════════ */
  function initProductSearch() {
    var searchInput = document.getElementById('product-search');
    var catFilter   = document.getElementById('product-cat-filter');
    var stockFilter = document.getElementById('product-stock-filter');

    [searchInput, catFilter, stockFilter].forEach(function (el) {
      if (el) el.addEventListener('input', applyFilters);
    });
  }

  function applyFilters() {
    var query  = (document.getElementById('product-search').value || '').toLowerCase();
    var cat    = document.getElementById('product-cat-filter').value;
    var stock  = document.getElementById('product-stock-filter').value;

    var filtered = currentProducts.filter(function (p) {
      var matchName  = !query || p.name.toLowerCase().includes(query) || (p.fullName || '').toLowerCase().includes(query);
      var matchCat   = !cat || p.category === cat;
      var matchStock = !stock || (stock === 'in' ? p.inStock : !p.inStock);
      return matchName && matchCat && matchStock;
    });

    renderProductsTable(filtered);
  }

  function renderProductsTable(products) {
    var tbody = document.getElementById('products-tbody');
    var countLabel = document.getElementById('product-count-label');
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fa-solid fa-box-open" style="font-size:32px;display:block;margin-bottom:12px;opacity:0.3"></i>Keine Produkte gefunden.</td></tr>';
      if (countLabel) countLabel.textContent = '0 Produkte';
      return;
    }

    tbody.innerHTML = products.map(function (p) {
      return '<tr>' +
        '<td style="font-weight:700;color:var(--accent)">' + p.id + '</td>' +
        '<td><div class="admin-product-emoji" style="background:' + escHtml(p.gradient) + '">' + p.emoji + '</div></td>' +
        '<td><div class="admin-product-name">' + escHtml(p.name) + '</div><div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + escHtml(p.fullName || '') + '</div></td>' +
        '<td><span class="cat-badge">' + escHtml(CATEGORY_LABELS[p.category] || p.category) + '</span></td>' +
        '<td style="color:var(--text-secondary)">' + escHtml(p.format || '–') + '</td>' +
        '<td style="font-weight:700;color:var(--text-primary)">€' + p.price.toFixed(2) + '</td>' +
        '<td style="color:var(--text-muted)">' + (p.originalPrice ? '€' + p.originalPrice.toFixed(2) : '–') + '</td>' +
        '<td><span style="color:#10b981;font-weight:600">' + escHtml(p.purity || '–') + '</span></td>' +
        '<td>' + badgeHtml(p.badge, p.badgeType) + '</td>' +
        '<td>' + stockBadge(p.inStock) + '</td>' +
        '<td class="admin-rating">★ ' + (p.rating || '4.5') + '</td>' +
        '<td><div class="admin-actions">' +
          '<button class="abtn abtn-sm abtn-icon" onclick="AdminActions.edit(' + p.id + ')" title="Bearbeiten"><i class="fa-solid fa-pencil"></i></button>' +
          '<button class="abtn abtn-sm abtn-icon" onclick="AdminActions.toggleStock(' + p.id + ')" title="Bestand umschalten" style="color:' + (p.inStock ? '#ef4444' : '#10b981') + '"><i class="fa-solid ' + (p.inStock ? 'fa-ban' : 'fa-check') + '"></i></button>' +
          '<button class="abtn abtn-sm abtn-icon abtn-danger" onclick="AdminActions.confirmDelete(' + p.id + ')" title="Löschen"><i class="fa-solid fa-trash"></i></button>' +
        '</div></td>' +
        '</tr>';
    }).join('');

    if (countLabel) countLabel.textContent = products.length + ' Produkt' + (products.length === 1 ? '' : 'e');
  }

  /* ══════════════════════════════════════════
     ADD PRODUCT FORM
  ══════════════════════════════════════════ */
  function renderAddProductForm() {
    var form = document.getElementById('add-product-form');
    if (!form) return;
    form.innerHTML = buildProductFormHtml(null);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = collectFormData(form);
      if (!data.name) { showAdminToast('Bitte Produktname eingeben.', 'error'); return; }
      data.id = generateId();
      currentProducts.push(data);
      saveProducts();
      showAdminToast('Produkt "' + data.name + '" wurde hinzugefügt!', 'success');
      form.reset();
      navigateTo('products');
    });
  }

  /* ══════════════════════════════════════════
     EDIT MODAL
  ══════════════════════════════════════════ */
  function openEditModal(productId) {
    var product = currentProducts.find(function (p) { return p.id === productId; });
    if (!product) return;

    var overlay = document.getElementById('edit-modal-overlay');
    var form    = document.getElementById('edit-product-form');
    var title   = document.getElementById('edit-modal-title');

    if (title) title.textContent = 'Bearbeiten: ' + product.name;
    if (form)  form.innerHTML = buildProductFormHtml(product);

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function initModals() {
    // Edit modal close
    ['close-edit-modal', 'cancel-edit-modal'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', closeEditModal);
    });

    // Edit modal save
    var saveBtn = document.getElementById('save-edit-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        var form = document.getElementById('edit-product-form');
        var data = collectFormData(form);
        var idx  = currentProducts.findIndex(function (p) { return p.id === data.id; });
        if (idx === -1) { showAdminToast('Produkt nicht gefunden.', 'error'); return; }
        currentProducts[idx] = data;
        saveProducts();
        closeEditModal();
        renderProductsTable(currentProducts);
        showAdminToast('Produkt aktualisiert!', 'success');
      });
    }

    // Delete modal close
    ['close-delete-modal', 'cancel-delete-modal'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', closeDeleteModal);
    });

    // Delete confirm
    var confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', function () {
        if (deleteTargetId === null) return;
        var idx = currentProducts.findIndex(function (p) { return p.id === deleteTargetId; });
        var name = idx !== -1 ? currentProducts[idx].name : '';
        if (idx !== -1) {
          currentProducts.splice(idx, 1);
          saveProducts();
          renderProductsTable(currentProducts);
          showAdminToast('"' + name + '" wurde gelöscht.', 'info');
        }
        closeDeleteModal();
      });
    }

    // Click outside to close
    ['edit-modal-overlay', 'delete-modal-overlay'].forEach(function (id) {
      var overlay = document.getElementById(id);
      if (overlay) {
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) {
            if (id === 'edit-modal-overlay') closeEditModal();
            else closeDeleteModal();
          }
        });
      }
    });
  }

  function closeEditModal() {
    document.getElementById('edit-modal-overlay').style.display = 'none';
    document.body.style.overflow = 'hidden';
  }

  function openDeleteModal(productId) {
    var product = currentProducts.find(function (p) { return p.id === productId; });
    if (!product) return;
    deleteTargetId = productId;
    var nameEl = document.getElementById('delete-product-name');
    if (nameEl) nameEl.textContent = product.name;
    document.getElementById('delete-modal-overlay').style.display = 'flex';
  }

  function closeDeleteModal() {
    document.getElementById('delete-modal-overlay').style.display = 'none';
    deleteTargetId = null;
  }

  /* ══════════════════════════════════════════
     FORM HELPERS
  ══════════════════════════════════════════ */
  function buildProductFormHtml(product) {
    var p = product || {};
    var isEdit = !!product;

    var cats = Object.keys(CATEGORY_LABELS).map(function (k) {
      return '<option value="' + k + '"' + (p.category === k ? ' selected' : '') + '>' + escHtml(CATEGORY_LABELS[k]) + '</option>';
    }).join('');

    var badges = [
      { val: '', label: 'Kein Badge' },
      { val: 'Bestseller|bestseller', label: 'Bestseller' },
      { val: 'Neu|new', label: 'Neu' },
      { val: 'Sale|sale', label: 'Sale' },
      { val: 'Forschung|research', label: 'Forschung' },
    ].map(function (b) {
      var cur = (p.badge || '') + '|' + (p.badgeType || '');
      var selected = b.val === '' ? (!p.badge ? ' selected' : '') : (cur === b.val ? ' selected' : '');
      return '<option value="' + b.val + '"' + selected + '>' + b.label + '</option>';
    }).join('');

    return (isEdit ? '<input type="hidden" name="id" value="' + p.id + '" />' : '') +
      '<div class="aform-grid">' +

      '<div style="grid-column:1/-1" class="aform-section-title">Grundinformationen</div>' +

      aformGroup('Kurzname (z.B. BPC-157)', 'name', p.name, 'text', 'BPC-157', true) +
      aformGroup('Vollständiger Name', 'fullName', p.fullName, 'text', 'BPC-157 (Body Protection Compound)') +

      '<div class="aform-group">' +
        '<label class="aform-label">Kategorie *</label>' +
        '<select name="category" class="aform-select" required>' + cats + '</select>' +
      '</div>' +

      '<div class="aform-group">' +
        '<label class="aform-label">Badge</label>' +
        '<select name="badge_combo" class="aform-select">' + badges + '</select>' +
      '</div>' +

      '<div style="grid-column:1/-1" class="aform-section-title" style="margin-top:8px">Preise & Details</div>' +

      aformGroup('Preis (€) *', 'price', p.price, 'number', '49.99', true, '0.01') +
      aformGroup('Originalpreis (€, leer = kein Sale)', 'originalPrice', p.originalPrice, 'number', '69.99', false, '0.01') +
      aformGroup('Format / Menge', 'format', p.format, 'text', '5mg/Vial × 10 Vials') +
      aformGroup('Reinheit', 'purity', p.purity, 'text', '99.5%') +
      aformGroup('Molekularformel', 'molecular', p.molecular, 'text', 'C62H98N16O22') +
      aformGroup('Molekulargewicht', 'weight', p.weight, 'text', '1419.5 g/mol') +
      aformGroup('Lagertemperatur', 'storage', p.storage, 'text', '-20°C') +
      aformGroup('Bewertung (1-5)', 'rating', p.rating, 'number', '4.8', false, '0.1') +
      aformGroup('Anzahl Bewertungen', 'reviews', p.reviews, 'number', '100') +

      '<div style="grid-column:1/-1" class="aform-section-title">Visuals</div>' +

      aformGroup('Emoji', 'emoji', p.emoji, 'text', '🧬') +
      aformGroup('Gradient CSS', 'gradient', p.gradient, 'text', 'linear-gradient(135deg, #0a1628 0%, #0a3060 100%)') +
      aformGroup('Glühfarbe (rgba)', 'glowColor', p.glowColor, 'text', 'rgba(0, 100, 255, 0.2)') +

      '<div class="aform-group">' +
        '<label class="aform-label">Auf Lager</label>' +
        '<div class="aform-group-inline">' +
          '<input type="checkbox" name="inStock" class="aform-checkbox" id="instock-check" ' + (p.inStock !== false ? 'checked' : '') + '>' +
          '<label class="aform-checkbox-label" for="instock-check">Produkt ist auf Lager</label>' +
        '</div>' +
      '</div>' +

      '<div style="grid-column:1/-1" class="aform-section-title">Beschreibungen</div>' +

      '<div class="aform-group aform-full">' +
        '<label class="aform-label">Kurzbeschreibung</label>' +
        '<textarea name="description" class="aform-textarea" placeholder="Kurze Beschreibung des Produkts...">' + escHtml(p.description || '') + '</textarea>' +
      '</div>' +

      '<div class="aform-group aform-full">' +
        '<label class="aform-label">Lange Beschreibung (HTML erlaubt)</label>' +
        '<textarea name="longDescription" class="aform-textarea" style="min-height:150px" placeholder="<p>Ausführliche HTML-Beschreibung...</p>">' + escHtml(p.longDescription || '') + '</textarea>' +
      '</div>' +

      '<div class="aform-group aform-full">' +
        '<label class="aform-label">Forschungsinformationen (HTML erlaubt)</label>' +
        '<textarea name="researchInfo" class="aform-textarea" placeholder="<h4>Forschungsübersicht</h4><ul><li>...</li></ul>">' + escHtml(p.researchInfo || '') + '</textarea>' +
      '</div>' +

      '<div class="aform-group aform-full">' +
        '<label class="aform-label">Dosierungsprotokoll (HTML erlaubt)</label>' +
        '<textarea name="dosageInfo" class="aform-textarea" placeholder="<p>Forschungsprotokoll...</p>">' + escHtml(p.dosageInfo || '') + '</textarea>' +
      '</div>' +

      (isEdit ? '' :
        '<div class="aform-submit-row">' +
          '<button type="button" class="abtn" data-section="products">Abbrechen</button>' +
          '<button type="submit" class="abtn abtn-primary"><i class="fa-solid fa-plus"></i> Produkt hinzufügen</button>' +
        '</div>') +

      '</div>';
  }

  function aformGroup(label, name, value, type, placeholder, required, step) {
    var val = value !== null && value !== undefined ? String(value) : '';
    return '<div class="aform-group">' +
      '<label class="aform-label">' + escHtml(label) + (required ? ' *' : '') + '</label>' +
      '<div class="aform-input-wrap">' +
        '<input type="' + type + '" name="' + name + '" class="aform-input" value="' + escAttr(val) + '"' +
          (placeholder ? ' placeholder="' + escAttr(placeholder) + '"' : '') +
          (required ? ' required' : '') +
          (step ? ' step="' + step + '"' : '') +
          ' style="padding-left:14px"' +
        ' />' +
      '</div>' +
      '</div>';
  }

  function collectFormData(form) {
    var fd = new FormData(form);
    var data = {};

    // ID
    var idVal = fd.get('id');
    if (idVal) data.id = parseInt(idVal, 10);

    data.name           = (fd.get('name') || '').trim();
    data.fullName       = (fd.get('fullName') || '').trim();
    data.category       = fd.get('category') || 'healing';
    data.categoryLabel  = CATEGORY_LABELS[data.category] || data.category;
    data.price          = parseFloat(fd.get('price')) || 0;
    var origP           = fd.get('originalPrice');
    data.originalPrice  = origP ? parseFloat(origP) : null;
    data.format         = (fd.get('format') || '').trim();
    data.purity         = (fd.get('purity') || '').trim();
    data.molecular      = (fd.get('molecular') || '').trim();
    data.weight         = (fd.get('weight') || '').trim();
    data.storage        = (fd.get('storage') || '').trim();
    data.rating         = parseFloat(fd.get('rating')) || 4.5;
    data.reviews        = parseInt(fd.get('reviews'), 10) || 0;
    data.emoji          = (fd.get('emoji') || '🧪').trim();
    data.gradient       = (fd.get('gradient') || 'linear-gradient(135deg, #0a1628, #0a3060)').trim();
    data.glowColor      = (fd.get('glowColor') || 'rgba(0,212,255,0.2)').trim();
    data.inStock        = form.querySelector('[name="inStock"]') ? form.querySelector('[name="inStock"]').checked : true;
    data.description    = (fd.get('description') || '').trim();
    data.longDescription = (fd.get('longDescription') || '').trim();
    data.researchInfo   = (fd.get('researchInfo') || '').trim();
    data.dosageInfo     = (fd.get('dosageInfo') || '').trim();

    // Badge
    var badgeCombo = fd.get('badge_combo') || '';
    if (badgeCombo) {
      var parts = badgeCombo.split('|');
      data.badge     = parts[0] || null;
      data.badgeType = parts[1] || null;
    } else {
      data.badge     = null;
      data.badgeType = null;
    }

    return data;
  }

  /* ══════════════════════════════════════════
     PUBLIC ACTION HANDLERS (called from inline onclick)
  ══════════════════════════════════════════ */
  window.AdminActions = {
    edit: function (id) {
      openEditModal(id);
    },
    confirmDelete: function (id) {
      openDeleteModal(id);
    },
    toggleStock: function (id) {
      var product = currentProducts.find(function (p) { return p.id === id; });
      if (!product) return;
      product.inStock = !product.inStock;
      saveProducts();
      renderProductsTable(currentProducts);
      showAdminToast(
        '"' + product.name + '" ist jetzt ' + (product.inStock ? 'auf Lager' : 'nicht vorrätig') + '.',
        product.inStock ? 'success' : 'info'
      );
    },
  };

  /* ══════════════════════════════════════════
     TOAST
  ══════════════════════════════════════════ */
  function showAdminToast(message, type) {
    type = type || 'info';
    var icons = { success: '✓', error: '✕', info: 'ℹ' };
    var container = document.getElementById('admin-toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'admin-toast admin-toast-' + type;
    toast.innerHTML = '<span style="font-size:16px">' + icons[type] + '</span><span>' + escHtml(message) + '</span>';
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('removing');
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 3000);
  }

  /* ══════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════ */
  function escHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/"/g, '&quot;');
  }

  function stockBadge(inStock) {
    return inStock
      ? '<span class="stock-badge stock-in">✓ Auf Lager</span>'
      : '<span class="stock-badge stock-out">✕ Nicht vorrätig</span>';
  }

  function badgeHtml(badge, type) {
    if (!badge) return '<span class="prod-badge none">–</span>';
    return '<span class="prod-badge ' + (type || '') + '">' + escHtml(badge) + '</span>';
  }

})();
