const express  = require('express');
const http     = require('http');
const { Server } = require('socket.io');
const fs       = require('fs');
const path     = require('path');
const cors     = require('cors');

const app    = express();
const server = http.createServer(app);

app.use(cors());

const CLOUD_KV_GET = 'https://keyvalue.immanuel.co/api/KeyVal/GetValue/rt4i17ti/deepathoon_count';
const CLOUD_KV_SET = 'https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/rt4i17ti/deepathoon_count/';
const BASELINE_COUNT = 1010;

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
      if (!isNaN(val) && val > data.count) {
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

// Health check / API status endpoint
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
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  activeUsers++;
  // Send current state to the connected user
  socket.emit('stats', { count: data.count, active: activeUsers });
  socket.broadcast.emit('stats', { count: data.count, active: activeUsers });

  socket.on('lamp_lit', (clientCount) => {
    const parsed = parseInt(clientCount, 10);
    if (!isNaN(parsed) && parsed > data.count) {
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
    io.emit('stats', { count: data.count, active: activeUsers });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🕉️  Deepathoon server running on port ${PORT} (Count: ${data.count})`);
});
