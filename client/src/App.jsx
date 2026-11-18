import { useState, useCallback, useEffect } from 'react'
import Header       from './components/Header'
import Counter      from './components/Counter'
import LampScene    from './components/LampScene'
import History      from './components/History'
import Footer       from './components/Footer'
import CaptchaModal from './components/CaptchaModal'
import { useSocket } from './hooks/useSocket'

export default function App() {
  const [isVerified, setIsVerified] = useState(false)
  const [isLit, setIsLit] = useState(false)
  const { stats, emitLampLit } = useSocket()

  // Automatic language switcher: cycles between English ('en') and Tamil ('ta') every 2 seconds
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const interval = setInterval(() => {
      setLang(prev => (prev === 'en' ? 'ta' : 'en'))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleLampLit = useCallback(() => {
    if (isLit) return
    setIsLit(true)
    emitLampLit()
  }, [isLit, emitLampLit])

  return (
    <div className="app">
      {/* Spiritual Bright Light Yellow Background Canvas */}
      <div className="bg" />
      <div className="bg-overlay" />

      {/* Hindu Devotee Verification Barrier */}
      {!isVerified && (
        <CaptchaModal onVerified={() => setIsVerified(true)} lang={lang} />
      )}

      {/* Main Sanctuary Content */}
      <main className="hero">
        <Header lang={lang} />
        <Counter stats={stats} lang={lang} />
        <LampScene isLit={isLit} onLampLit={handleLampLit} lang={lang} />
      </main>

      <History lang={lang} />
      <Footer lang={lang} />
    </div>
  )
}
