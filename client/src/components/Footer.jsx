import DevoteeConnect from './DevoteeConnect'

export default function Footer({ isLit }) {
  const email = 'Deepam@deepathoon.com'

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      {/* Devotee Email Collection directly into Google Sheets */}
      <DevoteeConnect isLit={isLit} />

      <div className="contact-section">
        <span className="contact-label">Contact Us:</span>
        <span className="contact-email-text">{email}</span>
      </div>
      <p className="footer-text">
        ॐ&nbsp; Vel Muruga Vel &middot; Om Saravanabhava &middot; Thiruparankundram &nbsp;ॐ
      </p>

      {/* Back to top widget - compact at right corner */}
      <div
        className="back-to-top-container"
        onClick={scrollToTop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            scrollToTop()
          }
        }}
        title="Back to Top"
        aria-label="Back to Top"
      >
        <span className="back-to-top-label">BACK TO TOP</span>
        <button
          type="button"
          className="back-to-top-circle-btn"
          aria-label="Scroll to top"
          tabIndex={-1}
        >
          <svg
            className="back-to-top-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </footer>
  )
}
