export default function Footer() {
  const email = 'Deepam@deepathoon.com'
  return (
    <footer className="footer">
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
