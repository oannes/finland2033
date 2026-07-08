import { useMemo, useState } from 'react'
import { Check, Copy, Users } from 'lucide-react'
import type { ActorId, GameContent, GameState } from './types'
import { ACTORS } from './types'
import { loadContent } from './content'
import { composeEndstate, initialState, resolvePhase } from './engine'
import { simulateAll } from './ai'
import {
  advanceGame,
  createGame,
  joinGame,
  loadSession,
  saveSession,
  submitMove,
  useServerState,
  type ServerState,
  type Session,
} from './net'
import { replayServerGame } from './replay'
import { ACTOR_PORTRAITS, Portrait } from './portraits'
import Sidebar from './Sidebar'

/** Seat labels and one-line intros for seat selection. Roles only — the
 * character's personal name is never shown to the player. */
/** Workshop mode needs the game server (server.mjs) — hidden on static hosts
 * like GitHub Pages, where the build runs under a /repo/ base path. */
export const WORKSHOP_ENABLED = import.meta.env.BASE_URL === '/'

const SEAT_INTROS: Record<ActorId, { role: string; line: string }> = {
  PM: { role: 'Prime Minister', line: 'Money and political capital. You can spend one to buy the other.' },
  SAK: { role: 'Union confederation chair', line: 'Consent or stalemate. Nobody automates a workforce that refuses.' },
  COUNTY: { role: 'Wellbeing county director', line: 'Dignity or efficiency on the service floor. Trust follows your choice.' },
  TI: { role: 'Industry federation head', line: 'The export industries’ voice. Geopolitics decides which side you are on.' },
  AALTO: { role: 'University rector', line: 'Education. Nothing you decide lands before 2030; nothing matters more by 2033.' },
  STARTUP: { role: 'Biotech founder', line: 'Emerging industry. You can create the jobs here, or take them abroad.' },
  HVK: { role: 'Security-of-supply chief', line: 'Quick security or patient resilience. The bills arrive years apart.' },
}
import {
  BriefingScreen,
  DecideScreen,
  EndstateScreen,
  FacilitatorBrief,
  PrimaryButton,
  RevealScreen,
  SectionCard,
  WaitNote,
} from './screens'

export default function GameApp() {
  const content = useMemo(() => loadContent(), [])
  const [solo, setSolo] = useState<GameState | null>(null)
  const [session, setSession] = useState<Session | null>(() => loadSession())
  // #/play/solo and #/play/workshop preselect the mode (the landing page carries the choice)
  const preselect = WORKSHOP_ENABLED && window.location.hash.includes('/workshop')
    ? ('workshop' as const)
    : window.location.hash.includes('/solo') || !WORKSHOP_ENABLED
      ? ('solo' as const)
      : null

  const enterWorkshop = (s: Session) => {
    saveSession(s)
    setSession(s)
  }
  const leaveWorkshop = () => {
    saveSession(null)
    setSession(null)
  }

  // "Play alone" must never be hijacked by a stored workshop session — the
  // saved session only resumes on the workshop route (or a bare #/play).
  const activeSession = preselect === 'solo' ? null : session

  return (
    <div className="min-h-screen bg-[#080d14] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {activeSession ? (
        <WorkshopGame content={content} session={activeSession} onLeave={leaveWorkshop} />
      ) : solo ? (
        <SoloGame content={content} state={solo} setState={setSolo} />
      ) : (
        <>
          <TopNav />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <ModeSelect
              preselect={preselect}
              onSolo={(actor) => setSolo(initialState('solo', actor, Math.floor(Math.random() * 1e9)))}
              onWorkshop={enterWorkshop}
            />
          </div>
        </>
      )}
    </div>
  )
}

function TopNav({ children }: { children?: React.ReactNode }) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#080d14]/90 backdrop-blur border-b border-white/5">
      <a href="#/" className="flex items-center gap-2.5">
        <svg width="20" height="20" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
        </svg>
        <span className="text-white text-lg font-playfair italic">Finland 2033</span>
      </a>
      {children}
    </nav>
  )
}

function Timeline({ state }: { state: GameState }) {
  return (
    <div className="flex items-center gap-1 text-[11px] text-white/50">
      {['2026', '2027–28', '2029', '2031', '2033'].map((y, i) => {
        const active =
          (state.stage === 'briefing' && i === 0) ||
          (state.stage !== 'briefing' && state.stage !== 'endstate' && i === state.phaseIdx + 1) ||
          (state.stage === 'endstate' && i === 4)
        const done = state.stage === 'endstate' ? i < 4 : i < (state.stage === 'briefing' ? 0 : state.phaseIdx + 1)
        return (
          <span key={y} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/20">→</span>}
            <span className={active ? 'text-[#e8702a] font-semibold' : done ? 'text-white/70' : ''}>{y}</span>
          </span>
        )
      })}
    </div>
  )
}

