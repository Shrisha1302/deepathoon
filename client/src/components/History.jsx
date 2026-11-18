const CARDS = [
  {
    icon: '🏔️',
    titleEn: 'The Sacred Abode',
    titleTa: 'முதல் படைவீடு',
    textEn: 'Thiruparankundram, nestled in the granite hills near Madurai, is one of the six sacred Arupadai Veedu of Lord Murugan. This temple, over 2,000 years old, was carved entirely into a natural cave — a marvel of Dravidian architecture where Lord Murugan wed the divine Deivanai after vanquishing Soorapadman.',
    textTa: 'மதுரை மாநகரின் அருகில் கம்பீரமாக அமைந்துள்ள திருப்பரங்குன்றம், முருகப்பெருமானின் ஆறுபடை வீடுகளில் முதன்மையான திருத்தலமாகும். இரண்டாயிரம் ஆண்டுகளுக்கும் பழமையான இக்குடைவரைக் கோயில், சூரபத்மனை வென்ற பின்னர் முருகன் தெய்வானையைத் திருமணம் புரிந்த திவ்வியத் தலமாகும்.'
  },
  {
    icon: '🪔',
    titleEn: 'Deepathoon — The Pillar of Light',
    titleTa: 'தீபத்தூண் — அழியா ஜோதி',
    textEn: "The Deepathoon (Deepam = lamp, Thoon = pillar) is a sacred stone pillar that has stood atop the hill for centuries. Tradition holds that its flame has never been extinguished — a symbol of the undying light of divine knowledge and Lord Murugan's unbroken grace.",
    textTa: 'தீபத்தூண் (தீபம் = விளக்கு, தூண் = கம்பம்) திருப்பரங்குன்ற மலையின் உச்சியில் நூற்றாண்டுகளாக கம்பீரமாக விளங்கும் புனிதக் கற்றூண். இதன் சுடர் என்றும் அணையாத மெய்ஞானத்தின் குறியீடாகவும், முருகனின் மாறா அருளின் சின்னமாகவும் போற்றப்படுகிறது.'
  },
  {
    icon: '✨',
    titleEn: 'Karthigai Deepam — Festival of Flames',
    titleTa: 'கார்த்திகைத் தீபத் திருவிழா',
    textEn: 'During the Tamil month of Karthigai (Nov–Dec), thousands of oil lamps light up the hill temple in a breathtaking sea of gold. The ritual lighting of the Deepathoon on this auspicious night is believed to wash away lifetimes of karma and bestow moksha upon devotees.',
    textTa: 'கார்த்திகை மாத பௌர்ணமியில் திருப்பரங்குன்ற மலையெங்கும் லட்சக்கணக்கான திருவிளக்குகள் பொன்னொளிர ஏற்றப்படுகின்றன. இந்நாளில் தீபத்தூணில் மகா தீபம் ஏற்றுவது பவவினைகளை நீக்கி, சகல நன்மைகளையும் முக்தியையும் அருளும் என்பது ஐதீகம்.'
  },
  {
    icon: '🙏',
    titleEn: 'The Flame as the Soul',
    titleTa: 'ஆத்ம ஜோதி தத்துவம்',
    textEn: 'In Hindu tradition the lamp (deepam) represents the eternal Atman — the soul — which, like a flame, never truly dies. At Thiruparankundram the Deepathoon embodies Murugan\'s Vel of light piercing darkness. To light it is an act of sacred surrender, carrying the vibration of "Om Saravanabhava."',
    textTa: 'இந்து தத்துவத்தில் தீபம் என்பது அழியாத ஆத்மாவைக் குறிக்கிறது. திருப்பரங்குன்றத்தில் எரியும் தீபத்தூண், அஞ்ஞான இருளைக் கிழிக்கும் முருகனின் ஞானவேலின் ஒளிப்பிழம்பாகத் திகழ்கிறது. இதனை ஏற்றுவது பக்தியின் பரிபூரண சரணாகதியாகும்.'
  }
]

export default function History({ lang = 'en' }) {
  return (
    <section className="history">
      <div className="hist-wrap">
        <h2 className="hist-title">
          {lang === 'en' ? 'The Sacred Deepathoon' : 'புனித தீபத்தூண் வரலாறு'}
        </h2>
        <p className="hist-sub">
          {lang === 'en'
            ? 'The Eternal Flame of Thiruparankundram'
            : 'திருப்பரங்குன்றத்தின் அழியா திருவிளக்கு'}
        </p>
        <div className="thin-rule" style={{ margin: '0 auto 48px', maxWidth: '120px' }} />

        <div className="cards-grid">
          {CARDS.map((c, i) => (
            <div key={i} className="hcard">
              <span className="hcard-icon">{c.icon}</span>
              <h3>{lang === 'en' ? c.titleEn : c.titleTa}</h3>
              <p>{lang === 'en' ? c.textEn : c.textTa}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
