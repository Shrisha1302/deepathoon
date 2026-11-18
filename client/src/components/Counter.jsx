import { useEffect, useRef } from 'react'

export default function Counter({ stats, lang }) {
  const numRef  = useRef(null)
  const prevRef = useRef(stats.count)

  useEffect(() => {
    if (numRef.current && stats.count !== prevRef.current) {
      numRef.current.classList.remove('bump')
      void numRef.current.offsetWidth   // force reflow
      numRef.current.classList.add('bump')
      prevRef.current = stats.count
    }
  }, [stats.count])

  return (
    <div className="counter">
      <span className="counter-num" ref={numRef}>
        {stats.count.toLocaleString('en-IN')}
      </span>
      <span className="counter-label">
        {lang === 'en'
          ? 'souls have lit this sacred flame'
          : 'பக்தர்கள் இந்த புனித ஜோதியை ஏற்றியுள்ளனர்'}
      </span>
      <span className="counter-live">
        <span className="live-dot" />
        {lang === 'en'
          ? `${stats.active} ${stats.active === 1 ? 'person' : 'people'} here now`
          : `${stats.active} பக்தர்கள் இப்போது தரிசிக்கின்றனர்`}
      </span>
    </div>
  )
}
