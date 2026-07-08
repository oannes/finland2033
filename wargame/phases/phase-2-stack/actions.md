# Phase 2 — Action menus

Pivotal actors (PM, COUNTY, STARTUP): tags feed `combos.md`. Modifier actors: effects + hooks apply to whichever outcome fires. Redesign v2: pole A (sovereignty / enforceability) vs pole B (capability now) vs radical (tag H). Deal metrics: books, share, bedside, pull, days, ladder, stay.

## PM (pivotal)

### P2-PM-A — "An enforceable deal"
- tag: A
- summary: Declare that the state's core systems run on the European tier: machines Finland's own courts can reach, whatever happens in Washington. In effect, you accept in public that Finnish services will run about twenty months behind the world's best. You do it because a guarantee you cannot enforce is a hope, and you were not elected to govern on hope. The gap chart runs on every front page with your name under it.
- effects: RES +0.8, PRO −0.4, POLL −4
- data: sov_share +8, days +8, books -4

### P2-PM-B — "The best machines"
- tag: B
- summary: Sign the allied access agreement: the best models in the world, under audit rights, end-use attestations, and a lane that someone else can close. You do it because every service works better this year and the savings math finally closes. What you sign away is quieter: the terms are written, and rewritten, in another capital.
- effects: PRO +0.8, RES −0.5, POLL +3
- data: pub_ai +3, books +4, days -6, sov_share -4

### P2-PM-H — "Auction every workload"
- tag: H
- summary: Refuse to pick a national engine at all: order both stacks to compete for every workload, service by service, best offer wins. You do it because picking winners is how governments get technology wrong, and markets exist for exactly this question. What you get is three systems, two legal regimes, and the org chart as the country's real architecture.
- effects: PRO +0.3, RES −0.4, LEG −0.4, POLL −3
- data: books +3, days -4, pull +2, trust -2
- hook: SILENT

## COUNTY (pivotal)

### P2-COUNTY-A — "Care that can't be cut off"
- tag: A
- summary: Move the counties' systems onto the European tier: records, eligibility, triage, everything that must never stop. You do it because care is the one service where an interruption is measured in lives, and you will not run Finnish wards on someone else's kill-switch. The price is this year's medicine: the sharper diagnostic models stay out of reach.
- effects: RES +0.5, PRO −0.3
- data: sov_share +5, days +5, bedside -1

### P2-COUNTY-B — "Best medicine now"
- tag: B
- summary: Buy the frontier lane for the wards: earlier diagnoses, better triage, fewer misses, starting this quarter. You do it because the patient in front of you outranks a scenario, and no continuity argument survives a missed cancer. The machines answer to another jurisdiction; you sign anyway.
- effects: PRO +0.5, RES −0.3
- data: bedside +4, care_gap -2, days -5

### P2-COUNTY-H — "The data dowry"
- tag: H
- summary: Accept the lab's offer: the counties' anonymized care data, in exchange for its best care tier, free. You do it because no budget you will ever hold can buy what this trade gets for nothing. The country's most sensitive dataset becomes someone's training asset, and there is no clause for taking it back.
- effects: PRO +0.6, LEG −0.5
- data: bedside +6, care_gap -2, days -6, share -4, trust -4
- hook: SILENT

## STARTUP (pivotal)

### P2-STARTUP-A — "Anchor tenant at home"
- tag: A
- summary: Move your company's platform to the European tier and announce it: your compute bill becomes the sovereign build's first real revenue. You do it because somebody's logo has to be on the domestic stack before anyone else believes in it, and yours is the one that counts. Your models fall behind the frontier, and your investors say so out loud.
- effects: RES +0.4, PRO −0.2
- data: sov_share +4, days +3, stay +5, pull -2

### P2-STARTUP-B — "Frontier abroad, HQ here"
- tag: B
- summary: Sign the attestations, take the lane, keep the frontier under your product, and keep the headquarters in Turku. You do it because your competitors run on the best machines on earth and second-best is a going-out-of-business strategy. The sovereign build loses its flagship, and every founder watching does what you did.
- effects: PRO +0.5
- data: pull +4, stay -2, days -3

### P2-STARTUP-H — "Leave loudly"
- tag: H
- summary: Relocate the company now, and publish the letter saying exactly why: the market too small, the rules too slow, the stack politics unbearable. You do it because your duty is to the company's survival, and if you must go, the country should at least hear the reason. You become the case study everyone cites, for years.
- effects: PRO −0.5, LEG −0.4, POLL −3
- data: stay -12, pull -4, ladder -2, books -2
- hook: SILENT

## SAK (modifier)

### P2-SAK-A — "Counterparties we can sue"
- tag: A
- summary: Take labour's position public: no job guarantee counts unless a European court can enforce it, so the state must run on machines within reach of European law. You do it because every right your members hold is paper if the counterparty is beyond the law that wrote it. The capability camp calls you the brake; you have been called worse.
- effects: LEG +0.4
- data: share +4, days +2

