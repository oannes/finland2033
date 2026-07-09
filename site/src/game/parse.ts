import type {
  ClashEdge,
  EpilogueDoc,
  KeyMetric,
  Action,
  ActorId,
  Archetype,
  ComboRow,
  DataAdjustment,
  DataBlock,
  EntryVariant,
  FlagAssign,
  GrandProject,
  IndexDelta,
  Indicator,
  Inject,
  Outcome,
  OutcomeClass,
  Persona,
  PersonaId,
  PersonaImplication,
  Requirement,
  Tag,
  Tension,
  TrendCard,
} from './types'
import { ACTORS, PERSONAS } from './types'

/** normalize unicode minus/dash variants to ascii '-' */
const norm = (s: string) => s.replace(/[−–—]/g, '-')

const num = (s: string) => parseFloat(norm(s).replace('+', ''))

/** split a markdown doc into sections by heading level */
export function splitSections(md: string, level: number): { heading: string; body: string }[] {
  const re = new RegExp(`^#{${level}} (.+)$`, 'gm')
  const out: { heading: string; body: string }[] = []
  let m: RegExpExecArray | null
  const marks: { heading: string; start: number; end: number }[] = []
  while ((m = re.exec(md))) marks.push({ heading: m[1].trim(), start: m.index, end: m.index + m[0].length })
  for (let i = 0; i < marks.length; i++) {
    const bodyStart = marks[i].end
    const bodyEnd = i + 1 < marks.length ? marks[i + 1].start : md.length
    out.push({ heading: marks[i].heading, body: md.slice(bodyStart, bodyEnd).trim() })
  }
  return out
}

function parseIndexDeltas(s: string): IndexDelta[] {
  const out: IndexDelta[] = []
  const re = /\b(RES|LEG|PRO)\s*([+−–-]?\d+(?:\.\d+)?)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) out.push({ index: m[1] as IndexDelta['index'], delta: num(m[2]) })
  return out
}

/** "POLL +4" / "POLL −6" in an effects line → government approval shift */
function parsePollDelta(s: string): number | undefined {
  const m = s.match(/\bPOLL\s*([+−–-]?\d+(?:\.\d+)?)/)
  return m ? num(m[1]) : undefined
}

function parseDataDeltas(s: string): Record<string, number> {
  const out: Record<string, number> = {}
  const re = /\b([a-z_]+)\s*([+−–-]\d+(?:\.\d+)?)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) out[m[1]] = (out[m[1]] ?? 0) + num(m[2])
  return out
}

/** Extract FLAG=value assignments from prose. Skips "contributes"/"enables" segments
 * (grammar: those apply only per combos.md), keeps "if outcome is …" conditions. */
function parseFlagAssigns(s: string, opts: { skipContributes?: boolean } = {}): FlagAssign[] {
  const out: FlagAssign[] = []
  const segments = s.split(/[;·]/)
  for (const seg of segments) {
    if (opts.skipContributes && /contribut|enable/i.test(seg)) continue
    const re = /\b([A-Z][A-Z_0-9]{2,})=([a-zA-Z][a-zA-Z-]*)/g
    let m: RegExpExecArray | null
    while ((m = re.exec(seg))) {
      const assign: FlagAssign = { flag: m[1], value: m[2].toLowerCase() }
      // "RESERVE=full if outcome is P1-O1/O2" or "RESERVE=partial in P1-O3/O4/O5"
      const after = seg.slice(m.index)
      const cond = after.match(/\b(?:if outcome is|in)\s+(P\d-O[\dO/]+(?:\/O?\d)*)/)
      if (cond) {
        const prefix = cond[1].match(/^P\d/)![0]
        assign.ifOutcomes = cond[1]
          .replace(/^P\d-/, '')
          .split('/')
          .map((o) => `${prefix}-${o.startsWith('O') ? o : 'O' + o}`)
      }
      // "on rows 10/19"
      const rows = seg.match(/on rows?\s+([\d/,\s]+)/)
      if (rows) assign.ifRows = rows[1].split(/[/,\s]+/).filter(Boolean).map(Number)
      out.push(assign)
      break // one assignment per segment; extra matches in parentheses are prose
    }
  }
  return out
}

