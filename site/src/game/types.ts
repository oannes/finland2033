export type Tag = 'A' | 'B' | 'H'
export type ActorId = 'PM' | 'AALTO' | 'STARTUP' | 'SAK' | 'HVK' | 'COUNTY' | 'TI'
export type IndexId = 'RES' | 'LEG' | 'PRO'
export type OutcomeClass = 'O1' | 'O2' | 'O3' | 'O4' | 'O5'
/** The followed cast — two lives the game narrates after every decision.
 * Changing the cast: add personas/<id>.md, add **ID (rung)** bullets to every
 * outcome file, update this list + PERSONA_PINS + personas.ts movement rules. */
export type PersonaId = 'MARJA' | 'EETU'

export const ACTORS: ActorId[] = ['PM', 'AALTO', 'STARTUP', 'SAK', 'HVK', 'COUNTY', 'TI']
export const PERSONAS: PersonaId[] = ['MARJA', 'EETU']

export interface IndexDelta {
  index: IndexId
  delta: number
}

export interface FlagAssign {
  flag: string
  value: string
  /** outcome ids this assignment is conditional on (from "if outcome is P1-O1/O2" prose) */
  ifOutcomes?: string[]
  /** combo rows this assignment is conditional on (from "on rows 10/19") */
  ifRows?: number[]
  /** "only if ACTOR-TAG" condition from outcome flags lines */
  ifActorTag?: { actor: ActorId; tag: Tag; elseValue?: string }
}

export interface Requirement {
  flag?: string
  values?: string[]
  /** measure-grammar gate, e.g. `indicator days >= 30` (redesign v2) */
  measure?: GoalMeasure
  raw: string
}

/** Snapshot the gates evaluate against (current flags + latest numbers). */
export interface MetricEnv {
  flags: Record<string, string>
  data: Record<string, number>
  indices: Indices
  poll: number
  drift: number
}

export interface Action {
  id: string
  actor: ActorId
  phase: number
  tag: Tag
  title: string
  summary: string
  effects: IndexDelta[]
  /** government polling shift (percentage points) parsed from effects */
  pollDelta?: number
  effectsRaw?: string
  data: Record<string, number>
  dataRaw?: string
  flagsRaw?: string
  flagSets: FlagAssign[]
  hook?: string
  requires?: Requirement
  requiresRaw?: string
  /** debrief dialogue: what the chooser says at the table, first person */
  said?: string
  /** debrief dialogue: narrator line on what the action sets in motion in the chooser's own corner */
  aftermath?: string
  /** debrief dialogue: lines addressed to specific other actors whose deal metrics this action moves */
  to?: Partial<Record<ActorId, string>>
  /** debrief dialogue: what the affected actor says back to the chooser (mirror of `to`) */
  react?: Partial<Record<ActorId, string>>
}

/** A between-years social-contract dilemma (dilemmas.md): two options, small
 * real effects, one per seat in 2030 and 2032. */
export interface DilemmaOption {
  key: 'A' | 'B'
  title: string
  summary: string
  effects: IndexDelta[]
  pollDelta?: number
  data: Record<string, number>
}

export interface Dilemma {
  id: string
  actor: ActorId
  year: number
  title: string
  context: string
  options: DilemmaOption[]
}

export interface ClashSide {
  /** what this actor pays when they lose the confrontation */
  effects: IndexDelta[]
  pollDelta?: number
  data: Record<string, number>
  line: string
}

/** A standing confrontation between two seats, resolved every phase by stance:
 * force (A) overruns negotiation (B), negotiation binds waiting (H), waiting
 * outlasts force. Same stance = stand-off. */
export interface ClashEdge {
  a: ActorId
  b: ActorId
  title: string
  loser: Partial<Record<ActorId, ClashSide>>
}

export interface ClashResult {
  edge: ClashEdge
  winner: ActorId
  loser: ActorId
  line: string
}

export interface ComboRow {
  row: number
  tags: [Tag, Tag, Tag]
  outcome: OutcomeClass
  note: string
  flags: FlagAssign[]
}

