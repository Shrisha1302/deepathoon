import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

export function useSocket() {
  const socketRef = useRef(null)
  const [stats, setStats] = useState({ count: 1000, active: 1 })

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_URL || window.location.origin
    socketRef.current = io(url, { transports: ['websocket', 'polling'] })

    socketRef.current.on('stats', (data) => setStats(data))

    return () => { socketRef.current?.disconnect() }
  }, [])

  const emitLampLit = () => { socketRef.current?.emit('lamp_lit') }

  return { stats, emitLampLit }
}
