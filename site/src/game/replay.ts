import type { ActorId, GameContent, GameState } from './types'
import { composeEndstate, initialState, resolvePhase } from './engine'
import { fillUnclaimed } from './ai'
import type { ServerState } from './net'

/**
 * Rebuild the full game state from the server's synchronized record.
 * Resolution is deterministic (fixed tables + seeded simulation for unclaimed
 * actors), so every client independently computes the identical playthrough.
 */
export function replayServerGame(content: GameContent, s: ServerState): GameState {
  let state = initialState('workshop', s.you, s.seed)
  const resolvedPhases = s.phaseIdx + (s.stage === 'reveal' || s.stage === 'endstate' ? 1 : 0)
  for (let i = 0; i < resolvedPhases; i++) {
    const phase = content.phases[i]
    const choices = fillUnclaimed(phase, s.submissions[i + 1] ?? {}, state.flags, s.seed) as Record<ActorId, string>
    const result = resolvePhase(content, state, phase, choices)
    state = {
      ...state,
      choices: { ...state.choices, [phase.idx]: choices },
      results: [...state.results, result],
      flags: result.flagsAfter,
      indices: result.indicesAfter,
      poll: result.pollAfter,
    }
  }
  state.phaseIdx = s.phaseIdx
  state.stage = s.stage === 'lobby' ? 'briefing' : s.stage
  if (s.stage === 'endstate' && state.results.length === 3) {
    state.endstate = composeEndstate(content, state)
  }
  return state
}
