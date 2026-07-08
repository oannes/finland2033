# Phase 2 — Action menus

Pivotal: PM, COUNTY, STARTUP. Modifiers: SAK, TI, AALTO, HVK. A = sovereignty (European tier), B = capability (assured US access), H = no national line.

---

## PM (pivotal)

### P2-PM-A — "Declare the core sovereign"
- tag: A
- summary: Declare the public core sovereign: European tier, joint procurement, the gap accepted aloud. Finland runs on machines it can inspect; the twenty-month gap goes on your record, in every headline.
- effects: RES +0.8, PRO −0.5, LEG +0.3, POLL −2

### P2-PM-B — "Fly to Washington"
- tag: B
- summary: Sign the Washington agreement: the best models under attestation, audit rights, a guaranteed lane. The savings math gets its engine; the terms are written, and rewritten, elsewhere.
- effects: PRO +0.8, RES −0.7, POLL +1

### P2-PM-H — "Let the agencies choose"
- tag: H
- summary: Issue guidance and let each agency choose. No fight today; three incompatible systems by next year, and no one to blame but the org chart.
- effects: RES −0.3, LEG −0.3, POLL −4

---

## COUNTY (pivotal)

### P2-COUNTY-A — "Migrate the services"
- tag: A
- summary: Move county services to the European tier. Weaker tools this year; data, law and continuity under Finnish control for a decade.
- effects: RES +0.5, PRO −0.3
- data: sov_share +5

### P2-COUNTY-B — "Best medicine available"
- tag: B
- summary: Buy the frontier lane for diagnostics and triage. Measurably better medicine now, on machines that answer to another jurisdiction.
- effects: PRO +0.5
- data: pub_ai +3, sov_share −4

### P2-COUNTY-H — "Run both, decide later"
- tag: H
- summary: Frontier for medicine, European for casework. Both benefits in half measure, and one IT staff maintaining two worlds.
- effects: PRO −0.2
- data: pub_ai +1

---

## STARTUP (pivotal)

### P2-STARTUP-A — "Build on the European tier"
- tag: A
- summary: Move the platform to the European tier and say so publicly. The genome moat stays under EU law and the migration team is hired in Espoo; your models trail the frontier.
- effects: RES +0.3, PRO −0.2
- data: sov_share +4, youth_u −0.3

### P2-STARTUP-B — "Take the lane"
- tag: B
- summary: Attest and take the lane. Full competitive strength abroad; the country's most sensitive dataset now runs under terms of service you did not write.
- effects: PRO +0.7
- data: sov_share −3

### P2-STARTUP-H — "Split the company"
- tag: H
- summary: Split the company: frontier abroad, European at home. Honest, and you pay for two of everything with one funding round.
- effects: PRO −0.2

---

## SAK (modifier)

### P2-SAK-A — "A counterparty we can grieve"
- tag: A
- summary: State it publicly: every guarantee must be enforceable in a European court. Labour's weight lands on the sovereignty side; the capability camp calls you a brake.
- effects: LEG +0.4
- hook: SAK-A

### P2-SAK-B — "Jobs where the work is"
- tag: B
- summary: Accept the lane if deployment and jobs keep growing. Work continues; your members' contracts now reference machines their law cannot reach.
- effects: LEG +0.1
- hook: SAK-B

### P2-SAK-H — "No position"
- tag: H
- summary: Take no position; save the powder for the money fight in 2031. The stack gets decided without labour at the table.
- effects: LEG −0.1
- hook: SAK-H

---

## TI (modifier)

### P2-TI-A — "The sovereign build's order book"
- tag: A
- summary: Underwrite the sovereign build: power agreements, construction, capital. The European tier gets its bank; your exporters' access question stays open.
- effects: PRO +0.4
- data: compute_mw +40
- hook: TI-A

### P2-TI-B — "Keep the lane open"
- tag: B
- summary: Lobby for the lane with member-signed letters. The exporters keep their access; the sovereign build loses its industrial leg.
- effects: PRO +0.5
- data: compute_mw +10
- hook: TI-B

### P2-TI-H — "Split the difference in public"
- tag: H
- summary: Let both camps publish their own statements. The association keeps its members and loses its voice.
- effects: PRO −0.3, POLL −1
- hook: TI-H

---

## AALTO (modifier)

### P2-AALTO-A — "Certify 'good enough'"
- tag: A
- summary: Put the faculty's hours on testing the European tier against the 80% claim, results published either way. Migration becomes an engineering fact; the frontier labs go on without you.
- effects: LEG +0.4
- flags: TALENT_PIPE=strong
- data: sov_share +3
- hook: AALTO-A

### P2-AALTO-B — "Follow the capability"
- tag: B
- summary: Joint labs on the frontier lane; students on the best tools available. The graduates work at the edge, and the edge is elsewhere.
- effects: PRO +0.4
- flags: TALENT_PIPE=weak
- data: sov_share −2
- hook: AALTO-B

### P2-AALTO-H — "Measure, don't choose"
- tag: H
- summary: Benchmark both tiers, endorse neither. Rigorous, useful, and quoted by both camps against each other.
- hook: AALTO-H

---

## HVK (modifier)

### P2-HVK-A — "Doctrine says sovereign"
- tag: A
- summary: Apply the doctrine: critical functions on infrastructure Finland can inspect and run alone. Resilience wins; your own services lose the best tools.
- effects: RES +0.8
- hook: HVK-A

### P2-HVK-B — "Conditional access, eyes open"
- tag: B
- summary: Argue for conditional access: the lane, plus exit drills, escrowed weights, a tested fallback. Dependence made survivable instead of denied. Both camps distrust you for a week and quote you for years.
- effects: RES +0.4, PRO +0.2
- hook: HVK-B

### P2-HVK-H — "Map the dependencies"
- tag: H
- summary: Deliver a classified dependency map with no recommendation. It will be excellent, and late.
- effects: RES −0.2
- hook: HVK-H
