import type { GameContent, GameState } from './types'
import { ACTORS } from './types'
import { applyDilemma, composeEndstate, initialState, metricEnv, pendingDilemma, resolvePhase } from './engine'
import { simulateAll } from './ai'

// URL-persistent playthroughs. A whole decade fits in one readable token:
//   <ACTOR>.<seed>.<phase choices>.<dilemma choices>
//   e.g.  PM.823741963.A-B-H2.A-B
// The engine is deterministic given seat + seed + the player's own choices
// (co-players are simulated from the same seed), so this replays exactly.

export function serializeRun(state: GameState): string | null {
  const actor = state.playerActor
  if (!actor) return null
  const suffixes = state.results.map((r) => (r.choices[actor] ?? '').replace(`P${r.phase}-${actor}-`, ''))
  const dilemmas = [2030, 2032]
    .map((y) => state.dilemmas?.[`D${y}-${actor}`] ?? '')
    .join('-')
    .replace(/-+$/, '')
  return [actor, String(state.seed), suffixes.join('-'), dilemmas].join('.').replace(/\.+$/, '')
}

/** Rebuild a game from a run token; lands the player where the token ends
 * (mid-decade → the next decision, complete → the endstate). Null if invalid. */
export function replayRun(content: GameContent, run: string): GameState | null {
  const [actorStr, seedStr, phasesStr = '', dilemmasStr = ''] = run.split('.')
  const actor = ACTORS.find((a) => a === actorStr)
  const seed = parseInt(seedStr)
  if (!actor || !Number.isFinite(seed)) return null

  let state = initialState('solo', actor, seed)
  const suffixes = phasesStr ? phasesStr.split('-') : []
  const dKeys = dilemmasStr ? dilemmasStr.split('-') : []

  for (let i = 0; i < suffixes.length && i < 3; i++) {
    const phase = content.phases[i]
    const actionId = `P${i + 1}-${actor}-${suffixes[i]}`
    if (!phase.actions[actor].some((a) => a.id === actionId)) break
    const prevResult = state.results[state.results.length - 1]
    const prevChoiceId = prevResult?.choices[actor]
    const prevPhase = prevResult ? content.phases[prevResult.phase - 1] : null
    const prevTag = prevPhase?.actions[actor].find((a) => a.id === prevChoiceId)?.tag
    const stateAt = { ...state, phaseIdx: i }
    const choices = simulateAll(phase, actor, actionId, state.flags, state.seed, prevTag, metricEnv(content, stateAt))
    const result = resolvePhase(content, stateAt, phase, choices)
    state = {
      ...state,
      choices: { ...state.choices, [phase.idx]: choices },
      results: [...state.results, result],
      flags: result.flagsAfter,
      indices: result.indicesAfter,
      poll: result.pollAfter,
      phaseIdx: i,
    }
    const dIdx = i === 1 ? 0 : i === 2 ? 1 : -1
    const key = dIdx >= 0 ? dKeys[dIdx] : undefined
    if ((key === 'A' || key === 'B') && dIdx >= 0) {
      const d = content.dilemmas.find((x) => x.id === `D${i === 1 ? 2030 : 2032}-${actor}`)
      if (d) state = applyDilemma(state, d, key)
    }
  }

  const done = state.results.length
  if (done === 0) return { ...state, phaseIdx: 0, stage: 'briefing' }
  if (done === 3) {
    const pend = pendingDilemma(content, { ...state, phaseIdx: 2 })
    if (pend) return { ...state, phaseIdx: 2, stage: 'dilemma' }
    return { ...state, phaseIdx: 2, stage: 'endstate', endstate: composeEndstate(content, state) }
  }
  const pend = pendingDilemma(content, { ...state, phaseIdx: done - 1 })
  if (pend) return { ...state, phaseIdx: done - 1, stage: 'dilemma' }
  return { ...state, phaseIdx: done, stage: 'decide' }
}
