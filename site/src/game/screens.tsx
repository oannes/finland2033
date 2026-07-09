import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Lock, Users } from 'lucide-react'
import type {
  Action,
  Dilemma,
  Interlude,
  ActorId,
  GameContent,
  GameState,
  PhaseContent,
  PhaseResult,
} from './types'
import { ACTORS } from './types'
import { actorMenu, evaluateGoals, injectRelevant, interpolateNumbers, matchingVariants, narrativeNote, decisionImpacts, keyMetricFor, gateReason, metricEnv } from './engine'
import Markdown from './Markdown'
import { ACTOR_PORTRAITS, eraForPhase, moodFor, MoodFace, PERSONA_NAMES, PERSONA_PORTRAITS, Portrait } from './portraits'
import { StreetScene } from './epilogue'
import { RevealSequence } from './reveal'

const YEAR_BY_PHASE: Record<number, string> = { 1: '2027–28', 2: '2029', 3: '2031' }

/** short seat names for the endstate attribution lines */
const SHORT_ROLE: Record<ActorId, string> = {
  PM: 'Prime Minister',
  AKAVA: 'union chair',
  COUNTY: 'county director',
  TI: 'industry federation',
  AALTO: 'rector',
  HVK: 'security-of-supply chief',
  STARTUP: 'founder',
}

