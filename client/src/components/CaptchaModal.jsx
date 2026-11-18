import { useState, useEffect, useRef } from 'react'

export default function CaptchaModal({ onVerified }) {
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const startTime = useRef(Date.now())
  const mouseMoves = useRef([])
  const isAutomated = useRef(false)

  useEffect(() => {
    startTime.current = Date.now()
    if (navigator.webdriver || window._phantom || window.__nightmare || window.callPhantom) {
      isAutomated.current = true
    }
    const handleMove = (e) => {
      const { clientX, clientY } = e
      if (mouseMoves.current.length < 50) {
        mouseMoves.current.push({ x: clientX, y: clientY, t: Date.now() })
      }
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [])

  const handleCheckboxClick = () => {
    if (status !== 'idle') return
    setStatus('analyzing')
    setErrorMsg('')

    setTimeout(() => {
      const elapsed = Date.now() - startTime.current
      const moves = mouseMoves.current

      if (honeypot.trim() !== '') {
        setStatus('failed')
        setErrorMsg('Bot-like activity detected. Verification blocked.')
        return
      }
      if (isAutomated.current) {
        setStatus('failed')
        setErrorMsg('Automated browser environment detected.')
        return
      }
      if (elapsed < 400) {
        setStatus('failed')
        setErrorMsg('Abnormal interaction speed detected. Please try again.')
        setTimeout(() => setStatus('idle'), 1500)
        return
      }
      let hasNaturalVariance = true
      if (moves.length >= 3) {
        const v1 = Math.hypot(moves[1].x - moves[0].x, moves[1].y - moves[0].y)
        const v2 = Math.hypot(moves[2].x - moves[1].x, moves[2].y - moves[1].y)
        if (v1 === 0 && v2 === 0 && moves.length > 10) hasNaturalVariance = false
      }
      if (!hasNaturalVariance) {
        setStatus('failed')
        setErrorMsg('Synthetic mouse trajectory detected.')
        setTimeout(() => setStatus('idle'), 1500)
        return
      }
      setStatus('verified')
      setTimeout(() => onVerified(), 900)
    }, 1100)
  }

  return (
    <div className="captcha-overlay">
      <div className="captcha-card">
        <span className="captcha-om">🕉</span>
        <h2 className="captcha-title">Devotee Verification</h2>
        <p className="captcha-sub">
          Verifying genuine Hindu devotee presence to enter the sacred Deepathoon sanctuary
        </p>

        {/* Honeypot — invisible to humans */}
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

        <div
          className={`turnstile-widget ${status}`}
          onClick={status === 'idle' ? handleCheckboxClick : undefined}
        >
          <div className="turnstile-left">
            <div className={`turnstile-checkbox ${status}`}>
              {status === 'idle'      && <div className="checkbox-box" />}
              {status === 'analyzing' && <div className="captcha-spinner" />}
              {status === 'verified'  && <span className="checkmark-icon">✓</span>}
              {status === 'failed'    && <span className="fail-icon">✕</span>}
            </div>
            <span className="turnstile-label">
              {status === 'idle'      && 'I am Hindu'}
              {status === 'analyzing' && 'Verifying devotee telemetry...'}
              {status === 'verified'  && 'Hindu Verified ✓'}
              {status === 'failed'    && 'Verification Failed'}
            </span>
          </div>

          <div className="turnstile-brand">
            <span className="brand-logo">🪔</span>
            <span className="brand-text">Sanctuary Gate</span>
          </div>
        </div>

        {errorMsg && <p className="captcha-error">{errorMsg}</p>}

        <p className="captcha-security-note">
          Protected by behavioural telemetry &amp; devotion verification.
        </p>
      </div>
    </div>
  )
}
