# Plan — credibility layer & the interludes

Agreed 2026-07-09, from the ai-2027.com / europe2031.ai comparison.
Status 2026-07-09 evening: items 1-8 are IMPLEMENTED (drumbeat metric decided:
exogenous cognition price + capability gap + the days-alone clock). Item 9
below is next up. The interlude SMS thread shipped static (v1).

## 1. Fact/fiction seam in the prologue

One sentence, placed where recorded history ends and the scenario begins
(after the 2015–2025 material, before the April 2027 election paragraph):
"Up to this point, everything you have read has happened. Maria and Eetu are
inventions; from here on, so is everything else."

- File: `wargame/prologue.md` only. No code.
- Keep it to exactly one seam; do not hedge sentence by sentence.

## 2. "About this scenario" (new `about.md`)

New content file in the md architecture, linked from the landing page footer
and the endstate screen ("How this was made").

- Who made it, and how: this is a war-game with a real engine — decisions
  select outcomes from authored combination tables, indicators move by
  arithmetic the reader can audit in the master document. Say that plainly.
- Epistemic stance: a scenario, not a prediction; the dates are less load-bearing
  than the trajectory; the endstates are reachable, not forecast.
- Invitation to disagree: name the places we are least sure of, and give a
  contact route for corrections and counter-scenarios.
- Files: `wargame/about.md`, parse + route (a static page, no game state),
  add to `master.mjs` FILES.

## 3. Sources page for the load-bearing numbers

Short page anchoring the numbers the briefs lean on: 57,000 missing care
workers by 2033, 101,000 more people aged 75+, debt ~91% of GDP, defence
toward 5%, AMD/Silo AI, LUMI, youth unemployment baseline, OECD trust survey.
One line per claim: the number, the source, a link.

