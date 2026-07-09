import { useEffect, useRef, useState } from 'react'

// Hover-reveal dialogue: the line under the cursor opens immediately; once a
// line is fully revealed, the next one begins a slow automatic un-blur, so
// the conversation cascades hands-free (and works untouched on mobile) while
// the cursor can always run ahead. Content that follows a sequence waits one
// extra second after the last line (RevealSequence fires onDone late).

/** ms for the slow automatic un-blur of the next line */
const CASCADE_MS = 2600
/** ms between the last revealed line and onDone (gates whatever follows) */
const TAIL_MS = 1000
/** ms before an `instant` item (buttons, interactive stops) appears */
const INSTANT_MS = 700

export function RevealLine({
  revealed,
  isNext,
  instant = false,
  onReveal,
  children,
}: {
  revealed: boolean
  isNext: boolean
  /** interactive items: no blur, just a short pause then visible */
  instant?: boolean
  onReveal: () => void
  children: React.ReactNode
}) {
  const [easing, setEasing] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!isNext || revealed) return
    if (instant) {
      timer.current = window.setTimeout(onReveal, INSTANT_MS)
      return () => {
        if (timer.current) window.clearTimeout(timer.current)
      }
    }
    // begin the slow cascade the moment this line becomes next
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEasing(true)))
    timer.current = window.setTimeout(onReveal, CASCADE_MS)
    return () => {
      cancelAnimationFrame(raf)
      if (timer.current) window.clearTimeout(timer.current)
      setEasing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNext, revealed, instant])

  if (revealed) return <div>{children}</div>
  if (!isNext) return null
  if (instant) return null
  return (
    <div
      onMouseEnter={onReveal}
      onClick={onReveal}
      className="cursor-pointer select-none"
      style={{
        filter: easing ? 'blur(0px)' : 'blur(3px)',
        opacity: easing ? 1 : 0.35,
        transition: `filter ${CASCADE_MS}ms ease-out, opacity ${CASCADE_MS}ms ease-out`,
      }}
    >
      {children}
    </div>
  )
}

export type RevealItem = React.ReactNode | { node: React.ReactNode; instant: true }

const isInstant = (it: RevealItem): it is { node: React.ReactNode; instant: true } =>
  typeof it === 'object' && it !== null && 'instant' in (it as object)

/** Sequence wrapper: cascading reveal; onDone fires TAIL_MS after the last line. */
export function RevealSequence({ items, onDone }: { items: RevealItem[]; onDone?: () => void }) {
  const [shown, setShown] = useState(1)
  const doneFired = useRef(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (shown > items.length) {
      const t = window.setTimeout(() => {
        if (doneFired.current) return
        doneFired.current = true
        onDoneRef.current?.()
      }, TAIL_MS)
      return () => window.clearTimeout(t)
    }
  }, [shown, items.length])

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <RevealLine
          key={i}
          revealed={i < shown - 1}
          isNext={i === shown - 1}
          instant={isInstant(item)}
          onReveal={() => setShown((s) => (i === s - 1 ? s + 1 : s))}
        >
          {isInstant(item) ? item.node : item}
        </RevealLine>
      ))}
    </div>
  )
}

/** Mount-time quick blur-in for content that follows a finished dialogue:
 * everything arrives at once, easing from blur to clear. */
export function QuickReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [clear, setClear] = useState(false)
  useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setClear(true)))
    return () => cancelAnimationFrame(r)
  }, [])
  return (
    <div
      className={className}
      style={{
        filter: clear ? 'blur(0px)' : 'blur(8px)',
        opacity: clear ? 1 : 0.2,
        transition: 'filter 700ms ease-out, opacity 700ms ease-out',
      }}
    >
      {children}
    </div>
  )
}
