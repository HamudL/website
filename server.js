/**
 * PeptideLab Backend Server
 * Run: node server.js
 * Requires: npm install
 *
 * API endpoints:
 *   POST /api/admin/login       – Admin login (returns session token)
 *   POST /api/admin/logout      – Invalidate session token
 *
 *   GET  /api/products          – Get all products (public)
 *   POST /api/products          – Save products (admin)
 *
 *   POST /api/orders            – Place a new order (public)
 *   GET  /api/orders            – List all orders (admin)
 *   GET  /api/orders/:id        – Get single order (admin)
 *   PATCH /api/orders/:id/status – Update order status (admin)
 *   DELETE /api/orders/:id      – Delete order (admin)
 *
 *   GET  /api/promos            – List all promo codes (admin)
 *   POST /api/promos            – Create promo code (admin)
 *   PATCH /api/promos/:code     – Update promo code (admin)
 *   DELETE /api/promos/:code    – Delete promo code (admin)
 *   POST /api/promo/validate    – Validate a promo code (public)
 *
 *   POST /api/upload/product    – Upload product image (admin, multipart)
 *   DELETE /api/upload/:filename – Delete uploaded image (admin)
 *
 *   POST /api/contact           – Save contact form message (public)
 */

'use strict';

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Paths ── */
const DATA_DIR      = path.join(__dirname, 'data');
const ORDERS_FILE   = path.join(DATA_DIR, 'orders.json');
const PROMOS_FILE   = path.join(DATA_DIR, 'promos.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const UPLOADS_DIR   = path.join(__dirname, 'uploads');

[DATA_DIR, UPLOADS_DIR].forEach(function (d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

/* ── Middleware ── */
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Block direct access to data/ directory ── */
app.use('/data', function (req, res) {
  res.status(403).json({ error: 'Forbidden' });
});

// Serve static frontend files (after /data block)
app.use(express.static(__dirname));
// Serve uploaded images
app.use('/uploads', express.static(UPLOADS_DIR));

/* ── File DB helpers ── */
function readJSON(file) {
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) { return []; }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

/* ── Admin session store ── */
const ADMIN_PASSWORD = process.env.ADMIN_TOKEN || 'PeptideLab2024';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;  // 8 hours
const adminSessions  = new Map(); // token -> expiry timestamp

// Brute-force tracker: ip -> { count, resetAt }
const loginAttempts = new Map();
const MAX_ATTEMPTS  = 10;
const LOCKOUT_MS    = 15 * 60 * 1000; // 15 minutes

/* ── Admin auth middleware ── */
function requireAdmin(req, res, next) {
  var token = req.headers['x-admin-token'] || req.query.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  var expiry = adminSessions.get(token);
  if (!expiry || Date.now() > expiry) {
    adminSessions.delete(token);
    return res.status(401).json({ error: 'Session abgelaufen. Bitte neu anmelden.' });
  }
  // Sliding expiry
  adminSessions.set(token, Date.now() + SESSION_TTL_MS);
  next();
}

/* ════════════════════════════════════════
   ADMIN AUTH ROUTES
════════════════════════════════════════ */

/** POST /api/admin/login */
app.post('/api/admin/login', function (req, res) {
  var ip  = req.ip || req.connection.remoteAddress || 'unknown';
  var now = Date.now();

  var entry = loginAttempts.get(ip) || { count: 0, resetAt: now + LOCKOUT_MS };
  if (now > entry.resetAt) {
    entry = { count: 0, resetAt: now + LOCKOUT_MS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    var waitMin = Math.ceil((entry.resetAt - now) / 60000);
    return res.status(429).json({ error: 'Zu viele Versuche. Bitte warte ' + waitMin + ' Minuten.' });
  }

  var password = (req.body.password || '').trim();
  if (password !== ADMIN_PASSWORD) {
    entry.count++;
    loginAttempts.set(ip, entry);
    return res.status(401).json({ error: 'Falsches Passwort.' });
  }

  // Success
  loginAttempts.delete(ip);
  var token = crypto.randomBytes(32).toString('hex');
  adminSessions.set(token, Date.now() + SESSION_TTL_MS);
  console.log('[AUTH] Admin login from', ip);
  res.json({ success: true, token: token });
});

/** POST /api/admin/logout */
app.post('/api/admin/logout', function (req, res) {
  var token = req.headers['x-admin-token'];
  if (token) adminSessions.delete(token);
  res.json({ success: true });
});

/* ════════════════════════════════════════
   PRODUCTS ROUTES
════════════════════════════════════════ */

/** GET /api/products – public */
app.get('/api/products', function (req, res) {
  var products = readJSON(PRODUCTS_FILE);
  res.json({ products: products });
});

/** POST /api/products – save full product list (admin) */
app.post('/api/products', requireAdmin, function (req, res) {
  var products = req.body.products;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Ungültige Produktdaten.' });
  }
  writeJSON(PRODUCTS_FILE, products);
  res.json({ success: true, count: products.length });
});

/* ════════════════════════════════════════
   ORDER ROUTES
════════════════════════════════════════ */

/** POST /api/orders – Place order (public) */
app.post('/api/orders', function (req, res) {
  var body = req.body;
  if (!body || !body.items || !body.customer) {
    return res.status(400).json({ error: 'Ungültige Bestelldaten.' });
  }

  // Validate promo if provided
  var discount = 0;
  var appliedPromo = null;
  if (body.promo) {
    var promos = readJSON(PROMOS_FILE);
    var promo = promos.find(function (p) { return p.code === body.promo && p.active; });
    if (promo) {
      var sub = body.subtotal || 0;
      discount = promo.type === 'percent' ? sub * (promo.value / 100) : Math.min(promo.value, sub);
      appliedPromo = promo.code;
      promo.usageCount = (promo.usageCount || 0) + 1;
      if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
        promo.active = false;
      }
      writeJSON(PROMOS_FILE, promos);
    }
  }

  var order = {
    id:           body.id || ('PL-' + Date.now().toString(36).toUpperCase()),
    createdAt:    body.createdAt || new Date().toISOString(),
    status:       'Ausstehend',
    customer:     body.customer  || {},
    shipping:     body.shipping  || {},
    payment:      body.payment   || 'bankueberweisung',
    promo:        appliedPromo,
    items:        body.items     || [],
    subtotal:     body.subtotal  || 0,
    discount:     discount,
    shippingCost: body.shippingCost || 0,
    total:        body.total     || 0,
  };

  var orders = readJSON(ORDERS_FILE);
  orders.unshift(order);
  writeJSON(ORDERS_FILE, orders);

  console.log('[ORDER]', order.id, order.customer.email, '€' + order.total);
  res.json({ success: true, order: order });
});

/** GET /api/orders – List all orders (admin) */
app.get('/api/orders', requireAdmin, function (req, res) {
  var orders = readJSON(ORDERS_FILE);
  if (req.query.status) {
    orders = orders.filter(function (o) { return o.status === req.query.status; });
  }
  res.json({ orders: orders, count: orders.length });
});

/** GET /api/orders/:id – Single order (admin) */
app.get('/api/orders/:id', requireAdmin, function (req, res) {
  var orders = readJSON(ORDERS_FILE);
  var order = orders.find(function (o) { return o.id === req.params.id; });
  if (!order) return res.status(404).json({ error: 'Bestellung nicht gefunden.' });
  res.json({ order: order });
});

/** PATCH /api/orders/:id/status – Update status (admin) */
app.patch('/api/orders/:id/status', requireAdmin, function (req, res) {
  var orders = readJSON(ORDERS_FILE);
  var idx = orders.findIndex(function (o) { return o.id === req.params.id; });
  if (idx === -1) return res.status(404).json({ error: 'Bestellung nicht gefunden.' });

  var validStatuses = ['Ausstehend', 'Bezahlt', 'In Bearbeitung', 'Versendet', 'Geliefert', 'Storniert'];
  var newStatus = req.body.status;
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: 'Ungültiger Status.' });
  }

  orders[idx].status = newStatus;
  orders[idx].updatedAt = new Date().toISOString();
  if (req.body.trackingNumber) orders[idx].trackingNumber = req.body.trackingNumber;
  writeJSON(ORDERS_FILE, orders);
  console.log('[ORDER STATUS]', orders[idx].id, '->', newStatus);
  res.json({ success: true, order: orders[idx] });
});