function parseRequirement(s: string): Requirement | undefined {
  const raw = s.trim()
  const bare = raw.replace(/\s*\([^)]*\)\s*$/, '').trim()
  const fm = bare.match(/([A-Z][A-Z_0-9]{2,})\s*=\s*([a-zA-Z][a-zA-Z/|,-]*)/)
  if (fm) return { flag: fm[1], values: fm[2].toLowerCase().split(/[/|,]/), raw }
  const measure = parseMeasure(bare)
  if (measure) return { measure, raw }
  return undefined
}

// ---------- actions.md ----------

export function parseActions(md: string, phase: number): Record<ActorId, Action[]> {
  const out = {} as Record<ActorId, Action[]>
  for (const a of ACTORS) out[a] = []
  for (const actorSec of splitSections(md, 2)) {
    const actor = ACTORS.find((a) => actorSec.heading.startsWith(a))
    if (!actor) continue
    for (const actSec of splitSections('### ' + '\n' + actorSec.body, 3)) {
      const h = actSec.heading.match(/^(P\d-[A-Z]+-[A-Z]\d?)\s*[—-]\s*"(.+?)"/)
      if (!h) continue
      const action: Action = {
        id: h[1],
        actor,
        phase,
        tag: 'H',
        title: h[2],
        summary: '',
        effects: [],
        data: {},
        flagSets: [],
      }
      for (const line of actSec.body.split('\n')) {
        const toM = line.match(/^-\s*(to|react)\s+([A-Z]+):\s*(.*)$/)
        if (toM && (ACTORS as readonly string[]).includes(toM[2])) {
          const map = toM[1] === 'to' ? (action.to ??= {}) : (action.react ??= {})
          map[toM[2] as ActorId] = toM[3].trim()
          continue
        }
        const f = line.match(/^-\s*(\w+):\s*(.*)$/)
        if (!f) continue
        const [, key, val] = f
        switch (key) {
          case 'tag':
            action.tag = val.trim().charAt(0) as Tag
            break
          case 'summary':
            action.summary = val.trim()
            break
          case 'effects':
            action.effectsRaw = val.trim()
            action.effects = parseIndexDeltas(val)
            action.pollDelta = parsePollDelta(val)
            // e.g. "sets EARLY_TABLE=demanded" inside effects
            action.flagSets.push(...parseFlagAssigns(val, { skipContributes: true }))
            break
          case 'data':
            action.dataRaw = val.trim()
            action.data = parseDataDeltas(val)
            break
          case 'flags':
            action.flagsRaw = val.trim()
            action.flagSets.push(...parseFlagAssigns(val, { skipContributes: true }))
            break
          case 'hook':
            action.hook = val.trim()
            break
          case 'said':
            action.said = val.trim()
            break
          case 'aftermath':
            action.aftermath = val.trim()
            break
          case 'requires':
            action.requiresRaw = val.trim()
            if (!/^none/i.test(val.trim())) action.requires = parseRequirement(val)
            break
        }
      }
      out[actor].push(action)
    }
  }
  return out
}

// ---------- combos.md ----------

export function parseCombos(md: string): { rows: ComboRow[]; preamble: string; flagDefaults?: string } {
  const rows: ComboRow[] = []
  const lines = md.split('\n')
  let preambleEnd = lines.length
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^\|\s*(\d+)\s*\|\s*([ABH])\s*\|\s*([ABH])\s*\|\s*([ABH])\s*\|\s*\*\*(O\d)\*\*\s*\|(.*)\|/)
    if (!m) continue
    if (preambleEnd === lines.length) preambleEnd = i - 2 // skip header rows
    const note = m[6].trim()
    rows.push({
      row: parseInt(m[1]),
      tags: [m[2] as Tag, m[3] as Tag, m[4] as Tag],
      outcome: m[5] as OutcomeClass,
      note,
      flags: parseFlagAssigns(note),
    })
  }
  const defaultsSec = splitSections(md, 2).find((s) => /flag defaults/i.test(s.heading))
  return {
    rows,
    preamble: lines.slice(0, Math.max(preambleEnd, 0)).filter((l) => !l.startsWith('#')).join('\n').trim(),
    flagDefaults: defaultsSec?.body,
  }
}

// ---------- outcome files ----------

