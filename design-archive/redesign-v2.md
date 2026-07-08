# Redesign v2 — numeric deal-metrics, pole/pole/radical decisions, reactionary round 3

Status: PROPOSAL. Current design archived in design-archive/v1-2026-07-08/ and git tag `design-v1`.

## 1. The seven metrics (flags become dials)

One per seat's dimension of the deal, in familiar language, 0–100 unless noted.
Everyone's actions can move every metric; each seat *answers* for one.

| id | Player-facing name | Owned by | Replaces (flags) |
|---|---|---|---|
| `books` | **Budget headroom** — how much room the framework has left | PM | (new; absorbs savings math) |
| `share` | **Workers' share** — how much of the machine's money reaches ordinary people | SAK | GUARANTEE, COMPACT, LEVY |
| `bedside` | **Time at the bedside** — minutes of human care per patient | COUNTY | (new; care side of MEGAPROJECT) |
| `pull` | **Investment pull** — whether capital still lands here | TI | (partly PRO index) |
| `days` | **Days Finland runs alone** — how long public systems survive a cut-off (unit: days) | HVK | SECURE_ARCH, STACK, CRISIS_LEG |
| `ladder` | **A first rung** — whether a degree still leads to a first job | AALTO | TALENT_PIPE, RETRAIN |
| `stay` | **Winners that stay** — whether the exceptional companies remain Finnish | STARTUP | (new; exit/champion outcomes) |

- Existing 8 indicators (trust, youth_u, …) stay; STACK's *identity* can remain a
  narrative fact, but its mechanics route through `days` + capability effects.
- The Second Gate's severity stops being a flag rule: it is computed from `days`
  (e.g. days ≥ 30 → drill; 10–29 → bruise; < 10 → crisis). Same for election
  modifiers, epilogue branches, endstates: thresholds on metrics.

## 2. Decision template (turning points 1–2)

Every actor, every turning point: exactly three options, always in this shape:

