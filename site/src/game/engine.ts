import type {
  Action,
  ActorId,
  ClashResult,
  Archetype,
  ComboRow,
  EndstateResult,
  EntryVariant,
  FlagAssign,
  GameContent,
  GameState,
  GoalMeasure,
  GoalStatus,
  IndexDelta,
  Indices,
  MetricEnv,
  Outcome,
  PersonaId,
  PhaseContent,
  PhaseResult,
  Tag,
} from './types'
import { ACTORS } from './types'
import { finalPersonaRungs } from './personas'

export function initialState(mode: 'solo' | 'workshop', playerActor: ActorId | null, seed: number): GameState {
  return {
    mode,
    playerActor,
    seed,
    phaseIdx: 0,
    stage: 'briefing',
    choices: { 1: {}, 2: {}, 3: {} },
    results: [],
    flags: {},
    indices: { RES: 5.0, LEG: 5.0, PRO: 5.0 },
    poll: 50, // fresh left-leaning government, spring 2027
    endstate: null,
  }
}

/** node year per phase (charts and exogenous schedules key on these) */
export const NODE_YEARS: Record<number, number> = { 1: 2028, 2: 2029, 3: 2031 }

export function actionById(phase: PhaseContent, id: string): Action | undefined {
  for (const a of ACTORS) {
    const found = phase.actions[a].find((x) => x.id === id)
    if (found) return found
  }
  return undefined
}

/** requires: gates are hard (WEBSITE_AGENT rule 2) */
export function requirementMet(action: Action, flags: Record<string, string>, env?: MetricEnv): boolean {
  const req = action.requires
  if (!req) return true
  if (req.flag && req.values) {
    const v = flags[req.flag]
    return v !== undefined && req.values.includes(v)
  }
  if (req.measure) {
    if (!env) return true // no snapshot to judge by: fail open (facilitator views)
    return measureMetEnv(req.measure, env)
  }
  return true
}

/** Evaluate a goal-grammar measure against a metric snapshot (used by gates). */
export function measureMetEnv(m: GoalMeasure, env: MetricEnv): boolean {
  const cmp = (v: number, op: '>=' | '<=', n: number) => (op === '>=' ? v >= n : v <= n)
  switch (m.kind) {
    case 'indicator':
      return cmp(env.data[m.id] ?? 0, m.op, m.n)
    case 'index':
      return cmp(env.indices[m.index], m.op, m.n)
    case 'poll':
      return cmp(env.poll, m.op, m.n)
    case 'flag': {
      const v = env.flags[m.flag]
      return v !== undefined && m.values.includes(v)
    }
    case 'drift':
      return env.drift <= m.max
    default:
      return true
  }
}

/** Snapshot of the current numbers, for gates ("DECISION NOT POSSIBLE BECAUSE…"). */
export function metricEnv(content: GameContent, state: GameState): MetricEnv {
  return {
    flags: state.flags,
    data:
      state.endstate?.dataNode ??
      state.results[state.results.length - 1]?.dataNode ??
      content.baseline,
    indices: state.indices,
    poll: state.poll,
    drift: state.results.filter((r) => r.outcome.cls === 'O3').length,
  }
}

/** Player-readable reason why a gated card is locked. */
export function gateReason(content: GameContent, action: Action, env?: MetricEnv): string {
  const req = action.requires
  if (!req) return ''
  const paren = (action.requiresRaw?.match(/\(([^)]+)\)/) || [])[1]
  if (req.flag) return paren ?? `needs ${req.flag}=${(req.values ?? []).join(' or ')}`
  if (req.measure && req.measure.kind === 'indicator') {
    const m = req.measure
    const label = content.indicators.find((i) => i.id === m.id)?.label ?? m.id
    const v = env?.data[m.id]
    return `${label} is ${v !== undefined ? v : '…'} (needs ${m.op === '>=' ? 'at least' : 'at most'} ${m.n})${paren ? `: ${paren}` : ''}`
  }
  if (req.measure && req.measure.kind === 'poll')
    return `approval is ${env?.poll ?? '…'} (needs ${req.measure.op === '>=' ? 'at least' : 'at most'} ${req.measure.n})${paren ? `: ${paren}` : ''}`
  if (req.measure && req.measure.kind === 'index')
    return `${req.measure.index} is ${env ? env.indices[req.measure.index].toFixed(1) : '…'} (needs ${req.measure.op === '>=' ? 'at least' : 'at most'} ${req.measure.n})${paren ? `: ${paren}` : ''}`
  return paren ?? action.requiresRaw ?? ''
}

