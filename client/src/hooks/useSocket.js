import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export function useSocket() {
  const socketRef = useRef(null)
  const [stats, setStats] = useState({ count: 1000, active: 1 })

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_URL
    if (!url && window.location.hostname.includes('github.io')) {
      // GitHub Pages static environment - no local socket server
      return
    }

    const socketUrl = url || window.location.origin
    try {
      socketRef.current = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnectionAttempts: 3
      })

      socketRef.current.on('stats', (data) => setStats(data))
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
      // Offline / GitHub Pages local state increment fallback
      setStats((prev) => ({ ...prev, count: prev.count + 1 }))
    }
  }

  return { stats, emitLampLit }
}
