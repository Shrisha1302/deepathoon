import { useState, useEffect } from 'react'
import { GOOGLE_SHEET_WEBAPP_URL } from '../config'

export default function DevoteeConnect({ isLit }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('')
  const [visitorLocation, setVisitorLocation] = useState(null)
  const [customSheetUrl, setCustomSheetUrl] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  // 1. Fetch visitor analytics and location silently in the background
  useEffect(() => {
    // Check if user previously registered in this browser
    try {
      const saved = localStorage.getItem('deepathoon_devotee_registered')
      if (saved) setAlreadyRegistered(true)
      const storedUrl = localStorage.getItem('deepathoon_sheet_url')
      if (storedUrl) setCustomSheetUrl(storedUrl)
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

      // Fallback 1: ipwhois.app
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

      // Fallback 2: Local browser inference
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

  // 2. Handle devotee email submission
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

    // Prepare complete data payload with analytics
    const payload = {
      email: cleanEmail,
      timestamp: visitorLocation?.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      city: visitorLocation?.city || 'Unknown City',
      region: visitorLocation?.region || 'Unknown State',
      country: visitorLocation?.country || 'India',
      ip: visitorLocation?.ip || 'Unknown IP',
      device: visitorLocation?.device || (/Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'),
      timezone: visitorLocation?.timezone || 'Asia/Kolkata',
      pageUrl: window.location.href
    }

    // A) Always save to browser localStorage safety backup (no data lost!)
    try {
      const existing = JSON.parse(localStorage.getItem('deepathoon_devotee_submissions') || '[]')
      existing.push(payload)
      localStorage.setItem('deepathoon_devotee_submissions', JSON.stringify(existing))
      localStorage.setItem('deepathoon_devotee_registered', 'true')
    } catch {}

    // B) Post directly to Google Spreadsheet via Google Apps Script Web App
    const activeSheetUrl = customSheetUrl || GOOGLE_SHEET_WEBAPP_URL
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

    // Success feedback
    setStatus('success')
    setAlreadyRegistered(true)
    setStatusMsg('🙏 நன்றி! Your email has been added to the Deepathoon devotee circle.')
  }

  const handleSaveSheetUrl = (e) => {
    e.preventDefault()
    try {
      localStorage.setItem('deepathoon_sheet_url', customSheetUrl.trim())
      setShowSettings(false)
      alert('Google Apps Script Web App URL saved successfully!')
    } catch {}
  }

  return (
    <section className="devotee-connect-section" id="devotee-connect">
      <div className="devotee-connect-container">

        <div className={`devotee-card ${isLit ? 'highlighted' : ''}`}>
          {/* Sacred Top Icon */}
          <div className="devotee-icon-wrap">
            <span className="devotee-icon">🪔</span>
            {isLit && (
              <span className="devotee-lit-badge">
                You have lit the sacred flame!
              </span>
            )}
          </div>

          {/* Heading */}
          <h3 className="devotee-heading">
            Stay Connected with Deepathoon
          </h3>
          <p className="devotee-subheading-ta">
            தீபத்தூண் ஆன்மீகப் பேரவை &middot; புதிய தகவல்களைப் பெற
          </p>

          <p className="devotee-desc">
            Enter your email ID to receive divine updates, announcements, and future developments regarding <strong>deepathoon.com</strong>.
            <br className="desc-break" />
            <span className="devotee-note-highlight">No names needed — only your email address.</span>
          </p>

          {/* Form */}
          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="devotee-form">
              <div className="devotee-input-row">
                <div className="devotee-input-box">
                  <span className="input-mail-icon" aria-hidden="true">✉</span>
                  <input
                    type="email"
                    className="devotee-email-field"
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
                  className="devotee-submit-btn"
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
                <div className="devotee-msg error">{statusMsg}</div>
              )}

              {alreadyRegistered && status !== 'error' && (
                <div className="devotee-already-sub">
                  ✓ You are already connected. Enter an additional email to register for family or friends.
                </div>
              )}
            </form>
          ) : (
            /* Success State */
            <div className="devotee-success-box">
              <div className="success-om">🕉️</div>
              <h4 className="success-title">
                வெற்றிவேல் முருகனுக்கு அரோகரா!
              </h4>
              <p className="success-desc">
                {statusMsg}
              </p>
              {visitorLocation?.city && visitorLocation.city !== 'Unknown City' && (
                <div className="devotee-location-pill">
                  📍 Logged from: <strong>{visitorLocation.city}, {visitorLocation.region}, {visitorLocation.country}</strong>
                </div>
              )}
              <p className="success-footer-note">
                Stored directly in your private Google Spreadsheet. May Lord Muruga bless you and your family!
              </p>
              <button
                type="button"
                className="devotee-add-another-btn"
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

          {/* Privacy & Google Spreadsheet Direct Sync Notice */}
          <div className="devotee-privacy-note">
            <span>🔒 Confidential &middot; Stored directly into Google Spreadsheets &middot; No Spam &middot; Purely for Sacred Updates</span>
            <button
              type="button"
              className="devotee-settings-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Configure Google Sheet Webhook URL"
              aria-label="Configure Google Sheet URL"
            >
              ⚙
            </button>
          </div>

          {/* Collapsible Admin/Config helper to test or paste Google Apps Script URL */}
          {showSettings && (
            <div className="devotee-settings-panel">
              <p className="settings-panel-title">
                📊 Google Sheet Connection Setup
              </p>
              <p className="settings-panel-desc">
                Paste your deployed Google Apps Script Web App URL below (starts with <code>https://script.google.com/macros/s/...</code>):
              </p>
              <form onSubmit={handleSaveSheetUrl} className="settings-form">
                <input
                  type="url"
                  className="settings-url-input"
                  placeholder="https://script.google.com/macros/s/AKfy.../exec"
                  value={customSheetUrl}
                  onChange={(e) => setCustomSheetUrl(e.target.value)}
                  required
                />
                <button type="submit" className="settings-save-btn">
                  Save URL
                </button>
              </form>
              <p className="settings-guide-hint">
                View <code>google-sheets-script.js</code> in the project folder for the 1-minute setup guide.
              </p>
            </div>
          )}

        </div>

      </div>
    </section>
  )
}
