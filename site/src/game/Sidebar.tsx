import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ActorId, GameContent, GameState, GoalStatus, PersonaId } from './types'
import { ACTORS, PERSONA_PINS, PERSONAS } from './types'
import { evaluateGoals, latestPersonaRung, NODE_YEARS, outcomeBaseData } from './engine'
import { eraForPhase, moodFor, MoodFace, PERSONA_NAMES, PERSONA_PORTRAITS, Portrait } from './portraits'

const YEARS = [2026, 2028, 2029, 2031, 2033]

interface GhostSet {
  [phaseIdx: number]: Record<string, Record<string, number>>
}

export function computeGhosts(content: GameContent, state: GameState): GhostSet {
  const ghosts: GhostSet = {}
  for (let i = 0; i < 3; i++) {
    if (i > state.results.length) break
    const phase = content.phases[i]
    const prevNodes = [content.baseline, ...state.results.slice(0, i).map((r) => r.dataNode)]
    ghosts[i] = {}
    for (const cls of ['O1', 'O2', 'O3', 'O4', 'O5'] as const) {
      ghosts[i][cls] = outcomeBaseData(content, phase.outcomes[cls], prevNodes, NODE_YEARS[i + 1])
    }
  }
  return ghosts
}

function Disclosure({
  summary,
  children,
  tone = 'neutral',
}: {
  summary: React.ReactNode
  children: React.ReactNode
  tone?: 'met' | 'miss' | 'open' | 'neutral'
}) {
  const [open, setOpen] = useState(false)
  const dot =
    tone === 'met' ? 'bg-emerald-400' : tone === 'miss' ? 'bg-red-400' : tone === 'open' ? 'bg-white/25' : 'bg-[#e8702a]'
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 py-2 text-left hover:bg-white/[0.03] rounded px-1"
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
        <span className="flex-1 text-[12.5px] text-white/85 leading-snug">{summary}</span>
        {open ? <ChevronDown size={13} className="text-white/30 shrink-0" /> : <ChevronRight size={13} className="text-white/30 shrink-0" />}
      </button>
      {open && <div className="pb-3 pl-4 pr-1 text-[12px] text-white/55 leading-relaxed space-y-1.5">{children}</div>}
    </div>
  )
}

function GoalRows({ statuses }: { statuses: GoalStatus[] }) {
  return (
    <div>
      {statuses.map((s, i) => (
        <Disclosure
          key={i}
          tone={s.state}
          summary={
            <>
              {s.goal.title}
              <span className={`ml-1.5 text-[10px] uppercase tracking-wide ${
                s.state === 'met' ? 'text-emerald-400' : s.state === 'miss' ? 'text-red-400' : 'text-white/35'
              }`}>
                {s.state === 'met' ? 'on track' : s.state === 'miss' ? 'failing' : 'open'}
              </span>
            </>
          }
        >
          <p className="text-white/70">{s.reading}</p>
          <p>{s.goal.why}</p>
        </Disclosure>
      ))}
    </div>
  )
}

const PHASE_YEARS = ['2028', '2029', '2031']

function displayName(pid: PersonaId): string {
  return PERSONA_NAMES[pid]
}