/** The action menu for an actor in a phase: available + gated (shown greyed). */
export function actorMenu(phase: PhaseContent, actor: ActorId, flags: Record<string, string>, env?: MetricEnv) {
  const all = phase.actions[actor]
  const available = all.filter((a) => requirementMet(a, flags, env))
  const gated = all.filter((a) => !requirementMet(a, flags, env))
  return { available, gated }
}

/** Entry variants whose flag condition matches current flags (facilitator reads all that match). */
export function matchingVariants(phase: PhaseContent, flags: Record<string, string>): EntryVariant[] {
  return phase.tension.entryVariants.filter((v) => {
    if (!v.flag || !v.values) return false
    const cur = flags[v.flag]
    return cur !== undefined && v.values.includes(cur)
  })
}

function applyAssign(
  flags: Record<string, string>,
  assign: FlagAssign,
  ctx: { outcomeId: string; row: number; tagOf: (actor: ActorId) => Tag | undefined },
) {
  if (assign.ifOutcomes && !assign.ifOutcomes.includes(ctx.outcomeId)) return
  if (assign.ifRows && !assign.ifRows.includes(ctx.row)) return
  if (assign.ifActorTag) {
    const chosen = ctx.tagOf(assign.ifActorTag.actor)
    if (chosen === assign.ifActorTag.tag) flags[assign.flag] = assign.value
    else if (assign.ifActorTag.elseValue) flags[assign.flag] = assign.ifActorTag.elseValue
    return
  }
  flags[assign.flag] = assign.value
}

const clamp10 = (x: number) => Math.max(0, Math.min(10, Math.round(x * 10) / 10))

/** Resolve `inherit±n` against the played path (walk backward to last absolute value). */
function resolveValue(
  indicator: string,
  spec: { abs?: number; inherit?: number } | undefined,
  prevNodes: Record<string, number>[],
  baseline: Record<string, number>,
): number {
  if (spec?.abs !== undefined) return spec.abs
  const offset = spec?.inherit ?? 0
  for (let i = prevNodes.length - 1; i >= 0; i--) {
    if (prevNodes[i][indicator] !== undefined) return prevNodes[i][indicator] + offset
  }
  return (baseline[indicator] ?? 0) + offset
}

/** Base data values for an outcome node with NO adjustments/action deltas — used for ghost nodes. */
export function outcomeBaseData(
  content: GameContent,
  outcome: Outcome,
  prevNodes: Record<string, number>[],
  nodeYear?: number,
): Record<string, number> {
  const out: Record<string, number> = {}
  for (const ind of content.indicators) {
    out[ind.id] = resolveValue(ind.id, outcome.data.values[ind.id], prevNodes, content.baseline)
  }
  if (nodeYear !== undefined) applyExogenous(content, out, nodeYear)
  return out
}

/** Exogenous indicators move on schedule, regardless of play (the visible world-trend). */
export function applyExogenous(content: GameContent, data: Record<string, number>, year: number) {
  for (const [id, sched] of Object.entries(content.exogenous)) {
    if (sched[year] !== undefined) data[id] = sched[year]
  }
}

/** The collision rule: force (A) overruns negotiation (B), negotiation binds
 * waiting (H), waiting outlasts force (A). Same stance = stand-off. */
export function stanceBeats(x: Tag, y: Tag): boolean {
  return (x === 'A' && y === 'B') || (x === 'B' && y === 'H') || (x === 'H' && y === 'A')
}

