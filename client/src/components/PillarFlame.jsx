import { useEffect, useRef } from 'react'

export default function PillarFlame() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationId
    const particles = []
    const width = canvas.width
    const height = canvas.height
    const emitterX = width / 2
    const emitterY = height - 8 // sits right on the stone top

    // Natural flame particle generator
    function addParticle() {
      // Modest, refined sacred flame footprint
      const spreadX = (Math.random() - 0.5) * 8
      particles.push({
        x: emitterX + spreadX,
        y: emitterY,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(1.2 + Math.random() * 1.5), // gentle upward buoyancy
        size: 5 + Math.random() * 3,
        life: 1.0,
        decay: 0.032 + Math.random() * 0.025,
        wobbleSpeed: 2 + Math.random() * 3,
        wobbleOffset: Math.random() * Math.PI * 2
      })
    }

    let time = 0
    function animate() {
      time += 0.05
      ctx.clearRect(0, 0, width, height)

      // Add 2-3 new flame particles each frame for dense organic body
      if (particles.length < 55) {
        addParticle()
        addParticle()
      }

      // Additive blending for realistic thermodynamic glow
      ctx.globalCompositeOperation = 'screen'

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx + Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 0.35
        p.y += p.vy
        p.size *= 0.965 // tapers gently as flame rises
        p.life -= p.decay

        if (p.life <= 0 || p.size <= 0.5) {
          particles.splice(i, 1)
          continue
        }

        // Color transition: White core -> Gold -> Warm Orange -> Saffron tip
        let r, g, b, alpha
        const progress = 1.0 - p.life

        if (progress < 0.25) {
          // White-hot base
          r = 255
          g = Math.floor(250 - progress * 150)
          b = Math.floor(210 - progress * 400)
          alpha = p.life * 0.85
        } else if (progress < 0.65) {
          // Pure golden-orange heart
          r = 255
          g = Math.floor(180 - (progress - 0.25) * 200)
          b = 10
          alpha = p.life * 0.75
        } else {
          // Saffron & crimson tip
          r = Math.floor(245 - (progress - 0.65) * 150)
          g = Math.floor(80 - (progress - 0.65) * 160)
          b = 0
          alpha = p.life * 0.5
        }

        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        radGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
        radGrad.addColorStop(0.5, `rgba(${r}, ${Math.max(0, g - 20)}, ${b}, ${alpha * 0.6})`)
        radGrad.addColorStop(1, `rgba(${r}, 0, 0, 0)`)

        ctx.fillStyle = radGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="canvas-pillar-flame-wrapper">
      {/* Soft warm light cast onto the stone rim */}
      <div className="pillar-stone-rim-light" />
      {/* Real-time organic flame simulation */}
      <canvas
        ref={canvasRef}
        width={64}
        height={72}
        className="pillar-flame-canvas"
      />
    </div>
  )
}