export interface DataAdjustment {
  ifRaw: string
  flag?: string
  values?: string[]
  deltas: Record<string, number>
  note?: string
}

export interface DataBlock {
  node: string
  year: number
  /** absolute values, or inherit offsets */
  values: Record<string, { abs?: number; inherit?: number }>
  adjustments: DataAdjustment[]
}

export interface PersonaImplication {
  persona: PersonaId
  rung: string
  text: string
}

export interface Outcome {
  id: string // e.g. P1-O2
  cls: OutcomeClass
  name: string
  epigraph?: string
  firesOn?: string
  indexEffects: IndexDelta[]
  pollDelta?: number
  narrative: string // markdown
  flagsText?: string
  flagSets: FlagAssign[]
  data: DataBlock
  personas: PersonaImplication[]
  hooks: Record<string, string> // key "AALTO-A" etc → paragraph
}

export interface Inject {
  label: string
  text: string
}

export interface EntryVariant {
  condRaw: string
  flag?: string
  values?: string[]
  /** narrative label shown to players (the flag condition itself is never displayed) */
  label?: string
  text: string
}

export interface GrandProject {
  key: Tag
  title: string
  text: string
}

export interface Tension {
  title: string
  year: string
  intro: string
  injects: Inject[]
  entryVariants: EntryVariant[]
  forkIntro: string
  projects: GrandProject[]
  whyNoOwner?: string
}

export interface PhaseContent {
  idx: number // 1..3
  slug: string
  tension: Tension
  actions: Record<ActorId, Action[]>
  combos: ComboRow[]
  combosPreamble: string
  flagDefaultsText?: string
  outcomes: Record<OutcomeClass, Outcome>
  pivotal: [ActorId, ActorId, ActorId]
  /** per-actor desk briefs (briefs.md) — the only text a player must read to decide */
  briefs: Partial<Record<ActorId, string>>
}

export interface Indicator {
  id: string
  label: string
  unit: string
  baseline: number
  /** plain-language definition shown to players */
  plain?: string
}

export interface HistorySeries {
  years: number[]
  series: Record<string, number[]>
}

export interface Persona {
  id: PersonaId
  title: string
  baseline: string
  measures: string
  /** goals and aspirations, shown in the Two lives sidebar */
  aspiration?: string
  ladder: { rung: string; state: string; rendering: string }[]
  movementRules: string
  raw: string
}

export interface TrendCard {
  id: string
  title: string
  text: string
}

export interface Archetype {
  id: string // E1..E9
  name: string
  text: string
  stack: string
  p3class: 'compact' | 'freeze' | 'efficiency'
}

export interface ActorBrief {
  title: string
  raw: string
  /** seat-select: the character's worry about the future, in their voice */
  seatQuote?: string
  /** seat-select: their dilemma, as a question */
  seatQuestion?: string
  who?: string
  levers?: string
  cannotControl?: string
  objectives?: string
  tensions?: string
}

export type GoalMeasure =
  | { kind: 'index'; index: IndexId; op: '>=' | '<='; n: number }
  | { kind: 'flag'; flag: string; values: string[] }
  | { kind: 'indicator'; id: string; op: '>=' | '<='; n: number }
  | { kind: 'drift'; max: number }
  | { kind: 'persona'; persona: PersonaId; min: number }
  | { kind: 'poll'; op: '>=' | '<='; n: number }

export interface Goal {
  actor: ActorId
  title: string
  measureRaw: string
  measure?: GoalMeasure
  why: string
}

export interface GoalStatus {
  goal: Goal
  state: 'met' | 'miss' | 'open'
  reading: string // e.g. "RES is 6.2 (needs ≥ 7)"
}

export interface KeyMetric {
  actor: ActorId
  title: string
  variants: { measure?: GoalMeasure; text: string }[]
}

