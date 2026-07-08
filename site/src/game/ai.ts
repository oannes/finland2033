import type { Action, ActorId, PhaseContent, Tag } from './types'
import { ACTORS } from './types'
import { actorMenu } from './engine'

/**
 * Simulated co-players for solo mode. Each actor has a disposition (weights
 * over A/B/H) that flags and phase context tilt. Deterministic per seed so a
 * playthrough is reproducible.
 */

// mulberry32 — small seeded PRNG
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Balance: hedges (H) are rare by default — a simulated table should be a
// living country, not a committee. Deadlock stays possible, never dominant.
const BASE_WEIGHTS: Record<ActorId, Record<Tag, number>> = {
  PM: { A: 0.42, B: 0.42, H: 0.16 },
  HVK: { A: 0.55, B: 0.33, H: 0.12 },
  TI: { A: 0.3, B: 0.55, H: 0.15 },
  AALTO: { A: 0.45, B: 0.42, H: 0.13 },
  STARTUP: { A: 0.35, B: 0.5, H: 0.15 },
  SAK: { A: 0.5, B: 0.28, H: 0.22 },
  COUNTY: { A: 0.42, B: 0.42, H: 0.16 },
}

function tilt(actor: ActorId, phase: number, flags: Record<string, string>): Record<Tag, number> {
  const w = { ...BASE_WEIGHTS[actor] }
  // Path dependence: institutions defend the position they already took.
  if (phase === 2) {
    // sovereignty (A) vs capability (B), colored by how Sampo went
    if (flags.SECURE_ARCH === 'yes') w.A *= 1.5
    if (flags.GUARANTEE === 'yes' && (actor === 'SAK' || actor === 'COUNTY')) w.A *= 1.5 // guarantees need an enforceable counterparty
    if (flags.MEGAPROJECT === 'full' && actor === 'PM') w.B *= 1.4 // booked savings demand capability now
    if (flags.MEGAPROJECT === 'pilot') w.H *= 1.3
    if (actor === 'HVK') w.B *= 1.2 // the paradox actor: security services want the best models
  }
  if (phase === 3) {
    if (flags.CRISIS_LEG === 'damaged') {
      if (actor === 'SAK' || actor === 'COUNTY') w.A *= 1.8 // the dividend becomes urgent
      if (actor === 'PM') w.B *= 1.3 // and consolidation tempting for the framework
    }
    if (flags.STRIKE_CARD === 'live' && actor === 'SAK') w.A *= 1.4
    if (flags.GUARANTEE === 'yes') w.A *= 1.3 // a promise made is a promise invoiced
    if (flags.STACK === 'us' && actor === 'TI') w.B *= 1.3
  }
  return w
}

export function simulateChoice(
  phase: PhaseContent,
  actor: ActorId,
  flags: Record<string, string>,
  random: () => number,
  opts: { biasTag?: Tag; biasStrength?: number; dampenH?: boolean } = {},
): Action {
  const { available } = actorMenu(phase, actor, flags)
  if (available.length === 0) return phase.actions[actor][phase.actions[actor].length - 1]
  const w = tilt(actor, phase.idx, flags)
  // Emergent alignment: the table read the player's previous move and drifts
  // toward it — random, but not deaf.
  if (opts.biasTag) w[opts.biasTag] *= opts.biasStrength ?? 1.6
  if (opts.dampenH) w.H *= 0.35
  const weighted = available.map((a) => ({ a, w: w[a.tag] ?? 0.1 }))
  const total = weighted.reduce((s, x) => s + x.w, 0)
  let r = random() * total
  for (const x of weighted) {
    r -= x.w
    if (r <= 0) return x.a
  }
  return weighted[weighted.length - 1].a
}

/** mechanics.md §3 as a function: what outcome class does a pivotal trio produce? */
function classifyTrio(tags: Tag[]): 'O1' | 'O2' | 'O3' | 'O4' | 'O5' {
  const n = (tag: Tag) => tags.filter((x) => x === tag).length
  if (n('A') === 3) return 'O1'
  if (n('B') === 3) return 'O5'
  if (n('A') === 2 && n('B') <= 1) return 'O2'
  if (n('B') === 2 && n('A') <= 1) return 'O4'
  return 'O3'
}

/**
 * Workshop mode: fill unclaimed seats with simulated choices. Draws one random
 * per actor in fixed order regardless of claims, so the stream — and therefore
 * the result — is identical on every client for the same seed and submissions.
 */
export function fillUnclaimed(
  phase: PhaseContent,
  claimed: Partial<Record<ActorId, string>>,
  flags: Record<string, string>,
  seed: number,
): Record<ActorId, string> {
  const random = rng(seed * 7919 + phase.idx * 104729)
  const choices = {} as Record<ActorId, string>
  for (const a of ACTORS) {
    const sim = simulateChoice(phase, a, flags, random)
    choices[a] = claimed[a] ?? sim.id
  }
  return choices
}

export function simulateAll(
  phase: PhaseContent,
  playerActor: ActorId,
  playerActionId: string,
  flags: Record<string, string>,
  seed: number,
  prevPlayerTag?: Tag,
): Record<ActorId, string> {
  const random = rng(seed * 7919 + phase.idx * 104729)
  // Alignment grows over the game: by the third decision the table has watched
  // the player twice and leans their way noticeably.
  const biasStrength = phase.idx === 2 ? 1.6 : phase.idx === 3 ? 2.1 : 1

  const draw = (dampenH: boolean): Record<ActorId, string> => {
    const choices = {} as Record<ActorId, string>
    for (const a of ACTORS) {
      choices[a] =
        a === playerActor
          ? playerActionId
          : simulateChoice(phase, a, flags, random, { biasTag: prevPlayerTag, biasStrength, dampenH }).id
    }
    return choices
  }

  let choices = draw(false)

  // Fairness guard: a random table shouldn't stumble into deadlock too easily.
  // If the pivotal trio lands on O3, redraw once with hedges dampened — the
  // second draw stands, whatever it is (drift stays possible, not cheap).
  const trioTags = phase.pivotal.map((a) => {
    const act = phase.actions[a].find((x) => x.id === choices[a])
    return (act?.tag ?? 'H') as Tag
  })
  if (classifyTrio(trioTags) === 'O3') {
    choices = draw(true)
  }
  return choices
}
