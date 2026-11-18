import { useRef, useEffect, useState, useCallback } from 'react'
import Blessing from './Blessing'
import RealisticTorch from './RealisticTorch'
import PillarFlame from './PillarFlame'

export default function LampScene({ isLit, onLampLit, torchLang = 'en' }) {
  const torchRef     = useRef(null)
  const pillarTopRef = useRef(null)
  const canvasRef    = useRef(null)
  const stageRef     = useRef(null)
  const audioRef     = useRef(null)
  const dragging     = useRef(false)
  const off          = useRef({ x: 0, y: 0 })
  const parts        = useRef([])
  const rafId        = useRef(null)
  const [ready, setReady] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  // Place torch bottom-left on desktop, bottom-right on mobile so pillar is clear
  useEffect(() => {
    function place() {
      if (!torchRef.current) return
      const isMobile = window.innerWidth <= 600
      if (isMobile) {
        torchRef.current.style.left = (window.innerWidth - 75) + 'px'
        torchRef.current.style.top  = (window.innerHeight - 150) + 'px'
      } else {
        torchRef.current.style.left = '45px'
        torchRef.current.style.top  = (window.innerHeight - 220) + 'px'
      }
      setReady(true)
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [])

  // Canvas size sync for brief particle burst
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const resize = () => {
      c.width = window.innerWidth
      c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Play audio when lamp is lit
  const playSacredAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.volume = 0.85
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(err => console.log('Audio autoplay prevented:', err))
    }
  }

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play()
      setIsPlayingAudio(true)
    } else {
      audioRef.current.pause()
      setIsPlayingAudio(false)
    }
  }

  const startDrag = useCallback((cx, cy) => {
    if (isLit || !torchRef.current) return
    dragging.current = true
    const r = torchRef.current.getBoundingClientRect()
    off.current = { x: cx - r.left, y: cy - r.top }
    torchRef.current.style.transition = 'none'
    torchRef.current.style.zIndex     = '500'
  }, [isLit])

  const moveDrag = useCallback((cx, cy) => {
    if (!dragging.current || !torchRef.current) return
    torchRef.current.style.left = (cx - off.current.x) + 'px'
    torchRef.current.style.top  = (cy - off.current.y) + 'px'
  }, [])

  const endDrag = useCallback((cx, cy) => {
    if (!dragging.current) return
    dragging.current = false
    if (!pillarTopRef.current || isLit) return

    // Flame head of user's torch
    const isMobile = window.innerWidth <= 600
    const tr = torchRef.current.getBoundingClientRect()
    const flameHead = {
      x: tr.left + tr.width / 2,
      y: tr.top + (isMobile ? 12 : 18)
    }

    const pr = pillarTopRef.current.getBoundingClientRect()
    const PAD = isMobile ? 80 : 65 // Generous touch/drop zone around pillar top

    const hit = (
      flameHead.x >= pr.left - PAD &&
      flameHead.x <= pr.right + PAD &&
      flameHead.y >= pr.top - PAD &&
      flameHead.y <= pr.bottom + PAD
    )

    if (hit) {
      onLampLit()
      playSacredAudio()
      burstSparks(pr)
    }
  }, [isLit, onLampLit])

  // Attach mouse + touch events (only active when not lit)
  useEffect(() => {
    if (isLit) {
      // Ensure dragging is stopped and cleanup if lit
      dragging.current = false
      return
    }

    const torch = torchRef.current
    if (!torch) return

    const handleMouseDown = e => {
      e.preventDefault()
      startDrag(e.clientX, e.clientY)
    }

    const handleMouseMove = e => {
      if (!dragging.current) return
      moveDrag(e.clientX, e.clientY)
    }

    const handleMouseUp = e => {
      if (!dragging.current) return
      endDrag(e.clientX, e.clientY)
    }

    const handleTouchStart = e => {
      // Prevent default only when touching the torch directly
      if (e.touches.length === 1) {
        e.preventDefault()
        const t = e.touches[0]
        startDrag(t.clientX, t.clientY)
      }
    }

    const handleTouchMove = e => {
      // CRITICAL: ONLY prevent default if actively dragging the torch!
      // If not dragging, allow native page scrolling on mobile!
      if (!dragging.current) return
      if (e.cancelable) e.preventDefault()
      const t = e.touches[0]
      moveDrag(t.clientX, t.clientY)
    }

    const handleTouchEnd = e => {
      if (!dragging.current) return
      const t = e.changedTouches[0]
      endDrag(t.clientX, t.clientY)
    }

    torch.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    torch.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      torch.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)

      torch.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [isLit, startDrag, moveDrag, endDrag])

  // Fade torch smoothly when lit
  useEffect(() => {
    if (!isLit || !torchRef.current) return
    torchRef.current.style.pointerEvents = 'none'
    torchRef.current.style.transition = 'opacity 0.6s'
    torchRef.current.style.opacity    = '0'
    const t = setTimeout(() => {
      if (torchRef.current) {
        torchRef.current.style.display = 'none'
      }
    }, 600)
    return () => clearTimeout(t)
  }, [isLit])

  // Brief spark burst: Quickly fades out and leaves ZERO lingering sparkles
  function burstSparks(targetRect) {
    const pr = targetRect || pillarTopRef.current?.getBoundingClientRect()
    if (!pr) return
    const ox   = pr.left + pr.width / 2
    const oy   = pr.top + 8
    const cols = ['#FFF44F','#FFD700','#FFA500','#FF7700','#FF3700','#FFFFFF']

    parts.current = []
    for (let i = 0; i < 45; i++) {
      const ang = Math.random() * Math.PI * 2
      const spd = 2.0 + Math.random() * 4.5
      parts.current.push({
        x: ox, y: oy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 2.2,
        life: 1.0,
        decay: 0.045 + Math.random() * 0.035,
        r: 1.5 + Math.random() * 2.2,
        col: cols[Math.floor(Math.random() * cols.length)]
      })
    }
    if (rafId.current) cancelAnimationFrame(rafId.current)
    drawSparks()

    // Enforce 100% canvas cleanup after 850ms so NO sparkles ever stay on screen
    setTimeout(() => {
      parts.current = []
      if (rafId.current) cancelAnimationFrame(rafId.current)
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }, 850)
  }

  function drawSparks() {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    parts.current = parts.current.filter(p => p.life > 0)
    for (const p of parts.current) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.14; p.vx *= 0.98; p.life -= p.decay
      ctx.save()
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.shadowColor = p.col; ctx.shadowBlur = 6
      ctx.fillStyle   = p.col
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0, p.r * p.life), 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }
    if (parts.current.length > 0) {
      rafId.current = requestAnimationFrame(drawSparks)
    } else {
      ctx.clearRect(0, 0, c.width, c.height)
    }
  }

  return (
    <>
      {/* Background Sacred Audio (Plays after lighting the lamp) */}
      <audio
        ref={audioRef}
        id="bgm"
        src="audio/om_saravanabava.mp3"
        preload="auto"
        loop
      />

      {/* Ephemeral sparks canvas (guaranteed to clear within 850ms) */}
      <canvas ref={canvasRef} className="sparks-canvas" />

      <section className="lamp-scene">
        {/* Static English instruction banner */}
        {!isLit ? (
          <div className="instr-banner-wrap">
            <p className="instr prominent-banner">
              🔥 Drag the sacred torch to the top of the pillar to light the Deepathoon
            </p>
          </div>
        ) : (
          <div className="lit-banner-wrap">
            <p className="instr lit-banner">
              ✨ The Sacred Deepathoon is Ignited with Eternal Divine Light ✨
            </p>
            <button
              className="audio-control-btn"
              onClick={toggleAudio}
              title={isPlayingAudio ? 'Mute Sacred Chant' : 'Play Sacred Chant'}
            >
              {isPlayingAudio ? '🔊 Om Saravanabhava' : '🔈 Play Sacred Chant'}
            </button>
          </div>
        )}

        {/* Central Stage with Thiruparankundram Temple & Stone Pillar Image */}
        <div className="pillar-stage" ref={stageRef}>
          <img
            src="images/thiruparankundram_deepathoon.jpg"
            alt="Sacred Deepathoon on Thiruparankundram Hilltop"
            className="pillar-backdrop-img"
          />

          {/* Flame Zone anchored to pillar top (21.5% X, 30.0% Y) */}
          <div
            ref={pillarTopRef}
            className={`pillar-flame-zone ${isLit ? 'active' : ''}`}
            style={{ left: '21.5%', top: '30.0%' }}
          >
            {/* Guide beacon — "Light Here" alternates 2s EN/TA */}
            {!isLit && (
              <div className="target-beacon-hint">
                <div className="beacon-ring r1" />
                <div className="beacon-ring r2" />
                <div className="beacon-dot" />
                <span className="beacon-target-text">
                  {torchLang === 'en' ? 'Light Here' : 'இங்கே வைக்கவும்'}
                </span>
              </div>
            )}

            {isLit && <PillarFlame />}
          </div>
        </div>

        <Blessing isLit={isLit} />
      </section>

      {/* Realistic Draggable Temple Torch */}
      <div
        ref={torchRef}
        className="torch-draggable"
        style={{ position: 'fixed', display: 'flex', opacity: ready ? 1 : 0 }}
      >
        <RealisticTorch torchLang={torchLang} />
      </div>
    </>
  )
}
