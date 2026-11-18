export default function Header({ subLang }) {
  return (
    <header className="header">
      <span className="om" aria-hidden="true">🕉</span>
      {/* Title is strictly in Tamil only */}
      <h1 className="site-title">தீபத்தூண்</h1>
      {/* Subtitle softly cross-fades between EN and TA every 4s — no bounce, no shake */}
      <div className="site-sub-wrap">
        <p className={`site-sub sub-slide ${subLang === 'en' ? 'sub-visible' : 'sub-hidden'}`}>
          Thiruparankundram · Sacred Abode of Lord Murugan
        </p>
        <p className={`site-sub sub-slide ${subLang === 'ta' ? 'sub-visible' : 'sub-hidden'}`}>
          திருப்பரங்குன்றம் · அருள்மிகு சுப்பிரமணிய சுவாமி திருக்கோயில்
        </p>
      </div>
      <div className="thin-rule" />
    </header>
  )
}