function PersonaRows({ content, state }: { content: GameContent; state: GameState }) {
  const lastResult = state.results[state.results.length - 1]
  return (
    <div>
      {PERSONAS.map((pid) => {
        const persona = content.personas[pid]
        const descriptor = persona.title.split(/[—-]/).slice(1).join('—').trim()
        const rung = latestPersonaRung(state, pid)
        const prevRung = state.results.length > 1 ? rungAt(state, pid, state.results.length - 2) : null
        const ladder = rung ? persona.ladder.find((l) => parseInt(l.rung.slice(1)) === rung) : null
        const trendDelta = rung && prevRung ? rung - prevRung : 0
        const trend = rung && prevRung ? (rung > prevRung ? '↑' : rung < prevRung ? '↓' : '→') : ''
        const tone: 'met' | 'miss' | 'open' = rung === null ? 'open' : rung >= 4 ? 'met' : rung <= 2 ? 'miss' : 'open'
        // her/his life so far: one chapter per resolved phase, plus the 2033 line
        const chapters = state.results
          .map((r, i) => {
            const imp = r.outcome.personas.find((p) => p.persona === pid)
            return imp ? { year: PHASE_YEARS[i], text: imp.text, rung: imp.rung } : null
          })
          .filter(Boolean) as { year: string; text: string; rung: string }[]
        return (
          <Disclosure
            key={pid}
            tone={tone}
            summary={
              <span className="flex items-center gap-2.5">
                <Portrait
                  slots={PERSONA_PORTRAITS[pid]}
                  era={state.endstate ? '2033' : eraForPhase(state.phaseIdx + 1)}
                  name={displayName(pid)}
                  size="xs"
                />
                <span className="flex flex-col leading-tight gap-0.5">
                <MoodFace pid={pid} mood={moodFor(rung, trendDelta)} size={18} era={state.endstate ? '2033' : eraForPhase(state.phaseIdx + 1)} />
                <span>
                <span className="font-medium">{displayName(pid)}</span>
                <span className="ml-1.5 text-white/45">
                  {rung ? `${ladder?.state ?? ''} (${pid.charAt(0)}${rung})` : '2026'}
                </span>
                {trend && (
                  <span className={`ml-1 ${trend === '↑' ? 'text-emerald-400' : trend === '↓' ? 'text-red-400' : 'text-white/30'}`}>
                    {trend}
                  </span>
                )}
                </span>
                </span>
              </span>
            }
          >
            {descriptor && <p className="text-white/40">{descriptor}</p>}
            {persona.aspiration && (
              <p className="text-white/60">
                <span className="font-semibold text-white/45">Wants:</span> {firstSentences(persona.aspiration, 2)}
              </p>
            )}
            <p>{firstSentences(persona.baseline, 2)}</p>
            {chapters.map((c) => (
              <p key={c.year} className="text-white/70">
                <span className="font-semibold text-white/50">{c.year}:</span> {c.text}
              </p>
            ))}
            {state.endstate && (
              <p className="text-white/70">
                <span className="font-semibold text-white/50">2033:</span> {state.endstate.personaRungs[pid].line}
              </p>
            )}
            {ladder && <p className="italic">{ladder.rendering}</p>}
            <p className="text-white/40">
              watches:{' '}
              {PERSONA_PINS[pid]
                .map((ind) => `${ind} ${latestValue(content, state, ind)}`)
                .join(' · ')}
            </p>
          </Disclosure>
        )
      })}
      {!lastResult && (
        <p className="text-[11px] text-white/30 pt-2">
          Two lives, one country. Every decision the table makes writes their next chapter here.
        </p>
      )}
    </div>
  )
}

function rungAt(state: GameState, pid: PersonaId, resultIdx: number): number | null {
  for (let i = resultIdx; i >= 0; i--) {
    const imp = state.results[i]?.outcome.personas.find((p) => p.persona === pid)
    if (imp) {
      const n = parseInt(imp.rung.replace(/^[A-Z]+/, ''))
      if (!Number.isNaN(n)) return n
    }
  }
  return null
}

function latestValue(content: GameContent, state: GameState, ind: string): string | number {
  const d = state.endstate?.dataNode ?? state.results[state.results.length - 1]?.dataNode ?? content.baseline
  return d[ind] ?? '—'
}

function firstSentences(text: string, n: number): string {
  return text.split(/(?<=\.)\s+/).slice(0, n).join(' ')
}

