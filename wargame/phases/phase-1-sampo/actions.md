# Phase 1 — Action menus

Pivotal actors (PM, SAK, COUNTY): tags feed `combos.md`. Modifier actors: effects + hooks apply to whichever outcome fires. `POLL ±n` moves government approval — the 2031 election is scored from it.

---

## PM (pivotal)

### P1-PM-A — "Back the megaproject"
- tag: A
- summary: Put the scale-up bill to Parliament intact: full budget, statutory targets, staffing cuts decided by management. It will deliver, and it will hollow out the offices your own voters work in.
- effects: PRO +1.0, LEG −0.7, POLL −6
- data: pub_ai +2

### P1-PM-B — "Make it your own"
- tag: B
- summary: Pull the bill and relaunch the program on your terms: job security in law, unions at the table, delivery re-tendered in pieces. You keep the base and half the savings. Development fragments, and foreign integrators pick up what the consultancy drops.
- effects: LEG +0.7, PRO −0.4, POLL +4

### P1-PM-H — "Shrink it to a pilot"
- tag: H
- summary: Cap the budget, keep the staff, and run a pilot in two agencies with a decision point in 2029. Nobody fights you this year, and the framework keeps counting savings that can no longer arrive on time.
- effects: LEG +0.2, PRO −0.4, POLL −2
- data: pub_ai −1

---

## SAK (pivotal)

### P1-SAK-A — "A seat, not a veto"
- tag: A
- summary: Accept the mandate for a seat on the program board and a written gain-sharing clause. You shape the machine from inside; you also co-own everything it does to your members.
- effects: LEG −0.4, POLL +2
- flags: STRIKE_CARD=unused

### P1-SAK-B — "The guarantee, in law"
- tag: B
- summary: Demand job security in law as the price of labour peace. The members are protected for a decade; the program gets slower and smaller, and industry calls it gutted.
- effects: LEG +0.5
- flags: contributes to GUARANTEE=yes (see combos)

### P1-SAK-H — "Ballot the members"
- tag: H
- summary: Run a strike ballot before agreeing to anything. Your threat becomes credible and stays usable later; the government you helped elect now negotiates with an opponent.
- effects: LEG −0.2, POLL −3
- flags: STRIKE_CARD=live

---

## COUNTY (pivotal)

### P1-COUNTY-A — "Efficiency first"
- tag: A
- summary: Commit the counties to the state's schedule and savings targets. The queues shrink fastest this way; staff consent is not asked, and trust pays for it.
- effects: PRO +0.5
- data: pub_ai +3, trust −2

### P1-COUNTY-B — "Dignity first"
- tag: B
- summary: Commit with consent gates: implementation councils and staff sign-off on every migration. The wards keep their people and their dignity; the savings arrive late and smaller.
- effects: LEG +0.4
- data: trust +2, pub_ai +1

### P1-COUNTY-H — "Show us it works first"
- tag: H
- summary: Join only after the state proves the platform in two agencies. Prudent, defensible, and a year of queue growth you chose.
- effects: PRO −0.3
- data: care_gap +1

---

## TI (modifier)

### P1-TI-A — "Full-throated backing"
- tag: A
- summary: Campaign publicly for the full mandate and finance delivery capacity. The program speeds up; industry's name is now on labour's enemy list.
- effects: PRO +0.5, POLL −1
- hook: TI-A

### P1-TI-B — "Support, with an audit"
- tag: B
- summary: Back the negotiated program on one condition: an annual public audit of the savings. Slower, but accountable, and you hold the yardstick.
- effects: PRO +0.2
- hook: TI-B

### P1-TI-H — "The credit letter"
- tag: H
- summary: Publish the fiscal council brief and an investor letter: a diluted program breaks the framework. The markets hear you; the government pays in basis points and remembers who sent the bill.
- effects: PRO −0.3, POLL −3
- hook: TI-H

---

## AALTO (modifier)

### P1-AALTO-A — "Spearhead programs"
- tag: A
- summary: Spend the faculty budget narrow: doctoral schools and elite AI engineering to staff the platform. The machine gets Finnish builders; the ten thousand displaced wait.
- effects: PRO +0.4
- flags: TALENT_PIPE=strong
- data: sov_share +2
- hook: AALTO-A

### P1-AALTO-B — "Broad training for all"
- tag: B
- summary: Spend it wide: retraining at scale for displaced clerical staff, first cohort in a year. Ten thousand bridges get built; nothing shows before 2030, and the platform is staffed by others.
- effects: LEG +0.4
- flags: TALENT_PIPE=weak; RETRAIN=broad
- hook: AALTO-B

### P1-AALTO-H — "Protect the core"
- tag: H
- summary: Fund neither; protect research autonomy and the existing degrees. The university stays itself while the labour market changes owners.
- flags: TALENT_PIPE=weak
- hook: AALTO-H

---

## STARTUP (modifier)

### P1-STARTUP-A — "The domestic bid"
- tag: A
- summary: Lead a Finnish consortium bid for the core modules. The state's plumbing stays in the country; the delivery risk carries your name.
- effects: RES +0.3
- data: sov_share +4
- hook: STARTUP-A

### P1-STARTUP-B — "Ride the integrator"
- tag: B
- summary: Subcontract under a global integrator. Faster revenue and export references; the platform, and the decade of contracts on it, belong to someone else.
- effects: PRO +0.4
- data: sov_share −3, pub_ai +2
- hook: STARTUP-B

### P1-STARTUP-H — "Sit this one out"
- tag: H
- summary: Pass, and build for private customers. Clean hands, zero risk, and plumbing contracts do not reopen for ten years.
- effects: PRO −0.2
- hook: STARTUP-H

---

## HVK (modifier)

### P1-HVK-A — "Architecture before scale"
- tag: A
- summary: Write exit clauses, data locality and fallback modes into the tender now. The program costs 15% more; the first crisis becomes survivable.
- effects: RES +1.0, PRO −0.3
- flags: SECURE_ARCH=yes
- hook: HVK-A

### P1-HVK-B — "Certify the vendors"
- tag: B
- summary: Accept vendor certification instead of architecture requirements. Cheaper and faster, and the protection is exactly as strong as a certificate.
- effects: RES +0.4
- flags: SECURE_ARCH=no
- hook: HVK-B

### P1-HVK-H — "Observe and document"
- tag: H
- summary: Publish guidance and wait for budget clarity. The gap gets documentation instead of a fix.
- effects: RES −0.3
- flags: SECURE_ARCH=no
- hook: HVK-H
