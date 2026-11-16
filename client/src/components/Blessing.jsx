export default function Blessing({ isLit }) {
  return (
    <div className={`blessing${isLit ? ' show' : ''}`}>
      <div className="bless-box">
        <span className="bless-icon">🌸</span>
        <h2>May the Divine Light Bless You</h2>
        <p>
          May Lord Murugan&apos;s eternal flame illuminate your path,<br />
          bringing peace, prosperity, and joy<br />
          to you and your beloved family.<br /><br />
          <strong>Om Saravanabhava &nbsp;🙏&nbsp; Vel Muruga Vel</strong>
        </p>
      </div>
    </div>
  )
}
