# Phase 1 — Action menus

Pivotal actors (PM, SAK, COUNTY): tags feed `combos.md`. Modifier actors: effects + hooks apply to whichever outcome fires. `POLL ±n` moves government approval — the 2031 election is scored from it. Redesign v2: every menu is pole A / pole B / radical (tag H); summaries name the trade and who pays. Deal metrics: books, share, bedside, pull, days, ladder, stay.

## PM (pivotal)

### P1-PM-A — "Book the savings"
- tag: A
- summary: Framework first. Pass the scale-up intact: the savings are real and on schedule, and the offices your own voters work in absorb the shock. The books breathe; the wards and the base pay.
- effects: PRO +1.0, LEG −0.7, POLL −6
- data: pub_ai +2, books +8, bedside -3, share -3

### P1-PM-B — "Protect the experience"
- tag: B
- summary: People first. Phase the savings, guarantee service levels and jobs during the transition: nobody's benefits office collapses mid-installation. The framework's credibility pays, and the bond desks notice.
- effects: LEG +0.7, PRO −0.4, POLL +4
- data: books -4, bedside +3, share +3

### P1-PM-H — "Rent the state"
- tag: H
- summary: The radical way out: outsource the whole platform to the winning global vendor for a revenue share. Cheapest, fastest, and the state's plumbing answers to a foreign board. The books win big; autonomy, jobs and the domestic sector pay.
- effects: PRO +0.6, LEG −0.5, POLL −3
- data: pub_ai +3, books +12, days -8, stay -6, share -4
- hook: SILENT

## SAK (pivotal)

### P1-SAK-A — "Trade jobs for terms"
- tag: A
- summary: Accept that desks will close, and sell the consent dear: gain-sharing, retraining rights, a seat on the program board. The members who stay are protected; the ones who go pay for the terms.
- effects: LEG −0.4, POLL +2
- data: share +5, books +3, ladder +2
- flags: STRIKE_CARD=unused

### P1-SAK-B — "Defend every desk"
- tag: B
- summary: No dismissals, in law, or no peace. The members are protected for a decade and the strike ballot stays armed. The program gets slower and smaller; the savings and the young outside the walls pay.
- effects: LEG +0.5
- data: share +4, books -4, ladder -2
- flags: contributes to GUARANTEE=yes (see combos); STRIKE_CARD=live

### P1-SAK-H — "The union becomes the platform"
- tag: H
- summary: The radical: SAK founds an AI-staffing cooperative and rents augmented labour back to the state. Members get equity in the machine that replaces them. Solidarity with everyone outside the coop pays.
- effects: LEG −0.2, PRO +0.3, POLL −2
- data: share +8, ladder +3, trust -2, books +2
- flags: STRIKE_CARD=unused
- hook: SILENT

## COUNTY (pivotal)

### P1-COUNTY-A — "Minutes to savings"
- tag: A
- summary: Productivity first. Every minute the machine frees is harvested as staffing cuts: queues shrink fastest this way. The patients and the care staff pay in presence.
- effects: PRO +0.5
- data: books +5, bedside -6, care_gap -1, trust -2

### P1-COUNTY-B — "Minutes to the bedside"
- tag: B
- summary: Care first. Every minute the machine frees goes back to patients: the paperwork dies, the visit grows. The framework pays, because none of the freed time is banked as savings.
- effects: LEG +0.4
- data: bedside +7, books -3, trust +2

### P1-COUNTY-H — "Let the lab run care"
- tag: H
- summary: The radical: contract a frontier lab to operate care services directly. Outcomes improve now, on machines and terms nobody here controls. Data rights, public jobs and autonomy pay.
- effects: PRO +0.7, LEG −0.6, POLL −2
- data: bedside +5, care_gap -3, days -8, share -5, trust -4, stay -4
- hook: SILENT

## TI (modifier)

### P1-TI-A — "Cheapest capable vendor"
- tag: A
- summary: Procurement neutrality: the taxpayer buys the best deal on earth, no sentiment. The books and the schedule win; the domestic sector's decade of references goes abroad.
- effects: PRO +0.5, POLL −1
- data: books +4, pull +2, stay -4

