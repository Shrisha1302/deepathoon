export default function Footer({ lang = 'en' }) {
  const email = 'creamhappy1234@gmail.com'

  return (
    <footer className="footer">
      <div className="contact-section">
        <span className="contact-label">
          {lang === 'en' ? 'Contact Us:' : 'தொடர்புக்கு:'}
        </span>
        {/* Strictly static non-clickable text */}
        <span className="contact-email-text">{email}</span>
      </div>
      <p className="footer-text">
        {lang === 'en'
          ? '🕉  Vel Muruga Vel · Om Saravanabhava · Thiruparankundram  🕉'
          : '🕉  வெற்றிவேல் முருகனுக்கு அரோகரா · ஓம் சரவணபவ · திருப்பரங்குன்றம்  🕉'}
      </p>
    </footer>
  )
}
