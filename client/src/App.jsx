import { useState, useCallback, useEffect } from 'react'
import Header       from './components/Header'
import Counter      from './components/Counter'
import LampScene    from './components/LampScene'
import DevoteeConnect from './components/DevoteeConnect'
import History      from './components/History'
import Footer       from './components/Footer'
import CaptchaModal from './components/CaptchaModal'
import { useSocket } from './hooks/useSocket'

export default function App() {
  const [isVerified, setIsVerified] = useState(false)
  const [isLit, setIsLit] = useState(false)
  const { stats, emitLampLit } = useSocket()

  // Only the header subtitle and torch/beacon auto-alternate.
  // - subLang: 4s cycle for the subtitle line "Thiruparankundram · Sacred Abode of Lord Murugan"
  // - torchLang: 2s cycle for torch drag badge + "Light Here" beacon label
  const [subLang, setSubLang] = useState('en')
  const [torchLang, setTorchLang] = useState('en')

  useEffect(() => {
    const sub = setInterval(() => setSubLang(p => p === 'en' ? 'ta' : 'en'), 4000)
    const torch = setInterval(() => setTorchLang(p => p === 'en' ? 'ta' : 'en'), 2000)
    return () => { clearInterval(sub); clearInterval(torch) }
  }, [])

  const handleLampLit = useCallback(() => {
    if (isLit) return
    setIsLit(true)
    emitLampLit()
  }, [isLit, emitLampLit])

  return (
    <div className="app">
      <div className="bg" />
      <div className="bg-overlay" />

      {/* Hindu Devotee Verification — always English */}
      {!isVerified && (
        <CaptchaModal onVerified={() => setIsVerified(true)} />
      )}

      <main className="hero">
        {/* subLang only for the subtitle line */}
        <Header subLang={subLang} />
        <Counter stats={stats} />
        <LampScene isLit={isLit} onLampLit={handleLampLit} torchLang={torchLang} />
      </main>

      {/* Devotee Connect & Analytics Collection directly into Google Sheets */}
      <DevoteeConnect isLit={isLit} />

      {/* History has its own manual translate toggle */}
      <History />
      <Footer />
    </div>
  )
}