export function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 ${className}`}>{children}</div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-[#e8702a] hover:bg-[#d2611f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95"
    >
      {children}
    </button>
  )
}

export function WaitNote({ text = 'Waiting for the facilitator to advance…' }: { text?: string }) {
  return (
    <span className="text-sm text-white/40 italic inline-flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#e8702a] animate-pulse" />
      {text}
    </span>
  )
}

function Collapsible({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-white/90 hover:bg-white/5"
      >
        {title}
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

// ---------- Briefing ----------

export function BriefingScreen({
  content,
  state,
  onStart,
  canAdvance = true,
}: {
  content: GameContent
  state: GameState
  onStart: () => void
  canAdvance?: boolean
}) {
  const actor = state.playerActor
  const brief = actor ? content.actors[actor] : null
  const goals = actor ? content.goals.filter((g) => g.actor === actor) : []

  return (
    <div className="space-y-6">
      <SectionCard>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-2">Briefing · spring 2027</p>
        <h2 className="font-playfair italic text-3xl text-white">
          {brief ? brief.title.replace(/^[A-Z]+\s*[—-]\s*/, '') : 'Seven seats at the table'}
        </h2>
      </SectionCard>

      {actor && brief && (
        <>
          {brief.who && (
            <SectionCard>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Who you are</p>
              <div className="sm:flex sm:gap-6 sm:items-start">
                <Portrait slots={ACTOR_PORTRAITS[actor]} era="now" name={actor} size="md" className="mb-3 sm:mb-0" />
                <div className="flex-1">
                  <Markdown text={brief.who} />
                </div>
              </div>
            </SectionCard>
          )}

          {goals.length > 0 && (
            <SectionCard>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-3">Your goals</p>
              <div className="grid md:grid-cols-3 gap-3">
                {goals.map((g, i) => (
                  <div key={i} className="rounded-xl border border-white/15 p-4">
                    <div className="font-playfair italic text-lg text-white mb-1.5">{g.title}</div>
                    <p className="text-[12.5px] text-white/60 leading-relaxed">{g.why}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          <div className="grid md:grid-cols-2 gap-3">
            {brief.levers && (
              <SectionCard>
                <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/80 mb-2">How you move the world</p>
                <Markdown text={brief.levers} className="text-sm" />
              </SectionCard>
            )}
            {brief.cannotControl && (
              <SectionCard>
                <p className="text-[11px] uppercase tracking-[0.2em] text-red-400/80 mb-2">What you cannot control</p>
                <Markdown text={brief.cannotControl} className="text-sm" />
              </SectionCard>
            )}
          </div>

          <p className="text-[12px] text-white/35">
            The numbers in this brief are anchored to public sources.{' '}
            <a href="#/about#sources" className="underline hover:text-white/60">Where they come from</a> ·{' '}
            <a href="#/about" className="underline hover:text-white/60">About this scenario</a>
          </p>
        </>
      )}

      {!actor && (
        <SectionCard>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">The seven actors (facilitator view)</p>
          <div className="space-y-2">
            {ACTORS.map((a) => (
              <Collapsible key={a} title={content.actors[a].title}>
                <Markdown text={content.actors[a].raw.split('\n').slice(1).join('\n')} />
              </Collapsible>
            ))}
            <Collapsible title="The weather: eight trends nobody at the table can decide">
              <div className="space-y-2 pt-1">
                {content.trends.map((t) => (
                  <Collapsible key={t.id} title={`${t.id}: ${t.title}`}>
                    <Markdown text={t.text} />
                  </Collapsible>
                ))}
              </div>
            </Collapsible>
          </div>
        </SectionCard>
      )}

      <div className="flex justify-end">
        {canAdvance ? <PrimaryButton onClick={onStart}>Open the first decision →</PrimaryButton> : <WaitNote />}
      </div>
    </div>
  )
}

// ---------- Facilitator brief (hidden from players) ----------

export function FacilitatorBrief({
  state,
  phase,
}: {
  state: GameState
  phase: PhaseContent
}) {
  const variants = matchingVariants(phase, state.flags)
  return (
    <SectionCard>
      <Collapsible title="Facilitator brief (read to the room)">
        <div className="pt-2 space-y-4">
          <Markdown text={phase.tension.intro} />
          {variants.length > 0 && (
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="border-l-2 border-[#e8702a]/50 pl-3">
                  <span className="text-xs font-semibold text-white/70">{v.condRaw}</span>
                  <Markdown text={v.text} className="text-sm" />
                </div>
              ))}
            </div>
          )}
          {phase.tension.injects.map((inj, i) => (
            <div key={i} className="border-l-2 border-white/15 pl-4 py-1">
              <span className="text-xs font-semibold text-white/50">{inj.label}</span>
              <Markdown text={inj.text} className="text-sm" />
            </div>
          ))}
          {phase.tension.projects.map((p) => (
            <div key={p.key}>
              <div className="text-sm font-semibold text-white/80 mb-1">
                {p.key === 'H' ? `Hedge: ${p.title}` : `Grand Project ${p.key}: ${p.title}`}
              </div>
              <Markdown text={p.text} className="text-sm" />
            </div>
          ))}
          {phase.tension.whyNoOwner && <Markdown text={phase.tension.whyNoOwner} className="text-sm" />}
        </div>
      </Collapsible>
    </SectionCard>
  )
}

// ---------- Decide ----------

export function DecideScreen({
  content,
  state,
  phase,
  actor,
  locked,
  onLock,
}: {
  content: GameContent
  state: GameState
  phase: PhaseContent
  actor: ActorId
  locked: Partial<Record<ActorId, boolean>>
  onLock: (actionId: string) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const env = metricEnv(content, state)
  const { available, gated } = actorMenu(phase, actor, state.flags, env)
  const variants = matchingVariants(phase, state.flags)
  const deskBrief = phase.briefs[actor]
  const othersWaiting = Object.keys(locked).length > 0

  return (
    <div className="space-y-6">
      <SectionCard>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-2">
          Decision {phase.idx} · {phase.tension.year || YEAR_BY_PHASE[phase.idx]}
        </p>
        <h2 className="font-playfair italic text-3xl sm:text-4xl text-white mb-2">{phase.tension.title}</h2>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {evaluateGoals(content, state, actor).map((s, i) => (
            <span
              key={i}
              title={`${s.reading} ${s.goal.why}`}
              className={`px-2 py-1 rounded-full text-[11px] border ${
                s.state === 'met'
                  ? 'border-emerald-400/40 text-emerald-300'
                  : s.state === 'miss'
                    ? 'border-red-400/40 text-red-300'
                    : 'border-white/15 text-white/45'
              }`}
            >
              {s.goal.title}
            </span>
          ))}
        </div>
      </SectionCard>

      {phase.tension.capability && phase.tension.capability.length > 0 && (
        <SectionCard>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">What the machines can now do</p>
          <ul className="space-y-1.5">
            {phase.tension.capability.map((c, i) => (
              <li key={i} className="text-[13.5px] text-white/70 leading-relaxed flex gap-2">
                <span className="text-[#e8702a]/70 shrink-0">▸</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {variants.length > 0 && (
        <SectionCard className="border-[#e8702a]/30">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-3">What you carry in</p>
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i}>
                {v.label && <span className="text-xs font-semibold text-[#e8702a]/90">{v.label}</span>}
                <Markdown text={v.text} className="text-sm" />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {deskBrief && (
        <SectionCard>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">Your brief</p>
          <Markdown text={deskBrief} />
        </SectionCard>
      )}

      {phase.tension.injects.some((_, i) => injectRelevant(content, phase.idx, i, actor)) && (
        <SectionCard>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">What lands on your desk</p>
          <div className="space-y-3">
            {phase.tension.injects.map((inj, i) =>
              injectRelevant(content, phase.idx, i, actor) ? (
                <div key={i} className="border-l-2 border-white/15 pl-4 py-0.5">
                  <span className="text-xs font-semibold text-white/50">{inj.label}</span>
                  <Markdown text={inj.text} className="text-sm" />
                </div>
              ) : null,
            )}
          </div>
        </SectionCard>
      )}

      {phase.idx === 3 && state.results.length >= 2 && (
        <SectionCard>
          <Collapsible title="The inquiry's record: what this table chose in 2027 and 2029">
            <InquiryRecord content={content} state={state} />
          </Collapsible>
        </SectionCard>
      )}

      <div className="grid md:grid-cols-3 gap-3">
        {available.map((a) => (
          <ActionCard key={a.id} action={a} selected={selected === a.id} onSelect={() => setSelected(a.id)} />
        ))}
      </div>
      {gated.length > 0 && (
        <div className="grid md:grid-cols-3 gap-3">
          {gated.map((a) => (
            <div key={a.id} className="rounded-xl border border-white/5 p-4 opacity-40 cursor-not-allowed">
              <div className="text-[11px] uppercase tracking-wide text-white/40 mb-1 flex items-center gap-1">
                <Lock size={11} /> not possible: {gateReason(content, a, env) || 'earlier choices closed this door'}
              </div>
              <div className="font-playfair italic text-lg text-white/70 mb-1">{a.title}</div>
              <p className="text-[13px] text-white/50 leading-relaxed">{a.summary}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end items-center gap-4">
        {othersWaiting && (
          <span className="text-[11px] text-white/40 flex items-center gap-1.5">
            <Users size={13} />
            {ACTORS.filter((a) => locked[a] !== undefined || a === actor).length > 0 &&
              ACTORS.map((a) => (
                <span key={a} className={locked[a] ? 'text-emerald-400' : ''}>
                  {a}{locked[a] ? '✓' : ''}
                </span>
              ))}
          </span>
        )}
        <PrimaryButton disabled={!selected} onClick={() => selected && onLock(selected)}>
          Decide
        </PrimaryButton>
      </div>
    </div>
  )
}

function InquiryRecord({ content, state }: { content: GameContent; state: GameState }) {
  return (
    <div className="space-y-4 pt-2">
      {state.results.map((r, i) => {
        const phase = content.phases[i]
        return (
          <div key={i}>
            <div className="text-xs font-semibold text-[#e8702a] mb-1">
              {PHASE_YEAR_LABEL[r.phase]} → {r.outcome.name}
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0.5">
              {ACTORS.map((a) => {
                const act = phase.actions[a].find((x) => x.id === r.choices[a])
                return (
                  <div key={a} className="text-[13px] text-white/65">
                    <span className="font-semibold text-white/80">{a}</span>
                    {': '}
                    {act ? `“${act.title}”` : '—'}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const PHASE_YEAR_LABEL: Record<number, string> = { 1: '2027–28', 2: '2029', 3: '2031' }

function ActionCard({ action, selected, onSelect }: { action: Action; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-xl border p-4 transition-all ${
        selected ? 'border-[#e8702a] bg-[#e8702a]/10 scale-[1.01]' : 'border-white/15 hover:border-white/35 bg-white/[0.02]'
      }`}
    >
      <div className="font-playfair italic text-lg text-white mb-1">{action.title}</div>
      {action.lever && (
        <div className="text-[10.5px] uppercase tracking-[0.15em] text-[#e8702a]/80 mb-1.5">
          your lever · {action.lever}
        </div>
      )}
      <p className="text-[13px] text-white/65 leading-relaxed">{action.summary}</p>
    </button>
  )
}

