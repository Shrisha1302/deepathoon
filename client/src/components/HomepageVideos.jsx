import { useRef, useState } from 'react'

/**
 * Resolves static asset paths respecting Vite's base config (e.g. './')
 */
function getAssetUrl(relPath) {
  const base = import.meta.env.BASE_URL || './'
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  const cleanPath = relPath.startsWith('/') ? relPath.slice(1) : relPath
  return `${cleanBase}${cleanPath}`
}

const HOME_VIDEOS = [
  {
    id: 1,
    title: 'Thiruparankundram Deepam & Sacred Hill',
    tamilTitle: 'திருப்பரங்குன்றம் தீபத்தூண் தீபக் காட்சி',
    src: getAssetUrl('videos/homepage-video.mp4')
  },
  {
    id: 2,
    title: 'Sacred Hilltop Rituals & Devotee Gathering',
    tamilTitle: 'பக்தர்கள் சங்கமம் & மலைக்கோயில் உற்சவம்',
    src: getAssetUrl('videos/homepage-video2.mp4')
  }
]

export default function HomepageVideos() {
  const [playingId, setPlayingId] = useState(null)
  const videoRefs = useRef({})

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

  return (
    <section className="homepage-videos-section" aria-label="Sacred Deepam Videos">
      <div className="homepage-videos-grid">
        {HOME_VIDEOS.map((item) => (
          <article key={item.id} className="homepage-video-card">
            <div className="homepage-video-badge">
              <span className="hp-badge-icon" aria-hidden="true">🪔</span>
              <span className="hp-badge-title">{item.title}</span>
            </div>

            <div className="homepage-video-wrapper">
              <video
                ref={(el) => (videoRefs.current[item.id] = el)}
                className="homepage-video-player"
                controls
                playsInline
                preload="metadata"
                onPlay={() => handleVideoPlay(item.id)}
                onPause={() => handleVideoPause(item.id)}
              >
                <source src={item.src} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>

            <div className="homepage-video-footer">
              <span className="homepage-video-tamil">{item.tamilTitle}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
