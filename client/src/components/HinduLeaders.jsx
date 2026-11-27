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

const DEFAULT_VIDEOS = [
  {
    id: 1,
    title: 'Hindu Leader Speech 1',
    tamilTitle: 'இந்து தலைவர் உரை 1',
    description: 'Sacred discourses on Dharma, temple heritage, and defending Sanatana traditions at Thiruparankundram.',
    src: getAssetUrl('videos/video1.mp4'),
    fallbackSrcs: [getAssetUrl('videos/leader1.mp4'), getAssetUrl('videos/hindu_leader1.mp4')]
  },
  {
    id: 2,
    title: 'Hindu Leader Speech 2',
    tamilTitle: 'இந்து தலைவர் உரை 2',
    description: 'Voices of spiritual strength uniting devotees for the preservation of ancient temple rights and rituals.',
    src: getAssetUrl('videos/video2.mp4'),
    fallbackSrcs: [getAssetUrl('videos/leader2.mp4'), getAssetUrl('videos/hindu_leader2.mp4')]
  },
  {
    id: 3,
    title: 'Hindu Leader Speech 3',
    tamilTitle: 'இந்து தலைவர் உரை 3',
    description: 'Profound messages of Dharmic awakening, temple patronage, and civilizational pride across Bharat.',
    src: getAssetUrl('videos/video3.mp4'),
    fallbackSrcs: [getAssetUrl('videos/leader3.mp4'), getAssetUrl('videos/hindu_leader3.mp4')]
  }
]

export default function HinduLeaders({ onNavigateHome }) {
  const [videoList, setVideoList] = useState(DEFAULT_VIDEOS)
  const [playingId, setPlayingId] = useState(null)
  const [errorMap, setErrorMap] = useState({})
  const [customPickMap, setCustomPickMap] = useState({})

  const videoRefs = useRef({})
  const fileInputRefs = useRef({})

  const handlePlayOverlay = (id) => {
    const video = videoRefs.current[id]
    if (video) {
      if (video.paused) {
        // Pause any other playing video so they don't play simultaneously
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

  const handleFilePicked = (id, event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create client-side object URL directly from file (no upload services or backend needed)
    const objectUrl = URL.createObjectURL(file)

    setVideoList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              src: objectUrl,
              pickedFileName: file.name
            }
          : item
      )
    )

    setCustomPickMap((prev) => ({ ...prev, [id]: file.name }))
    setErrorMap((prev) => ({ ...prev, [id]: false }))

    // Load newly picked video
    setTimeout(() => {
      const vid = videoRefs.current[id]
      if (vid) {
        vid.load()
      }
    }, 50)
  }

  const triggerPicker = (id) => {
    fileInputRefs.current[id]?.click()
  }

  const handleResetVideo = (id) => {
    const defaultItem = DEFAULT_VIDEOS.find((v) => v.id === id)
    if (!defaultItem) return

    setVideoList((prev) =>
      prev.map((item) => (item.id === id ? { ...defaultItem } : item))
    )
    setCustomPickMap((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
    setErrorMap((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })

    setTimeout(() => {
      const vid = videoRefs.current[id]
      if (vid) {
        vid.load()
      }
    }, 50)
  }

  return (
    <section className="hindu-leaders-section" aria-label="Hindu Leaders Video Gallery">
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
        <h1 className="hindu-leaders-main-title">Hindu Leaders</h1>
        <p className="hindu-leaders-sub-title">
          இந்து தலைவர்கள் · உரை &amp; தர்ம குரல்
        </p>
        <p className="hindu-leaders-tagline">
          Voices of Revered Gurus, Saints &amp; Dharmic Leaders Standing for Thiruparankundram and Sanatana Heritage
        </p>
        <div className="thin-rule" style={{ maxWidth: '280px', margin: '18px auto 36px' }} />
      </div>

      {/* ── Video Picker Quick Notice ── */}
      <div className="hindu-leaders-picker-bar">
        <div className="picker-bar-left">
          <span className="picker-bar-icon" aria-hidden="true">🎬</span>
          <span className="picker-bar-text">
            <strong>Video Gallery:</strong> 3 featured speeches. You can also pick local video files directly using each card&apos;s video picker.
          </span>
        </div>
      </div>

      {/* ── 3-Column Video Grid (Single row on desktop, vertical on mobile) ── */}
      <div className="hindu-leaders-grid">
        {videoList.map((item) => {
          const isPlaying = playingId === item.id
          const hasError = !!errorMap[item.id]
          const isCustom = !!customPickMap[item.id]

          return (
            <article key={item.id} className="hindu-leader-card">
              {/* Card Header Badge */}
              <div className="hindu-leader-card-badge">
                <span className="card-badge-num">Video {item.id}</span>
                {isCustom && <span className="card-badge-custom">Local Picked</span>}
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
                  {item.fallbackSrcs?.map((fb, idx) => (
                    <source key={idx} src={fb} type="video/mp4" />
                  ))}
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
                    <h4 className="fallback-title">Video Not Loaded</h4>
                    <p className="fallback-msg">
                      Place <code>video{item.id}.mp4</code> inside <code>client/public/videos/</code> or pick any video file from your computer below.
                    </p>
                    <button
                      type="button"
                      className="fallback-picker-btn"
                      onClick={() => triggerPicker(item.id)}
                    >
                      📁 Pick Video From Computer
                    </button>
                  </div>
                )}
              </div>

              {/* Card Details & Actions */}
              <div className="hindu-leader-card-body">
                <h3 className="hindu-leader-card-title">{item.title}</h3>
                <h4 className="hindu-leader-card-tamil">{item.tamilTitle}</h4>
                <p className="hindu-leader-card-desc">{item.description}</p>

                {/* Local Video Picker Control */}
                <div className="hindu-leader-picker-actions">
                  <input
                    ref={(el) => (fileInputRefs.current[item.id] = el)}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                    className="hidden-file-input"
                    onChange={(e) => handleFilePicked(item.id, e)}
                    aria-label={`Select local video file for Video ${item.id}`}
                  />

                  <button
                    type="button"
                    className="picker-action-btn"
                    onClick={() => triggerPicker(item.id)}
                    title="Pick video from your computer without uploading"
                  >
                    <span aria-hidden="true">📁</span> {isCustom ? 'Change Video' : 'Pick Video'}
                  </button>

                  {isCustom && (
                    <button
                      type="button"
                      className="picker-reset-btn"
                      onClick={() => handleResetVideo(item.id)}
                      title="Reset to default video path"
                    >
                      ↺ Reset
                    </button>
                  )}
                </div>

                {isCustom && (
                  <p className="picker-filename">
                    Loaded: <span>{customPickMap[item.id]}</span>
                  </p>
                )}
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
