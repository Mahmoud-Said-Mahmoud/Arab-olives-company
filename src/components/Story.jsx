import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import StaticStory from './StaticStory.jsx'

// The jar scene (GSAP + ScrollTrigger + its layout engine) is a separate chunk. It is fetched
// when the section comes within a screen and a half of the viewport; until then, and for good
// if the fetch fails, the static version stands in, so the page never depends on the animation.
export default function Story({ still, ...props }) {
  const holder = useRef(null)
  const swap = useRef(null)
  const [Scene, setScene] = useState(null)

  useEffect(() => {
    if (still || Scene) return
    let alive = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        import('./JarStory.jsx')
          .then((m) => {
            if (!alive) return
            const box = holder.current.getBoundingClientRect()
            swap.current = { height: box.height, above: box.bottom < 0 }
            setScene(() => m.default)
          })
          .catch(() => {}) // keep the static version
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(holder.current)
    return () => {
      alive = false
      io.disconnect()
    }
  }, [still, Scene])

  // If the visitor has already scrolled past, the taller scene must not push their view down.
  useLayoutEffect(() => {
    const was = swap.current
    if (!Scene || still || !was) return
    swap.current = null
    if (was.above) window.scrollBy({ top: holder.current.getBoundingClientRect().height - was.height, behavior: 'instant' })
  }, [Scene, still])

  return <div ref={holder}>{Scene && !still ? <Scene {...props} /> : <StaticStory {...props} />}</div>
}
