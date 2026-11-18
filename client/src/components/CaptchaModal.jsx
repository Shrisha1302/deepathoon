import { useState, useEffect, useRef } from 'react'

export default function CaptchaModal({ onVerified, lang = 'en' }) {
  // Verification states: 'idle' | 'analyzing' | 'verified' | 'failed'
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [honeypot, setHoneypot] = useState('')

  // Telemetry trackers
  const startTime = useRef(Date.now())
  const mouseMoves = useRef([])
  const isAutomated = useRef(false)

  useEffect(() => {
    startTime.current = Date.now()

    // 1. Detect headless automation tools (Puppeteer, Playwright, Selenium)
    if (
      navigator.webdriver ||
      window._phantom ||
      window.__nightmare ||
      window.callPhantom
    ) {
      isAutomated.current = true
    }

    // 2. Track human cursor micro-movements and curvature
    const handleMove = (e) => {
      const { clientX, clientY } = e
      const now = Date.now()
      if (mouseMoves.current.length < 50) {
        mouseMoves.current.push({ x: clientX, y: clientY, t: now })
      }
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [])

  // Analyze behavioral telemetry when user checks the box
  const handleCheckboxClick = () => {
    if (status !== 'idle') return

    setStatus('analyzing')
    setErrorMsg('')

    // Delay to simulate deep behavioral risk analysis
    setTimeout(() => {
      const elapsed = Date.now() - startTime.current
      const moves = mouseMoves.current

      // Check 1: Honeypot trap (only automated bots fill hidden fields)
      if (honeypot.trim() !== '') {
        setStatus('failed')
        setErrorMsg(
          lang === 'en'
            ? 'Bot-like activity detected. Verification blocked.'
            : 'தானியங்கி செயல்பாடு கண்டறியப்பட்டது. சரிபார்ப்பு தடுக்கப்பட்டது.'
        )
        return
      }

      // Check 2: Headless automation flag
      if (isAutomated.current) {
        setStatus('failed')
        setErrorMsg(
          lang === 'en'
            ? 'Automated browser environment detected.'
            : 'தானியங்கி உலாவி சூழல் கண்டறியப்பட்டது.'
        )
        return
      }

      // Check 3: Superhuman speed check (bots click < 400ms after load)
      if (elapsed < 400) {
        setStatus('failed')
        setErrorMsg(
          lang === 'en'
            ? 'Abnormal interaction speed detected. Please try again.'
            : 'இயல்புக்கு மாறான வேகம் கண்டறியப்பட்டது. மீண்டும் முயற்சிக்கவும்.'
        )
        setTimeout(() => setStatus('idle'), 1500)
        return
      }

      // Check 4: Curve & trajectory variance (real humans never move in perfect zeroes)
      let hasNaturalVariance = true
      if (moves.length >= 3) {
        const v1 = Math.hypot(moves[1].x - moves[0].x, moves[1].y - moves[0].y)
        const v2 = Math.hypot(moves[2].x - moves[1].x, moves[2].y - moves[1].y)
        if (v1 === 0 && v2 === 0 && moves.length > 10) {
          hasNaturalVariance = false
        }
      }

      if (!hasNaturalVariance) {
        setStatus('failed')
        setErrorMsg(
          lang === 'en'
            ? 'Synthetic mouse trajectory detected.'
            : 'செயற்கை சுட்டி இயக்கம் கண்டறியப்பட்டது.'
        )
        setTimeout(() => setStatus('idle'), 1500)
        return
      }

      // Telemetry verified!
      setStatus('verified')
      setTimeout(() => {
        onVerified()
      }, 900)
    }, 1100)
  }

  return (
    <div className="captcha-overlay">
      <div className="captcha-card">
        <span className="captcha-om">🕉</span>
        <h2 className="captcha-title">
          {lang === 'en' ? 'Devotee Verification' : 'பக்தர் சரிபார்ப்பு'}
        </h2>
        <p className="captcha-sub">
          {lang === 'en'
            ? 'Verifying genuine Hindu devotee presence to enter the sacred Deepathoon sanctuary'
            : 'புனித தீபத்தூண் சன்னதிக்குள் நுழைய மெய்யான இந்து பக்தர் உறுதிப்படுத்தல்'}
        </p>

        {/* Hidden Honeypot Field — Invisible to humans, trapped for bots */}
        <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
          <input
            type="text"
            tabIndex="-1"
            name="security_trap"
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Cloudflare/reCAPTCHA style verification widget with spiritual theme */}
        <div
          className={`turnstile-widget ${status}`}
          onClick={status === 'idle' ? handleCheckboxClick : undefined}
        >
          <div className="turnstile-left">
            <div className={`turnstile-checkbox ${status}`}>
              {status === 'idle' && <div className="checkbox-box" />}
              {status === 'analyzing' && <div className="captcha-spinner" />}
              {status === 'verified' && <span className="checkmark-icon">✓</span>}
              {status === 'failed' && <span className="fail-icon">✕</span>}
            </div>
            <span className="turnstile-label">
              {status === 'idle' && (lang === 'en' ? 'I am Hindu' : 'நான் ஒரு இந்து')}
              {status === 'analyzing' &&
                (lang === 'en' ? 'Verifying devotee telemetry...' : 'சரிபார்க்கிறது...')}
              {status === 'verified' &&
                (lang === 'en' ? 'Hindu Verified ✓' : 'இந்து என உறுதிப்படுத்தப்பட்டது ✓')}
              {status === 'failed' &&
                (lang === 'en' ? 'Verification Failed' : 'சரிபார்ப்பு தோல்வியடைந்தது')}
            </span>
          </div>

          <div className="turnstile-brand">
            <span className="brand-logo">🪔</span>
            <span className="brand-text">
              {lang === 'en' ? 'Sanctuary Gate' : 'சன்னதி வாயில்'}
            </span>
          </div>
        </div>

        {errorMsg && <p className="captcha-error">{errorMsg}</p>}

        <p className="captcha-security-note">
          {lang === 'en'
            ? 'Protected by behavioural telemetry & devotion verification.'
            : 'பாதுகாப்பான மெய்நிகர் சரிபார்ப்புடன் கூடியது.'}
        </p>
      </div>
    </div>
  )
}
