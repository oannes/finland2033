# Phase 2 — Action menus

Pivotal actors (PM, COUNTY, STARTUP): tags feed `combos.md`. Modifier actors: effects + hooks apply to whichever outcome fires. Redesign v2: pole A (sovereignty / enforceability) vs pole B (capability now) vs radical (tag H). Deal metrics: books, share, bedside, pull, days, ladder, stay.

## PM (pivotal)

### P2-PM-A — "An enforceable deal"
- tag: A
- summary: Sovereignty first. Declare the public core European: machines Finland can inspect, guarantees its courts can enforce, and a capability gap accepted out loud. Today's performance pays for tomorrow's jurisdiction.
- effects: RES +0.8, PRO −0.4, POLL −4
- data: sov_share +8, days +8, books -4

### P2-PM-B — "The best machines"
- tag: B
- summary: Capability first. Sign the Washington lane: the frontier models under attestation and audit. Every service improves this year, on terms written and rewritten elsewhere. Jurisdiction pays.
- effects: PRO +0.8, RES −0.5, POLL +3
- data: pub_ai +3, books +4, days -6, sov_share -4

### P2-PM-H — "Auction every workload"
- tag: H
- summary: The radical: no national line — run both stacks in open competition, service by service, winner takes each workload. Market discipline for engines; three systems, two legal regimes, and the org chart becomes the architecture. Coherence pays.
- effects: PRO +0.3, RES −0.4, LEG −0.4, POLL −3
- data: books +3, days -4, pull +2, trust -2
- hook: SILENT

## COUNTY (pivotal)

### P2-COUNTY-A — "Care that can't be cut off"
- tag: A
- summary: Continuity first. Move county services to the European tier: weaker tools, but records, eligibility and care that no foreign decision can switch off. This year's medicine pays.
- effects: RES +0.5, PRO −0.3
- data: sov_share +5, days +5, bedside -1

### P2-COUNTY-B — "Best medicine now"
- tag: B
- summary: Patients first. Buy the frontier lane for diagnostics and triage: measurably better outcomes this year, on machines that answer to another jurisdiction. The continuity guarantee pays.
- effects: PRO +0.5, RES −0.3
- data: bedside +4, care_gap -2, days -5

### P2-COUNTY-H — "The data dowry"
- tag: H
- summary: The radical: trade anonymized care data to the frontier lab for a free top-tier care service. The wards get the best machines for nothing; the country's most sensitive dataset becomes someone's training asset. Data rights pay.
- effects: PRO +0.6, LEG −0.5
- data: bedside +6, care_gap -2, days -6, share -4, trust -4
- hook: SILENT

## STARTUP (pivotal)

### P2-STARTUP-A — "Anchor tenant at home"
- tag: A
- summary: The sector signs first: move the platform to the European tier and say so publicly. The sovereign build gets its business case; your models trail the frontier, and your investors notice.
- effects: RES +0.4, PRO −0.2
- data: sov_share +4, days +3, stay +5, pull -2

### P2-STARTUP-B — "Frontier abroad, HQ here"
- tag: B
- summary: Competitiveness first: attest, take the lane, keep headquarters in Finland. Full strength on the world market; the domestic stack loses its flagship, and the sector follows your example.
- effects: PRO +0.5
- data: pull +4, stay -2, days -3

### P2-STARTUP-H — "Leave loudly"
- tag: H
- summary: The radical: relocate now, license the technology back, and say exactly why on the way out. A cautionary tale that reprices the whole country. Everyone who stays pays.
- effects: PRO −0.5, LEG −0.4, POLL −3
- data: stay -12, pull -4, ladder -2, books -2
- hook: SILENT

## SAK (modifier)

### P2-SAK-A — "Counterparties we can sue"
- tag: A
- summary: Enforceability first: labour's public line is that every job guarantee must be grievable in a European court. A smaller pie whose division is guaranteed; the capability camp pays.
- effects: LEG +0.4
- data: share +4, days +2

### P2-SAK-B — "A bigger pie to share"
- tag: B
- summary: Capability first: accept the lane if deployment and jobs keep growing. More to share, nominally; the contracts now reference machines your law cannot reach.
- effects: PRO +0.3
- data: share +2, books +2, days -2

### P2-SAK-H — "A treaty with the lab"
- tag: H
- summary: The radical: negotiate directly with the frontier lab — a union contract with an AI company, bypassing the state. Members get terms nobody else has; the national bargaining table pays.
- effects: LEG −0.5, PRO +0.2
- data: share +7, trust -3, days -2
- hook: SILENT

## TI (modifier)

### P2-TI-A — "Anchor the domestic build"
- tag: A
- summary: Autonomy as contribution: members commit compute demand and capital to the European build. Dearer inputs today; an industrial leg under the sovereign stack tomorrow.
- effects: RES +0.4, PRO −0.2
- data: days +4, compute_mw +40, pull -2

### P2-TI-B — "Competitiveness first"
- tag: B
- summary: Exporters buy the best tools on earth and contribute the old way: taxes, jobs, market access. The sovereign build loses its industrial customers; the order books stay full.
- effects: PRO +0.4
- data: pull +4, days -2

### P2-TI-H — "The compute embassy"
- tag: H
- summary: The radical: industry builds its own hall inside US jurisdiction — a guaranteed lane outside Finnish and EU rules entirely. The exporters are safe; the country's leverage pays.
- effects: PRO +0.5, RES −0.5
- data: pull +6, days -6, stay -4, compute_mw -20
- hook: SILENT

## AALTO (modifier)

### P2-AALTO-A — "Train for what we run"
- tag: A
- summary: Relevance first: point the faculty and the students at the European stack Finland actually operates. The graduates are needed here; the frontier's shine, and some of them, pay.
- effects: RES +0.3
- data: ladder +4, sov_share +2, stay +2
- flags: TALENT_PIPE=strong

### P2-AALTO-B — "Train at the frontier"
- tag: B
- summary: Excellence first: joint labs on the lane, students on the best machines on earth. They become world-class, and world-class is portable. The promise of being needed *here* pays.
- effects: PRO +0.4
- data: ladder +2, stay -3, pull +2
- flags: TALENT_PIPE=weak

### P2-AALTO-H — "Sell the pipeline"
- tag: H
- summary: The radical: degree programs contractually feed the frontier lab, tuition paid by the customer, with return clauses nobody believes. The university becomes a supplier; its independence pays.
- effects: PRO +0.4, LEG −0.4
- data: books +3, ladder +2, stay -4, trust -2
- flags: TALENT_PIPE=weak
- hook: SILENT

## HVK (modifier)

### P2-HVK-A — "Run-alone doctrine"
- tag: A
- summary: Resilience first: critical functions only on infrastructure Finland can inspect and run unassisted. The clock runs up; your own services lose the best tools, and everyone resents you until the day they don't.
- effects: RES +0.8, PRO −0.3
- data: days +8, books -3

### P2-HVK-B — "Dependence with drills"
- tag: B
- summary: The engineered middle: take the lane, but with exit drills, escrowed weights and a tested fallback tier. Dependence made survivable instead of denied; both camps distrust you for a week and quote you for years.
- effects: RES +0.4, PRO +0.2
- data: days +4
- flags: contributes to CRISIS_LEG=managed (see mechanics)

### P2-HVK-H — "Rent out our resilience"
- tag: H
- summary: The radical: offer Finland as the alliance's civil-resilience laboratory — sovereignty pooled, drills funded by others, obligations flowing both ways. The clock is paid for; the meaning of "alone" pays.
- effects: RES +0.6, LEG −0.3
- data: days +8, books +3, trust -2, sov_share -3
- hook: SILENT
