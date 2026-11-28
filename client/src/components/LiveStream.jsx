export default function LiveStream() {
  return (
    <section className="live-stream-section" aria-label="Thiruparankundram Deepam Live Stream">
      <div className="live-stream-card">
        {/* Live Indicator Header */}
        <div className="live-stream-badge-row">
          <span className="live-pulse-dot" />
          <span className="live-badge-text">LIVE BROADCAST &middot; நேரலை</span>
        </div>

        {/* Responsive 16:9 Live Video Player */}
        <div className="live-stream-video-container">
          <iframe
            src="https://www.youtube-nocookie.com/embed/bQenaTqrKNU?autoplay=1&mute=1&playsinline=1&rel=0"
            title="Thiruparankundram Deepam Live Broadcast"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="live-stream-iframe"
          />
        </div>

        {/* Sacred Footer Caption */}
        <div className="live-stream-footer">
          <span className="live-stream-title">
            🔴 நேரலை: திருப்பரங்குன்றம் தீபத்தூண் தீபம் &middot; Thiruparankundram Deepam Live
          </span>
        </div>
      </div>
    </section>
  )
}