export function resolvePhase(
  content: GameContent,
  state: GameState,
  phase: PhaseContent,
  choices: Record<ActorId, string>,
): PhaseResult {
  const tagOf = (actor: ActorId): Tag | undefined => {
    const id = choices[actor]
    return id ? actionById(phase, id)?.tag : undefined
  }

  // 1. Resolution: pivotal trio tags → combo row → outcome (table lookup, never overridden)
  const trioTags = phase.pivotal.map((a) => tagOf(a) ?? 'H') as [Tag, Tag, Tag]
  const comboRow: ComboRow =
    phase.combos.find((r) => r.tags[0] === trioTags[0] && r.tags[1] === trioTags[1] && r.tags[2] === trioTags[2]) ??
    phase.combos[phase.combos.length - 1]
  const outcome = phase.outcomes[comboRow.outcome]

  const modifierActors = ACTORS.filter((a) => !phase.pivotal.includes(a))

  // 1b. Collisions: the standing confrontations fire on stance (clashes.md)
  const clashes: ClashResult[] = []
  const clashIndex: IndexDelta[] = []
  let clashPoll = 0
  const clashData: Record<string, number> = {}
  for (const edge of content.clashes) {
    const ta = tagOf(edge.a)
    const tb = tagOf(edge.b)
    if (!ta || !tb || ta === tb) continue
    const loserId = stanceBeats(ta, tb) ? edge.b : stanceBeats(tb, ta) ? edge.a : null
    if (!loserId) continue
    const side = edge.loser[loserId]
    if (!side) continue
    clashes.push({ edge, winner: loserId === edge.a ? edge.b : edge.a, loser: loserId, line: side.line })
    for (const e of side.effects) clashIndex.push(e)
    if (side.pollDelta) clashPoll += side.pollDelta
    for (const [k, d] of Object.entries(side.data)) clashData[k] = (clashData[k] ?? 0) + d
  }

  // 2. Indices: outcome index effects + modifier actors' action effects (mechanics §4)
  const indices: Indices = { ...state.indices }
  const indicesDelta: Indices = { RES: 0, LEG: 0, PRO: 0 }
  for (const e of outcome.indexEffects) indicesDelta[e.index] += e.delta
  for (const a of modifierActors) {
    const act = actionById(phase, choices[a] ?? '')
    if (act) for (const e of act.effects) indicesDelta[e.index] += e.delta
  }
  for (const e of clashIndex) indicesDelta[e.index] += e.delta
  for (const k of ['RES', 'LEG', 'PRO'] as const) indices[k] = clamp10(indices[k] + indicesDelta[k])

  // 2b. Polling: the outcome's political price plus every actor's contribution
  let pollDelta = (outcome.pollDelta ?? 0) + clashPoll
  for (const a of ACTORS) {
    const act = actionById(phase, choices[a] ?? '')
    if (act?.pollDelta) pollDelta += act.pollDelta
  }
  const pollAfter = Math.max(0, Math.min(100, Math.round(state.poll + pollDelta)))

  // 3. Flags: outcome defaults → combo row overrides → action flags (modifier flags stand) → coded defaults
  const flags = { ...state.flags }
  const ctx = { outcomeId: outcome.id, row: comboRow.row, tagOf }
  for (const f of outcome.flagSets) applyAssign(flags, f, ctx)
  for (const f of comboRow.flags) applyAssign(flags, f, ctx)
  for (const a of ACTORS) {
    const act = actionById(phase, choices[a] ?? '')
    if (act) for (const f of act.flagSets) applyAssign(flags, f, ctx)
  }
  applyPhaseFlagDefaults(phase.idx, flags, outcome, choices, phase)

  // 4. Data node: outcome base ± action data-deltas ± matching adjustments.
  // Every actor's deltas apply — the outcome sets the big picture, but HOW each
  // seat chose still leaves fingerprints in the numbers (causal-model.md).
  const prevNodes = [content.baseline, ...state.results.map((r) => r.dataNode)]
  const dataNode = outcomeBaseData(content, outcome, prevNodes)
  for (const a of ACTORS) {
    const act = actionById(phase, choices[a] ?? '')
    if (act) for (const [k, d] of Object.entries(act.data)) dataNode[k] = (dataNode[k] ?? 0) + d
  }
  for (const [k, d] of Object.entries(clashData)) dataNode[k] = (dataNode[k] ?? 0) + d
  for (const adj of outcome.data.adjustments) {
    if (!adj.flag || !adj.values) continue
    const cur = flags[adj.flag]
    if (cur !== undefined && adj.values.includes(cur)) {
      for (const [k, d] of Object.entries(adj.deltas)) dataNode[k] = (dataNode[k] ?? 0) + d
    }
  }
  applyExogenous(content, dataNode, NODE_YEARS[phase.idx])
  for (const k of Object.keys(dataNode)) dataNode[k] = Math.round(dataNode[k] * 10) / 10

  // Redesign v2: the next crisis's shape follows the self-sufficiency clock.
  // Days Finland runs alone decides how the Second Gate lands, alongside the
  // legacy SECURE_ARCH rule.
  if (phase.idx === 2 && dataNode.days !== undefined) {
    if (dataNode.days >= 25 && outcome.cls !== 'O3') flags.CRISIS_LEG = 'managed'
    else if (dataNode.days < 10) flags.CRISIS_LEG = 'damaged'
  }

  // 5. Modifier hooks: render exactly the 4 matching (WEBSITE_AGENT rule 5)
  const hooks = modifierActors
    .map((a) => {
      const act = actionById(phase, choices[a] ?? '')
      const key = act?.hook ?? (act ? `${a}-${act.tag}` : undefined)
      const text = key ? outcome.hooks[key] : undefined
      return act && text ? { actor: a, actionId: act.id, text } : null
    })
    .filter(Boolean) as PhaseResult['hooks']

  return {
    phase: phase.idx,
    comboRow,
    outcome,
    choices,
    hooks,
    flagsAfter: flags,
    indicesAfter: indices,
    indicesDelta,
    pollAfter,
    pollDelta,
    dataNode,
    entryVariantsShown: matchingVariants(phase, state.flags),
    clashes,
  }
}

