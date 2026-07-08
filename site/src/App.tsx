import { useEffect, useRef, useState } from 'react'
import prologueRaw from '../../wargame/prologue.md?raw'
import { parsePrologue } from './game/parse'

import mapPlain from './assets/map-plain.webp'
import mapNetwork from './assets/map-network.webp'
import GameApp from './game/GameApp'
import { PERSONA_PORTRAITS, Portrait } from './game/portraits'
import { loadContent } from './game/content'
import Markdown from './game/Markdown'

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

const BG_IMAGE_1 = mapPlain
const BG_IMAGE_2 = mapNetwork

const SPOTLIGHT_R = 260

function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string
  cursorX: number
  cursorY: number
}) {
  // Pure CSS radial-gradient mask: works in Safari/Firefox where per-frame
  // canvas.toDataURL() masks stall, and needs no canvas at all.
  const ref = useRef<HTMLDivElement>(null)
  const rectRef = useRef({ left: 0, top: 0 })

  useEffect(() => {
    const update = () => {
      const r = ref.current?.getBoundingClientRect()
      if (r) rectRef.current = { left: r.left, top: r.top }
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update)
    }
  }, [])

  const x = cursorX - rectRef.current.left
  const y = cursorY - rectRef.current.top
  const mask = `radial-gradient(circle ${SPOTLIGHT_R}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, rgba(0,0,0,0) 100%)`

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
      style={{
        backgroundImage: `url(${image})`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  )
}

export default function App() {
  const route = useHashRoute()
  if (route.startsWith('#/play')) return <GameApp />
  if (route.startsWith('#/prologue')) return <Prologue mode={route.includes('workshop') ? 'workshop' : 'solo'} />
  if (route.startsWith('#/afterword')) return <AfterwordPage />
  return <Landing />
}

/** GDP per capita (constant 2015 US$, thousands), Finland vs Sweden.
 * Read from World Bank / OECD national accounts data (CC BY-4.0). */
function GdpChart() {
  const years = [1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
  const finland = [33.0, 34.5, 36.0, 37.9, 38.8, 39.3, 40.0, 41.5, 42.5, 44.0, 46.2, 46.3, 42.4, 43.5, 44.4, 43.5, 42.9, 42.5, 42.6, 43.5, 44.9, 45.2, 45.9, 44.7, 45.8, 46.0, 45.2, 45.0, 44.9]
  const sweden = [36.7, 38.2, 39.8, 41.5, 42.0, 42.8, 43.5, 45.1, 46.2, 48.1, 49.3, 48.4, 46.0, 48.2, 49.4, 48.8, 48.9, 49.5, 51.2, 51.6, 51.9, 52.2, 53.0, 51.6, 54.0, 54.3, 53.9, 54.2, 55.0]
  const W = 460
  const H = 210
  const PAD = { l: 30, r: 58, t: 14, b: 24 }
  const x = (yr: number) => PAD.l + ((yr - 1997) / (2025 - 1997)) * (W - PAD.l - PAD.r)
  const y = (v: number) => PAD.t + (1 - (v - 32) / (56 - 32)) * (H - PAD.t - PAD.b)
  const line = (vals: number[]) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(years[i]).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-1">The scoreboard</p>
      <p className="text-[12px] text-white/50 mb-3 leading-snug">
        GDP per capita, constant 2015 US$ (thousands): Finland and Sweden, 1997–2025.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
        {[35, 40, 45, 50, 55].map((v) => (
          <g key={v}>
            <line x1={PAD.l} y1={y(v)} x2={W - PAD.r} y2={y(v)} stroke="rgba(255,255,255,0.07)" />
            <text x={PAD.l - 6} y={y(v) + 3} fontSize={9} fill="rgba(255,255,255,0.35)" textAnchor="end">{v}</text>
          </g>
        ))}
        <line x1={x(2008)} y1={PAD.t} x2={x(2008)} y2={H - PAD.b} stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
        <text x={x(2008)} y={PAD.t + 8} fontSize={8.5} fill="rgba(255,255,255,0.35)" textAnchor="middle">2008</text>
        <path d={line(sweden)} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.8} />
        <path d={line(finland)} fill="none" stroke="#e8702a" strokeWidth={2} />
        <text x={x(2025) + 5} y={y(55.0) + 3} fontSize={10} fill="rgba(255,255,255,0.6)">Sweden</text>
        <text x={x(2025) + 5} y={y(44.9) + 3} fontSize={10} fill="#e8702a">Finland</text>
        {[2000, 2005, 2010, 2015, 2020, 2025].map((yr) => (
          <text key={yr} x={x(yr)} y={H - 6} fontSize={9} fill="rgba(255,255,255,0.35)" textAnchor="middle">{yr}</text>
        ))}
      </svg>
      <p className="text-[10px] text-white/30 mt-2">
        Finland's 2008 peak was not passed again for seventeen years. Source: World Bank, OECD national accounts.
      </p>
    </div>
  )
}

function AfterwordPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const content = loadContent()
  return (
    <div className="min-h-screen bg-[#04070c] text-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-b from-[#04070c]/90 via-[#04070c]/40 to-transparent pb-4">
        <div className="mx-auto w-full max-w-[920px] flex items-center justify-between p-4 sm:p-5">
          <a href="#/" className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="text-white text-xl font-playfair italic">Finland 2033</span>
          </a>
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">Afterword</span>
        </div>
      </nav>
      <div className="mx-auto w-full max-w-[920px] border-x border-white/5">
        <section className="px-6 sm:px-10 md:px-14 pt-28 pb-20 sm:pb-28">
          <div className="max-w-[560px] mx-auto">
            {content.afterword ? <Markdown text={content.afterword} /> : <p className="text-white/50">The afterword is written after you play.</p>}
            <div className="mt-12 border-t border-white/10 pt-8">
              <a
                href="#/prologue/solo"
                className="inline-block bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all hover:scale-[1.03] active:scale-95"
              >
                Play the decade
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

const PROLOGUE = parsePrologue(prologueRaw)

/** *asterisks* → emphasized span (used by prologue.md) */
function Em({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <em key={i} className="text-white/90">{p}</em> : p))}
    </>
  )
}

