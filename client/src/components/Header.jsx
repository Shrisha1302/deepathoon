export default function Header({ lang }) {
  return (
    <header className="header">
      <span className="om" aria-hidden="true">🕉</span>
      {/* Title is strictly in Tamil only: தீபத்தூண் */}
      <h1 className="site-title">தீபத்தூண்</h1>
      <p className="site-sub">
        {lang === 'en'
          ? 'Thiruparankundram · Sacred Abode of Lord Murugan'
          : 'திருப்பரங்குன்றம் · அருள்மிகு சுப்பிரமணிய சுவாமி திருக்கோயில்'}
      </p>
      <div className="thin-rule" />
    </header>
  )
}
