import type { ActorId, PersonaId } from './types'

/**
 * All portrait assets are auto-discovered from src/assets/portraits/ by
 * filename. To add or replace an image, just drop the file in — no code edit.
 *
 * Naming convention (png, webp, jpg all work):
 *   <id>-now.webp        portrait today (2026/27)
 *   <id>-2028.webp       portrait around 2028   (P1/P2 reveals)
 *   <id>-2033.webp       portrait in 2033       (P3 + endstate)
 *   <id>-env.webp        the person in their own environment (shown on hover)
 *   <id>-mood-<mood>.webp  small mood face (marja/eetu only);
 *                          moods: happy sad angry frustrated contempt
 *
 * ids: pm sak aalto county hvk ti startup marja eetu
 *
 * Actor face mapping (from the provided character sheets):
 *   PM      ← Prime_Minister.png
 *   SAK     ← Ritva_Aalto.png            (confederation chair)
 *   AALTO   ← Professor_Katri_Nyman.png  (the professor)
 *   COUNTY  ← Dr_Sari_Koski.png          (county services director)
 *   HVK     ← Ilkka_Kettunen.png         (security-of-supply chief)
 *   TI      ← Mikael_Gron.png            (industry federation)
 *   STARTUP ← Dr_Noora_Lehti.png         (biotech founder)
 */
const FILES = import.meta.glob('../assets/portraits/*.{png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function asset(name: string): string | undefined {
  const key = Object.keys(FILES).find((k) => {
    const base = k.split('/').pop() ?? ''
    return base.replace(/\.(png|webp|jpe?g)$/i, '') === name
  })
  return key ? FILES[key] : undefined
}

export type Era = 'now' | '2028' | '2033'

/** Display names for the followed lives (internal ids stay MARJA/EETU in the content files). */
export const PERSONA_NAMES: Record<PersonaId, string> = { MARJA: 'Maria', EETU: 'Eetu' }

type Slots = Partial<Record<Era, string>> & { env?: string }

function slotsFor(id: string): Slots {
  return { now: asset(`${id}-now`), '2028': asset(`${id}-2028`), '2033': asset(`${id}-2033`), env: asset(`${id}-env`) }
}

export const PERSONA_PORTRAITS: Record<PersonaId, Slots> = {
  MARJA: slotsFor('marja'),
  EETU: slotsFor('eetu'),
}

export const ACTOR_PORTRAITS: Record<ActorId, Slots> = {
  PM: slotsFor('pm'),
  SAK: slotsFor('sak'),
  AALTO: slotsFor('aalto'),
  COUNTY: slotsFor('county'),
  HVK: slotsFor('hvk'),
  TI: slotsFor('ti'),
  STARTUP: slotsFor('startup'),
}

export type Mood = 'happy' | 'sad' | 'angry' | 'frustrated' | 'contempt'

export const MOOD_EMOJI: Record<Mood, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  frustrated: '😤',
  contempt: '😒',
}

const MOODS: Mood[] = ['happy', 'sad', 'angry', 'frustrated', 'contempt']

/** marja-mood-happy.webp = young face (2027–29); marja-mood-happy-2033.webp = older
 * face for 2031/2033 scenes. Falls back young → emoji if the file is missing. */
export const MOOD_IMAGES: Record<PersonaId, Partial<Record<Mood, string>>> = {
  MARJA: Object.fromEntries(MOODS.map((m) => [m, asset(`marja-mood-${m}`)]).filter(([, v]) => v)),
  EETU: Object.fromEntries(MOODS.map((m) => [m, asset(`eetu-mood-${m}`)]).filter(([, v]) => v)),
}

const moodSet = (id: string, suffix: string) =>
  Object.fromEntries(MOODS.map((m) => [m, asset(`${id}-mood-${m}${suffix}`)]).filter(([, v]) => v))

const MOOD_IMAGES_2028: Record<PersonaId, Partial<Record<Mood, string>>> = {
  MARJA: moodSet('marja', '-2028'),
  EETU: moodSet('eetu', '-2028'),
}

const MOOD_IMAGES_2033: Record<PersonaId, Partial<Record<Mood, string>>> = {
  MARJA: moodSet('marja', '-2033'),
  EETU: moodSet('eetu', '-2033'),
}

/** Mood image for the era; each era falls back toward the younger face. */
export function moodImage(pid: PersonaId, mood: Mood, era: Era = 'now'): string | undefined {
  if (era === '2033') return MOOD_IMAGES_2033[pid][mood] ?? MOOD_IMAGES_2028[pid][mood] ?? MOOD_IMAGES[pid][mood]
  if (era === '2028') return MOOD_IMAGES_2028[pid][mood] ?? MOOD_IMAGES[pid][mood]
  return MOOD_IMAGES[pid][mood]
}

/** Feeling derived from where the life stands and which way it just moved. */
export function moodFor(rung: number | null, trend: number): Mood {
  if (rung === null) return 'frustrated' // both start 2027 frustrated with Finland
  if (rung >= 4) return 'happy'
  if (rung === 3) return 'frustrated'
  if (rung === 2) return trend < 0 ? 'angry' : 'sad'
  return 'contempt' // the exit
}

export function MoodFace({ pid, mood, size = 22, era = 'now' }: { pid: PersonaId; mood: Mood; size?: number; era?: Era }) {
  const img = moodImage(pid, mood, era)
  if (img) return <img src={img} alt={mood} title={mood} style={{ width: size, height: size }} className="rounded-full object-cover" />
  return (
    <span title={mood} style={{ fontSize: size * 0.85, lineHeight: 1 }} aria-label={mood}>
      {MOOD_EMOJI[mood]}
    </span>
  )
}

/** which portrait era a phase renders (P1/P2 → 2028, P3 and endstate → 2033) */
export const eraForPhase = (phaseIdx: number): Era => (phaseIdx >= 3 ? '2033' : '2028')

/** Portrait with graceful placeholder: falls back era → now → initial.
 * If an `<id>-env` image exists, hovering crossfades to the person in
 * their own environment. */
export function Portrait({
  slots,
  era = 'now',
  name,
  size = 'md',
  className = '',
}: {
  slots: Slots
  era?: Era
  name: string
  size?: 'xs' | 'sm' | 'seat' | 'md' | 'lg'
  className?: string
}) {
  const src = slots[era] ?? slots.now
  const dims =
    size === 'xs'
      ? 'w-7 h-7 rounded-full'
      : size === 'sm'
        ? 'w-12 h-12 rounded-xl'
        : size === 'seat'
          ? 'w-[68px] h-[90px] rounded-xl'
          : size === 'md'
            ? 'w-24 h-32 rounded-xl'
            : 'w-full max-w-[240px] aspect-[2/3] rounded-2xl'
  if (!src) {
    return (
      <div
        className={`${dims} ${className} shrink-0 bg-white/[0.04] border border-dashed border-white/15 flex flex-col items-center justify-center text-white/30`}
        title={`${name} — portrait (${era}) coming`}
      >
        <span className={size === 'xs' || size === 'sm' ? 'text-xs' : 'font-playfair italic text-2xl'}>
          {name.charAt(0)}
        </span>
        {(size === 'md' || size === 'lg') && <span className="text-[9px] mt-1 uppercase tracking-wide">{era}</span>}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={`${name}, ${era === 'now' ? 'today' : era}`}
      className={`${dims} ${className} shrink-0 object-cover object-top border border-white/10 bg-black`}
    />
  )
}
