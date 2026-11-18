export default function Blessing({ isLit }) {
  return (
    <div className={`blessing${isLit ? ' show' : ''}`}>
      <div className="bless-box">
        <span className="bless-icon">🪔</span>
        <h2>முருகன் அருள் உங்களோடு இருக்கட்டும்</h2>
        <p>
          <strong>ஓம் சரவணபவ &nbsp;🙏&nbsp; வெற்றிவேல் முருகனுக்கு அரோகரா</strong>
        </p>
      </div>
    </div>
  )
}
