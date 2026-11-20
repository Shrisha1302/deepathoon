import { useState, useEffect, useRef } from 'react'

const MULTILINGUAL_ITEMS = [
  {
    code: 'hi',
    name: 'हिन्दी',
    langLabel: 'Hindi',
    heading: 'दीप प्रज्वलित करना',
    body: 'कार्तिगई दीपम (Karthigai Deepam) मुख्य रूप से तमिलनाडु और दक्षिण भारत में मनाया जाने वाला एक प्राचीन प्रकाश पर्व है, जो तमिल पंचांग के कार्तिगई माह की पूर्णिमा और कृत्तिका नक्षत्र के संयोग पर (आमतौर पर नवंबर-दिसंबर में) आता है।',
    fontClass: 'font-hi'
  },
  {
    code: 'fr',
    name: 'Français',
    langLabel: 'French',
    heading: 'Allumage de la Lampe Sacrée',
    body: "Karthigai Deepam est une fête des lumières ancestrale célébrée principalement au Tamil Nadu et dans le sud de l'Inde, lors de la pleine lune du mois tamoul de Karthigai sous la constellation de Krittika (généralement en novembre-décembre).",
    fontClass: 'font-fr'
  },
  {
    code: 'si',
    name: 'සිංහල',
    langLabel: 'Sinhala',
    heading: 'පහන දැල්වීම',
    body: 'කාර්තිගෙයි දීපම් (Karthigai Deepam) යනු ප්‍රධාන වශයෙන් තමිල්නාඩුවේ සහ දකුණු ඉන්දියාවේ සමරනු லබන පුරාණ ආලෝක උත්සවයකි. එය දෙමළ දින දර්ශනයේ කාර්තිගෙයි මාසයේ පුර පසළොස්වක පොහොය සහ කෘත්තිකා නැකත සම්පාත වන අවස්ථාවේ (සාමාන්‍යයෙන් නොවැම්බර්-දෙසැම්බර් මාසවල) පැවැත්වේ.',
    fontClass: 'font-si'
  },
  {
    code: 'de',
    name: 'Deutsch',
    langLabel: 'German',
    heading: 'Das Entzünden der Heiligen Lampe',
    body: 'Karthigai Deepam ist ein uraltes Lichterfest, das vor allem in Tamil Nadu und Südindien gefeiert wird. Es findet beim Zusammentreffen des Vollmonds im tamilischen Monat Karthigai mit der Krittika-Konstellation statt (üblicherweise im November–Dezember).',
    fontClass: 'font-de'
  }
]

export default function MultilingualIntro() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const timerRef = useRef(null)

  const activeItem = MULTILINGUAL_ITEMS[currentIndex]

  // Switch to next item with a gentle fade
  const goToIndex = (newIdx) => {
    if (newIdx === currentIndex) return
    setIsFading(true)
    setTimeout(() => {
      setCurrentIndex(newIdx)
      setIsFading(false)
    }, 220)
  }

  // Auto-rotate every 8 seconds, pausing immediately when hovered
  useEffect(() => {
    if (isHovered) return

    timerRef.current = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MULTILINGUAL_ITEMS.length)
        setIsFading(false)
      }, 220)
    }, 8000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isHovered])

  return (
    <div
      className="multilingual-intro-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Top Header Row with language tabs and pause indicator */}
      <div className="multilingual-top-bar">
        <div className="multilingual-tabs">
          {MULTILINGUAL_ITEMS.map((item, idx) => (
            <button
              key={item.code}
              type="button"
              className={`multilingual-tab-btn ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goToIndex(idx)}
              title={`Switch to ${item.langLabel}`}
            >
              <span className="tab-native-name">{item.name}</span>
            </button>
          ))}
        </div>

        <div className="multilingual-status-pill">
          {isHovered ? (
            <span className="status-paused">⏸ Paused</span>
          ) : (
            <span className="status-timer">⏱ 8s Auto-rotate</span>
          )}
        </div>
      </div>

      {/* Dynamic Content Area with smooth fade */}
      <div className={`multilingual-content-area ${isFading ? 'fade-out' : 'fade-in'}`}>
        <div className="multilingual-heading-wrap">
          <span className="multilingual-deepam-icon">🪔</span>
          <h3 className={`multilingual-heading ${activeItem.fontClass}`}>
            {activeItem.heading}
          </h3>
        </div>

        <p className={`multilingual-body ${activeItem.fontClass}`}>
          {activeItem.body}
        </p>
      </div>

      {/* Progress animation line that pauses on hover */}
      <div className="multilingual-progress-track">
        <div
          key={currentIndex}
          className={`multilingual-progress-bar ${isHovered ? 'paused' : 'running'}`}
        />
      </div>
    </div>
  )
}
