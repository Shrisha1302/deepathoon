export default function LiveStream() {
  return (
    <section className="live-stream-section" aria-label="Thiruparankundram Deepam Live Streams">
      <div className="live-streams-grid">
        {/* Live Channel 1 */}
        <div className="live-stream-card">
          <div className="live-stream-badge-row">
            <span className="live-pulse-dot" />
            <span className="live-badge-text">LIVE BROADCAST 1 &middot; நேரலை 1</span>
          </div>

          <div className="live-stream-video-container">
            <iframe
              src="https://www.youtube.com/embed/-7kEwAdzgGQ?autoplay=1&mute=1&playsinline=1&rel=0"
              title="Thiruparankundram Deepam Live Broadcast 1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="live-stream-iframe"
            />
          </div>

          <div className="live-stream-footer">
            <span className="live-stream-title">
              🔴 நேரலை: திருப்பரங்குன்றம் தீபத்தூண் தீபம் &middot; Live Feed 1
            </span>
            <a
              href="https://www.youtube.com/watch?v=-7kEwAdzgGQ"
              target="_blank"
              rel="noopener noreferrer"
              className="live-external-link"
              title="Watch directly on YouTube"
            >
              YouTube ↗
            </a>
          </div>
        </div>

        {/* Live Channel 2 (Tamil Live Channel) */}
        <div className="live-stream-card">
          <div className="live-stream-badge-row">
            <span className="live-pulse-dot" />
            <span className="live-badge-text">TAMIL LIVE CHANNEL &middot; தமிழ் நேரலை 2</span>
          </div>

          <div className="live-stream-video-container">
            <iframe
              src="https://www.youtube.com/embed/R9Hd8rlxrZo?autoplay=0&playsinline=1&rel=0"
              title="Thiruparankundram Tamil Live Channel 2"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="live-stream-iframe"
            />
          </div>

          <div className="live-stream-footer">
            <span className="live-stream-title">
              🔴 நேரலை: தமிழ் நேரலை ஒளிபரப்பு &middot; Tamil Live Feed 2
            </span>
            <a
              href="https://www.youtube.com/watch?v=R9Hd8rlxrZo"
              target="_blank"
              rel="noopener noreferrer"
              className="live-external-link"
              title="Watch directly on YouTube"
            >
              YouTube ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
