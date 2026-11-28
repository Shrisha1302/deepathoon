function getAssetUrl(relPath) {
  const base = import.meta.env.BASE_URL || './'
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  const cleanPath = relPath.startsWith('/') ? relPath.slice(1) : relPath
  return `${cleanBase}${cleanPath}`
}

export default function HomepageVideo() {
  return (
    <section className="homepage-video-section" aria-label="Thiruparankundram Deepathoon Video">
      <div className="homepage-video-card">
        <div className="homepage-video-header">
          <span className="om" aria-hidden="true">ॐ</span>
          <h3 className="homepage-video-title">
            திருப்பரங்குன்றம் தீபத்தூண் &middot; Sacred Deepathoon Video
          </h3>
        </div>
        <div className="homepage-video-wrapper">
          <video
            controls
            playsInline
            preload="metadata"
            className="homepage-video-player"
            src={getAssetUrl('videos/homepage-video.mp4')}
          >
            Your browser does not support the HTML5 video element.
          </video>
        </div>
      </div>
    </section>
  )
}