function parseDataBlock(yamlText: string): DataBlock {
  const block: DataBlock = { node: '', year: 0, values: {}, adjustments: [] }
  const lines = yamlText.split('\n')
  let inAdjust = false
  let current: DataAdjustment | null = null
  for (const raw of lines) {
    const line = norm(raw).replace(/#.*$/, '').trimEnd()
    if (!line.trim()) continue
    if (/^adjustments:/.test(line.trim())) {
      inAdjust = true
      continue
    }
    if (inAdjust) {
      const ifM = line.match(/^\s*-\s*if:\s*(.+)$/)
      if (ifM) {
        current = { ifRaw: ifM[1].trim(), deltas: {} }
        const fm = ifM[1].match(/([A-Z][A-Z_0-9]{2,})=([a-zA-Z/]+)/)
        if (fm) {
          current.flag = fm[1]
          current.values = fm[2].toLowerCase().split('/')
        }
        block.adjustments.push(current)
        continue
      }
      const kv = line.match(/^\s+(\w+):\s*([+-]?\d+(?:\.\d+)?)/)
      if (kv && current) {
        if (kv[1] === 'note') continue
        current.deltas[kv[1]] = parseFloat(kv[2])
        continue
      }
      const noteM = line.match(/^\s+note:\s*(.+)$/)
      if (noteM && current) current.note = noteM[1]
      continue
    }
    const kv = line.match(/^(\w+):\s*(.+)$/)
    if (!kv) continue
    const [, key, valRaw] = kv
    const val = valRaw.trim()
    if (key === 'node') block.node = val
    else if (key === 'year') block.year = parseInt(val)
    else {
      const inh = val.match(/^inherit\s*([+-]\d+(?:\.\d+)?)?$/)
      if (inh) block.values[key] = { inherit: inh[1] ? parseFloat(inh[1]) : 0 }
      else if (/^[+-]?\d/.test(val)) block.values[key] = { abs: parseFloat(val) }
    }
  }
  return block
}

/** Parse outcome flags line, handling "only if TI-A, else `no`" style conditions */
function parseOutcomeFlags(s: string): FlagAssign[] {
  const out: FlagAssign[] = []
  for (const seg of s.split('·')) {
    const m = seg.match(/`?([A-Z][A-Z_0-9]{2,})=([a-zA-Z-]+)`?/)
    if (!m) continue
    const assign: FlagAssign = { flag: m[1], value: m[2].toLowerCase() }
    const cond = seg.match(/only if\s+(?:([A-Z]+)-([ABH]))/)
    if (cond) {
      const elseM = seg.match(/else\s*`?([a-zA-Z-]+)`?/)
      assign.ifActorTag = {
        actor: cond[1] as ActorId,
        tag: cond[2] as Tag,
        elseValue: elseM ? elseM[1].toLowerCase() : undefined,
      }
    }
    const rows = seg.match(/on rows?\s+([\d/,\s]+)/)
    if (rows) assign.ifRows = rows[1].split(/[/,\s]+/).filter(Boolean).map(Number)
    // "CRISIS_LEG per rule" has no '=' so it's skipped naturally (handled in engine)
    out.push(assign)
  }
  return out
}

export function parseOutcome(md: string): Outcome {
  const titleM = md.match(/^#\s*(P\d-O\d)\s*[—-]\s*([^("\n]+)(?:\("(.+?)"\))?/m)
  const id = titleM?.[1] ?? 'P?-O?'
  const cls = (id.split('-')[1] ?? 'O3') as OutcomeClass
  const firesM = md.match(/\*\*Fires on:?\*\*\s*(.+)/)
  const outcome: Outcome = {
    id,
    cls,
    name: titleM?.[2]?.trim() ?? id,
    epigraph: titleM?.[3],
    firesOn: firesM?.[1],
    indexEffects: firesM ? parseIndexDeltas(firesM[1].split(/index effects:?/i)[1] ?? '') : [],
    narrative: '',
    flagSets: [],
    data: { node: id, year: 0, values: {}, adjustments: [] },
    personas: [],
    hooks: {},
  }
  // index effects may also be on the fires line directly
  if (outcome.indexEffects.length === 0 && firesM) outcome.indexEffects = parseIndexDeltas(firesM[1])
  if (firesM) outcome.pollDelta = parsePollDelta(firesM[1])

  for (const sec of splitSections(md, 2)) {
    const h = sec.heading.toLowerCase()
    if (h.startsWith('what happens')) outcome.narrative = sec.body
    else if (h.startsWith('flags')) {
      outcome.flagsText = sec.body
      outcome.flagSets = parseOutcomeFlags(sec.body)
    } else if (h.startsWith('data')) {
      const yaml = sec.body.match(/```yaml\n([\s\S]*?)```/)
      if (yaml) outcome.data = parseDataBlock(yaml[1])
    } else if (h.startsWith('persona')) {
      const re = /^-\s*\*\*([A-Z]+)\s*\(([^)]+)\):?\*\*:?\s*(.+)$/gm
      let m: RegExpExecArray | null
      while ((m = re.exec(sec.body))) {
        if (PERSONAS.includes(m[1] as PersonaId))
          outcome.personas.push({ persona: m[1] as PersonaId, rung: m[2], text: m[3] } as PersonaImplication)
      }
    } else if (h.startsWith('modifier hooks')) {
      const re = /^-\s*\*\*([A-Z]+-[ABH]\d?):?\*\*:?\s*(.+)$/gm
      let m: RegExpExecArray | null
      while ((m = re.exec(sec.body))) outcome.hooks[m[1]] = m[2]
    }
  }
  return outcome
}

// ---------- tension.md ----------

function parseInjects(body: string): Inject[] {
  const out: Inject[] = []
  const re = /^-\s*\*\*(Inject \d+[^:*]*):?\*\*:?\s*(.+)$/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(body))) out.push({ label: m[1].trim(), text: m[2].trim() })
  return out
}

