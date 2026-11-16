export default function RealisticTorch() {
  return (
    <div className="user-torch-wrapper">
      {/* Ambient warm fire aura */}
      <div className="user-torch-glow" />

      {/* The User's Uploaded Torch (Isolated Transparent PNG) */}
      <img
        src="images/user_torch.png"
        alt="Sacred Flame Torch"
        className="user-torch-image"
        draggable={false}
      />

      {/* Drag instruction badge */}
      <span className="user-torch-drag-badge">Drag Torch ↑</span>
    </div>
  )
}