function Sparkline({
  content,
  state,
  ghosts,
  indicatorId,
  label,
  unit,
  plain,
}: {
  content: GameContent
  state: GameState
  ghosts: GhostSet
  indicatorId: string
  label: string
  unit: string
  plain?: string
}) {
  const W = 260
  const H = 84
  const PAD = { l: 8, r: 34, t: 10, b: 16 }

  // grey run-up: plausible history before the game starts
  const historyPts: { year: number; v: number }[] = []
  if (content.history?.series[indicatorId]) {
    content.history.years.forEach((yr, i) => {
      historyPts.push({ year: yr, v: content.history!.series[indicatorId][i] })
    })
  }

  const played: { year: number; v: number }[] = [{ year: 2026, v: content.baseline[indicatorId] ?? 0 }]
  state.results.forEach((r, i) => played.push({ year: YEARS[i + 1], v: r.dataNode[indicatorId] ?? 0 }))
  if (state.endstate) played.push({ year: 2033, v: state.endstate.dataNode[indicatorId] ?? 0 })

  const ghostPts: { year: number; v: number }[] = []
  Object.entries(ghosts).forEach(([pi, byCls]) => {
    const idx = Number(pi)
    const playedCls = state.results[idx]?.outcome.cls
    Object.entries(byCls as Record<string, Record<string, number>>).forEach(([cls, vals]) => {
      if (cls === playedCls) return
      if (vals[indicatorId] !== undefined) ghostPts.push({ year: YEARS[idx + 1], v: vals[indicatorId] })
    })
  })

  const all = [...historyPts.map((p) => p.v), ...played.map((p) => p.v), ...ghostPts.map((p) => p.v)]
  const min = Math.min(...all)
  const max = Math.max(...all)
  const span = max - min || 1
  const xMin = historyPts.length ? historyPts[0].year : 2026
  const x = (year: number) => PAD.l + ((year - xMin) / (2033 - xMin)) * (W - PAD.l - PAD.r)
  const y = (v: number) => PAD.t + (1 - (v - min) / span) * (H - PAD.t - PAD.b)

  const toPath = (pts: { year: number; v: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.year).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ')
  const last = played[played.length - 1]
  const tickYears = historyPts.length ? [xMin, 2022, 2026, 2030, 2033] : YEARS

  return (
    <div className="mb-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-wide text-white/50">{label}</span>
        <span className="text-[11px] text-white/40">
          {PERSONAS.filter((p) => PERSONA_PINS[p].includes(indicatorId)).map((p) => (
            <span key={p} title={`${displayName(p)} watches this number`} className="ml-1 inline-block w-4 h-4 rounded-full bg-white/10 text-center text-[9px] leading-4 text-white/70">
              {p.charAt(0)}
            </span>
          ))}
        </span>
      </div>
      {plain && <p className="text-[11px] text-white/45 leading-snug mb-1">{plain}</p>}
      <svg width={W} height={H} className="block">
        {tickYears.map((yr) => (
          <line key={yr} x1={x(yr)} y1={PAD.t} x2={x(yr)} y2={H - PAD.b} stroke="rgba(255,255,255,0.07)" />
        ))}
        {/* the world before the game: grey and already moving */}
        {historyPts.length > 0 && (
          <path d={toPath([...historyPts, played[0]])} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.5} />
        )}
        {historyPts.map((p, i) => (
          <circle key={i} cx={x(p.year)} cy={y(p.v)} r={1.8} fill="rgba(255,255,255,0.3)" />
        ))}
        {ghostPts.map((g, i) => (
          <circle key={i} cx={x(g.year)} cy={y(g.v)} r={2.5} fill="rgba(255,255,255,0.18)" />
        ))}
        <path d={toPath(played)} fill="none" stroke="#e8702a" strokeWidth={2} />
        {played.map((p, i) => (
          <circle key={i} cx={x(p.year)} cy={y(p.v)} r={3} fill="#e8702a" />
        ))}
        {last && (
          <text x={x(last.year) + 5} y={y(last.v) + 3.5} fontSize={11} fill="#fff">
            {last.v}
          </text>
        )}
        {tickYears.map((yr) => (
          <text key={yr} x={x(yr)} y={H - 3} fontSize={8.5} fill="rgba(255,255,255,0.35)" textAnchor="middle">
            {String(yr).slice(2)}
          </text>
        ))}
      </svg>
      <div className="text-[10px] text-white/30 -mt-1">{unit}</div>
    </div>
  )
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-t border-white/10 pt-3 mt-3 first:border-0 first:pt-0 first:mt-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-1">
        <span className="text-[11px] uppercase tracking-wide text-white/50">{title}</span>
        {open ? <ChevronDown size={12} className="text-white/30" /> : <ChevronRight size={12} className="text-white/30" />}
      </button>
      {open && children}
    </div>
  )
}

