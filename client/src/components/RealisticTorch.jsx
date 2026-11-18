export default function RealisticTorch({ lang = 'en' }) {
  return (
    <div className="user-torch-wrapper">
      {/* Ambient warm fire aura */}
      <div className="user-torch-glow" />

      {/* The User's Uploaded Torch with smaller, proportional flame */}
      <img
        src="images/user_torch.png"
        alt="Sacred Flame Torch"
        className="user-torch-image"
        draggable={false}
      />

      {/* Drag instruction badge in English & Tamil */}
      <span className="user-torch-drag-badge">
        {lang === 'en' ? 'Drag Torch ↑' : 'இழுக்கவும் ↑'}
      </span>
    </div>
  )
}