/** DELETE /api/orders/:id – Delete order (admin) */
app.delete('/api/orders/:id', requireAdmin, function (req, res) {
  var orders = readJSON(ORDERS_FILE);
  var idx = orders.findIndex(function (o) { return o.id === req.params.id; });
  if (idx === -1) return res.status(404).json({ error: 'Bestellung nicht gefunden.' });
  var removed = orders.splice(idx, 1)[0];
  writeJSON(ORDERS_FILE, orders);
  res.json({ success: true, removed: removed.id });
});

/* ════════════════════════════════════════
   PROMO CODE ROUTES
════════════════════════════════════════ */

/** POST /api/promo/validate – Public promo validation */
app.post('/api/promo/validate', function (req, res) {
  var code = (req.body.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ valid: false, error: 'Kein Code angegeben.' });

  var promos = readJSON(PROMOS_FILE);
  var promo  = promos.find(function (p) { return p.code === code && p.active; });

  if (!promo) return res.json({ valid: false });

  if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
    return res.json({ valid: false, error: 'Code bereits aufgebraucht.' });
  }

  res.json({ valid: true, promo: { code: promo.code, type: promo.type, value: promo.value } });
});

/** GET /api/promos – List all promos (admin) */
app.get('/api/promos', requireAdmin, function (req, res) {
  res.json({ promos: readJSON(PROMOS_FILE) });
});