export function parseTension(md: string): Tension {
  const titleM = md.match(/^#\s*(.+)$/m)
  const title = titleM?.[1] ?? 'Phase'
  const yearM = title.match(/\(([^)]+)\)/)
  const t: Tension = {
    title: title.replace(/\s*\([^)]*\)\s*$/, '').replace(/^Phase \d\s*[—-]\s*/, ''),
    year: yearM?.[1] ?? '',
    intro: '',
    injects: [],
    entryVariants: [],
    forkIntro: '',
    projects: [],
  }
  // intro = text between title and first ## section
  const firstSec = md.indexOf('\n## ')
  const afterTitle = md.indexOf('\n', md.indexOf('# '))
  t.intro = md
    .slice(afterTitle, firstSec > -1 ? firstSec : undefined)
    .replace(/\*\*Tension reaching inflection:?\*\*/, '**Tension reaching inflection:**')
    .trim()

  for (const sec of splitSections(md, 2)) {
    const h = sec.heading.toLowerCase()
    if (h.includes('situation') || h.includes('fixed injects')) {
      t.injects.push(...parseInjects(sec.body))
      const beforeList = sec.body.split(/^-\s*\*\*/m)[0].trim()
      if (beforeList && !t.intro.includes(beforeList)) t.intro += (t.intro ? '\n\n' : '') + beforeList
    } else if (h.includes('entry variants')) {
      const re = /^-\s*\*\*([^:]+?):?\*\*:?\s*([\s\S]+?)(?=\n-\s*\*\*|$)/gm
      let m: RegExpExecArray | null
      while ((m = re.exec(sec.body))) {
        const condRaw = m[1].trim()
        const v: EntryVariant = { condRaw, text: m[2].trim() }
        const fm = condRaw.match(/([A-Z][A-Z_0-9]{2,})=([a-zA-Z/]+)/)
        if (fm) {
          v.flag = fm[1]
          v.values = fm[2].toLowerCase().split('/')
        }
        // "FLAG=value — Narrative label" → players see only the label
        const lm = condRaw.match(/—\s*(.+)$/)
        if (lm) v.label = lm[1].trim()
        t.entryVariants.push(v)
      }
    } else if (h === 'the fork') {
      const parts = splitSections(sec.body, 3)
      t.forkIntro = sec.body.split(/\n### /)[0].trim()
      for (const p of parts) {
        const pm = p.heading.match(/Grand Project ([AB])\s*[—-]\s*(.+)/)
        if (pm) t.projects.push({ key: pm[1] as GrandProject['key'], title: pm[2].trim(), text: p.body })
        else if (/^hedge/i.test(p.heading)) {
          const hm = p.heading.match(/Hedge\s*[—-]\s*(.+)/i)
          t.projects.push({ key: 'H', title: hm ? hm[1].trim() : 'Hedge', text: p.body })
        }
      }
    } else if (h.includes('why no one owns')) {
      t.whyNoOwner = sec.body
    }
  }
  return t
}

