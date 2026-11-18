export default function RealisticTorch({ torchLang }) {
  return (
    <div className="user-torch-wrapper">
      <div className="user-torch-glow" />
      <img
        src="images/user_torch.png"
        alt="Sacred Flame Torch"
        className="user-torch-image"
        draggable={false}
      />
      {/* Drag badge alternates every 2s between English and Tamil */}
      <span className="user-torch-drag-badge">
        {torchLang === 'en' ? 'Drag Torch ↑' : 'இழுக்கவும் ↑'}
      </span>
    </div>
  )
}
