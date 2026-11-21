import { useState, useEffect } from 'react'
import { GOOGLE_SHEET_WEBAPP_URL } from '../config'

export default function DevoteeConnect({ isLit }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('')
  const [visitorLocation, setVisitorLocation] = useState(null)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  // 1. Fetch visitor analytics and location silently in the background
  useEffect(() => {
    try {
      const saved = localStorage.getItem('deepathoon_devotee_registered')
      if (saved) setAlreadyRegistered(true)
    } catch {}

    const detectLocation = async () => {
      const baseAnalytics = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
        device: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        language: navigator.language || 'en',
        screen: `${window.innerWidth}x${window.innerHeight}`,
        pageUrl: window.location.href,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
      }

      // Try primary IP geo service (ipapi.co)
      try {
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' })
        if (res.ok) {
          const geo = await res.json()
          if (geo && (geo.city || geo.country_name)) {
            setVisitorLocation({
              ...baseAnalytics,
              ip: geo.ip || 'Unknown IP',
              city: geo.city || 'Unknown City',
              region: geo.region || geo.region_code || 'Unknown State',
              country: geo.country_name || geo.country || 'India',
              countryCode: geo.country_code || 'IN'
            })
            return
          }
        }
      } catch {}

      // Fallback: ipwhois.app
      try {
        const res2 = await fetch('https://ipwhois.app/json/')
        if (res2.ok) {
          const geo2 = await res2.json()
          if (geo2 && (geo2.city || geo2.country)) {
            setVisitorLocation({
              ...baseAnalytics,
              ip: geo2.ip || 'Unknown IP',
              city: geo2.city || 'Unknown City',
              region: geo2.region || 'Unknown State',
              country: geo2.country || 'India',
              countryCode: geo2.country_code || 'IN'
            })
            return
          }
        }
      } catch {}

      // Fallback: local browser inference
      setVisitorLocation({
        ...baseAnalytics,
        ip: 'Direct Visitor',
        city: 'Online Devotee',
        region: baseAnalytics.timezone,
        country: 'India & Worldwide',
        countryCode: 'IN'
      })
    }

    detectLocation()
  }, [])

  // 2. Resolve active Google Sheet URL (from saved localStorage or config.js)
  const getActiveSheetUrl = () => {
    try {
      const saved = localStorage.getItem('deepathoon_sheet_url')
      if (saved && saved.startsWith('http')) return saved.trim()
    } catch {}
    return GOOGLE_SHEET_WEBAPP_URL
  }

  // 3. Handle devotee email submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setStatus('error')
      setStatusMsg('Please enter a valid email address / சரியான மின்னஞ்சலை உள்ளிடவும்')
      return
    }

    setStatus('loading')
    setStatusMsg('')

    const payload = {
      email: cleanEmail,
      timestamp: visitorLocation?.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      city: '',
      state: visitorLocation?.region || 'Unknown State',
      region: visitorLocation?.region || 'Unknown State',
      country: visitorLocation?.country || 'India',
      ip: visitorLocation?.ip || 'Unknown IP',
      device: visitorLocation?.device || (/Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'),
      timezone: visitorLocation?.timezone || 'Asia/Kolkata',
      pageUrl: window.location.href
    }

    // A) Browser localStorage backup (so no email is ever lost)
    try {
      const existing = JSON.parse(localStorage.getItem('deepathoon_devotee_submissions') || '[]')
      existing.push(payload)
      localStorage.setItem('deepathoon_devotee_submissions', JSON.stringify(existing))
      localStorage.setItem('deepathoon_devotee_registered', 'true')
    } catch {}

    // B) Post directly to Google Sheet Web App
    const activeSheetUrl = getActiveSheetUrl()
    const isReadyUrl = activeSheetUrl && !activeSheetUrl.includes('YOUR_SCRIPT_ID_HERE')

    if (isReadyUrl) {
      try {
        await fetch(activeSheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        })
      } catch (err) {
        console.warn('Google Sheet sync notice:', err)
      }
    }

    setStatus('success')
    setAlreadyRegistered(true)
    setStatusMsg('Your email has been safely added to the Deepathoon devotee circle.')
  }

  return (
    <div className="devotee-footer-wrap" id="devotee-connect">
      <div className={`devotee-footer-card ${isLit ? 'lit-glow' : ''}`}>
        
        {/* Header */}
        <div className="devotee-footer-header">
          <span className="devotee-mini-lamp">🪔</span>
          <span className="devotee-footer-title">
            Stay Connected &middot; தீபத்தூண் ஆன்மீகப் பேரவை
          </span>
        </div>

        <p className="devotee-footer-desc">
          Enter your email to receive future updates on <strong>deepathoon.com</strong> (no name needed).
        </p>

        {/* Form */}
        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="devotee-footer-form">
            <div className="devotee-footer-input-row">
              <div className="devotee-footer-input-box">
                <span className="devotee-footer-icon" aria-hidden="true">✉</span>
                <input
                  type="email"
                  className="devotee-footer-input"
                  placeholder="Enter your email ID / உங்கள் மின்னஞ்சல்..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  required
                  disabled={status === 'loading'}
                  autoComplete="email"
                  aria-label="Email address"
                />
              </div>

              <button
                type="submit"
                className="devotee-footer-btn"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="btn-loading-flex">
                    <span className="devotee-spinner" /> Connecting...
                  </span>
                ) : (
                  <span>Subscribe / இணைக 🪔</span>
                )}
              </button>
            </div>

            {status === 'error' && (
              <div className="devotee-footer-msg error">{statusMsg}</div>
            )}

            {alreadyRegistered && status !== 'error' && (
              <div className="devotee-footer-already">
                ✓ You are connected. Enter an additional email for family or friends if needed.
              </div>
            )}
          </form>
        ) : (
          /* Compact Success State */
          <div className="devotee-footer-success">
            <span className="footer-success-om">🕉️</span>
            <span className="footer-success-title">நன்றி! வெற்றிவேல் முருகனுக்கு அரோகரா</span>
            <p className="footer-success-text">{statusMsg}</p>
            {visitorLocation?.region && visitorLocation.region !== 'Unknown State' ? (
              <div className="footer-location-tag">
                📍 Logged from: <strong>{visitorLocation.region}, {visitorLocation.country}</strong>
              </div>
            ) : visitorLocation?.country ? (
              <div className="footer-location-tag">
                📍 Logged from: <strong>{visitorLocation.country}</strong>
              </div>
            ) : null}
            <button
              type="button"
              className="devotee-mini-another-btn"
              onClick={() => {
                setStatus('idle')
                setEmail('')
                setStatusMsg('')
              }}
            >
              + Register another email ID
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
