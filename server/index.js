const express  = require('express');
const http     = require('http');
const { Server } = require('socket.io');
const fs       = require('fs');
const path     = require('path');
const cors     = require('cors');

const app    = express();
const server = http.createServer(app);

// ── SECURITY: Rate Limiter (simple in-memory, no extra package needed) ────
const rateLimitMap = new Map(); // ip -> { count, windowStart }
const RATE_LIMIT   = 10;        // max lamp_lit events per IP per minute (strict)
const RATE_WINDOW  = 60 * 1000; // 1-minute window

function isRateLimited(ip) {
  const now  = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };

  if (now - entry.windowStart > RATE_WINDOW) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);

  if (rateLimitMap.size > 5000) {
    // Prune stale entries to prevent memory leak
    for (const [k, v] of rateLimitMap) {
      if (now - v.windowStart > RATE_WINDOW * 2) rateLimitMap.delete(k);
    }
  }

  return entry.count > RATE_LIMIT;
}

// ── SECURITY: Allowed CORS origins ────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'https://deepathoon.com',
  'https://www.deepathoon.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, server-to-server, etc.)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET'],
  credentials: false,
};

app.use(cors(corsOptions));

// ── SECURITY: Hardened HTTP headers ───────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  // Remove fingerprinting headers
  res.removeHeader('X-Powered-By');
  next();
});

// ── SECURITY: Block bots & scrapers by user-agent ─────────────────────────
const badBots = [
  'curl/', 'python-requests', 'go-http', 'wget/', 'scrapy', 'httrack',
  'masscan', 'zgrab', 'headlesschrome', 'phantomjs', 'puppeteer',
  'selenium', 'playwright', 'postman', 'insomnia', 'aiohttp', 'httpx'
];

app.use((req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  if (badBots.some(b => ua.includes(b))) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// ── SECURITY: Simple request IP helper ────────────────────────────────────
function getIP(req) {
  return (
    req.headers['cf-connecting-ip'] ||     // Cloudflare
    req.headers['x-real-ip'] ||            // nginx
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress || 'unknown'
  );
}

const CLOUD_KV_GET = 'https://keyvalue.immanuel.co/api/KeyVal/GetValue/rt4i17ti/deepathoon_count';
const CLOUD_KV_SET = 'https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/rt4i17ti/deepathoon_count/';
const BASELINE_COUNT = 205900; // Hard reset baseline — never go below this
const MAX_VALID_COUNT = 10000000; // 1 crore sanity ceiling — reject bot-inflated values

// ── Counter persistence ───────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, 'counter.json');
let data = { count: BASELINE_COUNT };

if (fs.existsSync(DATA_FILE)) {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (parsed && typeof parsed.count === 'number') {
      data.count = Math.max(BASELINE_COUNT, parsed.count);
    }
  } catch {
    data = { count: BASELINE_COUNT };
  }
}

function saveCount() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Save error:', e.message);
  }
}

async function syncFromCloud() {
  try {
    const res = await fetch(CLOUD_KV_GET, { headers: { 'Accept': 'application/json, text/plain' } });
    if (res.ok) {
      const text = await res.text();
      const val = parseInt(text.replace(/[^0-9]/g, ''), 10);
      // ── SECURITY: Reject corrupted/bot-inflated values ──
      if (!isNaN(val) && val >= BASELINE_COUNT && val <= MAX_VALID_COUNT && val > data.count) {
        console.log(`[Cloud Sync] Updated local count from cloud (${data.count} -> ${val})`);
        data.count = val;
        saveCount();
        io.emit('stats', { count: data.count, active: getActiveCount() });
      }
    }
  } catch (err) {
    console.warn('[Cloud Sync] Fetch warning:', err.message);
  }
}

async function syncToCloud(count) {
  try {
    await fetch(CLOUD_KV_SET + count, { method: 'POST' });
  } catch (err) {
    console.warn('[Cloud Sync] Upload warning:', err.message);
  }
}

// Initial cloud sync on startup
syncFromCloud();
// Re-sync with cloud store every 5 minutes
setInterval(syncFromCloud, 5 * 60 * 1000);

// Active unique visitors = number of distinct IP addresses connected
function getActiveCount() {
  return Math.max(1, socketConnMap.size);
}

// Health check / API status endpoint (read-only, no sensitive data)
app.get('/', (req, res) => {
  res.json({
    status: 'Deepathoon Server Running',
    count: data.count,
    active: getActiveCount()
  });
});

// ── Socket.io ─────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST']
  },
  // ── SECURITY: Socket.io hardening ──────────────────────────────────────
  pingTimeout: 20000,
  pingInterval: 25000,
  connectTimeout: 10000,
  maxHttpBufferSize: 1e4,         // 10 KB max payload (prevent memory bombs)
  transports: ['websocket', 'polling'],
});

// ── SECURITY: Track connections per IP to detect floods ───────────────────
const socketConnMap = new Map(); // ip -> socket count
const MAX_CONNS_PER_IP = 5;

io.on('connection', (socket) => {
  // ── SECURITY: Disconnect bot/scraper user-agents at handshake ─────────
  const ua = (socket.handshake.headers['user-agent'] || '').toLowerCase();
  if (!ua || badBots.some(b => ua.includes(b))) {
    socket.disconnect(true);
    return;
  }

  const ip = getIP(socket.request);

  // ── SECURITY: Connection flood protection ─────────────────────────────
  const connCount = (socketConnMap.get(ip) || 0) + 1;
  if (connCount > MAX_CONNS_PER_IP) {
    console.warn(`[Security] Too many sockets from ${ip} (${connCount}). Disconnecting.`);
    socket.disconnect(true);
    return;
  }
  socketConnMap.set(ip, connCount);

  // Send current state to connected users using unique visitor count (distinct IPs)
  const currentActive = getActiveCount();
  socket.emit('stats', { count: data.count, active: currentActive });
  socket.broadcast.emit('stats', { count: data.count, active: currentActive });

  let lastLitTime = 0;

  socket.on('lamp_lit', () => {
    const now = Date.now();
    // ── SECURITY: 3-second cooldown per socket (prevents spam clicking/scripts)
    if (now - lastLitTime < 3000) {
      return;
    }

    // ── SECURITY: Rate limiting per IP ────────────────────────────────
    if (isRateLimited(ip)) {
      console.warn(`[Security] Rate limit hit for ${ip}. Ignoring lamp_lit.`);
      return;
    }
    lastLitTime = now;

    // ── SECURITY: Strict increment ONLY. Never trust client-supplied counts!
    data.count++;
    if (data.count > MAX_VALID_COUNT) data.count = BASELINE_COUNT;
    saveCount();
    syncToCloud(data.count);
    io.emit('stats', { count: data.count, active: getActiveCount() });
  });

  socket.on('disconnect', () => {
    const remaining = (socketConnMap.get(ip) || 1) - 1;
    if (remaining <= 0) {
      socketConnMap.delete(ip);
    } else {
      socketConnMap.set(ip, remaining);
    }
    io.emit('stats', { count: data.count, active: getActiveCount() });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🕉️  Deepathoon server running on port ${PORT} (Count: ${data.count})`);
});
