export default function Blessing({ isLit, lang = 'en' }) {
  return (
    <div className={`blessing${isLit ? ' show' : ''}`}>
      <div className="bless-box">
        <span className="bless-icon">🌸</span>
        <h2>
          {lang === 'en'
            ? 'May the Divine Light Bless You'
            : 'தெய்வீக ஒளி உங்கள் வாழ்வில் அருள் பாலிக்கட்டும்'}
        </h2>
        <p>
          {lang === 'en' ? (
            <>
              May Lord Murugan&apos;s eternal flame illuminate your path,<br />
              bringing peace, prosperity, and joy<br />
              to you and your beloved family.<br /><br />
              <strong>Om Saravanabhava &nbsp;🙏&nbsp; Vel Muruga Vel</strong>
            </>
          ) : (
            <>
              முருகப் பெருமானின் நித்திய ஜோதி உங்கள் வாழ்வின் பாதையை ஒளிரச் செய்து,<br />
              உங்களுக்கும் உங்கள் குடும்பத்தினருக்கும் அமைதி, வளம் மற்றும்<br />
              பேரானந்தத்தை என்றென்றும் அருளட்டும்.<br /><br />
              <strong>ஓம் சரவணபவ &nbsp;🙏&nbsp; வெற்றிவேல் முருகனுக்கு அரோகரா</strong>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