// ---------- Implications (the reveal) ----------

const KEY_NUMBERS: { id: string; label: string; downIsGood?: boolean; unit?: string }[] = [
  { id: 'pub_ai', label: 'public AI', unit: '%' },
  { id: 'trust', label: 'trust', unit: '%' },
  { id: 'youth_u', label: 'youth unemployment', unit: '%', downIsGood: true },
  { id: 'care_gap', label: 'care gap', unit: 'k', downIsGood: true },
]

function personaRungNum(result: PhaseResult, pid: 'MARJA' | 'EETU'): number | null {
  const imp = result.outcome.personas.find((p) => p.persona === pid)
  if (!imp) return null
  const n = parseInt(imp.rung.replace(/^[A-Z]+/, ''))
  return Number.isNaN(n) ? null : n
}

export function RevealScreen({
  content,
  state,
  phase,
  result,
  isLast,
  onContinue,
  canAdvance = true,
  viewerActor = null,
}: {
  content: GameContent
  state: GameState
  phase: PhaseContent
  result: PhaseResult
  isLast: boolean
  onContinue: () => void
  canAdvance?: boolean
  viewerActor?: ActorId | null
}) {
  const era = eraForPhase(phase.idx)
  // the numbers this outcome produced, against where the country stood before
  const prevResult = state.results[phase.idx - 2] ?? null
  const prevData = prevResult?.dataNode ?? content.baseline
  const moods = {
    MARJA: moodFor(personaRungNum(result, 'MARJA'), (personaRungNum(result, 'MARJA') ?? 0) - (prevResult ? personaRungNum(prevResult, 'MARJA') ?? 0 : 0)),
    EETU: moodFor(personaRungNum(result, 'EETU'), (personaRungNum(result, 'EETU') ?? 0) - (prevResult ? personaRungNum(prevResult, 'EETU') ?? 0 : 0)),
  }
  const numCtx = { data: result.dataNode, poll: result.pollAfter, moods }
  // how this round moved the things the player answers for
  let goalsNow = 0
  let goalsBefore = 0
  let goalsTotal = 0
  if (viewerActor) {
    const afterStatuses = evaluateGoals(content, state, viewerActor)
    goalsTotal = afterStatuses.length
    goalsNow = afterStatuses.filter((s) => s.state === 'met').length
    const beforeState: GameState = {
      ...state,
      results: state.results.slice(0, phase.idx - 1),
      flags: prevResult?.flagsAfter ?? {},
      indices: prevResult?.indicesAfter ?? { RES: 5, LEG: 5, PRO: 5 },
      poll: prevResult?.pollAfter ?? 50,
      endstate: null,
    }
    goalsBefore = evaluateGoals(content, beforeState, viewerActor).filter((s) => s.state === 'met').length
  }
  return (
    <div className="space-y-6">
      <SectionCard>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-2">
          {YEAR_BY_PHASE[phase.idx]} · What your decisions did
        </p>
        <h2 className="font-playfair italic text-3xl sm:text-4xl text-white mb-1">{result.outcome.name}</h2>
        {result.outcome.epigraph && <p className="text-white/50 italic mb-4">“{result.outcome.epigraph}”</p>}
        {narrativeNote(result.comboRow.note) && (
          <div className="text-sm border-l-2 border-[#e8702a]/60 pl-3 mb-4">
            <Markdown text={interpolateNumbers(narrativeNote(result.comboRow.note), numCtx)} className="text-sm" />
          </div>
        )}
        <Markdown text={interpolateNumbers(result.outcome.narrative, numCtx)} />

        {/* the state of the nation, in numbers — the outcome is what the numbers say it is */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
          {KEY_NUMBERS.map(({ id, label, unit, downIsGood }) => {
            const v = result.dataNode[id]
            if (v === undefined) return null
            const d = Math.round((v - (prevData[id] ?? v)) * 10) / 10
            const good = d === 0 ? null : downIsGood ? d < 0 : d > 0
            return (
              <span key={id} className="px-2.5 py-1 rounded-full bg-white/5 text-[11.5px] text-white/70">
                {label} <span className="text-white font-semibold">{v}{unit}</span>
                {d !== 0 && (
                  <span className={good ? 'text-emerald-400' : 'text-red-400'}> {d > 0 ? '+' : ''}{d}</span>
                )}
              </span>
            )
          })}
          <span className="px-2.5 py-1 rounded-full bg-white/5 text-[11.5px] text-white/70">
            approval <span className="text-white font-semibold">{result.pollAfter}%</span>
            {result.pollDelta !== 0 && (
              <span className={result.pollDelta > 0 ? 'text-emerald-400' : 'text-red-400'}> {result.pollDelta > 0 ? '+' : ''}{result.pollDelta}</span>
            )}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/5 text-[11.5px] text-white/70 inline-flex items-center gap-1.5">
            <MoodFace pid="MARJA" mood={moods.MARJA} size={15} era={era} /> Maria is {moods.MARJA}
            <span className="text-white/25 mx-0.5">·</span>
            <MoodFace pid="EETU" mood={moods.EETU} size={15} era={era} /> Eetu is {moods.EETU}
          </span>
          {viewerActor && goalsTotal > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-white/5 text-[11.5px] text-white/70">
              your goals <span className="text-white font-semibold">{goalsNow}/{goalsTotal}</span>
              {goalsNow !== goalsBefore && (
                <span className={goalsNow > goalsBefore ? 'text-emerald-400' : 'text-red-400'}>
                  {' '}{goalsNow > goalsBefore ? '▲' : '▼'}
                </span>
              )}
            </span>
          )}
        </div>
      </SectionCard>

      {/* the two lives */}
      <div className="grid sm:grid-cols-2 gap-3">
        {result.outcome.personas.map((imp) => {
          const persona = content.personas[imp.persona]
          const ladder = persona.ladder.find((l) => imp.rung.startsWith(l.rung))
          return (
            <SectionCard key={imp.persona} className="border-[#e8702a]/20 !p-5">
              <div className="flex gap-4">
                <Portrait slots={PERSONA_PORTRAITS[imp.persona]} era={era} name={imp.persona} size="md" />
                <div>
                  <div className="font-playfair italic text-xl text-white">
                    {PERSONA_NAMES[imp.persona]}
                    <span className="ml-2 text-xs text-white/50">{ladder?.state ?? imp.rung}</span>
                  </div>
                  <Markdown text={interpolateNumbers(imp.text, numCtx)} className="text-sm mt-1" />
                </div>
              </div>
            </SectionCard>
          )
        })}
      </div>

      {result.clashes.length > 0 && (
        <SectionCard>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">The collisions</p>
          <div className="space-y-3">
            {result.clashes.map((c, i) => (
              <div key={i} className="border-l-2 border-[#e8702a]/40 pl-3">
                <div className="text-sm text-white/85 font-playfair italic">{c.edge.title}</div>
                <p className="text-[13px] text-white/60 leading-relaxed mt-0.5">
                  {c.line} <span className="text-white/35">(the {SHORT_ROLE[c.loser]} pays)</span>
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">What the seven decided</p>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-5">
          {ACTORS.map((a) => {
            const act = phase.actions[a].find((x) => x.id === result.choices[a])
            return (
              <div key={a} className="flex items-center gap-2.5 text-[13px] text-white/70">
                <Portrait slots={ACTOR_PORTRAITS[a]} era={era} name={a} size="xs" />
                <span>
                  <span className="font-semibold text-white/85">{a}</span>
                  {': '}
                  {act ? `“${act.title}”` : '—'}
                </span>
              </div>
            )
          })}
        </div>
        {result.hooks.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-4">
            {result.hooks.map((h) => (
              <div key={h.actionId} className="text-sm text-white/70 leading-relaxed flex gap-2">
                <span className="font-semibold text-white/90 shrink-0">{h.actor}:</span>
                <Markdown text={interpolateNumbers(narrativeNote(h.text), numCtx)} className="text-sm" />
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="flex justify-end">
        {canAdvance ? (
          <PrimaryButton onClick={onContinue}>
            {isLast ? 'Finland, 2033 →' : `On to ${YEAR_BY_PHASE[phase.idx + 1]} →`}
          </PrimaryButton>
        ) : (
          <WaitNote />
        )}
      </div>
    </div>
  )
}

// ---------- Interlude (time passes, the world moves, the cousins text) ----------

export function InterludeScreen({
  content,
  state,
  interlude,
  onContinue,
}: {
  content: GameContent
  state: GameState
  interlude: Interlude
  onContinue: () => void
}) {
  const { fromYear, toYear } = interlude
  const exoAt = (id: string, year: number) =>
    year <= 2026 ? content.baseline[id] : content.exogenous[id]?.[year] ?? content.baseline[id]
  const costFrom = exoAt('intel_cost', fromYear)
  const costTo = exoAt('intel_cost', toYear)
  const costFall = Math.round((1 - costTo / costFrom) * 100)
  const gapFrom = exoAt('cap_gap', fromYear)
  const gapTo = exoAt('cap_gap', toYear)
  const latest = state.results[state.results.length - 1]?.dataNode ?? content.baseline
  const [allRead, setAllRead] = useState(false)
  const era = eraForPhase(state.phaseIdx + 1)
  const lastResult = state.results[state.results.length - 1]
  const moodOf = (pid: 'MARJA' | 'EETU') =>
    lastResult ? moodFor(personaRungNum(lastResult, pid), 0) : 'frustrated'
  return (
    <div className="space-y-6">
      <SectionCard>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-2">
          {fromYear} → {toYear}
        </p>
        <h2 className="font-playfair italic text-3xl sm:text-4xl text-white mb-5">{interlude.passes}</h2>
        {/* the drumbeat: same box every time, worsening */}
        <div className="rounded-xl border border-white/15 bg-white/[0.03] p-5 space-y-2.5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">The world, while Finland decided</p>
          <p className="text-[15px] text-white/85">
            The price of machine cognition fell <span className="text-[#e8702a] font-semibold">{costFall}%</span>.
          </p>
          <p className="text-[15px] text-white/85">
            The capability gap grew to{' '}
            <span className="text-[#e8702a] font-semibold">{gapTo} months</span>
            <span className="text-white/45"> (+{Math.round((gapTo - gapFrom) * 10) / 10})</span>. No Finnish decision moves this line.
          </p>
          {latest.days !== undefined && (
            <p className="text-[15px] text-white/85">
              If the access stopped tomorrow, Finland would run alone for{' '}
              <span className="text-[#e8702a] font-semibold">{latest.days} days</span>.
            </p>
          )}
        </div>
      </SectionCard>

      {interlude.messages.length > 0 && (
        <SectionCard>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4">Meanwhile, in the family group chat</p>
          <RevealSequence
            onDone={() => setAllRead(true)}
            items={interlude.messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2.5 ${m.v === 'MARJA' ? 'flex-row-reverse' : ''}`}>
                <MoodFace pid={m.v} mood={moodOf(m.v)} size={26} era={era} />
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[14px] leading-snug ${
                    m.v === 'MARJA'
                      ? 'bg-[#e8702a]/15 text-white/90 rounded-br-sm'
                      : 'bg-white/[0.07] text-white/85 rounded-bl-sm'
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wide text-white/35 mb-0.5">
                    {PERSONA_NAMES[m.v]}
                  </span>
                  {m.t}
                </div>
              </div>
            ))}
          />
        </SectionCard>
      )}

      <div className="flex justify-end">
        {(allRead || interlude.messages.length === 0) ? (
          <PrimaryButton onClick={onContinue}>On to {toYear} →</PrimaryButton>
        ) : (
          <span className="text-[12px] text-white/35 py-2">rest your cursor on the next message…</span>
        )}
      </div>
    </div>
  )
}

// ---------- Dilemma (between the decisions) ----------

/** A social-contract dilemma in a quiet year: two options, one call, small
 * real effects. Content from dilemmas.md. */
export function DilemmaScreen({ dilemma, onChoose }: { dilemma: Dilemma; onChoose: (k: 'A' | 'B') => void }) {
  const [picked, setPicked] = useState<'A' | 'B' | null>(null)
  return (
    <div className="space-y-6">
      <SectionCard>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-2">
          {dilemma.year} · Between the decisions
        </p>
        <h2 className="font-playfair italic text-3xl sm:text-4xl text-white mb-3">{dilemma.title}</h2>
        <p className="text-[15px] text-white/75 leading-relaxed">{dilemma.context}</p>
      </SectionCard>
      <div className="grid sm:grid-cols-2 gap-3">
        {dilemma.options.map((o) => (
          <button
            key={o.key}
            onClick={() => setPicked(o.key)}
            className={`text-left rounded-2xl border p-5 transition-all ${
              picked === o.key ? 'border-[#e8702a] bg-[#e8702a]/10' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="font-playfair italic text-xl text-white mb-1">{o.title}</div>
            {o.lever && (
              <div className="text-[10.5px] uppercase tracking-[0.15em] text-[#e8702a]/80 mb-1.5">
                your lever · {o.lever}
              </div>
            )}
            <p className="text-[13px] text-white/60 leading-relaxed">{o.summary}</p>
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <PrimaryButton disabled={!picked} onClick={() => picked && onChoose(picked)}>
          Decide
        </PrimaryButton>
      </div>
    </div>
  )
}

// ---------- Debrief dialogue (before the reveal) ----------

/** The table debrief: you explain your call, then the actors whose moves
 * touch your world answer. Beats reveal one by one; content comes from the
 * `said:` / `aftermath:` / `to X:` lines in actions.md. */
export function DebriefScreen({
  phase,
  result,
  viewerActor,
  onContinue,
}: {
  phase: PhaseContent
  result: PhaseResult
  viewerActor: ActorId
  onContinue: () => void
}) {
  const era = eraForPhase(phase.idx)
  const you = viewerActor
  const yourAction = phase.actions[you].find((x) => x.id === result.choices[you])
  const beats = useMemo(() => {
    const list: { kind: 'you' | 'narr' | 'other'; actor?: ActorId; note?: string; text: string }[] = []
    if (yourAction?.said) list.push({ kind: 'you', actor: you, note: `“${yourAction.title}”`, text: yourAction.said })
    if (yourAction?.aftermath) list.push({ kind: 'narr', text: yourAction.aftermath })
    // first: those your decision treated, answering you
    for (const a of ACTORS) {
      if (a === you) continue
      const line = yourAction?.react?.[a]
      if (line) list.push({ kind: 'other', actor: a, note: 'answers your call', text: line })
    }
    // then: those whose own moves land on your world
    for (const a of ACTORS) {
      if (a === you) continue
      const act = phase.actions[a].find((x) => x.id === result.choices[a])
      const line = act?.to?.[you]
      if (act && line) list.push({ kind: 'other', actor: a, note: `“${act.title}”`, text: line })
    }
    return list
  }, [phase, result, you, yourAction])
  const [step, setStep] = useState(1)
  const done = step >= beats.length
  return (
    <div className="space-y-6">
      <SectionCard>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-2">
          {YEAR_BY_PHASE[phase.idx]} · Around the table
        </p>
        <h2 className="font-playfair italic text-3xl sm:text-4xl text-white mb-6">The decisions, face to face</h2>
        <div className="space-y-6">
          {beats.slice(0, step).map((b, i) =>
            b.kind === 'narr' ? (
              <p key={i} className="text-[14px] italic text-white/55 leading-relaxed pl-1 border-l-2 border-white/15 ml-1.5 pl-4">
                {b.text}
              </p>
            ) : (
              <div key={i} className="flex gap-4 items-start">
                <Portrait slots={ACTOR_PORTRAITS[b.actor!]} era={era} name={SHORT_ROLE[b.actor!]} size="sm" />
                <div className="flex-1">
                  <div className="text-[11px] uppercase tracking-[0.15em] text-white/40 mb-1">
                    {b.kind === 'you' ? `You — the ${SHORT_ROLE[b.actor!]}` : `The ${SHORT_ROLE[b.actor!]}`}
                    {b.note && <span className="normal-case tracking-normal text-white/30"> · {b.note}</span>}
                  </div>
                  <p className="text-[14.5px] text-white/85 leading-relaxed">{b.text}</p>
                </div>
              </div>
            ),
          )}
        </div>
        <div className="flex justify-end mt-8">
          {done ? (
            <PrimaryButton onClick={onContinue}>What it adds up to →</PrimaryButton>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              className="text-sm text-white/60 hover:text-white border border-white/15 hover:border-white/40 rounded-full px-5 py-2 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

/** Reveal stage: the table debrief first (when a player seat is known and the
 * content exists), then the collective reveal. */
export function RevealFlow(props: Parameters<typeof RevealScreen>[0]) {
  const { phase, result, viewerActor } = props
  const [debriefedPhase, setDebriefedPhase] = useState<number | null>(null)
  const yourAction = viewerActor ? phase.actions[viewerActor].find((x) => x.id === result.choices[viewerActor]) : null
  if (viewerActor && yourAction?.said && debriefedPhase !== phase.idx) {
    return (
      <DebriefScreen
        phase={phase}
        result={result}
        viewerActor={viewerActor}
        onContinue={() => setDebriefedPhase(phase.idx)}
      />
    )
  }
  return <RevealScreen {...props} />
}

// ---------- Endstate ----------

export function EndstateScreen({
  content,
  state,
  onRestart,
}: {
  content: GameContent
  state: GameState
  onRestart?: () => void
}) {
  const es = state.endstate!
  const esCtx = { data: es.dataNode, poll: es.poll }
  const impacts = useMemo(() => decisionImpacts(content, state), [content, state])
  const body = interpolateNumbers(es.archetype.text.replace(/\*Debrief:[\s\S]*?\*/, '').trim(), esCtx)
  const ownMetric = state.playerActor ? keyMetricFor(content, state, state.playerActor) : null

  return (
    <div className="space-y-6">
      <SectionCard className="border-[#e8702a]/40">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8702a] mb-2">Finland, 2033 · endstate {es.archetype.id}</p>
        <h2 className="font-playfair italic text-4xl text-white mb-4">{es.archetype.name}</h2>
        <Markdown text={body} />
      </SectionCard>

      {ownMetric && (
        <SectionCard className="border-white/20">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">{ownMetric.title}</p>
          <p className="font-playfair italic text-lg text-white leading-relaxed">{ownMetric.line}</p>
        </SectionCard>
      )}

      {state.playerActor && <StreetScene content={content} state={state} />}

      

      <SectionCard>
        <Collapsible title="What happened to the others">
          <div className="pt-2">
                <div className="space-y-2">
          {ACTORS.filter((a) => a !== state.playerActor).map((a) => {
            const statuses = evaluateGoals(content, state, a)
            if (statuses.length === 0) return null
            const role = content.actors[a].title.replace(/^[A-Z]+\s*[—-]\s*/, '')
            const met = statuses.filter((s) => s.state === 'met').length
            const isViewer = a === state.playerActor
            const metric = keyMetricFor(content, state, a)
            const mine = impacts.filter((im) => im.actor === a)
            const costs = mine.filter((im) => im.kind === 'cost').slice(0, 2)
            const shown = costs.length > 0 ? costs : mine.filter((im) => im.kind === 'saved').slice(0, 1)
            return (
              <div
                key={a}
                className={`rounded-xl border p-3 flex items-center gap-4 ${
                  isViewer ? 'border-[#e8702a]/40 bg-[#e8702a]/5' : 'border-white/10'
                }`}
              >
                <Portrait slots={ACTOR_PORTRAITS[a]} era="2033" name={role} size="seat" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-playfair italic text-white">{role}</span>
                    {isViewer && <span className="text-[10px] uppercase tracking-wider text-[#e8702a]">you</span>}
                    <span className="text-xs text-white/40">
                      {met} of {statuses.length} held
                    </span>
                  </div>
                  {metric && <p className="text-[13px] text-white/60 mt-1 leading-relaxed">{metric.line}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {statuses.map((s, i) => (
                      <span
                        key={i}
                        title={`${s.reading} ${s.goal.why}`}
                        className={`px-2 py-0.5 rounded-full text-[11px] border ${
                          s.state === 'met'
                            ? 'border-emerald-400/40 text-emerald-300'
                            : s.state === 'miss'
                              ? 'border-red-400/40 text-red-300'
                              : 'border-white/15 text-white/45'
                        }`}
                      >
                        {s.state === 'met' ? '✓ ' : s.state === 'miss' ? '✕ ' : ''}
                        {s.goal.title}
                      </span>
                    ))}
                  </div>
                  {shown.map((im, i) => {
                    const byYou = im.by === state.playerActor
                    const whose = byYou ? 'Your' : `The ${SHORT_ROLE[im.by]}’s`
                    const target = isViewer ? 'you' : im.by === a ? 'them' : 'this seat'
                    return (
                      <p key={i} className="text-[12px] text-white/50 mt-2 leading-relaxed">
                        {im.kind === 'cost'
                          ? `${whose} “${im.chosenTitle}” (${im.phaseYear}) cost ${target} “${im.goalTitle}”. “${im.altTitle}” would have kept it.`
                          : `“${im.goalTitle}” held because ${byYou ? 'you' : `the ${SHORT_ROLE[im.by]}`} chose “${im.chosenTitle}” over “${im.altTitle}” (${im.phaseYear}).`}
                      </p>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
          </div>
        </Collapsible>
      </SectionCard>

      <div className="flex justify-between items-center">
        <a href="#/" className="text-sm text-white/50 hover:text-white underline underline-offset-4">
          Back to the map
        </a>
        {onRestart && <PrimaryButton onClick={onRestart}>Play a different Finland →</PrimaryButton>}
      </div>
    </div>
  )
}