interface SidebarProps {
  content: GameContent
  state: GameState
  viewerActor?: ActorId | null
}

/** Desktop: sticky right column. Mobile: a pull-up drawer fixed to the
 * bottom edge, so goals, lives and charts stay one thumb away. */
export default function Sidebar(props: SidebarProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <aside className="hidden lg:block w-full lg:w-[300px] shrink-0 lg:sticky lg:top-16 self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
        <SidebarBody {...props} />
      </aside>
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex flex-col">
        <div
          className={`bg-[#0b1018]/95 backdrop-blur border-t border-white/10 overflow-y-auto transition-[max-height] duration-300 ease-out ${
            open ? 'max-h-[70vh]' : 'max-h-0'
          }`}
        >
          <div className="p-4 pb-2">
            <SidebarBody {...props} />
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center gap-2 bg-[#0b1018]/95 backdrop-blur border-t border-white/15 py-3 text-[11px] uppercase tracking-[0.25em] text-white/70 active:text-white"
        >
          {open ? '▾ Hide the numbers' : '▴ Goals · lives · numbers'}
        </button>
      </div>
    </>
  )
}

function SidebarBody({ content, state, viewerActor }: SidebarProps) {
  const ghosts = computeGhosts(content, state)
  const lastResult = state.results[state.results.length - 1]

  return (
    <div>
      {viewerActor ? (
        <Section title="Your goals">
          <GoalRows statuses={evaluateGoals(content, state, viewerActor)} />
        </Section>
      ) : (
        content.goals.length > 0 && (
          <Section title="Goals around the table" defaultOpen={false}>
            {ACTORS.map((a) => {
              const st = evaluateGoals(content, state, a)
              const met = st.filter((s) => s.state === 'met').length
              return (
                <Disclosure key={a} tone={met >= st.length - 1 ? 'met' : met === 0 ? 'miss' : 'open'} summary={<><span className="font-medium">{a}</span> <span className="text-white/40">{met}/{st.length} on track</span></>}>
                  {st.map((s, i) => (
                    <p key={i}>
                      <span className={s.state === 'met' ? 'text-emerald-400' : s.state === 'miss' ? 'text-red-400' : 'text-white/40'}>●</span>{' '}
                      {s.goal.title}: {s.reading}
                    </p>
                  ))}
                </Disclosure>
              )
            })}
          </Section>
        )
      )}

      <Section title="Two lives">
        <PersonaRows content={content} state={state} />
      </Section>

      <Section title="Government approval">
        <div className="space-y-1">
          <div className="flex items-center gap-2 pt-1">
            <span className="w-9 text-[11px] font-semibold text-white/60" title="Government approval">POLL</span>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${state.poll >= 48 ? 'bg-emerald-500/80' : state.poll >= 42 ? 'bg-[#e8702a]' : 'bg-red-500/80'}`}
                style={{ width: `${state.poll}%` }}
              />
            </div>
            <span className="w-14 text-right text-[11px] text-white/70">
              {state.poll}%
              {lastResult && lastResult.pollDelta !== 0 && (
                <span className={lastResult.pollDelta > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {' '}{lastResult.pollDelta > 0 ? '+' : ''}{lastResult.pollDelta}
                </span>
              )}
            </span>
          </div>
          <p className="text-[10px] text-white/30 pl-11">government approval. The 2031 election is scored from this.</p>
        </div>
      </Section>

      <Section title="The numbers, 2018 → 2033">
        <div className="grid grid-cols-1 gap-2">
          {content.indicators.filter((ind) => content.chartIds.includes(ind.id)).map((ind) => (
            <Sparkline
              key={ind.id}
              content={content}
              state={state}
              ghosts={ghosts}
              indicatorId={ind.id}
              label={ind.id.replace('_', ' ')}
              unit={ind.unit}
              plain={ind.plain}
            />
          ))}
        </div>
      </Section>

    </div>
  )
}