// ---------------- solo ----------------

function SoloGame({
  content,
  state,
  setState,
}: {
  content: GameContent
  state: GameState
  setState: (s: GameState | null) => void
}) {
  const phase = content.phases[state.phaseIdx]

  const lock = (actionId: string) => {
    if (!state.playerActor) return
    // the table remembers: simulated actors lean toward the player's previous move
    const prevResult = state.results[state.results.length - 1]
    const prevChoiceId = prevResult?.choices[state.playerActor]
    const prevPhase = prevResult ? content.phases[prevResult.phase - 1] : null
    const prevTag = prevPhase?.actions[state.playerActor].find((a) => a.id === prevChoiceId)?.tag
    const choices = simulateAll(phase, state.playerActor, actionId, state.flags, state.seed, prevTag)
    const result = resolvePhase(content, state, phase, choices)
    setState({
      ...state,
      choices: { ...state.choices, [phase.idx]: choices },
      results: [...state.results, result],
      flags: result.flagsAfter,
      indices: result.indicesAfter,
      poll: result.pollAfter,
      stage: 'reveal',
    })
  }

  const afterReveal = () => {
    if (state.phaseIdx < 2) setState({ ...state, phaseIdx: state.phaseIdx + 1, stage: 'decide' })
    else setState({ ...state, stage: 'endstate', endstate: composeEndstate(content, state) })
  }

  return (
    <>
      <TopNav>
        <Timeline state={state} />
      </TopNav>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="flex-1 min-w-0">
            {state.stage === 'briefing' && (
              <BriefingScreen content={content} state={state} onStart={() => setState({ ...state, stage: 'decide' })} />
            )}
            {state.stage === 'decide' && state.playerActor && (
              <DecideScreen content={content} state={state} phase={phase} actor={state.playerActor} locked={{}} onLock={lock} />
            )}
            {state.stage === 'reveal' && state.results[state.phaseIdx] && (
              <RevealScreen
                content={content}
                state={state}
                phase={phase}
                result={state.results[state.phaseIdx]}
                isLast={state.phaseIdx === 2}
                viewerActor={state.playerActor}
                onContinue={afterReveal}
              />
            )}
            {state.stage === 'endstate' && state.endstate && (
              <EndstateScreen content={content} state={state} onRestart={() => setState(null)} />
            )}
          </main>
          {state.stage !== 'briefing' && <Sidebar content={content} state={state} viewerActor={state.playerActor} />}
        </div>
      </div>
    </>
  )
}

// ---------------- workshop (networked) ----------------