- **Pole A** — one side of that seat's tension, normative preference in the title.
- **Pole B** — the opposing preference, equally legitimate.
- **Radical W** — a genuine rupture. Big multi-metric swings, at least one
  externalized cost (someone else's metric pays), low-probability-feel.

The card states the preference plainly: "Take the freed minutes as savings —
productivity first, the wards pay" vs "Give the minutes back to patients —
care first, the framework pays".

### Draft pole pairs + radicals

**TP1 — the megaproject (2027–28)**
- PM: A `Book the savings` (books+, trust−, bedside−) · B `Protect the experience` (trust+, books−) · W `Rent the state`: outsource the platform wholesale to the winning global vendor for a revenue share (books++, days−−, share−, stay−)
- SAK: A `Trade jobs for terms` (share+, books+, jobs−) · B `Defend every desk` (share~, books−, pub_ai−) · W `The union becomes a platform`: SAK founds an AI-staffing coop renting augmented labour back to the state (share++ members, solidarity−, ladder+)
- COUNTY: A `Minutes to savings` (books+, bedside−) · B `Minutes to the bedside` (bedside+, books−) · W `Let the lab run care`: frontier lab operates care directly under contract (bedside+ short-term, days−−, share−, jobs−−, data rights gone)
- TI: A `Cheapest capable vendor` (books+, stay−) · B `Domestic premium` (stay+, pull+ long, books−) · W `The state as product`: consortium + state found an export company selling the automated-state stack abroad (pull++, books+ later, share−)
- HVK: A `Pay the premium` (days+, books−) · B `Capacity now` (books+, days−−) · W `Analog shadow state`: maintain a full manual fallback administration (days++, books−−, pub_ai−)
- AALTO: A `Spearhead the few` (capability+, ladder− broad) · B `A floor for the many` (ladder+, capability− elite) · W `AI tutors take the lectures`: sell teaching to the platform, faculty becomes examiners (ladder+ cheap, trust−, stay−)
- STARTUP: A `Bid as champion` (stay+, days+, delivery risk) · B `Fair market, no favours` (pull+, stay−) · W `Reverse acquihire`: import a frontier-lab team wholesale with golden visas + data access (capability++, days−, trust−)

**TP2 — whose machines (2029)**
- PM: A `An enforceable deal` (days+, capability−) · B `The best machines` (capability+, days−−) · W `Auction every workload`: both stacks compete service by service (pull+, days−, books+, chaos)
- SAK: A `Counterparties we can sue` (share+ enforceable) · B `A bigger pie to share` (share+ nominal, enforceability−) · W `Union treaty with the lab`: SAK negotiates directly with the frontier lab, bypassing the state (share++ members, trust−, precedent)
- COUNTY: A `Care that can't be cut off` (days+, medicine−) · B `Best medicine now` (bedside+ quality, days−) · W `The data dowry`: counties trade anonymized care data for a free frontier tier (bedside+, share−, sovereignty of data gone)
- TI: A `Anchor the domestic build` (days+, pull− short) · B `Competitiveness first` (pull+, days−) · W `Compute embassy`: industry builds its hall inside US jurisdiction (pull++, days−−, stay−)
- HVK: A `Run-alone doctrine` (days++, capability−) · B `Dependence with drills` (days+ some, capability+) · W `Rent out our resilience`: Finland becomes the alliance's civil-resilience lab, sovereignty pooled (days+ funded, autonomy redefined)
- AALTO: A `Train for what we run` (ladder+ home, excellence−) · B `Train at the frontier` (excellence+, emigration+) · W `Sell the pipeline`: degree programs contractually feed the lab, with return clauses (books+, ladder±, stay−)
- STARTUP: A `Anchor tenant at home` (days+, stay+, growth−) · B `Frontier abroad, HQ here` (pull+, stay±) · W `Leave loudly`: relocate now, license back (stay−−, pull−, cautionary tale)

## 3. Turning point 3 — reactionary, gated pools

Round 3 changes character: a LARGE pool of actions per actor (6–9). Every card
is a reaction to the world the first two rounds made, and most are "save
yourself, someone else pays" moves — the card names who pays.

**Gating**: each action may carry `requires:` conditions in the goals measure
grammar, now extended to all metrics — e.g.
`requires: indicator days >= 30` or `requires: indicator share <= 40`.
Cards failing the gate are shown greyed with the reason:
"Not possible: Finland runs alone for under 30 days."
(UI + parser already support gated cards with reasons — the mechanism exists;
only the grammar extension is new. CONFIRMED FEASIBLE.)

Sketch of pools (examples, 4 of ~7 each):
- PM: The bridge (needs books ≥ 40) · The books · Emergency consolidation (needs books ≤ 30; bedside and ladder pay) · Snap election (needs poll ≥ 55)
- SAK: Sign and retire the threat (needs share path) · General strike (needs share ≤ 40; books and pull pay) · Sector raids: save your members, abandon the rest (share+ members, solidarity−) · Wage round now (share+ visible, books−)
- COUNTY: Claw the dividend to care (needs bedside ≤ 45; books pay) · Publish the rationing honestly (trust+, poll−) · Sell the care model abroad (needs bedside ≥ 60; staff poached, pull+) · Close wards, save the rest (bedside+ where kept, trust−)
- TI: A number we can live with (levy capped) · Capital strike (needs share ≥ 60; everyone pays) · Split the bill to SMEs (pull+ big firms, stay−) · Buy the peace privately (fund osaamistakuu, tax break)
- HVK: Make the drills boring (needs days ≥ 30) · Securitize (needs Second Gate = crisis; trust pays later) · Raid care for stockpiles (days+, bedside−) · Declare victory and stand down (books+, days−)
- AALTO: Repair the cohort (Eetu's generation; needs books ≥ 30) · Fund the next cohort (ladder+ future) · Import talent instead (capability+, ladder−) · Sell consolidation analytics (books+, faculty's name on cuts)
- STARTUP: The exit (needs pull ≥ 60; stay−−) · The pledge: 100 hires for levy exemption (stay+, TI pays precedent) · Build the retraining platform (share+, ladder+) · Follow the acquirer (stay−, cautionary)

## 4. Mechanics that must change

1. Parser: `requires:` accepts measure grammar (small).
2. Metrics: add 7 indicators with baselines/history to data-indicators.md; decide
   which appear in the sidebar chart (suggest: days, bedside, share, ladder + existing).
3. Flags → thresholds: engine rules (CRISIS_LEG, election modifiers, endstate
   composition, epilogue branches, keymetrics, goals) re-keyed to metric thresholds.
4. Combos: A/B/W tags still select outcomes; W-heavy tables need re-authoring
   (radical outcomes). Collisions layer: reflavor H→W ("force beats bargain,
   bargain contains rupture, rupture blindsides force").
5. Solo AI: weights per tag (W stays rare, ~0.10–0.15), alignment logic unchanged.
6. TP3: pool size means no 27-row table — resolution by pivotal trio still works
   (tags), or switch TP3 to effect-composition without combos (simpler with 7×7+ actions).
