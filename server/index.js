const express  = require('express');
const http     = require('http');
const { Server } = require('socket.io');
const fs       = require('fs');
const path     = require('path');
const cors     = require('cors');

const app    = express();
const server = http.createServer(app);

app.use(cors());

// Health check / API status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Deepathoon Server Running',
    count: data.count,
    active: activeUsers
  });
});

// ── Counter persistence ───────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, 'counter.json');
let data = { count: 1000 };

if (fs.existsSync(DATA_FILE)) {
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    data = { count: 1000 };
  }
}

function saveCount() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Save error:', e.message);
  }
}

let activeUsers = 0;

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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🕉️  Deepathoon server on port ${PORT}`);
});