/** Phase-specific defaults for flags left unset (from combos.md "Flag defaults" + mechanics §6). */
function applyPhaseFlagDefaults(
  phaseIdx: number,
  flags: Record<string, string>,
  outcome: Outcome,
  choices: Record<ActorId, string>,
  phase: PhaseContent,
) {
  const tagOf = (actor: ActorId): Tag | undefined => {
    const id = choices[actor]
    return id ? actionById(phase, id)?.tag : undefined
  }
  if (phaseIdx === 1) {
    // Sampo: O1/O2 = full mandate, O4/O5 = negotiated, O3 = pilot state
    if (!flags.MEGAPROJECT) flags.MEGAPROJECT = ['O1', 'O2'].includes(outcome.cls) ? 'full' : outcome.cls === 'O3' ? 'pilot' : 'negotiated'
    if (!flags.GUARANTEE) flags.GUARANTEE = ['O4', 'O5'].includes(outcome.cls) ? 'yes' : 'no'
    if (!flags.SECURE_ARCH) flags.SECURE_ARCH = tagOf('HVK') === 'A' ? 'yes' : 'no'
    if (!flags.TALENT_PIPE) flags.TALENT_PIPE = 'weak'
    if (!flags.STRIKE_CARD) flags.STRIKE_CARD = 'live'
  }
  if (phaseIdx === 2) {
    // sovereignty (euro) vs capability (us); drift = split
    if (!flags.STACK) flags.STACK = outcome.cls === 'O3' ? 'split' : ['O1', 'O2'].includes(outcome.cls) ? 'euro' : 'us'
    // CRISIS_LEG rule: the Second Gate hits a country whose architecture was or wasn't hardened in P1
    if (!flags.CRISIS_LEG || flags.CRISIS_LEG === 'per') {
      flags.CRISIS_LEG = flags.SECURE_ARCH === 'yes' && outcome.cls !== 'O3' ? 'managed' : 'damaged'
    }
  }
  if (phaseIdx === 3) {
    // the dividend: O1 strong, O2 thin, O4/O5 balance-sheet, O3 punt
    if (!flags.COMPACT) flags.COMPACT = ['O1', 'O2'].includes(outcome.cls) ? (outcome.cls === 'O1' ? 'strong' : 'thin') : 'none'
    if (!flags.LEVY) flags.LEVY = 'no'
  }
}

