import type { GameContent, GameState, PersonaId } from './types'

/**
 * Final 2033 rungs for the two followed lives, implementing the
 * "Movement rules (for software)" sections of personas/marja.md and
 * personas/eetu.md. The ending LINES live in personas/endings.md — edit
 * them there. If you edit the movement rules in the md files, mirror the
 * rung logic here.
 */
export function finalPersonaRungs(
  content: GameContent,
  state: GameState,
  flags: Record<string, string>,
): Record<PersonaId, { rung: string; line: string }> {
  const p3cls = state.results[2].outcome.cls
  const compact = flags.COMPACT ?? 'none' // strong/thin = the dividend; none = balance sheet or punt
  const sampo = flags.MEGAPROJECT ?? 'pilot'
  const stack = flags.STACK ?? 'split'

  // MARJA — does the state absorb or expel its returners
  let marja = sampo === 'negotiated' ? 4 : sampo === 'full' ? 3 : 3
  if (stack === 'euro') marja = Math.min(5, marja + 0) // the migration needs her plan
  else if (stack === 'us') marja = Math.max(2, marja - 1)
  else marja = 2 // two stacks, one backlog
  if (compact === 'strong') marja = 5
  else if (compact === 'thin') marja = 4
  else if (p3cls === 'O4') marja = 2
  else if (p3cls === 'O5') marja = 1
  else if (p3cls === 'O3') marja = 1 // the second exit

  // EETU — does the door into working life open
  let eetu = sampo === 'pilot' ? 2 : sampo === 'full' ? 3 : 4
  if (stack === 'euro') eetu = Math.min(5, eetu + 1)
  else if (stack === 'us') eetu = 3
  if (compact === 'strong' || flags.LEVY === 'yes') eetu = Math.min(5, eetu + 1)
  else if (['O4', 'O5'].includes(p3cls)) eetu = Math.max(3, eetu) // work exists; the message was received
  else if (p3cls === 'O3') eetu = eetu <= 2 ? 1 : 2

  const line = (id: PersonaId, key: string, fallback: string): string =>
    content.personaEndings[id]?.[key] ?? content.personaEndings[id]?.[fallback] ?? ''

  const marjaKey = marja === 1 && p3cls === 'O3' ? '1-drift' : String(marja)
  const eetuKey = eetu === 3 && stack === 'us' ? '3-us' : String(eetu)

  return {
    MARJA: { rung: `M${marja}`, line: line('MARJA', marjaKey, String(marja)) },
    EETU: { rung: `E${eetu}`, line: line('EETU', eetuKey, String(eetu)) },
  }
}
