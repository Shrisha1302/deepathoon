import { useState, useCallback, useEffect } from 'react'
import Header       from './components/Header'
import Counter      from './components/Counter'
import LampScene    from './components/LampScene'
import History      from './components/History'
import Footer       from './components/Footer'
import CaptchaModal from './components/CaptchaModal'
import HinduLeaders from './components/HinduLeaders'
import HomepageVideo from './components/HomepageVideo'
import { useSocket } from './hooks/useSocket'

export default function App() {
  const [isVerified, setIsVerified] = useState(false)
  const [isLit, setIsLit] = useState(false)
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = (typeof window !== 'undefined' ? window.location.hash : '').toLowerCase()
    return hash === '#voices-of-bharat' || hash === '#hindu-leaders' || hash === '#leaders' ? 'leaders' : 'home'
  })
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

  useEffect(() => {
    const handleHash = () => {
      const hash = (window.location.hash || '').toLowerCase()
      if (hash === '#voices-of-bharat' || hash === '#hindu-leaders' || hash === '#leaders') {
        setCurrentPage('leaders')
      } else if (hash === '#home' || hash === '' || hash === '#') {
        setCurrentPage('home')
      }
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const setPage = (page) => {
    setCurrentPage(page)
    window.location.hash = page === 'leaders' ? 'voices-of-bharat' : ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

      {/* Top Spiritual Navigation Bar */}
      <nav className="site-top-nav" aria-label="Main Sanctuary Navigation">
        <div className="site-top-nav-inner">
          <button
            type="button"
            className={`top-nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => setPage('home')}
          >
            <span className="top-nav-om" aria-hidden="true">ॐ</span>
            <span>தீபத்தூண் (Home)</span>
          </button>
          <span className="top-nav-divider" aria-hidden="true">·</span>
          <button
            type="button"
            className={`top-nav-item ${currentPage === 'leaders' ? 'active' : ''}`}
            onClick={() => setPage('leaders')}
          >
            <span className="top-nav-icon" aria-hidden="true">🚩</span>
            <span>Voices of Bharat</span>
          </button>
        </div>
      </nav>

      {/* Conditional Rendering between Home Sanctuary and Hindu Leaders */}
      {currentPage === 'home' ? (
        <>
          <main className="hero">
            {/* subLang only for the subtitle line */}
            <Header subLang={subLang} />
            <Counter stats={stats} />
            <LampScene isLit={isLit} onLampLit={handleLampLit} torchLang={torchLang} />
          </main>
          {/* Sacred homepage video directly under refresh button */}
          <HomepageVideo />
          {/* History has its own manual translate toggle */}
          <History />
        </>
      ) : (
        <main className="leaders-page-main">
          <HinduLeaders onNavigateHome={() => setPage('home')} />
        </main>
      )}

      <Footer
        isLit={isLit}
        currentPage={currentPage}
        onNavigateHome={() => setPage('home')}
        onNavigateLeaders={() => setPage('leaders')}
      />
    </div>
  )
}
