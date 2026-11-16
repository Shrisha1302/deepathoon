import { useState, useCallback } from 'react'
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

  const handleLampLit = useCallback(() => {
    if (isLit) return
    setIsLit(true)
    emitLampLit()
  }, [isLit, emitLampLit])

  return (
    <div className="app">
      {/* Background */}
      <div className="bg" />
      <div className="bg-overlay" />

      {/* Real Captcha barrier before entering */}
      {!isVerified && (
        <CaptchaModal onVerified={() => setIsVerified(true)} />
      )}

      {/* Main site content once verified */}
      <main className="hero">
        <Header />
        <Counter stats={stats} />
        <LampScene isLit={isLit} onLampLit={handleLampLit} />
      </main>

      <History />
      <Footer />
    </div>
  )
}
