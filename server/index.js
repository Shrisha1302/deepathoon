const express  = require('express');
const http     = require('http');
const { Server } = require('socket.io');
const fs       = require('fs');
const path     = require('path');
const cors     = require('cors');

const app    = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// ── Counter persistence ───────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, 'counter.json');
let data = { count: 1134 };

if (fs.existsSync(DATA_FILE)) {
  try { data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { data = { count: 1134 }; }
}

function saveCount() {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }
  catch (e) { console.error('Save error:', e.message); }
}

let activeUsers = 0;

// ── Socket.io ─────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  activeUsers++;
  socket.emit('stats', { count: data.count, active: activeUsers });
  socket.broadcast.emit('stats', { count: data.count, active: activeUsers });

  socket.on('lamp_lit', () => {
    data.count++;
    saveCount();
    io.emit('stats', { count: data.count, active: activeUsers });
  });

  socket.on('disconnect', () => {
    activeUsers = Math.max(0, activeUsers - 1);
    io.emit('stats', { count: data.count, active: activeUsers });
  });
});

// ── Serve React build in production ──────────────────────────────────────
const distPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) =>
    res.sendFile(path.join(distPath, 'index.html'))
  );
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () =>
  console.log(`Deepathoon server on http://localhost:${PORT}`)
);
