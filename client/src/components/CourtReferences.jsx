export default function CourtReferences() {
  const references = [
    {
      source: 'The Hindu',
      tag: 'Supreme Court Live Updates',
      date: 'Published on 28-11-2026',
      title: 'Thiruparankundram Deepam Issue: Supreme Court Contempt, Tamil Nadu Karthigai Deepam Deepathoon Row Live Updates',
      url: 'https://www.thehindu.com/news/national/tamil-nadu/thiruparankundram-deepam-issue-supreme-court-contempt-tamil-nadu-karthigai-deepam-deepathoon-row-live-updates-november-28-2026/article71753437.ece'
    },
    {
      source: 'LiveLaw',
      tag: 'Supreme Court Order',
      title: 'Thiruparankundram Row: Supreme Court Orders Lamp Lighting At Deepathoon Tomorrow, Issues Contempt Notice To TN Authorities',
      url: 'https://www.livelaw.in/top-stories/thiruparankundram-row-supreme-court-orders-lamp-lighting-at-deepathoon-tomorrow-issues-contempt-notice-to-tn-authorities-560277'
    },
    {
      source: 'LiveLaw',
      tag: 'Supreme Court',
      title: 'Thiruparankundram Hill: Supreme Court Stays Madras HC Judgment, Allows Karthigai Lamp Lighting at Deepathoon on Nov 24',
      url: 'https://www.livelaw.in/top-stories/thiruparankundram-hill-supreme-court-stays-madras-hc-judgment-allows-karthigai-lamp-lighting-at-deepathoon-on-nov-24-559296'
    },
    {
      source: 'Law Chakra',
      tag: 'Legal Hearing',
      title: 'Supreme Court Proceedings & Arguments on Thiruparankundram Deepathoon',
      url: 'https://lawchakra.in/supreme-court/thiruparankundram-deepathoon/'
    },
    {
      source: 'CaseMine',
      tag: 'Judicial Commentary',
      title: 'The Deepathoon Doctrine: Madras High Court Mandates Temple’s Duty to Assert Property Rights Through Karthigai Deepam Rituals at Thirupparankundram',
      url: 'https://www.casemine.com/commentary/in/-the-deepathoon-doctrine%3A-madras-high-court-mandates-temple%E2%80%99s-duty-to-assert-property-rights-through-karthigai-deepam-rituals-at-thirupparankundram-/view'
    },
    {
      source: 'Times of India',
      tag: 'High Court Ruling',
      title: 'Wakf Has No Locus Standi: Madras HC Upholds Order of Single Bench to Light Deepam at the Deepathoon atop Thiruparankundram Hill',
      url: 'https://timesofindia.indiatimes.com/city/chennai/wakf-has-no-locus-standi-madras-hc-upholds-order-of-single-bench-to-light-deepam-at-the-deepathoon-atop-thiruparankundram-hill/amp_articleshow/126367820.cms'
    },
    {
      source: 'The Commune',
      tag: 'High Court Order',
      title: '“Deepathoon Is Temple Property, Lighting Lamp Atop Hill Is Tamil Tradition”: What Justice G.R. Swaminathan Told In His Order On Thiruparankundram',
      url: 'https://thecommunemag.com/deepathoon-is-temple-property-dargah-management-hasnt-demonstrated-how-theyll-be-affected-lighting-lamp-atop-hill-is-tamil-tradition-what-justice-gr-swaminathan-told-in-his-order-on-thirupa/'
    },
    {
      source: 'Indian Masterminds',
      tag: 'Judiciary Report',
      title: 'Madras High Court: Thiruparankundram Hill Deepathoon Dispute & Survey Stone Lamp Ruling',
      url: 'https://indianmasterminds.com/news/judiciary/madras-high-court-thiruparankundram-hill-deepathoon-dispute-survey-stone-lamp-174868/'
    },
    {
      source: 'LawBeat',
      tag: 'High Court Order',
      title: "Madras High Court Allows Deepam Atop Thiruparankundram Hill's Ancient Pillar, Rejects Dargah Claim",
      url: 'https://lawbeat.in/amp/news-updates/madras-high-court-allows-deepam-atop-thiruparankundram-hills-ancient-pillar-rejects-dargah-claim-1544883'
    },
    {
      source: 'ShreeTV Live',
      tag: 'Live Broadcast',
      title: '🔴 நேரலை: ஸ்ரீதேவி பூதேவி சமேத ஸ்ரீ கோவிந்தராஜப்பெருமாள் கோவிலில் தீபத்தூணில் தீபம்',
      url: 'https://www.youtube.com/live/9jDOEbsoVLg?si=iK0256sRjR37WPdy'
    }
  ]

  return (
    <div className="court-references-wrap">
      <div className="court-references-card">
        <div className="court-references-header">
          <span className="court-scales-icon" aria-hidden="true">⚖️</span>
          <h3 className="court-references-title">Court References</h3>
        </div>
        <p className="court-references-desc">
          Official court judgments, legal proceedings &amp; public news coverage on the Thiruparankundram Deepathoon:
        </p>

        <div className="court-references-list">
          {references.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="court-ref-item"
            >
              <div className="court-ref-meta">
                <span className="court-ref-source">{item.source}</span>
                <span className="court-ref-tag">{item.tag}</span>
                {item.date && <span className="court-ref-date">{item.date}</span>}
              </div>
              <div className="court-ref-title-row">
                <span className="court-ref-title">{item.title}</span>
                <span className="court-ref-arrow" aria-hidden="true">↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
