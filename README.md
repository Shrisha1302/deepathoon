# Deepathoon — Thiruparankundram

A single-page interactive spiritual website where visitors drag a flame to light the sacred Deepathoon lamp. Features a real-time devotee counter and live visitor tracking via WebSocket.

## Stack
- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express + Socket.io

## Setup & Run (Development)

```bash
# 1. Install root deps
npm install

# 2. Install server deps
cd server && npm install && cd ..

# 3. Install client deps
cd client && npm install && cd ..

# 4. Run both together
npm run dev
```

- React dev server: http://localhost:5173
- Node server:      http://localhost:3001

## Add BGM
Place your audio file in `client/public/` and add `<audio id="bgm" src="/your-bgm.mp3" loop />` to App.jsx. It auto-plays after the lamp is lit.

## Add Contact Email
In `client/src/components/Footer.jsx`, replace `your@email.com` with the real address.

## Production Build
```bash
npm run build   # builds React into client/dist/
npm start       # serves everything from Node on port 3001
```
