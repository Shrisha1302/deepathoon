import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// Your live backend on Render:
const RENDER_SERVER_URL = 'https://deepathoon.onrender.com'

export function useSocket() {
  const socketRef = useRef(null)
  const [stats, setStats] = useState({ count: 1000, active: 1 })

  useEffect(() => {
    // Prefer environment variable or use the live Render server
    const serverUrl = import.meta.env.VITE_SERVER_URL || RENDER_SERVER_URL

    try {
      socketRef.current = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionAttempts: 5
      })

      socketRef.current.on('stats', (data) => {
        setStats(data)
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
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('lamp_lit')
    } else {
      // Offline fallback
      setStats((prev) => ({ ...prev, count: prev.count + 1 }))
    }
  }

  return { stats, emitLampLit }
}