function WorkshopGame({
  content,
  session,
  onLeave,
}: {
  content: GameContent
  session: Session
  onLeave: () => void
}) {
  const { state: server, error, push } = useServerState(session)

  if (!server) {
    return (
      <>
        <TopNav />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          {error ? (
            <>
              <p className="text-white/70 mb-2">Could not reach game {session.code}.</p>
              <p className="text-sm text-red-400/80 mb-6">{error}</p>
              <div className="flex justify-center gap-3">
                <PrimaryButton onClick={onLeave}>Back to setup</PrimaryButton>
                <a
                  href="#/play/solo"
                  onClick={onLeave}
                  className="border border-white/30 hover:border-white text-white text-sm font-medium px-7 py-3 rounded-full transition-all"
                >
                  Play alone instead
                </a>
              </div>
            </>
          ) : (
            <WaitNote text={`Connecting to game ${session.code}…`} />
          )}
        </div>
      </>
    )
  }

  const game = replayServerGame(content, server)
  const phase = content.phases[server.phaseIdx]

  const act = async (fn: () => Promise<{ state: ServerState }>) => {
    try {
      const r = await fn()
      push(r.state)
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <>
      <TopNav>
        <div className="flex items-center gap-4">
          {server.stage !== 'lobby' && <Timeline state={game} />}
          <span className="text-[11px] text-white/40">
            game <span className="font-semibold text-white/70">{server.code}</span>
            {server.you && (
              <>
                {' · you are '}
                <span className="font-semibold text-[#e8702a]">{server.you}</span>
              </>
            )}
            {server.isHost && ' · facilitator'}
          </span>
        </div>
      </TopNav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {server.stage === 'lobby' ? (
          <LobbyScreen server={server} session={session} push={push} onLeave={onLeave} act={act} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <main className="flex-1 min-w-0">
              {server.stage === 'briefing' && (
                <BriefingScreen
                  content={content}
                  state={game}
                  canAdvance={server.isHost}
                  onStart={() => act(() => advanceGame(session.code, session.token))}
                />
              )}
              {(server.stage === 'decide' || server.stage === 'tension') && (
                <WorkshopDecide content={content} server={server} session={session} game={game} phase={phase} act={act} />
              )}
              {server.stage === 'reveal' && game.results[server.phaseIdx] && (
                <RevealScreen
                  content={content}
                  state={game}
                  phase={phase}
                  result={game.results[server.phaseIdx]}
                  isLast={server.phaseIdx === 2}
                  viewerActor={server.you}
                  canAdvance={server.isHost}
                  onContinue={() => act(() => advanceGame(session.code, session.token))}
                />
              )}
              {server.stage === 'endstate' && game.endstate && <EndstateScreen content={content} state={game} />}
            </main>
            {server.stage !== 'briefing' && <Sidebar content={content} state={game} viewerActor={server.you} />}
          </div>
        )}
      </div>
    </>
  )
}

function WorkshopDecide({
  content,
  server,
  session,
  game,
  phase,
  act,
}: {
  content: GameContent
  server: ServerState
  session: Session
  game: GameState
  phase: GameContent['phases'][number]
  act: (fn: () => Promise<{ state: ServerState }>) => Promise<void>
}) {
  const you = server.you
  const youSubmitted = you ? server.submitted[you] : false

  if (you && !youSubmitted) {
    return (
      <DecideScreen
        content={content}
        state={game}
        phase={phase}
        actor={you}
        locked={server.submitted}
        onLock={(actionId) => act(() => submitMove(session.code, session.token, actionId))}
      />
    )
  }

  const claimed = ACTORS.filter((a) => server.roles[a])
  return (
    <div className="space-y-6">
    {!you && server.isHost && <FacilitatorBrief phase={phase} state={game} />}
    <SectionCard>
      <div className="flex flex-col items-center py-12 text-center">
        <Users className="text-[#e8702a] mb-4" size={28} />
        <h2 className="font-playfair italic text-2xl text-white mb-2">
          {you ? 'Move submitted' : 'Decisions in progress'}
        </h2>
        <p className="text-sm text-white/50 max-w-md mb-6">
          {you
            ? 'Waiting for the other teams to lock in. The reveal fires the moment the last submission lands.'
            : 'The teams are deciding secretly. Unclaimed actors will be simulated at the reveal.'}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {claimed.map((a) => (
            <span
              key={a}
              className={`px-3 py-1.5 rounded-full text-xs border ${
                server.submitted[a]
                  ? 'border-emerald-400/50 text-emerald-300 bg-emerald-400/10'
                  : 'border-white/15 text-white/50'
              }`}
            >
              {a} {server.submitted[a] ? '✓ submitted' : '· thinking'}
            </span>
          ))}
          {ACTORS.filter((a) => !server.roles[a]).map((a) => (
            <span key={a} className="px-3 py-1.5 rounded-full text-xs border border-white/5 text-white/25">
              {a} · simulated
            </span>
          ))}
        </div>
        {server.isHost && (
          <PrimaryButton onClick={() => act(() => advanceGame(session.code, session.token))}>
            Force the reveal (missing teams become simulated)
          </PrimaryButton>
        )}
      </div>
    </SectionCard>
    </div>
  )
}

function LobbyScreen({
  server,
  session,
  push,
  onLeave,
  act,
}: {
  server: ServerState
  session: Session
  push: (s: ServerState) => void
  onLeave: () => void
  act: (fn: () => Promise<{ state: ServerState }>) => Promise<void>
}) {
  const [copied, setCopied] = useState(false)
  const claimedCount = ACTORS.filter((a) => server.roles[a]).length

  const claim = async (actor: ActorId) => {
    try {
      const r = await joinGame(server.code, actor, session.token)
      push(r.state)
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#e8702a] mb-3">Workshop lobby</p>
        <h1 className="font-playfair italic text-4xl text-white mb-3">Game {server.code}</h1>
        <p className="text-sm text-white/60 max-w-lg mx-auto leading-relaxed mb-4">
          Every team opens this site on their own device, clicks <em>Join a game</em>, enters the code, and claims a
          seat. Unclaimed actors will be simulated. The facilitator starts the game when the room is ready.
        </p>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(server.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : `Copy code ${server.code}`}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {ACTORS.map((a) => {
          const taken = server.roles[a]
          const yours = server.you === a
          return (
            <button
              key={a}
              onClick={() => !taken || yours ? claim(a) : undefined}
              disabled={taken && !yours}
              className={`text-left rounded-xl border px-4 py-3 transition-all flex items-center gap-4 ${
                yours
                  ? 'border-[#e8702a] bg-[#e8702a]/10'
                  : taken
                    ? 'border-white/5 opacity-40 cursor-not-allowed'
                    : 'border-white/10 hover:border-white/30'
              }`}
            >
              <Portrait slots={ACTOR_PORTRAITS[a]} era="now" name={SEAT_INTROS[a].role} size="seat" />
              <div>
                <div className="text-sm font-semibold text-white">{SEAT_INTROS[a].role}</div>
                <div className="text-[12px] text-white/50 leading-snug mt-0.5">{SEAT_INTROS[a].line}</div>
                <div className="text-[11px] text-white/40 mt-0.5">
                  {yours ? 'YOU' : taken ? 'claimed' : 'available — click to claim'}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onLeave} className="text-sm text-white/40 hover:text-white underline underline-offset-4">
          Leave game
        </button>
        {server.isHost ? (
          <PrimaryButton disabled={claimedCount === 0} onClick={() => act(() => advanceGame(session.code, session.token))}>
            Start with {claimedCount} team{claimedCount === 1 ? '' : 's'} →
          </PrimaryButton>
        ) : (
          <WaitNote text="The facilitator starts the game…" />
        )}
      </div>
    </div>
  )
}

// ---------------- mode select ----------------

function ModeSelect({
  preselect,
  onSolo,
  onWorkshop,
}: {
  preselect: 'solo' | 'workshop' | null
  onSolo: (actor: ActorId) => void
  onWorkshop: (s: Session) => void
}) {
  const [mode, setMode] = useState<'solo' | 'workshop' | null>(preselect)
  const [actor, setActor] = useState<ActorId | null>(null)
  const [joinCode, setJoinCode] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const create = async () => {
    setBusy('Creating game…')
    try {
      const g = await createGame()
      onWorkshop({ code: g.code, token: g.token })
    } catch (e) {
      alert(`Could not create a game — is the game server running? (${e instanceof Error ? e.message : e})`)
    } finally {
      setBusy(null)
    }
  }

  const join = async () => {
    const code = joinCode.trim().toUpperCase()
    if (code.length !== 5) return alert('Game codes are 5 characters.')
    setBusy('Joining…')
    try {
      // token minted on first claim; joining the session first with no seat
      onWorkshop({ code, token: crypto.randomUUID() })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8">
      <div className="text-center mb-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#e8702a] mb-3">AI in Finland 2033</p>
        <h1 className="font-playfair italic text-4xl sm:text-5xl text-white">
          {mode === 'solo' ? 'Choose your seat' : mode === 'workshop' ? 'Workshop' : 'How will you play it?'}
        </h1>
      </div>

      {!mode && (
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('solo')}
            className="text-left rounded-2xl border p-6 transition-all border-white/15 hover:border-white/35"
          >
            <div className="font-playfair italic text-2xl text-white">Play alone</div>
          </button>
          {WORKSHOP_ENABLED && (
            <button
              onClick={() => setMode('workshop')}
              className="text-left rounded-2xl border p-6 transition-all border-white/15 hover:border-white/35"
            >
              <div className="font-playfair italic text-2xl text-white">Workshop</div>
            </button>
          )}
        </div>
      )}

      {mode === 'solo' && (
        <div className="rounded-2xl border border-white/10 p-6">
          <div className="grid sm:grid-cols-2 gap-2">
            {ACTORS.map((a) => (
              <button
                key={a}
                onClick={() => setActor(a)}
                className={`text-left rounded-xl border px-4 py-3 transition-all flex items-center gap-4 ${
                  actor === a ? 'border-[#e8702a] bg-[#e8702a]/10' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <Portrait slots={ACTOR_PORTRAITS[a]} era="now" name={SEAT_INTROS[a].role} size="seat" />
                <div>
                  <div className="text-sm font-semibold text-white">{SEAT_INTROS[a].role}</div>
                  <div className="text-[12px] text-white/50 leading-snug mt-0.5">{SEAT_INTROS[a].line}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-center pt-6">
            <PrimaryButton disabled={!actor} onClick={() => actor && onSolo(actor)}>
              Begin →
            </PrimaryButton>
          </div>
        </div>
      )}

      {mode === 'workshop' && (
        <div className="rounded-2xl border border-white/10 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <PrimaryButton onClick={create}>{busy ?? 'Create a new game'}</PrimaryButton>
            <div className="flex-1 flex items-center gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && join()}
                placeholder="Or enter a 5-character code"
                maxLength={5}
                className="flex-1 rounded-full bg-white/5 border border-white/15 px-5 py-3 text-sm text-white placeholder-white/30 tracking-[0.3em] uppercase focus:outline-none focus:border-[#e8702a]"
              />
              <button
                onClick={join}
                className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 hover:bg-white/5"
              >
                Join
              </button>
            </div>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            One person creates the game and shares the code; each team joins on its own device and claims a seat.
          </p>
        </div>
      )}
    </div>
  )
}