/** Replace {tokens} in outcome text with the played numbers, so narrative and
 * data cannot drift apart. Supported: {any_indicator_id}, {poll},
 * {maria_mood}, {eetu_mood}. */
export function interpolateNumbers(
  text: string,
  ctx: { data: Record<string, number>; poll: number; moods?: { MARJA?: string; EETU?: string } },
): string {
  return text
    .replace(/\{poll\}/g, String(ctx.poll))
    .replace(/\{maria_mood\}/g, ctx.moods?.MARJA ?? '')
    .replace(/\{eetu_mood\}/g, ctx.moods?.EETU ?? '')
    .replace(/\{([a-z_]+)\}/g, (m, id) => (ctx.data[id] !== undefined ? String(ctx.data[id]) : m))
}

/** Strip engine tokens (FLAG=value, POLL ±n) from a note so players read prose, not state. */
export function narrativeNote(s: string): string {
  return s
    .replace(/\(?\b[A-Z][A-Z_0-9]{2,}=[a-zA-Z-]+(\s*\([^)]*\))?\)?/g, '')
    .replace(/\bPOLL\s*[+\u2212\u2013-]?\d+\.?/g, '')
    .replace(/\(\s*[,;.]?\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/[;,:]\s*\./g, '.')
    .replace(/(\.\s*)\.+/g, '$1')
    .replace(/^[\s.;,]+/, '')
    .trim()
}

// ---------- goals & relevance ----------

/** Latest known rung number (1–5) for a persona, from the endstate or the last reveal. */
export function latestPersonaRung(state: GameState, persona: string): number | null {
  if (state.endstate) {
    const r = state.endstate.personaRungs[persona as keyof typeof state.endstate.personaRungs]
    if (r) return parseInt(r.rung.slice(1)) || null
  }
  for (let i = state.results.length - 1; i >= 0; i--) {
    const imp = state.results[i].outcome.personas.find((p) => p.persona === persona)
    if (imp) {
      const n = parseInt(imp.rung.replace(/^[A-Z]+/, ''))
      if (!Number.isNaN(n)) return n
    }
  }
  return null
}

/** Evaluate an actor's goals against the current game state ("how am I doing, and why"). */
export function evaluateGoals(
  content: GameContent,
  state: GameState,
  actor: string,
): import('./types').GoalStatus[] {
  const latestData =
    state.endstate?.dataNode ?? state.results[state.results.length - 1]?.dataNode ?? content.baseline
  const cmp = (v: number, op: '>=' | '<=', n: number) => (op === '>=' ? v >= n : v <= n)

  return content.goals
    .filter((g) => g.actor === actor)
    .map((goal) => {
      const m = goal.measure
      if (!m) return { goal, state: 'open' as const, reading: goal.measureRaw }
      switch (m.kind) {
        case 'index': {
          const v = state.indices[m.index]
          const label = { RES: 'Resilience', LEG: 'Legitimacy', PRO: 'Prosperity' }[m.index]
          return {
            goal,
            state: cmp(v, m.op, m.n) ? ('met' as const) : ('miss' as const),
            reading: `${label} is ${v.toFixed(1)} of 10 (needs ${m.op === '>=' ? '≥' : '≤'} ${m.n})`,
          }
        }
        case 'flag': {
          const v = state.flags[m.flag]
          if (v === undefined) return { goal, state: 'open' as const, reading: 'Not decided yet.' }
          return {
            goal,
            state: m.values.includes(v) ? ('met' as const) : ('miss' as const),
            reading: `Now “${v}”. This goal needs ${m.values.join(' or ')}.`,
          }
        }
        case 'indicator': {
          const v = latestData[m.id] ?? content.baseline[m.id] ?? 0
          const unit = content.indicators.find((i) => i.id === m.id)?.unit ?? ''
          return {
            goal,
            state: cmp(v, m.op, m.n) ? ('met' as const) : ('miss' as const),
            reading: `${m.id.replace('_', ' ')} is ${v}${unit ? ' ' + unit : ''} (needs ${m.op === '>=' ? '≥' : '≤'} ${m.n})`,
          }
        }
        case 'drift': {
          const drifts = state.results.filter((r) => r.outcome.cls === 'O3').length
          return {
            goal,
            state: drifts <= m.max ? ('met' as const) : ('miss' as const),
            reading: `${drifts} deadlock outcome${drifts === 1 ? '' : 's'} so far (tolerates ${m.max})`,
          }
        }
        case 'persona': {
          const rung = latestPersonaRung(state, m.persona)
          if (rung === null) return { goal, state: 'open' as const, reading: `${m.persona} not yet read` }
          return {
            goal,
            state: rung >= m.min ? ('met' as const) : ('miss' as const),
            reading: `${m.persona} is at rung ${rung} (needs ≥ ${m.min})`,
          }
        }
        case 'poll': {
          const v = state.poll
          return {
            goal,
            state: cmp(v, m.op, m.n) ? ('met' as const) : ('miss' as const),
            reading: `Government approval is ${v}% (needs ${m.op === '>=' ? '≥' : '≤'} ${m.n}%)`,
          }
        }
      }
    })
}

