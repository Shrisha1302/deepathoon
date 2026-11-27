import { useState, useRef } from 'react'

/**
 * Resolves static asset paths respecting Vite's base config (e.g. './')
 */
function getAssetUrl(relPath) {
  const base = import.meta.env.BASE_URL || './'
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  const cleanPath = relPath.startsWith('/') ? relPath.slice(1) : relPath
  return `${cleanBase}${cleanPath}`
}

const VIDEOS = [
  {
    id: 1,
    title: 'Swathi Kr Iyengar',
    tamilTitle: 'சுவாதி கே.ஆர். ஐயங்கார்',
    description: 'Sacred discourses on Dharma, temple heritage, and defending Sanatana traditions at Thiruparankundram.',
    src: getAssetUrl('videos/video1.mp4')
  },
  {
    id: 2,
    title: 'Shri. Anandji',
    tamilTitle: 'ஸ்ரீ ஆனந்த்ஜி',
    description: 'Spiritual discourse on temple sanctity, historical heritage, and devotee rights.',
    src: getAssetUrl('videos/video2.mp4')
  },
  {
    id: 3,
    title: 'Sri Sri Narahari Swamiji',
    tamilTitle: 'ஸ்ரீ ஸ்ரீ நரஹரி சுவாமிஜி',
    description: 'Voices of spiritual strength uniting devotees for the preservation of ancient temple rights and rituals.',
    src: getAssetUrl('videos/video3.mp4')
  },
  {
    id: 4,
    title: 'Sri Sri Narahari Swamiji',
    tamilTitle: 'ஸ்ரீ ஸ்ரீ நரஹரி சுவாமிஜி',
    description: 'Profound message of Dharmic awakening, temple patronage, and civilizational pride across Bharat.',
    src: getAssetUrl('videos/video4.mp4')
  },
  {
    id: 5,
    title: 'Senior Advocate, Mr. Sai deepak',
    tamilTitle: 'மூத்த வழக்கறிஞர் திரு. சாய் தீபக்',
    description: 'Legal defense of sacred traditions, civilizational rights, and constitutional protection for Thiruparankundram Deepathoon.',
    src: getAssetUrl('videos/video5.mp4')
  }
]

export default function HinduLeaders({ onNavigateHome }) {
  const [playingId, setPlayingId] = useState(null)
  const [errorMap, setErrorMap] = useState({})
  const videoRefs = useRef({})

  const handlePlayOverlay = (id) => {
    const video = videoRefs.current[id]
    if (video) {
      if (video.paused) {
        // Pause any other playing video so they do not overlap
        Object.entries(videoRefs.current).forEach(([k, v]) => {
          if (k !== String(id) && v && !v.paused) {
            v.pause()
          }
        })
        video.play().catch(() => {})
        setPlayingId(id)
      } else {
        video.pause()
        setPlayingId(null)
      }
    }
  }

  const handleVideoPlay = (id) => {
    setPlayingId(id)
    Object.entries(videoRefs.current).forEach(([k, v]) => {
      if (k !== String(id) && v && !v.paused) {
        v.pause()
      }
    })
  }

  const handleVideoPause = (id) => {
    if (playingId === id) {
      setPlayingId(null)
    }
  }

  const handleVideoError = (id) => {
    setErrorMap((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section className="hindu-leaders-section" aria-label="Voices of Bharat Video Gallery">
      {/* ── Page Header ── */}
      <div className="hindu-leaders-header">
        <div className="hindu-leaders-back-row">
          <button
            type="button"
            className="hindu-leaders-back-btn"
            onClick={onNavigateHome}
            title="Return to Main Sanctuary"
          >
            ← தீபத்தூண் Sanctuary (Home)
          </button>
        </div>

        <span className="om" aria-hidden="true">ॐ</span>
        <h1 className="hindu-leaders-main-title">Voices of Bharat</h1>
        <p className="hindu-leaders-sub-title">
          பாரதத்தின் குரல்கள் · தர்ம உரை &amp; சனாதன எழுச்சி
        </p>
        <p className="hindu-leaders-tagline">
          Revered Spiritual Gurus, Legal Defenders &amp; Dharmic Leaders Standing for Thiruparankundram Deepam and Sanatana Heritage
        </p>
        <div className="thin-rule" style={{ maxWidth: '280px', margin: '18px auto 36px' }} />
      </div>

      {/* ── 3-Column Responsive Video Grid (Single row on desktop, vertical on mobile) ── */}
      <div className="hindu-leaders-grid">
        {VIDEOS.map((item) => {
          const isPlaying = playingId === item.id
          const hasError = !!errorMap[item.id]

          return (
            <article key={item.id} className="hindu-leader-card">
              {/* Card Header Badge */}
              <div className="hindu-leader-card-badge">
                <span className="card-badge-num">Video {item.id}</span>
              </div>

              {/* Video Player Container (Aspect ratio preserved) */}
              <div className="video-player-wrapper">
                <video
                  ref={(el) => (videoRefs.current[item.id] = el)}
                  className="hindu-leader-video"
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={() => handleVideoPlay(item.id)}
                  onPause={() => handleVideoPause(item.id)}
                  onError={() => handleVideoError(item.id)}
                  key={item.src}
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the HTML5 video element.
                </video>

                {/* Modern Play Button Overlay */}
                {!isPlaying && !hasError && (
                  <button
                    type="button"
                    className="video-play-overlay"
                    onClick={() => handlePlayOverlay(item.id)}
                    aria-label={`Play ${item.title}`}
                    title="Play Video"
                  >
                    <span className="play-overlay-circle">
                      <svg
                        className="play-overlay-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                )}

                {/* Fallback Display if video cannot load */}
                {hasError && (
                  <div className="video-fallback-box">
                    <span className="fallback-icon" aria-hidden="true">⚠️</span>
                    <h4 className="fallback-title">Video Unavailable</h4>
                    <p className="fallback-msg">
                      Unable to stream this video currently. Please try refreshing the page.
                    </p>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="hindu-leader-card-body">
                <h3 className="hindu-leader-card-title">{item.title}</h3>
                <h4 className="hindu-leader-card-tamil">{item.tamilTitle}</h4>
                <p className="hindu-leader-card-desc">{item.description}</p>
              </div>
            </article>
          )
        })}
      </div>

      {/* ── Footer Navigation Back ── */}
      <div className="hindu-leaders-footer-nav">
        <button
          type="button"
          className="hindu-leaders-primary-btn"
          onClick={onNavigateHome}
        >
          🕉 Return to Sacred Deepathoon Sanctuary
        </button>
      </div>
    </section>
  )
}
