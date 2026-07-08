# Phase 3 — Action menus

Pivotal: PM, SAK, TI. Modifiers: COUNTY, AALTO, STARTUP, HVK. A = transition dividend, B = balance sheet, H = let the election decide.

---

## PM (pivotal)

### P3-PM-A — "Pay the bridge"
- tag: A
- summary: Send the savings to the bridge: retraining, care, a permanent reform unit, the levy to Parliament. Legitimacy is bought at list price; the balance sheet waits another parliament.
- effects: LEG +0.8, PRO −0.3, POLL +5
- data: youth_u −0.3

### P3-PM-B — "The balance sheet first"
- tag: B
- summary: Send the savings to the books: debt, defence, growth relief. The arithmetic is impeccable; a generation reads exactly what it was worth to you.
- effects: PRO +0.7, LEG −0.6, POLL −4
- data: youth_u +0.3

### P3-PM-H — "Put it to the voters"
- tag: H
- summary: Allocate nothing; run the election on the question. Democratic to the letter, and the question campaigns harder than any answer would.
- effects: LEG −0.4, POLL −5

---

## SAK (pivotal)

### P3-SAK-A — "Sign, with teeth"
- tag: A
- summary: Sign the dividend and retire the strike mandate: retraining and gain-sharing go into law. The rights are real; the threat that won them is spent.
- effects: LEG +0.6
- flags: STRIKE_CARD=spent

### P3-SAK-B — "The winter of refusal"
- tag: B
- requires: STRIKE_CARD=live (the 2027 ballot mandate was already spent or never taken)
- summary: Spend the ballot: a 72-hour public-sector stoppage against consolidation, weeks before the vote. Maximum leverage, once, in front of everyone.
- effects: LEG −0.5, POLL −4
- flags: STRIKE_CARD=spent

### P3-SAK-H — "Sectoral deals only"
- tag: H
- summary: Settle sector by sector, no national line. Every union gets something; the moment when labour could set the template passes.
- effects: LEG −0.2
- flags: STRIKE_CARD=unused

---

## TI (pivotal)

### P3-TI-A — "A number we can live with"
- tag: A
- summary: Negotiate the levy: capped, sunset-claused, earmarked, in exchange for signed labour peace. A price your members can invoice, not a precedent.
- effects: PRO −0.2, LEG +0.4
- flags: LEVY=yes

### P3-TI-B — "Fight the levy"
- tag: B
- summary: Campaign against any levy. Win, and the precedent dies with labour angrier. Lose, and the levy arrives without a cap.
- effects: PRO +0.3, LEG −0.3, POLL −2
- flags: LEVY=no

### P3-TI-H — "Free riders"
- tag: H
- summary: No position; let politics allocate. Optionality kept, relevance spent.
- effects: PRO −0.2

---

## COUNTY (modifier)

### P3-COUNTY-A — "The execution partner"
- tag: A
- summary: Co-sign the dividend and run its delivery: retraining desks and care reinvestment in every service centre. The bridge gets an address; your budgets carry the work.
- effects: LEG +0.3
- data: care_gap −2, pub_ai +2
- hook: COUNTY-A

### P3-COUNTY-B — "Savings first"
- tag: B
- summary: Bank the counties' share against next winter. Prudence with a queue attached.
- effects: PRO +0.2
- data: care_gap +1
- hook: COUNTY-B

### P3-COUNTY-H — "Absorb into the queues"
- tag: H
- summary: No structural allocation; the money seeps into deficits. The queues absorb the difference, as always.
- data: care_gap +1, trust −1
- hook: COUNTY-H

---

## AALTO (modifier)

### P3-AALTO-A — "Certify the guarantee"
- tag: A
- summary: Build the evaluation regime for the retraining guarantee: what it teaches, whether it lands people in work, published yearly. The bridge gets its proof.
- effects: LEG +0.3
- data: youth_u −0.5
- hook: AALTO-A

### P3-AALTO-B — "Efficiency analytics"
- tag: B
- summary: Sell consolidation analytics: where the machine can still cut. Rigorous, lucrative, and your name is on the cuts.
- effects: PRO +0.3
- data: trust −1
- hook: AALTO-B

### P3-AALTO-H — "Academic distance"
- tag: H
- summary: Neither the bridge nor the knife; a working paper on both.
- hook: AALTO-H

---

## STARTUP (modifier)

### P3-STARTUP-A — "Build the bridge's tools"
- tag: A
- summary: Bid the retraining platform and reform tooling; hire juniors to build it. The state becomes a customer with knowable rules.
- effects: PRO +0.2
- data: sov_share +2, youth_u −0.3
- hook: STARTUP-A

### P3-STARTUP-B — "The exit"
- tag: B
- summary: Take the acquisition. The cap table moves abroad at the top of the market; the next hundred hires happen in someone else's city.
- effects: PRO +0.4
- data: sov_share −3, youth_u +0.3
- hook: STARTUP-B

### P3-STARTUP-H — "Neither"
- tag: H
- summary: Ship product, skip politics. The defensible default, again.
- hook: STARTUP-H

---

## HVK (modifier)

### P3-HVK-A — "Normalize the exercises"
- tag: A
- summary: Make the Second Gate's drills routine: budgeted, boring, permanent. Preparedness that survives elections because it stopped being news.
- effects: RES +0.8
- hook: HVK-A

### P3-HVK-B — "Securitize the audits"
- tag: B
- summary: Securitize the audits under emergency framing. Money and powers now; a trust bill that arrives after you have left the room.
- effects: RES +0.4, LEG −0.2
- flags: SECURITIZED=yes
- hook: HVK-B

### P3-HVK-H — "Stand down"
- tag: H
- summary: Close the file; the Gate passed. The next one reopens it.
- effects: RES −0.4
- hook: HVK-H
