import { useEffect, useRef } from 'react'

export default function Counter({ stats }) {
  const numRef  = useRef(null)
  const prevRef = useRef(stats.count)

  useEffect(() => {
    if (numRef.current && stats.count !== prevRef.current) {
      numRef.current.classList.remove('bump')
      void numRef.current.offsetWidth
      numRef.current.classList.add('bump')
      prevRef.current = stats.count
    }
  }, [stats.count])

  return (
    <div className="counter">
      <span className="counter-num" ref={numRef}>
        {stats.count.toLocaleString('en-IN')}
      </span>
      <span className="counter-label">souls have lit this sacred flame</span>
      <span className="counter-live">
        <span className="live-dot" />
        {stats.active} {stats.active === 1 ? 'person' : 'people'} here now
      </span>
    </div>
  )
}