/** Is inject i of this phase relevant to the viewer? Facilitator (null viewer) sees all. */
export function injectRelevant(
  content: GameContent,
  phaseIdx: number,
  injectIdx: number,
  viewer: string | null,
): boolean {
  if (!viewer) return true
  const allowed = content.relevance[phaseIdx]?.[injectIdx]
  if (allowed === undefined || allowed === null) return true
  return allowed.includes(viewer as (typeof allowed)[number])
}

// ---------- endstate ----------

const P3_CLASS = (cls: string): Archetype['p3class'] =>
  ['O1', 'O2'].includes(cls) ? 'compact' : cls === 'O3' ? 'freeze' : 'efficiency'

export function composeEndstate(content: GameContent, state: GameState): EndstateResult {
  const p3 = state.results[2]
  const flags = p3.flagsAfter
  const stack = ['euro', 'us', 'split'].includes(flags.STACK) ? flags.STACK : 'split'
  const cls = P3_CLASS(p3.outcome.cls)
  const archetype =
    content.archetypes.find((a) => a.stack === stack && a.p3class === cls) ??
    content.archetypes.find((a) => a.id === 'E8')!

  // Final data: carry P3 forward one year with archetype drift (endstates.md)
  const d = { ...p3.dataNode }
  const add = (k: string, v: number) => (d[k] = Math.round(((d[k] ?? 0) + v) * 10) / 10)
  if (cls === 'compact') {
    add('trust', 2); add('youth_u', -0.5); add('care_gap', -1)
  } else if (cls === 'freeze') {
    add('trust', -2); add('youth_u', 0.5); add('care_gap', 1); add('pub_ai', -2)
  } else {
    add('pub_ai', 3); add('trust', -2); add('youth_u', 0.5)
  }
  if (flags.SECURE_ARCH === 'yes') add('trust', 1)
  if (flags.SECURITIZED === 'yes') add('trust', -2) // emergency powers: security bought fast, trust billed late
  if (flags.LEVY === 'yes') add('youth_u', -0.8)
  if (flags.TALENT_PIPE === 'strong') add('sov_share', 3)
  if (flags.RETRAIN === 'broad') add('youth_u', -0.5) // the 2027 retraining cohorts land in the 2030s labour market
  applyExogenous(content, d, 2033)

  // The 2031 election: the polling tracker plus the dividend decision, scored for real.
  const poll = p3.pollAfter
  const mod = cls === 'compact' ? 3 : cls === 'efficiency' ? -2 : -5
  const score = poll + mod
  const election: EndstateResult['election'] =
    score >= 52
      ? {
          verdict: 'returned',
          line: `The government is returned in 2031 with ${poll}% approval. The productivity fight was paid for, and the payment cleared.`,
        }
      : score >= 45
        ? {
            verdict: 'hung',
            line: `The 2031 election hangs: ${poll}% approval buys a weakened coalition and a renegotiated program. Every guarantee is reopened.`,
          }
        : {
            verdict: 'defeated',
            line: `The government falls in 2031 at ${poll}% approval. The next coalition inherits the machine and campaigns against how it was built.`,
          }

  return {
    archetype,
    dataNode: d,
    personaRungs: finalPersonaRungs(content, state, flags),
    flags,
    indices: p3.indicesAfter,
    poll,
    election,
  }
}