/** One parsed line of the epilogue script: voice line (v set) or narration. */
export interface EpiLine {
  v?: string
  t: string
  /** `+ label` lines: an action button the player clicks to continue */
  action?: boolean
}

/** A section of epilogue.md: script lines plus `key: value` settings. */
export interface EpiSection {
  lines: EpiLine[]
  meta: Record<string, string>
}

export type EpilogueDoc = Record<string, EpiSection>

export interface GameContent {
  phases: PhaseContent[]
  indicators: Indicator[]
  baseline: Record<string, number>
  personas: Record<PersonaId, Persona>
  actors: Record<ActorId, ActorBrief>
  trends: TrendCard[]
  archetypes: Archetype[]
  epiloguesText: string
  mechanicsRaw: string
  goals: Goal[]
  /** phase idx → inject index (0-based) → allowed actors, or null = everyone */
  relevance: Record<number, Record<number, ActorId[] | null>>
  /** pre-2026 historical run-up for the indicator charts */
  history: HistorySeries | null
  /** which indicators the sidebar charts (data-indicators.md `chart:` line) */
  chartIds: string[]
  /** standing confrontations (clashes.md); empty if the file is absent */
  clashes: ClashEdge[]
  /** per-seat headline metrics (keymetrics.md); PM's comes from the election */
  keymetrics: KeyMetric[]
  dilemmas: Dilemma[]
  /** the 2033 epilogue script (epilogue.md) */
  epilogue: EpilogueDoc
  /** Maria/Eetu 2033 ending lines by rung (personas/endings.md) */
  personaEndings: Record<PersonaId, Record<string, string>>
  /** exogenous indicators: id → year → value; grow regardless of play */
  exogenous: Record<string, Record<number, number>>
  /** optional closing text (wargame/afterword.md) rendered at the end of the endstate */
  afterword: string | null
}

// ---- runtime state ----

export interface Indices {
  RES: number
  LEG: number
  PRO: number
}

export interface PhaseResult {
  phase: number
  comboRow: ComboRow
  outcome: Outcome
  choices: Record<ActorId, string> // action id per actor
  hooks: { actor: ActorId; actionId: string; text: string }[]
  flagsAfter: Record<string, string>
  indicesAfter: Indices
  indicesDelta: Indices
  pollAfter: number
  pollDelta: number
  dataNode: Record<string, number>
  entryVariantsShown: EntryVariant[]
  clashes: ClashResult[]
}

export interface EndstateResult {
  archetype: Archetype
  dataNode: Record<string, number>
  personaRungs: Record<PersonaId, { rung: string; line: string }>
  flags: Record<string, string>
  indices: Indices
  poll: number
  election: { verdict: 'returned' | 'hung' | 'defeated'; line: string }
}

export type Stage =
  | 'briefing'
  | 'tension'
  | 'dilemma'
  | 'decide'
  | 'reveal'
  | 'endstate'

export interface GameState {
  mode: 'solo' | 'workshop'
  playerActor: ActorId | null // solo only
  seed: number
  phaseIdx: number // 0..2 (index into phases)
  stage: Stage
  choices: Record<number, Partial<Record<ActorId, string>>>
  results: PhaseResult[]
  flags: Record<string, string>
  indices: Indices
  /** government approval, 0–100; the 2031 election is scored from this */
  poll: number
  endstate: EndstateResult | null
  /** dilemma id → chosen option (solo mode, between-years decisions) */
  dilemmas?: Record<string, 'A' | 'B'>
}

export const PIVOTAL_BY_PHASE: Record<number, [ActorId, ActorId, ActorId]> = {
  1: ['PM', 'SAK', 'COUNTY'], // Sampo: consent and execution
  2: ['PM', 'COUNTY', 'STARTUP'], // the stack: declaration, services, sector signal
  3: ['PM', 'SAK', 'TI'], // the dividend: the distribution triangle
}

export const PERSONA_PINS: Record<PersonaId, string[]> = {
  MARJA: ['pub_ai', 'trust'],
  EETU: ['youth_u', 'sov_share'],
}
