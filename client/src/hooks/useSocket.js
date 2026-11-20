import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// Live backend on Render:
const RENDER_SERVER_URL = 'https://deepathoon.onrender.com'
const CLOUD_KV_GET = 'https://keyvalue.immanuel.co/api/KeyVal/GetValue/rt4i17ti/deepathoon_count'
const CLOUD_KV_SET = 'https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/rt4i17ti/deepathoon_count/'
const LOCAL_STORAGE_KEY = 'deepathoon_sacred_count'
const BASELINE_COUNT = 1010

function getStoredCount() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const num = parseInt(saved, 10)
      if (!isNaN(num) && num >= BASELINE_COUNT) return num
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

  // 1. Immediately fetch latest cloud count on mount (survives Render cold starts)
  useEffect(() => {
    fetch(CLOUD_KV_GET)
      .then(res => res.text())
      .then(text => {
        const val = parseInt(text.replace(/[^0-9]/g, ''), 10)
        if (!isNaN(val) && val > countRef.current) {
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
        // Enforce monotonicity: count can NEVER go backward!
        if (data && typeof data.count === 'number') {
          const highest = Math.max(countRef.current, data.count, BASELINE_COUNT)
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
    // Strictly increment count by 1 upon lighting
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
