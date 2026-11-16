import { useRef, useEffect, useState, useCallback } from 'react'
import Blessing from './Blessing'

export default function LampScene({ isLit, onLampLit }) {
  const torchRef  = useRef(null)
  const wickRef   = useRef(null)
  const canvasRef = useRef(null)
  const dragging  = useRef(false)
  const off       = useRef({ x: 0, y: 0 })
  const parts     = useRef([])
  const rafId     = useRef(null)
  const [ready, setReady] = useState(false)

  // Place torch bottom-left on mount & resize
  useEffect(() => {
    function place() {
      if (!torchRef.current) return
      torchRef.current.style.left = '60px'
      torchRef.current.style.top  = (window.innerHeight - 220) + 'px'
      setReady(true)
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [])

  // Canvas size sync
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

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
    if (!wickRef.current || isLit) return

    const tr  = torchRef.current.getBoundingClientRect()
    const wr  = wickRef.current.getBoundingClientRect()
    const PAD = 42

    const hit = !(
      tr.right  < wr.left   - PAD ||
      tr.left   > wr.right  + PAD ||
      tr.bottom < wr.top    - PAD ||
      tr.top    > wr.bottom + PAD
    )
    if (hit) { onLampLit(); burstSparks() }
  }, [isLit, onLampLit]) // eslint-disable-line react-hooks/exhaustive-deps

  // Attach mouse + touch events
  useEffect(() => {
    const torch = torchRef.current
    if (!torch) return
    const md = e => { e.preventDefault(); startDrag(e.clientX, e.clientY) }
    const mm = e => moveDrag(e.clientX, e.clientY)
    const mu = e => endDrag(e.clientX, e.clientY)
    const ts = e => { e.preventDefault(); const t = e.touches[0]; startDrag(t.clientX, t.clientY) }
    const tm = e => { e.preventDefault(); const t = e.touches[0]; moveDrag(t.clientX, t.clientY) }
    const te = e => { const t = e.changedTouches[0]; endDrag(t.clientX, t.clientY) }

    torch.addEventListener('mousedown', md)
    document.addEventListener('mousemove', mm)
    document.addEventListener('mouseup', mu)
    torch.addEventListener('touchstart', ts, { passive: false })
    document.addEventListener('touchmove', tm, { passive: false })
    document.addEventListener('touchend', te)
    return () => {
      torch.removeEventListener('mousedown', md)
      document.removeEventListener('mousemove', mm)
      document.removeEventListener('mouseup', mu)
      torch.removeEventListener('touchstart', ts)
      document.removeEventListener('touchmove', tm)
      document.removeEventListener('touchend', te)
    }
  }, [startDrag, moveDrag, endDrag])

  // Fade torch when lit
  useEffect(() => {
    if (!isLit || !torchRef.current) return
    torchRef.current.style.transition = 'opacity 0.5s'
    torchRef.current.style.opacity    = '0'
    const t = setTimeout(() => {
      if (torchRef.current) torchRef.current.style.display = 'none'
    }, 500)
    return () => clearTimeout(t)
  }, [isLit])

  function burstSparks() {
    const wr = wickRef.current?.getBoundingClientRect()
    if (!wr) return
    const ox   = wr.left + wr.width  / 2
    const oy   = wr.top  + wr.height / 2
    const cols = ['#FFD700','#FFA500','#FF8C00','#FFF44F','#FF4500','#FFEC8B']
    for (let i = 0; i < 90; i++) {
      const ang = Math.random() * Math.PI * 2
      const spd = 2.5 + Math.random() * 5.5
      parts.current.push({
        x: ox, y: oy,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 2.5,
        life: 1, decay: 0.014 + Math.random() * 0.024,
        r: 1.8 + Math.random() * 3.5,
        col: cols[Math.floor(Math.random() * cols.length)]
      })
    }
    if (rafId.current) cancelAnimationFrame(rafId.current)
    drawSparks()
  }

  function drawSparks() {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    parts.current = parts.current.filter(p => p.life > 0)
    for (const p of parts.current) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.99; p.life -= p.decay
      ctx.save()
      ctx.globalAlpha = p.life
      ctx.shadowColor = p.col; ctx.shadowBlur = 7
      ctx.fillStyle   = p.col
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }
    if (parts.current.length) rafId.current = requestAnimationFrame(drawSparks)
    else ctx.clearRect(0, 0, c.width, c.height)
  }

  return (
    <>
      <canvas ref={canvasRef} className="sparks-canvas" />

      <section className="lamp-scene">
        {!isLit && (
          <p className="instr">Drag the sacred torch &#8593; to light the Deepathoon</p>
        )}

        {/* Deepathoon lamp */}
        <div className={`deepathoon${isLit ? ' lit' : ''}`}>
          <div className="flame-wrap" ref={wickRef}>
            <div className="halo" />
            <div className="flame-outer" />
            <div className="wick" />
          </div>
          <div className="l-rim" />
          <div className="l-bowl" />
          <div className="l-collar" />
          <div className="l-shaft-top" />
          <div className="l-bulge" />
          <div className="l-shaft-bot" />
          <div className="l-base" />
        </div>

        <Blessing isLit={isLit} />
      </section>

      {/* Draggable temple flame torch (Theevatti / Mashaal) */}
      <div
        ref={torchRef}
        className="torch"
        style={{ position: 'fixed', display: 'flex', opacity: ready ? 1 : 0 }}
      >
        <div className="torch-flame-container">
          <div className="t-fire-glow" />
          <div className="t-flame" />
          <div className="t-cloth-wrap" />
        </div>
        <div className="t-brass-cup" />
        <div className="t-guard-ring" />
        <div className="t-handle">
          <div className="t-grip-ridge r1" />
          <div className="t-grip-ridge r2" />
          <div className="t-grip-ridge r3" />
        </div>
        <div className="t-pommel" />
        <span className="t-hint">Drag Torch ↑</span>
      </div>
    </>
  )
}
