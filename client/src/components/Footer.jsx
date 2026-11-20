export default function Footer() {
  const email = 'Deepam@deepathoon.com'

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <button
        type="button"
        onClick={scrollToTop}
        className="back-to-top-btn"
        aria-label="Back to Top"
        title="Back to Top"
      >
        <span className="back-to-top-icon">▲</span>
        <span className="back-to-top-text">Back to Top &middot; மேலே செல்லவும்</span>
      </button>

      <div className="contact-section">
        <span className="contact-label">Contact Us:</span>
        <span className="contact-email-text">{email}</span>
      </div>
      <p className="footer-text">
        ॐ&nbsp; Vel Muruga Vel &middot; Om Saravanabhava &middot; Thiruparankundram &nbsp;ॐ
      </p>
    </footer>
  )
}
