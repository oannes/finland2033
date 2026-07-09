import { useRef, useState } from 'react'

// Hover-dwell reveal: dialogue lines appear one at a time.

/** The next dialogue line renders blurred; resting the pointer on it for 500ms
 * (or a click/tap) reveals it. Lines after the next stay hidden. */
export function RevealLine({
  revealed,
  isNext,
  onReveal,
  children,
}: {
  revealed: boolean
  isNext: boolean
  onReveal: () => void
  children: React.ReactNode
}) {
  const timer = useRef<number | null>(null)
  const [dwelling, setDwelling] = useState(false)
  if (revealed) return <div className="transition-all duration-300">{children}</div>
  if (!isNext) return null
  const start = () => {
    setDwelling(true)
    timer.current = window.setTimeout(onReveal, 500)
  }
  const stop = () => {
    setDwelling(false)
    if (timer.current) window.clearTimeout(timer.current)
  }
  return (
    <div
      onMouseEnter={start}
      onMouseLeave={stop}
      onClick={() => {
        stop()
        onReveal()
      }}
      className={`cursor-pointer select-none transition-all duration-500 ${
        dwelling ? 'blur-[1.5px] opacity-70' : 'blur-[3px] opacity-40'
      }`}
    >
      {children}
    </div>
  )
}

/** Sequence wrapper: reveals items one by one via RevealLine; calls onDone when all shown. */
export function RevealSequence({
  items,
  onDone,
}: {
  items: React.ReactNode[]
  onDone?: () => void
}) {
  const [shown, setShown] = useState(1)
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <RevealLine
          key={i}
          revealed={i < shown - 1 || (i === items.length - 1 && shown > items.length)}
          isNext={i === shown - 1}
          onReveal={() => {
            setShown(shown + 1)
            if (shown >= items.length && onDone) onDone()
          }}
        >
          {item}
        </RevealLine>
      ))}
    </div>
  )
}

