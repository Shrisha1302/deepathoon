import { useEffect, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

// ── HARD RESET BASELINE REQUESTED BY USER ─────────────────────────────────
const BASELINE_COUNT = 196783
const MAX_VALID_COUNT = 50000000   // 5 crore sanity ceiling
const LOCAL_STORAGE_KEY = 'deepathoon_sacred_count_v2'

// API endpoint on the hosting server (cPanel / Apache / LiteSpeed)
const API_COUNTER = 'api/counter.php'

// Optional live socket backend
const RENDER_SERVER_URL = 'https://deepathoon.onrender.com'

function sanitise(val) {
  const n = parseInt(val, 10)
  if (isNaN(n) || n < BASELINE_COUNT || n > MAX_VALID_COUNT) return BASELINE_COUNT
  return n
}

function getStoredCount() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const n = parseInt(saved, 10)
      if (isNaN(n) || n < BASELINE_COUNT || n > MAX_VALID_COUNT) {
        localStorage.setItem(LOCAL_STORAGE_KEY, BASELINE_COUNT.toString())
        return BASELINE_COUNT
      }
      return n
    }
  } catch {}
  return BASELINE_COUNT
}

function persistCount(val) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, val.toString())
  } catch {}
}

export function useSocket() {
  const socketRef = useRef(null)
  const initialCount = getStoredCount()
  const [stats, setStats] = useState({ count: initialCount, active: 1 })
  const countRef = useRef(initialCount)

  // Keep countRef synchronized with latest count
  useEffect(() => {
    countRef.current = stats.count
  }, [stats.count])

  // Helper: Synchronize with server counter endpoint
  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch(`${API_COUNTER}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        if (data && typeof data.count === 'number') {
          const serverCount = sanitise(data.count)
          const highest = Math.max(countRef.current, serverCount)
          countRef.current = highest
          persistCount(highest)

          setStats({
            count: highest,
            active: Math.max(1, data.active || 1)
          })
          return
        }
      }
    } catch {
      // In local preview without PHP or offline, keep current baseline/count
    }
  }, [])

  // 1. Initial fetch on mount + Periodic live polling every 3.5s
  // This guarantees every user across the world sees the exact same counter in real-time!
  useEffect(() => {
    syncWithServer()

    const pollInterval = setInterval(() => {
      syncWithServer()
    }, 3500)

    return () => clearInterval(pollInterval)
  }, [syncWithServer])

  // 2. Connect to live socket server (if available/unsuspended)
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || RENDER_SERVER_URL

    try {
      socketRef.current = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 6000,
        reconnectionAttempts: 3
      })

      socketRef.current.on('stats', (data) => {
        if (data && typeof data.count === 'number') {
          const incoming = sanitise(data.count)
          const highest = Math.max(countRef.current, incoming)
          countRef.current = highest
          persistCount(highest)
          setStats({
            count: highest,
            active: data.active || 1
          })
        }
      })
    } catch {}

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  // 3. Atomically increment counter when lamp is lit
  const emitLampLit = useCallback(async () => {
    // Optimistic UI bump
    const optimisticCount = countRef.current + 1
    countRef.current = optimisticCount
    persistCount(optimisticCount)
    setStats(prev => ({ ...prev, count: optimisticCount }))

    // Post increment to server-side atomic counter (with flock & IP rate-limit)
    try {
      const res = await fetch(API_COUNTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ action: 'increment' })
      })

      if (res.ok) {
        const data = await res.json()
        if (data && typeof data.count === 'number') {
          const confirmedCount = sanitise(data.count)
          countRef.current = confirmedCount
          persistCount(confirmedCount)
          setStats({
            count: confirmedCount,
            active: Math.max(1, data.active || 1)
          })
        }
      }
    } catch {
      // Offline fallback already updated optimistically
    }

    // Also notify socket server if connected
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('lamp_lit')
    }
  }, [])

  return { stats, emitLampLit }
}
