import type { ActorId, GameContent, PersonaId, PhaseContent } from './types'
import { ACTORS, PERSONAS, PIVOTAL_BY_PHASE } from './types'
import {
  parseActions,
  parseActorBrief,
  parseCombos,
  parseEndstates,
  parseGoals,
  parseIndicators,
  parseBriefs,
  parseOutcome,
  parsePersona,
  parseClashes,
  parseEpilogue,
  parseKeyMetrics,
  parsePersonaEndings,
  parseRelevance,
  parseTension,
  parseTrends,
} from './parse'

// All game content lives in ../wargame/**/*.md — edit those files to change
// the simulation. Vite hot-reloads them in dev.
const files = import.meta.glob('../../../wargame/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function file(suffix: string): string {
  const key = Object.keys(files).find((k) => k.endsWith(suffix))
  if (!key) throw new Error(`Content file not found: ${suffix}`)
  return files[key]
}

function optionalFile(suffix: string): string | null {
  const key = Object.keys(files).find((k) => k.endsWith(suffix))
  return key ? files[key] : null
}

const PHASE_SLUGS = ['phase-1-sampo', 'phase-2-stack', 'phase-3-dividend']

let cached: GameContent | null = null

export function loadContent(): GameContent {
  if (cached) return cached

  const phases: PhaseContent[] = PHASE_SLUGS.map((slug, i) => {
    const idx = i + 1
    const combos = parseCombos(file(`${slug}/combos.md`))
    const outcomes = {} as PhaseContent['outcomes']
    for (const o of ['O1', 'O2', 'O3', 'O4', 'O5'] as const) {
      outcomes[o] = parseOutcome(file(`${slug}/outcomes/${o}.md`))
    }
    const briefsMd = optionalFile(`${slug}/briefs.md`)
    return {
      idx,
      slug,
      tension: parseTension(file(`${slug}/tension.md`)),
      actions: parseActions(file(`${slug}/actions.md`), idx),
      combos: combos.rows,
      combosPreamble: combos.preamble,
      flagDefaultsText: combos.flagDefaults,
      outcomes,
      pivotal: PIVOTAL_BY_PHASE[idx],
      briefs: briefsMd ? parseBriefs(briefsMd) : {},
    }
  })

  const { indicators, baseline, history, exogenous } = parseIndicators(file('data-indicators.md'))

  const personas = {} as Record<PersonaId, ReturnType<typeof parsePersona>>
  for (const p of PERSONAS) personas[p] = parsePersona(file(`personas/${p.toLowerCase()}.md`), p)

  const actorFiles: Record<ActorId, string> = {
    PM: 'actors/pm.md',
    AALTO: 'actors/aalto.md',
    STARTUP: 'actors/startup.md',
    SAK: 'actors/sak.md',
    HVK: 'actors/hvk.md',
    COUNTY: 'actors/county.md',
    TI: 'actors/ti.md',
  }
  const actors = {} as GameContent['actors']
  for (const a of ACTORS) {
    actors[a] = parseActorBrief(file(actorFiles[a]))
  }

  const { archetypes, epiloguesText } = parseEndstates(file('endstates.md'))

  const goalsMd = optionalFile('goals.md')
  const relevanceMd = optionalFile('relevance.md')
  const afterwordMd = optionalFile('afterword.md')
  const clashesMd = optionalFile('clashes.md')
  const keymetricsMd = optionalFile('keymetrics.md')
  const epilogueMd = optionalFile('epilogue.md')
  const endingsMd = optionalFile('personas/endings.md')

  cached = {
    phases,
    indicators,
    baseline,
    personas,
    actors,
    trends: parseTrends(file('trends.md')),
    archetypes,
    epiloguesText,
    mechanicsRaw: file('mechanics.md'),
    goals: goalsMd ? parseGoals(goalsMd) : [],
    relevance: relevanceMd ? parseRelevance(relevanceMd) : {},
    history,
    clashes: clashesMd ? parseClashes(clashesMd) : [],
    keymetrics: keymetricsMd ? parseKeyMetrics(keymetricsMd) : [],
    epilogue: epilogueMd ? parseEpilogue(epilogueMd) : {},
    personaEndings: (endingsMd ? parsePersonaEndings(endingsMd) : {}) as GameContent['personaEndings'],
    exogenous,
    afterword: afterwordMd,
  }
  return cached
}
