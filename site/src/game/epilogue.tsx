import { useEffect, useRef, useState } from 'react'
import type { EpilogueDoc, GameContent, GameState } from './types'
import { evaluateGoals, keyMetricFor, personaLeverage } from './engine'
import { moodFor, moodImage, PERSONA_PORTRAITS, Portrait } from './portraits'

/**
 * The 2033 epilogue: a street scene on Aleksanterinkatu, then Mummotunneli,
 * where the five haltijat of Finland hold court. Disco Elysium-style voices.
 * The conversation script has three tiers by goals met (≤1 / 2 / 3); the
 * middle and ending are shared, the openers and first exchange differ.
 */

// ---------- voices ----------

const VOICE_COLOR: Record<string, string> = {
  RAJA: '#7fb3d5',
  TALKOOT: '#e8c06a',
  NOKIA: '#e87ad0',
  VELKA: '#b8b8b8',
  METSÄ: '#7dbf8e',
  MUMMOTUNNELI: '#e8702a',
  MARIA: '#e8a1c0',
  EETU: '#8fd0c8',
  'YOUR FINNISH GENES': '#c9b8e8',
}

type Beat =
  | { v?: string; t: string } // voice line (v) or plain narration (no v)
  | { choice: { label: string; replies: { v?: string; t: string }[] }[] }
  | { hub: true } // pause: the player picks which spirit to talk to next
  | { img: string; alt: string; env?: string } // a portrait revealed mid-scene (env = hover layer)

function VoiceLine({ v, t }: { v?: string; t: string }) {
  if (!v)
    return <p className="text-white/60 text-[15px] leading-relaxed italic">{t}</p>
  return (
    <p className="text-white/85 text-[15px] leading-relaxed">
      <span className="font-semibold tracking-[0.08em]" style={{ color: VOICE_COLOR[v] ?? '#fff' }}>
        {v}
      </span>
      <span className="text-white/40"> — </span>
      {t}
    </p>
  )
}

// ---------- the conversation scripts (texts live in wargame/epilogue.md) ----------

/** Scenario facts the spirits react to. */
export interface EpilogueCtx {
  met: number
  stack: string // euro | us | split
  compact: string // strong | thin | none
  levy: string
  trust: number
  sovShare: number
  drift: number
}

const interp = (t: string, ctx: EpilogueCtx): string =>
  t
    .replace(/\{trust\}/g, String(ctx.trust))
    .replace(/\{sov_share\}/g, String(ctx.sovShare))
    .replace(/\{met\}/g, String(ctx.met))

function beatsOf(doc: EpilogueDoc, slug: string, ctx: EpilogueCtx): Beat[] {
  return (doc[slug]?.lines ?? []).map((l) => ({ v: l.v, t: interp(l.t, ctx) }))
}

function rajaTalk(doc: EpilogueDoc, ctx: EpilogueCtx): Beat[] {
  const branch = ctx.stack === 'euro' ? 'raja/euro' : ctx.stack === 'us' ? 'raja/us' : 'raja/split'
  return [...beatsOf(doc, 'raja/open', ctx), ...beatsOf(doc, branch, ctx), ...beatsOf(doc, 'raja/close', ctx)]
}

function talkootTalk(doc: EpilogueDoc, ctx: EpilogueCtx): Beat[] {
  const branch = ctx.trust >= 55 && ctx.drift <= 1 ? 'talkoot/better' : 'talkoot/worse'
  return [...beatsOf(doc, 'talkoot/open', ctx), ...beatsOf(doc, branch, ctx)]
}

function nokiaTalk(doc: EpilogueDoc, ctx: EpilogueCtx): Beat[] {
  const branch =
    ctx.stack === 'euro' && ctx.sovShare >= 35
      ? 'nokia/miracle-stack'
      : ctx.compact === 'strong'
        ? 'nokia/miracle-compact'
        : 'nokia/no-miracle'
  return [...beatsOf(doc, 'nokia/open', ctx), ...beatsOf(doc, branch, ctx)]
}

function velkaTalk(doc: EpilogueDoc, ctx: EpilogueCtx): Beat[] {
  const tier = ctx.met >= 3 ? 'velka/met-high' : ctx.met === 2 ? 'velka/met-mid' : 'velka/met-low'
  const paid = ctx.compact === 'strong' || ctx.compact === 'thin' || ctx.levy === 'yes'
  return [
    ...beatsOf(doc, 'velka/open', ctx),
    ...beatsOf(doc, tier, ctx),
    ...beatsOf(doc, paid ? 'velka/paid' : 'velka/unpaid', ctx),
    ...beatsOf(doc, 'velka/coda', ctx),
  ]
}