function PrologueParas({ slug, last = 'mb-4' }: { slug: string; last?: string }) {
  const sec = PROLOGUE[slug]
  if (!sec) return null
  return (
    <>
      {sec.paragraphs.map((para, i) => (
        <p
          key={i}
          className={`text-white/70 text-[15px] leading-relaxed ${i === sec.paragraphs.length - 1 ? last : 'mb-4'}`}
        >
          <Em text={para} />
        </p>
      ))}
    </>
  )
}

function Prologue({ mode }: { mode: 'solo' | 'workshop' }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="min-h-screen bg-[#04070c] text-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-b from-[#04070c]/90 via-[#04070c]/40 to-transparent pb-4">
        <div className="mx-auto w-full max-w-[920px] flex items-center justify-between p-4 sm:p-5">
          <a href="#/" className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="text-white text-xl font-playfair italic">Finland 2033</span>
          </a>
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
            {mode === 'workshop' ? 'Workshop' : 'Playing alone'}
          </span>
        </div>
      </nav>

      <div className="mx-auto w-full max-w-[920px] border-x border-white/5">
        <section className="px-6 sm:px-10 md:px-14 pt-28 pb-20 sm:pb-28">
          <div className="max-w-[560px] mx-auto space-y-16">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#e8702a] mb-4">{PROLOGUE['lost-years']?.meta.kicker}</p>
              <h2 className="font-playfair italic text-3xl sm:text-4xl leading-tight mb-5">
                {PROLOGUE['lost-years']?.meta.headline}
              </h2>
              <PrologueParas slug="lost-years" last="" />
              <GdpChart />
            </div>

            <div>
              <PrologueParas slug="intro" last="" />
            </div>

            <div>
              <h2 className="font-playfair italic text-3xl sm:text-4xl leading-tight mb-5">{PROLOGUE.maria?.meta.headline}</h2>
              <div className="sm:flex sm:gap-6 sm:items-start">
                <div className="mb-4 sm:mb-0 sm:order-2">
                  <Portrait slots={PERSONA_PORTRAITS.MARJA} era="now" name="Maria" size="lg" className="mx-auto sm:mx-0 w-[160px] sm:w-[180px]" />
                  <p className="text-[10px] text-white/30 mt-2 text-center sm:text-left">{PROLOGUE.maria?.meta.caption}</p>
                </div>
                <div className="flex-1">
                  <PrologueParas slug="maria" last="" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-playfair italic text-3xl sm:text-4xl leading-tight mb-5">{PROLOGUE.eetu?.meta.headline}</h2>
              <div className="sm:flex sm:gap-6 sm:items-start">
                <div className="mb-4 sm:mb-0">
                  <Portrait slots={PERSONA_PORTRAITS.EETU} era="now" name="Eetu" size="lg" className="mx-auto sm:mx-0 w-[160px] sm:w-[180px] -scale-x-100" />
                  <p className="text-[10px] text-white/30 mt-2 text-center sm:text-left">{PROLOGUE.eetu?.meta.caption}</p>
                </div>
                <div className="flex-1">
                  <PrologueParas slug="eetu" last="" />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-14">
              <h2 className="font-playfair italic text-3xl sm:text-4xl leading-tight mb-5">{PROLOGUE['another-chance']?.meta.headline}</h2>
              <PrologueParas slug="another-chance" last="mb-8" />
              <a
                href={`#/play/${mode}`}
                className="inline-block bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
              >
                {PROLOGUE.cta?.meta[mode] ?? (mode === 'workshop' ? 'Set up the workshop' : 'Take your seat')}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Landing() {
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef(0)
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)
    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-[#04070c] tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-b from-[#04070c]/90 via-[#04070c]/40 to-transparent pb-4">
        <div className="mx-auto w-full max-w-[920px] flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-2.5">
          <svg
            width="26"
            height="26"
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z"
            />
          </svg>
          <span className="text-white text-2xl font-playfair italic">
            Finland 2033
          </span>
        </div>

        <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          <a href="#/" className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-medium">
            Introduction
          </a>
          <a
            href="#/prologue/solo"
            className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
          >
            Simulation
          </a>
          <a
            href="#/afterword"
            className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
          >
            Afterword
          </a>
        </div>
        </div>
      </nav>

      {/* the landing stays a narrow portrait column even on wide screens; the simulation uses full width */}
      <div className="mx-auto w-full max-w-[920px] border-x border-white/5">
      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              In Finland, choices
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              cast long shadows
            </span>
          </h1>
        </div>

        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed mb-3">
            The future of AI will largely be built beyond Finland's borders. But Finland's place in that future
            will be shaped by Finns themselves.
          </p>
          <p className="text-sm text-white/80 leading-relaxed">
            See Finland only as it is, and we will make it less than it is. See Finland as it could be, and we can
            make it what it should be.
          </p>
        </div>

        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50 flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Step into the roles of Finland's key decision-makers. Between 2027 and 2033, powerful currents will
            reshape Finland's place in the world. Can you steer the country toward what it should become?
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#/prologue/solo"
              className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
            >
              Play alone
            </a>
            <a
              href="#/prologue/workshop"
              className="border border-white/40 hover:border-white text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:bg-white/10"
            >
              Workshop
            </a>
          </div>
        </div>
      </section>

            </div>
    </div>
  )
}
