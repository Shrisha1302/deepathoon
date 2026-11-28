function getAssetUrl(relPath) {
  const base = import.meta.env.BASE_URL || './'
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  const cleanPath = relPath.startsWith('/') ? relPath.slice(1) : relPath
  return `${cleanBase}${cleanPath}`
}

export default function CourtVideos() {
  return (
    <section className="court-videos-section" aria-label="Court Reference Videos">
      <div className="court-videos-grid">
        {/* Court Video 1 */}
        <div className="court-video-card">
          <div className="court-video-header">
            <span className="court-video-icon" aria-hidden="true">⚖️</span>
            <h4 className="court-video-card-title">நீதிமன்ற உத்தரவு பார்வை 1</h4>
          </div>
          <div className="court-video-wrapper">
            <video
              controls
              playsInline
              preload="metadata"
              className="court-video-player"
              src={getAssetUrl('videos/abovecourtvideo1.mp4')}
            >
              Your browser does not support HTML5 video playback.
            </video>
          </div>
        </div>

        {/* Court Video 2 */}
        <div className="court-video-card">
          <div className="court-video-header">
            <span className="court-video-icon" aria-hidden="true">⚖️</span>
            <h4 className="court-video-card-title">நீதிமன்ற உத்தரவு பார்வை 2</h4>
          </div>
          <div className="court-video-wrapper">
            <video
              controls
              playsInline
              preload="metadata"
              className="court-video-player"
              src={getAssetUrl('videos/abovecourtvideo2.mp4')}
            >
              Your browser does not support HTML5 video playback.
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