// ---------- counterfactual attribution ----------

export interface PlayerImpact {
  /** whose decision */
  by: ActorId
  /** whose goal */
  actor: ActorId
  goalTitle: string
  kind: 'cost' | 'saved'
  phaseYear: string
  chosenTitle: string
  altTitle: string
}

/**
 * How every seat's decisions moved every seat's goals: replay the whole game
 * with each alternative each player could have chosen (all other recorded
 * choices held fixed, later gated actions re-checked), and report only goals
 * that actually flip. Deterministic, no narration invented.
 */
/** Replay the whole game with one actor's action in one phase swapped, all
 * other recorded choices held fixed (later gated actions re-checked). */
export function replayWithChoice(
  content: GameContent,
  state: GameState,
  phaseI: number,
  by: ActorId,
  altId: string,
): GameState {
    let sim = initialState(state.mode, state.playerActor, state.seed)
    for (let i = 0; i < content.phases.length; i++) {
      const phase = content.phases[i]
      const choices = { ...state.results[i].choices }
      if (i === phaseI) choices[by] = altId
      if (i > phaseI) {
        // a changed past can close a gate a recorded action walked through
        const env = metricEnv(content, sim)
        for (const a of ACTORS) {
          const act = phase.actions[a]?.find((x) => x.id === choices[a])
          if (act && !requirementMet(act, sim.flags, env)) {
            const fallback = phase.actions[a].find((x) => requirementMet(x, sim.flags, env))
            if (fallback) choices[a] = fallback.id
          }
        }
      }
      const result = resolvePhase(content, sim, phase, choices)
      sim = {
        ...sim,
        results: [...sim.results, result],
        flags: result.flagsAfter,
        indices: result.indicesAfter,
        poll: result.pollAfter,
      }
    }
    sim.endstate = composeEndstate(content, sim)
    return sim
}

export function decisionImpacts(content: GameContent, state: GameState): PlayerImpact[] {
  if (!state.endstate || state.results.length < content.phases.length) return []

  const actual: Partial<Record<ActorId, GoalStatus[]>> = {}
  for (const a of ACTORS) actual[a] = evaluateGoals(content, state, a)
  const replayWith = (phaseI: number, by: ActorId, altId: string) => replayWithChoice(content, state, phaseI, by, altId)

  const impacts: PlayerImpact[] = []
  const seen = new Set<string>()
  for (let i = 0; i < content.phases.length; i++) {
    const phase = content.phases[i]
    for (const by of ACTORS) {
      const chosenId = state.results[i].choices[by]
      const chosen = phase.actions[by]?.find((a) => a.id === chosenId)
      if (!chosen) continue
      for (const alt of phase.actions[by]) {
        if (alt.id === chosenId) continue
        const sim = replayWith(i, by, alt.id)
        for (const a of ACTORS) {
          const cf = evaluateGoals(content, sim, a)
          for (let g = 0; g < cf.length; g++) {
            const was = actual[a]?.[g]?.state
            const now = cf[g].state
            const key = `${a}:${cf[g].goal.title}`
            if (seen.has(key)) continue
            if (was !== 'met' && now === 'met') {
              seen.add(key)
              impacts.push({
                by,
                actor: a,
                goalTitle: cf[g].goal.title,
                kind: 'cost',
                phaseYear: phase.tension.year,
                chosenTitle: chosen.title,
                altTitle: alt.title,
              })
            } else if (was === 'met' && now !== 'met') {
              seen.add(key)
              impacts.push({
                by,
                actor: a,
                goalTitle: cf[g].goal.title,
                kind: 'saved',
                phaseYear: phase.tension.year,
                chosenTitle: chosen.title,
                altTitle: alt.title,
              })
            }
          }
        }
      }
    }
  }
  return impacts
}