function metsaTalk(doc: EpilogueDoc, ctx: EpilogueCtx): Beat[] {
  return beatsOf(doc, 'metsa', ctx)
}

function finaleBeats(doc: EpilogueDoc, ctx: EpilogueCtx): Beat[] {
  const options = ['finale/option-1', 'finale/option-2', 'finale/option-3']
    .filter((s) => doc[s])
    .map((s) => ({
      label: doc[s].meta.label ?? '…',
      replies: beatsOf(doc, s, ctx) as { v?: string; t: string }[],
    }))
  return [...beatsOf(doc, 'finale/open', ctx), { choice: options }, ...beatsOf(doc, 'finale/end', ctx)]
}

const SPIRIT_FILES = import.meta.glob('../assets/portraits/spirit-*.{png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const spiritSlug = (key: string) => (key === 'METSÄ' ? 'metsa' : key.toLowerCase())
const spiritImage = (key: string): string | undefined =>
  Object.entries(SPIRIT_FILES).find(([p]) => p.includes(`spirit-${spiritSlug(key)}.`))?.[1]
/** conceptual inner-life version, revealed on hover */
const spiritEnvImage = (key: string): string | undefined =>
  Object.entries(SPIRIT_FILES).find(([p]) => p.includes(`spirit-${spiritSlug(key)}-env`))?.[1]

const SPIRIT_ORDER = ['RAJA', 'TALKOOT', 'NOKIA', 'VELKA', 'METSÄ']

function talkFor(doc: EpilogueDoc, key: string, ctx: EpilogueCtx): Beat[] {
  const beats = (() => {
    switch (key) {
      case 'RAJA': return rajaTalk(doc, ctx)
      case 'TALKOOT': return talkootTalk(doc, ctx)
      case 'NOKIA': return nokiaTalk(doc, ctx)
      case 'VELKA': return velkaTalk(doc, ctx)
      default: return metsaTalk(doc, ctx)
    }
  })()
  const img = spiritImage(key)
  return img ? [{ img, alt: key, env: spiritEnvImage(key) }, ...beats] : beats
}

// ---------- the tunnel scene ----------

function TunnelScene({ doc, ctx }: { doc: EpilogueDoc; ctx: EpilogueCtx }) {
  const [script, setScript] = useState<Beat[]>(() => [...beatsOf(doc, 'tunnel/intro', ctx), { hub: true }])
  const [idx, setIdx] = useState(1) // beats revealed so far
  const [picked, setPicked] = useState<Record<number, number>>({}) // choice beat index → option index
  const [talked, setTalked] = useState<string[]>([])

  const spirits = SPIRIT_ORDER.map((key) => ({ key, label: doc['tunnel/spirits']?.meta[key] ?? key }))

  const pickSpirit = (key: string) => {
    const done = [...talked, key]
    const next: Beat[] = done.length < spirits.length ? [{ hub: true }] : finaleBeats(doc, ctx)
    setTalked(done)
    setScript((s) => [...s, ...talkFor(doc, key, ctx), ...next])
    setIdx((n) => n + 1)
  }

  const shown: React.ReactNode[] = []
  let waiting: 'continue' | 'choice' | 'done' = 'done'
  for (let i = 0; i < script.length && i < idx; i++) {
    const b = script[i]
    if ('hub' in b) {
      if (i === script.length - 1) {
        waiting = 'choice'
        shown.push(
          <p key={`${i}-hubq`} className="text-white/60 text-[15px] leading-relaxed italic">
            {talked.length === 0
              ? doc['tunnel/hub']?.meta.first ?? 'Whom do you turn to first?'
              : doc['tunnel/hub']?.meta.again ?? 'Whom do you turn to now?'}
          </p>,
        )
        shown.push(
          <div key={i} className="space-y-2 pt-1">
            {spirits
              .filter((s) => !talked.includes(s.key))
              .map((s) => (
                <button
                  key={s.key}
                  onClick={() => pickSpirit(s.key)}
                  className="flex w-full items-center gap-3 text-left rounded-xl border border-white/20 hover:border-[#e8702a]/60 hover:bg-[#e8702a]/5 px-4 py-2.5 text-[15px] text-white/90 transition-colors"
                >
                  {spiritImage(s.key) && (
                    <img src={spiritImage(s.key)} alt="" className="w-9 h-9 rounded-full object-cover object-top border border-white/15" />
                  )}
                  {s.label}
                </button>
              ))}
          </div>,
        )
        break
      }
      continue
    }
    if ('img' in b) {
      const tilt = i % 2 ? '-rotate-1' : 'rotate-1'
      shown.push(
        b.env ? (
          <div
            key={i}
            className={`relative w-24 h-28 rounded-2xl overflow-hidden border border-white/15 shadow-lg shadow-black/50 group ${tilt}`}
          >
            <img src={b.img} alt={b.alt} className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 group-hover:opacity-0" />
            <img src={b.env} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          </div>
        ) : (
          <img
            key={i}
            src={b.img}
            alt={b.alt}
            className={`w-24 h-28 rounded-2xl object-cover object-top border border-white/15 shadow-lg shadow-black/50 ${tilt}`}
          />
        ),
      )
      continue
    }
    if ('choice' in b) {
      const pick = picked[i]
      if (pick === undefined) {
        waiting = 'choice'
        shown.push(
          <div key={i} className="space-y-2 pt-1">
            {b.choice.map((c, ci) => (
              <button
                key={ci}
                onClick={() => setPicked((p) => ({ ...p, [i]: ci }))}
                className="block w-full text-left rounded-xl border border-white/20 hover:border-[#e8702a]/60 hover:bg-[#e8702a]/5 px-4 py-3 text-[15px] text-white/90 transition-colors"
              >
                {c.label}
              </button>
            ))}
          </div>,
        )
        break
      }
      shown.push(
        <p key={`${i}-you`} className="text-white/90 text-[15px] leading-relaxed">
          <span className="font-semibold tracking-[0.08em] text-white/60">YOU</span>
          <span className="text-white/40"> — </span>
          {b.choice[pick].label.replace(/^"|"$/g, '')}
        </p>,
      )
      b.choice[pick].replies.forEach((r, ri) => shown.push(<VoiceLine key={`${i}-r${ri}`} v={r.v} t={r.t} />))
    } else {
      shown.push(<VoiceLine key={i} v={b.v} t={b.t} />)
    }
  }
  if (waiting !== 'choice') waiting = idx < script.length ? 'continue' : 'done'

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 sm:p-8 space-y-4 bg-black/40">
        {shown}
        {waiting === 'continue' && (
          <button
            onClick={() => setIdx((n) => n + 1)}
            className="text-sm text-white/50 hover:text-white underline underline-offset-4"
          >
            …
          </button>
        )}
      </div>
    </div>
  )
}