### P2-SAK-B — "A bigger pie to share"
- tag: B
- summary: Accept the lane, on one condition: deployment and jobs keep growing. You do it because your members' wages are paid out of productivity, not principles, and a richer machine leaves more on the table to bargain over. What cannot be sued can still be struck against. You hope.
- effects: PRO +0.3
- data: share +2, books +2, days -2

### P2-SAK-H — "A treaty with the lab"
- tag: H
- summary: Open your own channel and negotiate labour's terms directly with the frontier lab: training funds, deployment rules, member protections. A union agreement with an AI company, state not invited. You do it because the state is slow and the lab is where the power actually moved. The national bargaining table learns about it from the press.
- effects: LEG −0.5, PRO +0.2
- data: share +7, trust -3, days -2
- hook: SILENT

## TI (modifier)

### P2-TI-A — "Anchor the domestic build"
- tag: A
- summary: Commit your members as the European build's first industrial customers: compute demand, long contracts, capital for the halls. You do it because autonomy is infrastructure, and infrastructure is the one thing industry knows how to will into existence. Your members pay above market for years and expect to be remembered for it.
- effects: RES +0.4, PRO −0.2
- data: days +4, compute_mw +40, pull -2

### P2-TI-B — "Competitiveness first"
- tag: B
- summary: Advise your members to buy the best tools on earth wherever they run, and let the sovereign build find other customers. You do it because your exporters compete against firms that owe nothing to anyone's stack, and sentiment is not a line item. Industry's contribution stays what it always was: taxes, jobs, and staying alive.
- effects: PRO +0.4
- data: pull +4, days -2

### P2-TI-H — "The compute embassy"
- tag: H
- summary: Organize the consortium nobody expected: your biggest members build their own AI hall inside US jurisdiction: a private, guaranteed lane beyond both Helsinki's and Brussels' reach. You do it because access is existential and this secures it permanently, treaty or no treaty. Finland's leverage over its own industry goes with it.
- effects: PRO +0.5, RES −0.5
- data: pull +6, days -6, stay -4, compute_mw -20
- hook: SILENT

## AALTO (modifier)

### P2-AALTO-A — "Train for what we run"
- tag: A
- summary: Point the curriculum at the European stack, the machines Finland's state and hospitals will actually operate. You do it because a graduate who is needed here stays here, and the sovereign build fails without hands. Your best students grumble that you train them for the second-best machine, and some leave to prove the point.
- effects: RES +0.3
- data: ladder +4, sov_share +2, stay +2
- flags: TALENT_PIPE=strong

### P2-AALTO-B — "Train at the frontier"
- tag: B
- summary: Put the students on the best models on earth, through joint labs on the lane. You do it because a university's job is the frontier, wherever it is, and second-rate tools teach second-rate instincts. What you produce is world-class and world-portable, and the world has the address of neither.
- effects: PRO +0.4
- data: ladder +2, stay -3, pull +2
- flags: TALENT_PIPE=weak

### P2-AALTO-H — "Sell the pipeline"
- tag: H
- summary: Sign the lab's offer: it funds the programs, sets half the syllabus, and takes first pick of the graduates, with return clauses after five years abroad. You do it because the money is real, the training genuinely is the best, and the clauses might even hold. The university becomes a supplier with a crest.
- effects: PRO +0.4, LEG −0.4
- data: books +3, ladder +2, stay -4, trust -2
- flags: TALENT_PIPE=weak
- hook: SILENT

## HVK (modifier)

### P2-HVK-A — "Run-alone doctrine"
- tag: A
- summary: Invoke the mandate: critical state functions may run only on infrastructure Finland can inspect and operate unassisted. You do it because your office answers one question, can the country function alone, and every month on the lane makes the answer worse. Every ministry whose tools you just downgraded files a complaint.
- effects: RES +0.8, PRO −0.3
- data: days +8, books -3

### P2-HVK-B — "Dependence with drills"
- tag: B
- summary: Accept the lane, but engineer it survivable: quarterly exit drills, escrowed model weights, a tested domestic fallback tier. You do it because dependence denied is dependence unmanaged, and your job is not purity, it is survival. Both camps distrust you for a week and quote you for years.
- effects: RES +0.4, PRO +0.2
- data: days +4
- flags: contributes to CRISIS_LEG=managed (see mechanics)

### P2-HVK-H — "Rent out our resilience"
- tag: H
- summary: Offer Finland to the alliance as its civil-resilience laboratory: everyone's drills run here, everyone's funding follows, and the obligations run both ways. You do it because resilience is the one export Finland holds in surplus, and pooled sovereignty is still sovereignty, with better financing. 'Alone' stops being the operative word of your doctrine.
- effects: RES +0.6, LEG −0.3
- data: days +8, books +3, trust -2, sov_share -3
- hook: SILENT