// ---------- key metrics ----------

/** Evaluate a goal-grammar measure against the current state (used by keymetrics.md). */
export function measureMet(content: GameContent, state: GameState, m: GoalMeasure): boolean {
  const latestData =
    state.endstate?.dataNode ?? state.results[state.results.length - 1]?.dataNode ?? content.baseline
  const cmp = (v: number, op: '>=' | '<=', n: number) => (op === '>=' ? v >= n : v <= n)
  switch (m.kind) {
    case 'index':
      return cmp(state.indices[m.index], m.op, m.n)
    case 'flag': {
      const v = state.flags[m.flag]
      return v !== undefined && m.values.includes(v)
    }
    case 'indicator':
      return cmp(latestData[m.id] ?? content.baseline[m.id] ?? 0, m.op, m.n)
    case 'drift':
      return state.results.filter((r) => r.outcome.cls === 'O3').length <= m.max
    case 'persona': {
      const rung = latestPersonaRung(state, m.persona)
      return rung !== null && rung >= m.min
    }
    case 'poll':
      return cmp(state.poll, m.op, m.n)
  }
}

/** The seat's headline number, realized as a sentence. PM's is the election verdict. */
export function keyMetricFor(
  content: GameContent,
  state: GameState,
  actor: ActorId,
): { title: string; line: string } | null {
  const es = state.endstate
  if (!es) return null
  if (actor === 'PM') return { title: 'The 2031 election', line: es.election.line }
  const km = content.keymetrics.find((k) => k.actor === actor)
  if (!km) return null
  const ctx = { data: es.dataNode, poll: es.poll }
  for (const v of km.variants) {
    if (!v.measure || measureMet(content, state, v.measure)) {
      return { title: km.title, line: interpolateNumbers(v.text, ctx) }
    }
  }
  return null
}

// ---------- persona leverage (did the player's own choices help the two lives) ----------

export interface PersonaLeverage {
  kind: 'helped' | 'hurt' | 'neutral'
  /** the player's decisive action, e.g. `"Back the megaproject" (2027–28)` */
  action?: string
  /** for 'hurt': the alternative that would have gone better for them */
  alt?: string
  delta: number
}

export function personaLeverage(
  content: GameContent,
  state: GameState,
  persona: PersonaId,
): PersonaLeverage {
  const player = state.playerActor
  if (!player || !state.endstate || state.results.length < content.phases.length)
    return { kind: 'neutral', delta: 0 }
  const rungOf = (s: GameState) => parseInt(s.endstate!.personaRungs[persona].rung.slice(1)) || 3
  const actual = rungOf(state)
  let best = { r: actual, action: '', alt: '' }
  let worst = { r: actual, action: '' }
  for (let i = 0; i < content.phases.length; i++) {
    const phase = content.phases[i]
    const chosenId = state.results[i].choices[player]
    const chosen = phase.actions[player]?.find((a) => a.id === chosenId)
    if (!chosen) continue
    const label = `“${chosen.title}” (${phase.tension.year})`
    for (const alt of phase.actions[player]) {
      if (alt.id === chosenId) continue
      const r = rungOf(replayWithChoice(content, state, i, player, alt.id))
      if (r > best.r) best = { r, action: label, alt: `“${alt.title}”` }
      if (r < worst.r) worst = { r, action: label }
    }
  }
  if (best.r > actual) return { kind: 'hurt', action: best.action, alt: best.alt, delta: best.r - actual }
  if (worst.r < actual) return { kind: 'helped', action: worst.action, delta: actual - worst.r }
  return { kind: 'neutral', delta: 0 }
}
