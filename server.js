/**
 * PeptideLab Backend Server
 * Run: node server.js
 * Requires: npm install
 *
 * API endpoints:
 *   POST /api/orders            – Place a new order
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
 * All admin routes require the header: X-Admin-Token: PeptideLab2024
 */

'use strict';

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Paths ── */
const DATA_DIR    = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PROMOS_FILE = path.join(DATA_DIR, 'promos.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

[DATA_DIR, UPLOADS_DIR].forEach(function (d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

/* ── Middleware ── */
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({
  contentSecurityPolicy: false, // CSP handled by HTML meta tags
  crossOriginEmbedderPolicy: false,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
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

/* ── Admin auth middleware ── */
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'PeptideLab2024';

function requireAdmin(req, res, next) {
  var token = req.headers['x-admin-token'] || req.query.token;
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

/* ── Multer (image uploads) ── */
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOADS_DIR); },
  filename: function (req, file, cb) {
    var ext = path.extname(file.originalname).toLowerCase();
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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
      // Increment usage
      promo.usageCount = (promo.usageCount || 0) + 1;
      if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
        promo.active = false;
      }
      writeJSON(PROMOS_FILE, promos);
    }
  }

  var order = {
    id:        body.id || ('PL-' + Date.now().toString(36).toUpperCase()),
    createdAt: body.createdAt || new Date().toISOString(),
    status:    'Ausstehend',
    customer:  body.customer || {},
    shipping:  body.shipping || {},
    payment:   body.payment  || 'bankueberweisung',
    promo:     appliedPromo,
    items:     body.items    || [],
    subtotal:  body.subtotal || 0,
    discount:  discount,
    shippingCost: body.shipping_cost || 0,
    total:     body.total    || 0,
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
  // Optional status filter
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

  // Check usage limit
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

/** POST /api/upload/product – Upload product image (admin) */
app.post('/api/upload/product', requireAdmin, upload.single('image'), function (req, res) {
  if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
  var url = '/uploads/' + req.file.filename;
  console.log('[UPLOAD]', req.file.filename);
  res.json({ success: true, url: url, filename: req.file.filename });
}, function (err, req, res, next) {
  res.status(400).json({ error: err.message });
});

/** DELETE /api/upload/:filename – Delete uploaded image (admin) */
app.delete('/api/upload/:filename', requireAdmin, function (req, res) {
  var filename = req.params.filename.replace(/[^a-zA-Z0-9.\-_]/g, '');
  var filepath = path.join(UPLOADS_DIR, filename);
  if (!fs.existsSync(filepath)) return res.status(404).json({ error: 'Datei nicht gefunden.' });
  fs.unlinkSync(filepath);
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
  console.log('  ║   Admin-Token: ' + ADMIN_TOKEN + '    ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});
