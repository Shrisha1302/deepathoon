import { useState, useEffect, useRef } from 'react'

export default function CaptchaModal({ onVerified }) {
  const [captchaCode, setCaptchaCode] = useState('')
  const [userInput, setUserInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const canvasRef = useRef(null)

  // Generate random 5-character alphanumeric captcha
  const generateCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  // Draw distorted captcha image on canvas
  const drawCaptcha = (code) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, '#2b0000')
    bgGrad.addColorStop(1, '#4a0808')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // Noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 + Math.random() * 0.25})`
      ctx.lineWidth = 1 + Math.random() * 1.5
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      )
      ctx.stroke()
    }

    // Noise dots
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255, 244, 79, ${0.2 + Math.random() * 0.4})`
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw characters with random rotation, color and font size
    ctx.textBaseline = 'middle'
    const charSpacing = width / (code.length + 1)

    for (let i = 0; i < code.length; i++) {
      const char = code[i]
      const angle = (Math.random() - 0.5) * 0.45
      const fontSize = Math.floor(24 + Math.random() * 6)
      
      ctx.save()
      ctx.translate((i + 0.8) * charSpacing, height / 2 + (Math.random() - 0.5) * 6)
      ctx.rotate(angle)

      // Golden spiritual hue variations
      const colors = ['#FFD700', '#FFE27A', '#FFA500', '#FFF3B0', '#FFCC00']
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
      ctx.font = `bold ${fontSize}px 'Cinzel', serif`
      ctx.shadowColor = 'rgba(255, 215, 0, 0.4)'
      ctx.shadowBlur = 4
      ctx.fillText(char, 0, 0)
      ctx.restore()
    }
  }

  const refreshCaptcha = () => {
    const newCode = generateCode()
    setCaptchaCode(newCode)
    setUserInput('')
    setErrorMsg('')
    setTimeout(() => drawCaptcha(newCode), 20)
  }

  useEffect(() => {
    refreshCaptcha()
  }, [])

  const handleVerify = (e) => {
    e.preventDefault()
    if (!userInput.trim()) {
      setErrorMsg('Please enter the captcha characters')
      return
    }

    if (userInput.trim().toUpperCase() === captchaCode) {
      onVerified()
    } else {
      setErrorMsg('Incorrect captcha code. Please try again.')
      refreshCaptcha()
    }
  }

  return (
    <div className="captcha-overlay">
      <div className="captcha-card">
        <span className="captcha-om">🕉</span>
        <h2 className="captcha-title">Human Verification</h2>
        <p className="captcha-sub">
          Please verify to enter the sacred Deepathoon sanctuary
        </p>

        <div className="captcha-display-wrap">
          <canvas
            ref={canvasRef}
            width={200}
            height={60}
            className="captcha-canvas"
          />
          <button
            type="button"
            className="captcha-refresh-btn"
            onClick={refreshCaptcha}
            title="Get new code"
          >
            ↻
          </button>
        </div>

        <form onSubmit={handleVerify} className="captcha-form">
          <input
            type="text"
            className="captcha-input"
            placeholder="Enter code shown above"
            maxLength={6}
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value)
              if (errorMsg) setErrorMsg('')
            }}
            autoFocus
          />

          {errorMsg && <p className="captcha-error">{errorMsg}</p>}

          <button type="submit" className="captcha-submit-btn">
            Enter Sanctuary
          </button>
        </form>
      </div>
    </div>
  )
}