// ---------- data-indicators.md ----------

export function parseIndicators(md: string): {
  indicators: Indicator[]
  baseline: Record<string, number>
  history: import('./types').HistorySeries | null
  exogenous: Record<string, Record<number, number>>
  chartIds: string[]
} {
  const indicators: Indicator[] = []
  const re = /^\|\s*`(\w+)`\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([\d.]+)\s*\|/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(md))) {
    indicators.push({ id: m[1], label: m[2].trim(), unit: m[3].trim(), baseline: parseFloat(m[4]) })
  }

  // plain-language definitions: "- id: text" bullets in their own section
  const defsSec = splitSections(md, 2).find((s) => /plain-language definitions/i.test(s.heading))
  if (defsSec) {
    const dre = /^-\s*(\w+):\s*(.+)$/gm
    let dm: RegExpExecArray | null
    while ((dm = dre.exec(defsSec.body))) {
      const ind = indicators.find((i) => i.id === dm![1])
      if (ind) ind.plain = dm[2].trim()
    }
  }

  // baseline block: the yaml block in the "Baseline block" section
  const baseline: Record<string, number> = {}
  const baseSec = splitSections(md, 2).find((s) => /baseline block/i.test(s.heading))
  const yaml = (baseSec?.body ?? md).match(/```yaml\n([\s\S]*?)```/)
  if (yaml) {
    for (const line of yaml[1].split('\n')) {
      const kv = line.match(/^(\w+):\s*([\d.]+)/)
      if (kv && kv[1] !== 'year') baseline[kv[1]] = parseFloat(kv[2])
    }
  }

  // historical run-up: "years: [..]" + per-indicator arrays
  let history: import('./types').HistorySeries | null = null
  const histSec = splitSections(md, 2).find((s) => /historical series/i.test(s.heading))
  const histYaml = histSec?.body.match(/```yaml\n([\s\S]*?)```/)
  if (histYaml) {
    const series: Record<string, number[]> = {}
    let years: number[] = []
    const lre = /^(\w+):\s*\[([^\]]+)\]/gm
    let lm: RegExpExecArray | null
    while ((lm = lre.exec(histYaml[1]))) {
      const values = lm[2].split(',').map((v) => parseFloat(v.trim()))
      if (lm[1] === 'years') years = values
      else series[lm[1]] = values
    }
    if (years.length) history = { years, series }
  }

  // exogenous schedule: indicators that grow regardless of play
  // format inside the "Exogenous schedule" section's yaml block:
  //   cap_gap: { 2028: 12, 2029: 20, 2031: 28, 2033: 34 }
  const exogenous: Record<string, Record<number, number>> = {}
  const exoSec = splitSections(md, 2).find((s) => /exogenous schedule/i.test(s.heading))
  const exoYaml = exoSec?.body.match(/```yaml\n([\s\S]*?)```/)
  if (exoYaml) {
    const ere = /^(\w+):\s*\{([^}]+)\}/gm
    let em: RegExpExecArray | null
    while ((em = ere.exec(exoYaml[1]))) {
      const sched: Record<number, number> = {}
      for (const pair of em[2].split(',')) {
        const kv = pair.split(':').map((x) => parseFloat(x.trim()))
        if (kv.length === 2 && !Number.isNaN(kv[0])) sched[kv[0]] = kv[1]
      }
      exogenous[em[1]] = sched
    }
  }

  const chartM = md.match(/^chart:\s*(.+)$/m)
  const chartIds = chartM
    ? chartM[1].split(/[,\s]+/).map((x) => x.trim()).filter((x) => indicators.some((i) => i.id === x))
    : indicators.map((i) => i.id)
  return { indicators, baseline, history, exogenous, chartIds }
}

// ---------- personas ----------

