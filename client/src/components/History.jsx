const CARDS = [
  {
    icon: '🏔️',
    title: 'The Sacred Abode',
    text: 'Thiruparankundram, nestled in the granite hills near Madurai, is one of the six sacred Arupadai Veedu of Lord Murugan. This temple, over 2,000 years old, was carved entirely into a natural cave — a marvel of Dravidian architecture where Lord Murugan wed the divine Deivanai after vanquishing Soorapadman.'
  },
  {
    icon: '🪔',
    title: 'Deepathoon — The Pillar of Light',
    text: "The Deepathoon (Deepam = lamp, Thoon = pillar) is a sacred tall brass lamp that has stood within the sanctum for centuries. Tradition holds that its flame has never been extinguished — a symbol of the undying light of divine knowledge and Lord Murugan's unbroken grace."
  },
  {
    icon: '✨',
    title: 'Karthigai Deepam — Festival of Flames',
    text: 'During the Tamil month of Karthigai (Nov–Dec), thousands of lamps light up the hill temple in a breathtaking sea of gold. The ritual lighting of the Deepathoon on this night is believed to wash away lifetimes of karma and bestow moksha upon the devoted pilgrim.'
  },
  {
    icon: '🙏',
    title: 'The Flame as the Soul',
    text: 'In Hindu tradition the lamp (deepam) represents the eternal Atman — the soul — which, like a flame, never truly dies. At Thiruparankundram the Deepathoon embodies Murugan\'s Vel of light piercing darkness. To light it is an act of surrender, carrying the vibration of "Om Saravanabhava."'
  }
]

export default function History() {
  return (
    <section className="history">
      <div className="hist-wrap">
        <h2 className="hist-title">The Sacred Deepathoon</h2>
        <p className="hist-sub">The Eternal Flame of Thiruparankundram</p>
        <div className="thin-rule" style={{ margin: '0 auto 48px', maxWidth: '120px' }} />

        <div className="cards-grid">
          {CARDS.map((c, i) => (
            <div key={i} className="hcard">
              <span className="hcard-icon">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