### P1-TI-B — "A domestic premium"
- tag: B
- summary: Industrial policy: pay more and slower so Finnish firms build the state's plumbing and export the references. Growth contributes to the deal; today's budget pays for tomorrow's sector.
- effects: PRO +0.2
- data: stay +5, pull +1, books -3

### P1-TI-H — "The state as a product"
- tag: H
- summary: The radical: consortium and state found a joint venture to sell the automated Finnish state abroad as a product. Public administration becomes an export business, with shareholders. Neutrality of the state pays.
- effects: PRO +0.8, LEG −0.4
- data: pull +6, stay +4, books +2, trust -3, share -3
- hook: SILENT

## AALTO (modifier)

### P1-AALTO-A — "Spearhead the few"
- tag: A
- summary: Depth for some: doctoral schools and elite AI engineering to staff the platform. The machine gets Finnish builders; the ten thousand displaced clerks wait, and the broad promise to the young thins.
- effects: PRO +0.4
- data: ladder -3, pub_ai +1, stay +2
- flags: TALENT_PIPE=strong

### P1-AALTO-B — "A floor for the many"
- tag: B
- summary: A floor for all: retraining at scale for the displaced, AI literacy in every degree. Nobody is left illegible to the new state; the elite pipeline and the platform's Finnish builders pay.
- effects: LEG +0.4
- data: ladder +6, share +2, books -2
- flags: TALENT_PIPE=weak; RETRAIN=broad

### P1-AALTO-H — "AI tutors take the lectures"
- tag: H
- summary: The radical: sell the teaching itself to the platform. AI tutors run the courses; faculty becomes an examination authority. Education gets cheap and scalable; the university's soul and the graduates' networks pay.
- effects: PRO +0.3, LEG −0.3
- data: ladder +3, books +3, trust -2, stay -3
- flags: TALENT_PIPE=weak
- hook: SILENT

## STARTUP (modifier)

### P1-STARTUP-A — "Bid as the champion"
- tag: A
- summary: The rigged-market bargain: lead a Finnish consortium bid, take the delivery risk, keep the state's plumbing in the country. Procurement neutrality pays, and if the champion fails, everyone eats it.
- effects: PRO +0.4
- data: stay +6, days +2, sov_share +2

### P1-STARTUP-B — "Fair market, no favours"
- tag: B
- summary: No special treatment: subcontract under whoever wins, compete on merit, scale abroad. The market stays honest; the plumbing and the decade of contracts on it belong to someone else.
- effects: PRO +0.2
- data: pull +4, stay -4

### P1-STARTUP-H — "The reverse acquihire"
- tag: H
- summary: The radical: use golden visas and a data-access deal to import a frontier lab's team wholesale to Turku. World-class capability lands in Finland overnight, on terms that trade away data and trust.
- effects: PRO +0.6, RES −0.3
- data: stay +5, pub_ai +2, days -3, trust -3, ladder -2
- hook: SILENT

## HVK (modifier)

### P1-HVK-A — "Pay the premium"
- tag: A
- summary: Insurance first: exit clauses, data locality and tested fallbacks in every contract, 15% dearer. The self-sufficiency clock starts running up; today's service budget pays.
- effects: RES +1.0, PRO −0.3
- data: days +8, books -4
- flags: SECURE_ARCH=yes

### P1-HVK-B — "Capacity now"
- tag: B
- summary: Wellbeing first: skip the premium, maximize what the money buys today, and accept that the state's new nervous system has one foreign supplier. The clock pays, later.
- effects: RES −0.3, PRO +0.3
- data: books +4, days -2
- flags: SECURE_ARCH=no

### P1-HVK-H — "The analog shadow state"
- tag: H
- summary: The radical: maintain a full manual fallback administration, drilled yearly, paper and people, able to run the country with the machines dark. Absolute resilience; a permanent, visible bill that every budget fights.
- effects: RES +1.2, PRO −0.6, POLL −2
- data: days +15, books -8, pub_ai -2
- flags: SECURE_ARCH=no
- hook: SILENT