export function parsePersona(md: string, id: PersonaId): Persona {
  const titleM = md.match(/^#\s*(.+)$/m)
  const p: Persona = {
    id,
    title: titleM?.[1] ?? id,
    baseline: '',
    measures: '',
    ladder: [],
    movementRules: '',
    raw: md,
  }
  for (const sec of splitSections(md, 2)) {
    const h = sec.heading.toLowerCase()
    if (h.startsWith('baseline')) p.baseline = sec.body
    else if (h.startsWith('goals and aspirations')) p.aspiration = sec.body
    else if (h.startsWith('what')) p.measures = sec.body
    else if (h.startsWith('state ladder')) {
      const re = /^\|\s*([A-Z]\d)\s*\|\s*([^|]+)\|\s*([^|]+)\|/gm
      let m: RegExpExecArray | null
      while ((m = re.exec(sec.body))) p.ladder.push({ rung: m[1], state: m[2].trim(), rendering: m[3].trim() })
    } else if (h.startsWith('movement rules')) p.movementRules = sec.body
  }
  return p
}

// ---------- trends ----------

export function parseTrends(md: string): TrendCard[] {
  return splitSections(md, 2)
    .filter((s) => /^TR-\d/.test(s.heading))
    .map((s) => {
      const m = s.heading.match(/^(TR-\d+)\s+(.+)$/)
      return { id: m?.[1] ?? s.heading, title: m?.[2] ?? s.heading, text: s.body }
    })
}

// ---------- goals.md ----------

function parseMeasure(s: string): import('./types').GoalMeasure | undefined {
  const t = norm(s).trim()
  let m = t.match(/^index\s+(RES|LEG|PRO)\s*(>=|<=)\s*([\d.]+)/)
  if (m) return { kind: 'index', index: m[1] as 'RES' | 'LEG' | 'PRO', op: m[2] as '>=' | '<=', n: parseFloat(m[3]) }
  m = t.match(/^flag\s+([A-Z_0-9]+)\s+in\s+([a-z,\s]+)/)
  if (m) return { kind: 'flag', flag: m[1], values: m[2].split(',').map((v) => v.trim()).filter(Boolean) }
  m = t.match(/^indicator\s+(\w+)\s*(>=|<=)\s*([\d.]+)/)
  if (m) return { kind: 'indicator', id: m[1], op: m[2] as '>=' | '<=', n: parseFloat(m[3]) }
  m = t.match(/^drift\s*<=\s*(\d+)/)
  if (m) return { kind: 'drift', max: parseInt(m[1]) }
  m = t.match(/^persona\s+([A-Z]+)\s*>=\s*(\d)/)
  if (m && PERSONAS.includes(m[1] as PersonaId)) return { kind: 'persona', persona: m[1] as PersonaId, min: parseInt(m[2]) }
  m = t.match(/^poll\s*(>=|<=)\s*([\d.]+)/)
  if (m) return { kind: 'poll', op: m[1] as '>=' | '<=', n: parseFloat(m[2]) }
  return undefined
}

export function parseGoals(md: string): import('./types').Goal[] {
  const goals: import('./types').Goal[] = []
  for (const sec of splitSections(md, 2)) {
    const actor = ACTORS.find((a) => sec.heading.trim() === a || sec.heading.startsWith(a + ' '))
    if (!actor) continue
    // blocks start with "- goal:" followed by indented fields
    const blocks = sec.body.split(/^-\s*goal:\s*/m).slice(1)
    for (const block of blocks) {
      const [titleLine, ...rest] = block.split('\n')
      const fields: Record<string, string> = {}
      for (const line of rest) {
        const f = line.match(/^\s+(\w+):\s*(.+)$/)
        if (f) fields[f[1]] = f[2].trim()
      }
      goals.push({
        actor,
        title: titleLine.trim(),
        measureRaw: fields.measure ?? '',
        measure: fields.measure ? parseMeasure(fields.measure) : undefined,
        why: fields.why ?? '',
      })
    }
  }
  return goals
}

// ---------- relevance.md ----------

export function parseRelevance(md: string): Record<number, Record<number, ActorId[] | null>> {
  const out: Record<number, Record<number, ActorId[] | null>> = {}
  for (const sec of splitSections(md, 2)) {
    const pm = sec.heading.match(/Phase\s+(\d)/i)
    if (!pm) continue
    const phase = parseInt(pm[1])
    out[phase] = {}
    const re = /^-\s*Inject\s+(\d+):\s*(.+)$/gm
    let m: RegExpExecArray | null
    while ((m = re.exec(sec.body))) {
      const idx = parseInt(m[1]) - 1
      const val = m[2].trim()
      if (/\(all\)/i.test(val)) out[phase][idx] = null
      else out[phase][idx] = val.split(',').map((a) => a.trim()).filter((a) => ACTORS.includes(a as ActorId)) as ActorId[]
    }
  }
  return out
}

// ---------- phase desk briefs (briefs.md) ----------

export function parseBriefs(md: string): Partial<Record<ActorId, string>> {
  const out: Partial<Record<ActorId, string>> = {}
  for (const sec of splitSections(md, 2)) {
    const actor = ACTORS.find((a) => sec.heading.trim() === a || sec.heading.startsWith(a + ' '))
    if (actor) out[actor] = sec.body
  }
  return out
}

// ---------- actor briefs ----------

export function parseActorBrief(md: string): import('./types').ActorBrief {
  const titleM = md.match(/^#\s*(.+)$/m)
  const brief: import('./types').ActorBrief = { title: titleM?.[1] ?? 'Actor', raw: md }
  for (const sec of splitSections(md, 2)) {
    const h = sec.heading.toLowerCase()
    if (h.startsWith('seat')) {
      brief.seatQuote = (sec.body.match(/^quote:\s*(.+)$/m) || [])[1]?.trim()
      brief.seatQuestion = (sec.body.match(/^question:\s*(.+)$/m) || [])[1]?.trim()
    } else if (h.startsWith('who you are')) brief.who = sec.body
    else if (h.includes('levers')) brief.levers = sec.body
    else if (h.includes('cannot control')) brief.cannotControl = sec.body
    else if (h.startsWith('objectives')) brief.objectives = sec.body
    else if (h.includes('standing tensions')) brief.tensions = sec.body
  }
  return brief
}

// ---------- endstates ----------

export function parseEndstates(md: string): { archetypes: Archetype[]; epiloguesText: string } {
  const archetypes: Archetype[] = []
  // matrix row → stack per row, column → p3 class
  const cols: Archetype['p3class'][] = ['compact', 'freeze', 'efficiency']
  const rowRe = /^\|\s*\*\*STACK=(\w+)\*\*\s*\|(.+)\|$/gm
  let m: RegExpExecArray | null
  const cellMap: Record<string, { stack: string; p3class: Archetype['p3class'] }> = {}
  while ((m = rowRe.exec(md))) {
    const stack = m[1]
    const cells = m[2].split('|')
    cells.forEach((cell, i) => {
      const em = cell.match(/\*\*(E\d)\./)
      if (em && cols[i]) cellMap[em[1]] = { stack, p3class: cols[i] }
    })
  }
  const textsSec = splitSections(md, 2).find((s) => /archetype texts/i.test(s.heading))
  if (textsSec) {
    for (const sec of splitSections(textsSec.body, 3)) {
      const hm = sec.heading.match(/^(E\d)\.\s*(.+?)(?:\s*\(.*\))?$/)
      if (!hm) continue
      const meta = cellMap[hm[1]] ?? { stack: 'split', p3class: 'freeze' as const }
      archetypes.push({ id: hm[1], name: hm[2].trim(), text: sec.body, ...meta })
    }
  }
  const epi = splitSections(md, 2).find((s) => /epilogue/i.test(s.heading))
  return { archetypes, epiloguesText: epi?.body ?? '' }
}

// ---------- clashes (standing confrontations) ----------

/** clashes.md: `## X vs Y — Title` + `- if X loses: EFFECTS | line` */
export function parseClashes(md: string): ClashEdge[] {
  const out: ClashEdge[] = []
  for (const sec of splitSections(md, 2)) {
    const hm = sec.heading.match(/^([A-Z]+)\s+vs\s+([A-Z]+)\s*[—-]\s*(.+)$/)
    if (!hm) continue
    const edge: ClashEdge = {
      a: hm[1] as ClashEdge['a'],
      b: hm[2] as ClashEdge['b'],
      title: hm[3].trim(),
      loser: {},
    }
    const re = /^-\s*if\s+([A-Z]+)\s+loses:\s*([^|]+)\|\s*(.+)$/gm
    let m: RegExpExecArray | null
    while ((m = re.exec(sec.body))) {
      const spec = m[2]
      edge.loser[m[1] as ClashEdge['a']] = {
        effects: parseIndexDeltas(spec.replace(/data\s+[a-z_]+\s*[+−–-]?\d+(?:\.\d+)?/g, '')),
        pollDelta: parsePollDelta(spec),
        data: parseDataDeltas(spec.replace(/\bPOLL\s*[+−–-]?\d+(?:\.\d+)?/g, '')),
        line: m[3].trim(),
      }
    }
    if (edge.loser[edge.a] && edge.loser[edge.b]) out.push(edge)
  }
  return out
}

// ---------- key metrics ----------

/** keymetrics.md: `## ACTOR — Title` + `- if <measure>: text` / `- else: text` */
export function parseKeyMetrics(md: string): KeyMetric[] {
  const out: KeyMetric[] = []
  for (const sec of splitSections(md, 2)) {
    const hm = sec.heading.match(/^([A-Z]+)\s*[—-]\s*(.+)$/)
    if (!hm) continue
    const km: KeyMetric = { actor: hm[1] as KeyMetric['actor'], title: hm[2].trim(), variants: [] }
    const re = /^-\s*(?:if\s+([^:]+)|else)\s*:\s*(.+)$/gm
    let m: RegExpExecArray | null
    while ((m = re.exec(sec.body))) {
      km.variants.push({ measure: m[1] ? parseMeasure(m[1].trim()) : undefined, text: m[2].trim() })
    }
    if (km.variants.length) out.push(km)
  }
  return out
}

// ---------- prologue ----------

export interface PrologueSection {
  meta: Record<string, string>
  paragraphs: string[]
}

/** prologue.md: `## slug` sections; leading lowercase `key: value` lines are
 * settings; the rest are paragraphs separated by blank lines. */
export function parsePrologue(md: string): Record<string, PrologueSection> {
  const out: Record<string, PrologueSection> = {}
  for (const sec of splitSections(md, 2)) {
    const slug = sec.heading.trim()
    const meta: Record<string, string> = {}
    const rest: string[] = []
    for (const line of sec.body.split('\n')) {
      const m = line.match(/^([a-z][a-z-]*):\s*(.+)$/)
      if (m && rest.join('').trim() === '') meta[m[1]] = m[2].trim()
      else rest.push(line)
    }
    const paragraphs = rest
      .join('\n')
      .split(/\n\s*\n/)
      .map((x) => x.replace(/\s*\n\s*/g, ' ').trim())
      .filter(Boolean)
    out[slug] = { meta, paragraphs }
  }
  return out
}

// ---------- epilogue ----------

/** epilogue.md: `## slug` sections. `NAME: text` (caps) = voice line,
 * `> text` = narration, lowercase `key: value` = settings. All `X: y`
 * lines also land in meta so list sections (roles, spirits) can read them. */
export function parseEpilogue(md: string): EpilogueDoc {
  const out: EpilogueDoc = {}
  for (const sec of splitSections(md, 2)) {
    const slug = sec.heading.trim()
    const lines: import('./types').EpiLine[] = []
    const meta: Record<string, string> = {}
    for (const raw of sec.body.split('\n')) {
      const line = raw.trim()
      if (!line) continue
      if (line.startsWith('>')) {
        lines.push({ t: line.replace(/^>\s*/, '') })
        continue
      }
      if (line.startsWith('+ ')) {
        lines.push({ t: line.slice(2).trim(), action: true })
        continue
      }
      const m = line.match(/^([A-ZÄÖÅ][A-ZÄÖÅ' ]*):\s*(.+)$/)
      if (m) {
        lines.push({ v: m[1].trim(), t: m[2].trim() })
        meta[m[1].trim()] = m[2].trim()
        continue
      }
      const lm = line.match(/^([a-z][a-z-]*):\s*(.+)$/)
      if (lm) {
        meta[lm[1]] = lm[2].trim()
        continue
      }
      lines.push({ t: line })
    }
    out[slug] = { lines, meta }
  }
  return out
}

// ---------- persona endings ----------

/** personas/endings.md: `## MARJA` / `## EETU`, lines `key: text` where key is
 * a rung (5…1) or a variant like `1-drift`, `3-us`. */
export function parsePersonaEndings(md: string): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {}
  for (const sec of splitSections(md, 2)) {
    const id = sec.heading.trim()
    const map: Record<string, string> = {}
    for (const line of sec.body.split('\n')) {
      const m = line.match(/^([0-9][0-9a-z-]*):\s*(.+)$/)
      if (m) map[m[1]] = m[2].trim()
    }
    out[id] = map
  }
  return out
}