/** The Mummotunneli backdrop: the dark alley terrace, with the five spirits
 * revealed in a cursor spotlight — the same CSS radial-gradient mask mechanism
 * as the Finland map on the landing page. Falls back to a gradient if the
 * images are absent. */
const TUNNEL_FILES = import.meta.glob('../assets/portraits/mummotunneli-*.{png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const tunnelAsset = (k: string) => Object.entries(TUNNEL_FILES).find(([p]) => p.includes(k))?.[1]

const TUNNEL_SPOT_R = 170

function TunnelBackdrop() {
  const dark = tunnelAsset('mummotunneli-dark')
  const lit = tunnelAsset('mummotunneli-lit')
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
    }
    const onLeave = () => setPos({ x: -999, y: -999 })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  if (!dark) {
    return (
      <div className="h-40 sm:h-56 bg-gradient-to-b from-[#0a0c12] via-[#11141d] to-black flex items-end justify-center rounded-xl overflow-hidden">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25 pb-3">mummotunneli</span>
      </div>
    )
  }
  const mask = `radial-gradient(circle ${TUNNEL_SPOT_R}px at ${pos.x.toFixed(1)}px ${pos.y.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, rgba(0,0,0,0) 100%)`
  return (
    <div ref={ref} className="relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] sm:aspect-[16/10]">
      <img src={dark} alt="A narrow alley terrace in darkness" className="absolute inset-0 w-full h-full object-cover" />
      {lit && (
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${lit})`, maskImage: mask, WebkitMaskImage: mask }}
        />
      )}
    </div>
  )
}

// ---------- the street scene (texts live in wargame/epilogue.md) ----------

function SideFace({ pid, rung, tilt }: { pid: 'MARJA' | 'EETU'; rung: number | null; tilt: string }) {
  const mood = moodFor(rung, 0)
  const img = moodImage(pid, mood, '2033')
  if (img)
    return (
      <img
        src={img}
        alt={mood}
        className={`w-20 h-20 rounded-2xl object-cover border border-white/15 shadow-lg shadow-black/40 ${tilt}`}
      />
    )
  return <Portrait slots={PERSONA_PORTRAITS[pid]} era="2033" name={pid} size="sm" className={tilt} />
}

export function StreetScene({ content, state }: { content: GameContent; state: GameState }) {
  const [walkedIn, setWalkedIn] = useState(false)
  const actor = state.playerActor
  const es = state.endstate
  if (!actor || !es) return null

  const doc = content.epilogue
  const statuses = evaluateGoals(content, state, actor)
  const met = statuses.filter((s) => s.state === 'met').length
  const metric = keyMetricFor(content, state, actor)
  const ctx: EpilogueCtx = {
    met,
    stack: es.flags.STACK ?? 'split',
    compact: es.flags.COMPACT ?? 'none',
    levy: es.flags.LEVY ?? 'no',
    trust: Math.round(es.dataNode.trust ?? 0),
    sovShare: es.dataNode.sov_share ?? 0,
    drift: state.results.filter((r) => r.outcome.cls === 'O3').length,
  }

  const roles = (doc['street/roles']?.meta[actor] ?? '').split('|').map((x) => x.trim())
  const role = roles[met >= 3 ? 2 : met === 2 ? 1 : 0] ?? 'former decision-maker'

  const metTitles = statuses.filter((s) => s.state === 'met').map((s) => s.goal.title.toLowerCase())
  const missed = statuses.filter((s) => s.state !== 'met').map((s) => s.goal.title.toLowerCase())
  const tpl = (slug: string) => doc[slug]?.lines[0]?.t ?? ''
  const recap = (met === statuses.length && met > 0
    ? tpl('street/recap-all')
    : met >= 1
      ? tpl('street/recap-some')
      : tpl('street/recap-none'))
    .replace('{met}', metTitles.join(' and ').replace(/^./, (c) => c.toUpperCase()))
    .replace('{missed}', missed.join(' and '))
  const opening = tpl('street/opening')
    .replace('{role}', role)
    .replace('{metric}', metric ? metric.line : '')
    .replace('{recap}', recap)
    .replace(/\s{2,}/g, ' ')

  const marjaRung = parseInt(es.personaRungs.MARJA.rung.slice(1)) || null
  const eetuRung = parseInt(es.personaRungs.EETU.rung.slice(1)) || null
  const spoken = (id: string, rung: number | null) =>
    doc[`street/${id}-${rung ?? 3}`]?.lines ?? doc[`street/${id}-3`]?.lines ?? []
  // how the player's own choices moved each life (counterfactual replay)
  const reaction = (id: string, pid: 'MARJA' | 'EETU') => {
    const lev = personaLeverage(content, state, pid)
    return (doc[`street/${id}-react-${lev.kind}`]?.lines ?? []).map((l) => ({
      v: l.v,
      t: l.t.replace('{action}', lev.action ?? '').replace('{alt}', lev.alt ?? '').replace(/\s{2,}/g, ' '),
    }))
  }

  const narr = (slug: string, i = 0) => doc[slug]?.lines[i]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a]">Helsinki, 2033</p>
        <p className="text-white/80 text-[15px] leading-relaxed">{opening}</p>

        {narr('street/maria-intro') && <VoiceLine t={narr('street/maria-intro')!.t} />}
        <div className="flex items-start gap-5">
          <div className="flex-1 space-y-3">
            {spoken('marja', marjaRung).map((l, i) => (
              <VoiceLine key={`m${i}`} v={l.v ?? 'MARIA'} t={l.t} />
            ))}
            {reaction('marja', 'MARJA').map((l, i) => (
              <VoiceLine key={`mr${i}`} v={l.v ?? 'MARIA'} t={l.t} />
            ))}
            {narr('street/eetu-intro') && <VoiceLine t={narr('street/eetu-intro')!.t} />}
            {spoken('eetu', eetuRung).map((l, i) => (
              <VoiceLine key={`e${i}`} v={l.v ?? 'EETU'} t={l.t} />
            ))}
            {reaction('eetu', 'EETU').map((l, i) => (
              <VoiceLine key={`er${i}`} v={l.v ?? 'EETU'} t={l.t} />
            ))}
          </div>
          <div className="flex flex-col gap-3 shrink-0 pt-1">
            <SideFace pid="MARJA" rung={marjaRung} tilt="rotate-2" />
            <SideFace pid="EETU" rung={eetuRung} tilt="-rotate-2" />
          </div>
        </div>

        {(doc['street/shivers']?.lines ?? []).map((l, i) => (
          <VoiceLine key={`s${i}`} v={l.v} t={l.t} />
        ))}
        <TunnelBackdrop />
        {!walkedIn && (
          <div className="flex justify-end">
            <button
              onClick={() => setWalkedIn(true)}
              className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-8 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95"
            >
              {doc['street/enter']?.meta.button ?? 'Enter'}
            </button>
          </div>
        )}
      </div>

      {walkedIn && <TunnelScene doc={doc} ctx={ctx} />}
    </div>
  )
}