- Files: `wargame/sources.md`, linked from the briefing screen ("where these
  numbers come from") and from about.md. Add to `master.mjs`.
- Rule: only numbers that actually appear in player-facing text. If a number
  has no source, either find one or soften the claim where it is used.

## 4. The interlude: one view between decisions (drumbeat + world clock + SMS)

One new screen type shown between a phase's reveal and the next decision
(sequence: reveal → interlude → dilemma if any → next decide). As simple as
possible: the player should absorb it in fifteen seconds and click on.
Three stacked elements, identical layout every time so repetition does the
arguing:

**a. Time passed.** A single line: "Eighteen months pass." The interlude owns
the calendar; the decision screens stop having to explain it.

**b. The world moved (the drumbeat box).** The same box every time, worsening:
- "While you deliberated: the price of machine cognition fell 65%. The
  capability gap grew 8 months." Computed from `intel_cost` and `cap_gap`
  deltas between node years — data already exists, no engine change.
- Plus ONE master metric rendered identically each time. Decision needed:
  Finland-vs-world compute box (europe2031's GW device) or the days-alone
  clock. Current lean: compute box, because it is exogenous-flavoured and
  brutal; days-alone already lives in the sidebar as HVK's number.
- Optionally animate the numbers counting (ai-2027's counters), but the box
  must read fine static.

**c. SMS between Eetu and Maria.** They are cousins. A short exchange (4–8
messages) per interlude, formatted like the epilogue dialogue (voice lines,
same renderer). Eetu opens the first interlude with: "hey cousin, how are you
doing?" Later interludes continue the same thread, so the three interludes
read as one conversation with year-long silences.
- Content: new `wargame/interludes.md` (grammar reuses the epilogue line
  grammar: `EETU:` / `MARJA:` lines, `>` narration if needed). One section per
  interlude year (2028→29, 2029→31, 2031→33).
- v1: static thread. v2 (optional): condition a line or two on the personas'
  rungs, the way the epilogue composes by rung.
- Tone: texting register, lowercase, short. Their situations (from the phase
  results) leak into what they joke about.

Files: `wargame/interludes.md`, parser, `InterludeScreen` in screens.tsx,
solo-flow wiring in GameApp (stage between reveal and dilemma/decide),
`master.mjs` FILES. Workshop mode: skip, same as dilemmas.

## 5. Capability note on each decision brief

Three lines max at the top of each phase's decision screen: what the machines
can now do that they could not last round. Our capability ladder — concrete
abilities, not benchmark numbers ("a model can now run a small company's
bookkeeping unattended"; "the best agents now do a junior researcher's week
in an afternoon").
- Files: a `capability:` block in each phase's `tension.md` (3 lines each),
  parser + a small strip in DecideScreen.
- The 2027 note doubles as calibration for players who arrive knowing nothing.

## 6. Name the coercion instrument

Pick one boring official name and use it everywhere the access valve appears
in P2/P3 (briefs, actions, outcomes, HVK content): working candidate
**"end-use attestation tier"** (usage: "Finland's lane runs on Tier-2
attestations"). Pure edit pass across wargame/, no code. The term should
appear at least once per phase so it accumulates dread by familiarity.

## 7. HVK's dilemmas: always the drill or the budget

The HVK chief's "small decisions" (the 2030/2032 dilemmas) are always one of
two recurring shapes, so the seat's routine becomes familiar:
- **"What do we run the main drill on this year?"** — pick the scenario the
  national exercise rehearses (and therefore what the country is ready for).
- **"Which domain gets the extra budget?"** — the year's unspent margin goes
  to one preparedness domain at the cost of the others.

Current state: D2030-HVK ("Whose drill is it") already fits the drill shape.
D2032-HVK ("The scarcity list") does not — rewrite it into one of the two
shapes (the scarcity-list material can live inside a budget option, e.g.
funding the rationing plan vs. funding stockpiles). If more HVK dilemmas are
ever added, they alternate: drill, budget, drill, budget.

- Files: `wargame/dilemmas.md` only. No code.

## 8. Hover-dwell dialogue reveal (epilogue + SMS)

Requested mechanism: hovering the right spot for 0.5s opens the next sentence
of a dialogue.

Honest UX assessment: dwell-to-reveal works, with three caveats.
- Hover does not exist on touch devices — a tap fallback is mandatory.
- An invisible hover target is undiscoverable — the next line must be
  *visibly there but withheld* (blurred/ghosted, like a spoiler tag), so the
  cursor has somewhere obvious to go.
- 0.5s dwell is about right (0.3s feels accidental, 1s feels broken), but
  accidental mouse-through must not trigger it — require the pointer to rest
  (cancel the timer on leave), not merely pass.

Design that keeps the requested feel and fixes the caveats:
- The next line renders blurred + dimmed at ~40% opacity.
- Desktop: resting the pointer on it for 500ms unblurs it (a subtle progress
  cue during the dwell, e.g. the blur easing off, so the wait reads as
  intentional).
- Touch / impatient users: tapping or clicking it reveals immediately.
- Applies to: epilogue dialogue beats (replacing some of the current
  click-to-continue) and the interlude SMS thread. The debrief roundtable
  keeps its Continue button (professional register reads better paced by
  explicit clicks).
- Files: a `RevealLine` component used by epilogue.tsx and InterludeScreen;
  no content changes required.

## 9. Weird decisions hit other players directly

The radical (H-tag) options should, where possible, land on a named other
seat, not just on the indices — the way the debrief dialogue already makes
consequences personal.

The anchor case: the wellbeing county director's weird decision is to take a
real risk and **buy a whole preventive care system from the quantum-biotech
company** (Veriseq's drug-assisted preventive care, per the P1 brief). For the
startup this means they "make it" very easily: a large stay/pull boost, their
Series C goal effectively secured, and debrief/react lines that say so. This
replaces or reshapes the county's current lab-flavoured weird option in P2
(the data dowry) or becomes the P3 weird option.

Generalize deliberately, one pair at a time: each weird option names who it
lifts or drops (e.g. AKAVA's cooperative lifting AALTO's ladder is already
close; TI's compute embassy dropping HVK is already close). Requirement: the
affected seat's deal metric moves enough that the debrief filter picks it up,
and the to/react lines carry the relationship.

- Files: dilemmas.md / phase actions.md + debrief lines. No engine change.

## Sequencing

1. Seam line (#1) — minutes, ship immediately.
2. about.md + sources.md (#2, #3) — one writing session, one small route.
3. Interlude view (#4) — the big one: content + parser + screen + flow.
4. RevealLine hover mechanism (#8) — build with #4, retrofit epilogue after.
5. Capability notes (#5), coercion term (#6) and HVK dilemma shapes (#7) —
   content edit passes, any time.

Open decisions for Johannes:
- Master metric in the drumbeat box: compute-vs-world, or days-alone clock?
- Interlude SMS: fully static v1, or rung-conditioned from the start?
- Does the epilogue switch wholesale to hover-reveal, or only the tunnel
  dialogue (keeping action buttons as clicks)?