/** POST /api/promos – Create promo (admin) */
app.post('/api/promos', requireAdmin, function (req, res) {
  var body = req.body;
  var promos = readJSON(PROMOS_FILE);

  var code = (body.code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!code) return res.status(400).json({ error: 'Ungültiger Code.' });
  if (promos.find(function (p) { return p.code === code; })) {
    return res.status(409).json({ error: 'Code existiert bereits.' });
  }

  var promo = {
    code:        code,
    type:        body.type === 'fixed' ? 'fixed' : 'percent',
    value:       Math.abs(parseFloat(body.value) || 0),
    active:      body.active !== false,
    description: (body.description || '').trim(),
    usageCount:  0,
    usageLimit:  body.usageLimit ? parseInt(body.usageLimit) : null,
    createdAt:   new Date().toISOString(),
  };

  promos.push(promo);
  writeJSON(PROMOS_FILE, promos);
  res.json({ success: true, promo: promo });
});

/** PATCH /api/promos/:code – Update promo (admin) */
app.patch('/api/promos/:code', requireAdmin, function (req, res) {
  var promos = readJSON(PROMOS_FILE);
  var idx = promos.findIndex(function (p) { return p.code === req.params.code; });
  if (idx === -1) return res.status(404).json({ error: 'Code nicht gefunden.' });

  var p = promos[idx];
  if (req.body.active !== undefined)      p.active = !!req.body.active;
  if (req.body.value !== undefined)       p.value  = Math.abs(parseFloat(req.body.value) || 0);
  if (req.body.description !== undefined) p.description = req.body.description;
  if (req.body.usageLimit !== undefined)  p.usageLimit = req.body.usageLimit ? parseInt(req.body.usageLimit) : null;
  p.updatedAt = new Date().toISOString();

  writeJSON(PROMOS_FILE, promos);
  res.json({ success: true, promo: p });
});

/** DELETE /api/promos/:code – Delete promo (admin) */
app.delete('/api/promos/:code', requireAdmin, function (req, res) {
  var promos = readJSON(PROMOS_FILE);
  var idx = promos.findIndex(function (p) { return p.code === req.params.code; });
  if (idx === -1) return res.status(404).json({ error: 'Code nicht gefunden.' });
  promos.splice(idx, 1);
  writeJSON(PROMOS_FILE, promos);
  res.json({ success: true });
});

/* ════════════════════════════════════════
   IMAGE UPLOAD ROUTES
════════════════════════════════════════ */

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOADS_DIR); },
  filename: function (req, file, cb) {
    var ext  = path.extname(file.originalname).toLowerCase();
    var name = 'product-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6) + ext;
    cb(null, name);
  },
});

function imageFileFilter(req, file, cb) {
  var allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  var ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Nur Bilddateien erlaubt (jpg, png, webp, gif)'));
  }
}

const upload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/** POST /api/upload/product – Upload product image (admin) */
app.post('/api/upload/product', requireAdmin, function (req, res, next) {
  upload.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
    var url = '/uploads/' + req.file.filename;
    console.log('[UPLOAD]', req.file.filename);
    res.json({ success: true, url: url, filename: req.file.filename });
  });
});

/** DELETE /api/upload/:filename – Delete uploaded image (admin) */
app.delete('/api/upload/:filename', requireAdmin, function (req, res) {
  var filename = req.params.filename.replace(/[^a-zA-Z0-9.\-_]/g, '');
  var filepath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'Datei nicht gefunden.' });
  fs.unlinkSync(filepath);
  res.json({ success: true });
});

/* ════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */

/** POST /api/contact – Save contact message */
app.post('/api/contact', function (req, res) {
  var body = req.body;
  if (!body || !body.email || !body.message) {
    return res.status(400).json({ error: 'E-Mail und Nachricht sind Pflichtfelder.' });
  }

  var message = {
    id:        Date.now(),
    createdAt: new Date().toISOString(),
    name:      (body.name    || '').trim(),
    email:     (body.email   || '').trim(),
    subject:   (body.subject || '').trim(),
    message:   (body.message || '').trim(),
    read:      false,
  };

  var contacts = readJSON(CONTACTS_FILE);
  contacts.unshift(message);
  writeJSON(CONTACTS_FILE, contacts);

  console.log('[CONTACT]', message.email, message.subject);
  res.json({ success: true });
});

/* ── 404 fallback → serve index.html for SPA ── */
app.use(function (req, res) {
  if (req.accepts('html') && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

/* ── Start ── */
app.listen(PORT, function () {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   PeptideLab Backend gestartet       ║');
  console.log('  ║   http://localhost:' + PORT + '              ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
