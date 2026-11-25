import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// Live backend on Render:
const RENDER_SERVER_URL = 'https://deepathoon.onrender.com'
const CLOUD_KV_GET = 'https://keyvalue.immanuel.co/api/KeyVal/GetValue/rt4i17ti/deepathoon_count'
const CLOUD_KV_SET = 'https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/rt4i17ti/deepathoon_count/'
const LOCAL_STORAGE_KEY = 'deepathoon_sacred_count'

// ── HARD RESET BOUNDARY ───────────────────────────────────────────────────
// Any count below this is invalid. Any count above MAX is corrupted/bot spam.
const BASELINE_COUNT = 98635
const MAX_VALID_COUNT = 10000000   // 1 crore — sanity ceiling

// Sanitise any value coming from cloud / socket / localStorage
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
      // If stored value is out of range (corrupted / old giant number) wipe it
      if (isNaN(n) || n < BASELINE_COUNT || n > MAX_VALID_COUNT) {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
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

  // Keep countRef synchronised with latest count
  useEffect(() => {
    countRef.current = stats.count
  }, [stats.count])

  // 1. Immediately fetch latest cloud count on mount
  useEffect(() => {
    fetch(CLOUD_KV_GET)
      .then(res => res.text())
      .then(text => {
        const val = sanitise(text.replace(/[^0-9]/g, ''))
        if (val > countRef.current) {
          countRef.current = val
          persistCount(val)
          setStats(prev => ({ ...prev, count: val }))
        }
      })
      .catch(() => {})
  }, [])

  // 2. Connect to live Render socket server
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || RENDER_SERVER_URL

    try {
      socketRef.current = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionAttempts: 5
      })

      socketRef.current.on('stats', (data) => {
        if (data && typeof data.count === 'number') {
          const incoming = sanitise(data.count)   // ← rejects giant corrupted numbers
          const highest  = Math.max(countRef.current, incoming)
          countRef.current = highest
          persistCount(highest)
          setStats({
            count: highest,
            active: data.active || 1
          })
        }
      })

      socketRef.current.on('connect', () => {
        console.log('Connected to Deepathoon live server!')
      })
    } catch (err) {
      console.warn('Socket connection error:', err)
    }

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  const emitLampLit = () => {
    const newCount = countRef.current + 1
    countRef.current = newCount
    persistCount(newCount)
    setStats(prev => ({ ...prev, count: newCount }))

    // Sync to Cloud KV immediately
    fetch(CLOUD_KV_SET + newCount, { method: 'POST' }).catch(() => {})

    // Sync to Render socket if connected
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('lamp_lit', newCount)
    }
  }

  return { stats, emitLampLit }
}
