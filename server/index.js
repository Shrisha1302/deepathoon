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
const RATE_LIMIT   = 30;        // max lamp_lit events per IP per window
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
app.use((req, res, next) => {
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const badBots = ['curl/', 'python-requests', 'go-http', 'wget/', 'scrapy', 'httrack', 'masscan', 'zgrab'];
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
const BASELINE_COUNT = 98635; // <-- Updated baseline

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
      // ── SECURITY: Never trust cloud if below our baseline ──
      if (!isNaN(val) && val >= BASELINE_COUNT && val > data.count) {
        console.log(`[Cloud Sync] Updated local count from cloud (${data.count} -> ${val})`);
        data.count = val;
        saveCount();
        io.emit('stats', { count: data.count, active: activeUsers });
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

let activeUsers = 0;

// Health check / API status endpoint (read-only, no sensitive data)
app.get('/', (req, res) => {
  res.json({
    status: 'Deepathoon Server Running',
    count: data.count,
    active: activeUsers
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
  const ip = getIP(socket.request);

  // ── SECURITY: Connection flood protection ─────────────────────────────
  const connCount = (socketConnMap.get(ip) || 0) + 1;
  if (connCount > MAX_CONNS_PER_IP) {
    console.warn(`[Security] Too many sockets from ${ip} (${connCount}). Disconnecting.`);
    socket.disconnect(true);
    return;
  }
  socketConnMap.set(ip, connCount);

  activeUsers++;
  // Send current state to the connected user
  socket.emit('stats', { count: data.count, active: activeUsers });
  socket.broadcast.emit('stats', { count: data.count, active: activeUsers });

  socket.on('lamp_lit', (clientCount) => {
    // ── SECURITY: Rate limiting per IP ────────────────────────────────
    if (isRateLimited(ip)) {
      console.warn(`[Security] Rate limit hit for ${ip}. Ignoring lamp_lit.`);
      return;
    }

    // ── SECURITY: Validate payload – reject non-numeric / malicious data
    const parsed = parseInt(clientCount, 10);
    if (!isNaN(parsed) && parsed > data.count && parsed <= data.count + 1000) {
      // Only accept client suggestion if it's ahead but not suspiciously huge
      data.count = parsed;
    } else {
      data.count++;
    }
    saveCount();
    syncToCloud(data.count);
    io.emit('stats', { count: data.count, active: activeUsers });
  });

  socket.on('disconnect', () => {
    activeUsers = Math.max(0, activeUsers - 1);
    const remaining = (socketConnMap.get(ip) || 1) - 1;
    if (remaining <= 0) {
      socketConnMap.delete(ip);
    } else {
      socketConnMap.set(ip, remaining);
    }
    io.emit('stats', { count: data.count, active: activeUsers });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🕉️  Deepathoon server running on port ${PORT} (Count: ${data.count})`);
});
