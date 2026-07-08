# Phase 3 — Action menus

Pivotal actors (PM, SAK, TI): tags feed `combos.md`. Redesign v2: round three is
reactionary — a larger pool per actor, most moves save your own metric at a
named someone else's cost, and several are LOCKED unless the numbers you all
made in 2027–29 allow them. Gates use the goals measure grammar in `requires:`;
locked cards show the reason ("not possible: …").

## PM (pivotal)

### P3-PM-A — "Pay the bridge"
- tag: A
- summary: Send the savings to the people who paid for them: retraining you can sue for, care reinvestment, a permanent reform unit. Legitimacy at list price; the balance sheet waits another parliament.
- effects: LEG +0.6, POLL +2
- data: share +6, ladder +4, bedside +2, books -8
- requires: indicator books >= 35 (a bridge needs a framework that can carry it)

### P3-PM-A2 — "The half-bridge"
- tag: A
- summary: Fund the retraining guarantee, defer the care reinvestment. A bridge with one lane: cheaper, real, and everyone sees which half was left out.
- effects: LEG +0.3, POLL +1
- data: share +3, ladder +2, books -4
- hook: SILENT

### P3-PM-B — "The books first"
- tag: B
- summary: Send the savings where they were promised: debt, defence, growth relief. The arithmetic is impeccable; a generation reads exactly what it was worth to you.
- effects: PRO +0.6, POLL −3
- data: books +8, share -4, trust -2

### P3-PM-B2 — "Emergency consolidation"
- tag: B
- summary: The cornered version: across-the-board cuts with the savings as anaesthetic. Only a government out of room does this, and everyone pays except the deficit.
- effects: PRO +0.8, LEG −0.7, POLL −5
- data: books +12, bedside -4, ladder -4, share -4, trust -4
- requires: indicator books <= 30 (only an empty framework justifies it)
- hook: SILENT

### P3-PM-H — "Run on the question"
- tag: H
- summary: Allocate nothing; put the dividend on the ballot. Democratic to the letter, and the question campaigns harder than any answer would.
- effects: LEG −0.3, POLL −2
- data: trust -2

### P3-PM-H2 — "The citizens' assembly"
- tag: H
- summary: Hand the allocation to a randomly selected assembly with a binding mandate. Radical trust in ordinary people; every institution at this table loses its seat at that one.
- effects: LEG +0.5, POLL −1
- data: trust +4, books -2
- requires: poll >= 52 (only a government citizens trust can afford to share the pen)
- hook: SILENT

## SAK (pivotal)

### P3-SAK-A — "Sign, with teeth"
- tag: A
- summary: Sign the dividend and retire the threat: retraining rights and gain-sharing into law, enforceable, funded. The rights are real; the weapon that won them is spent.
- effects: LEG +0.5
- data: share +6, ladder +3
- flags: STRIKE_CARD=unused

### P3-SAK-A2 — "Backdate the rights"
- tag: A
- summary: Sign, but the price is retroactive: compensation for the cohort automated before the rules existed. Justice for the already-displaced; the framework and the employers pay twice.
- effects: LEG +0.3, PRO −0.3
- data: share +8, books -5, pull -2
- requires: indicator share <= 45 (backdating is only owed where sharing failed)
- hook: SILENT

### P3-SAK-B — "The general strike"
- tag: B
- summary: Spend the ballot: a 72-hour public-sector stoppage weeks before the vote. Maximum leverage, once, in front of everyone, and the whole economy holds its breath.
- effects: LEG −0.6, PRO −0.6, POLL −4
- data: share +7, books -6, pull -4, trust -2
- requires: STRIKE_CARD=live (the 2027 ballot mandate was already spent or never taken)

### P3-SAK-B2 — "Work-to-rule winter"
- tag: B
- summary: The quiet coercion: every rule followed to the letter, every flexibility withdrawn, until the dividend moves. Slower damage, same message; the services and their users pay meanwhile.
- effects: LEG −0.3, PRO −0.3
- data: share +4, books -3, trust -1
- requires: indicator share <= 50 (members won't grind for gains they already have)
- hook: SILENT

### P3-SAK-H — "Sector by sector"
- tag: H
- summary: No national line: every union cuts its own deal. Everyone gets something; the moment when labour could set the template passes, and the weakest sectors get the leftovers.
- effects: LEG −0.2
- data: share +2, trust -1

### P3-SAK-H2 — "Save our own"
- tag: H
- summary: The member-first raid: protections and payouts for those inside the walls, silence about everyone outside them. Your members are safe; the young and the unorganized pay.
- effects: LEG −0.4
- data: share +5, ladder -4, trust -3
- hook: SILENT

## TI (pivotal)

### P3-TI-A — "A number we can live with"
- tag: A
- summary: Negotiate the levy: capped, sunset-claused, earmarked, in exchange for signed labour peace. A price your members can invoice, not a precedent.
- effects: PRO +0.3, LEG +0.3
- data: share +3, pull +2, books +2

### P3-TI-A2 — "Buy the peace privately"
- tag: A
- summary: Pre-empt the levy: industry funds the retraining guarantee itself, brands it, and claims the credit. Cheaper than the precedent; the public's grip on the machine's gains pays.
- effects: PRO +0.4
- data: share +3, ladder +3, stay +2, books +1
- requires: indicator pull >= 55 (only a confident sector pays voluntarily)
- hook: SILENT

### P3-TI-B — "Fight the levy"
- tag: B
- summary: Campaign against any levy, win or lose. Win, and the precedent dies with labour angrier. Lose, and it arrives without a cap.
- effects: PRO +0.3, LEG −0.3, POLL −2
- data: pull +3, share -4, trust -2

### P3-TI-B2 — "The capital strike"
- tag: B
- summary: The nuclear option: a coordinated investment freeze until the levy dies. Save the margins, spend the country: every metric that needs capital stalls with you.
- effects: PRO −0.4, LEG −0.5, POLL −3
- data: pull -6, books -4, share -3, stay -2
- requires: indicator share >= 60 (only when labour holds the whip does capital dare the counter-whip)
- hook: SILENT

### P3-TI-H — "No position"
- tag: H
- summary: Let politics allocate; keep the association out of it. Optionality kept, relevance spent.
- effects: PRO +0.1
- data: pull +1

### P3-TI-H2 — "Split the bill to SMEs"
- tag: H
- summary: Accept the levy, lobby the thresholds so it lands on firms too small to lobby. The members are shielded; the ecosystem beneath them pays.
- effects: PRO +0.2, LEG −0.3
- data: pull +3, stay -3, share -2, trust -2
- hook: SILENT

## COUNTY (modifier)

### P3-COUNTY-A — "The execution partner"
- tag: A
- summary: Co-sign the dividend and run its delivery: retraining desks and care reinvestment in every service centre. The bridge gets an address; your budgets carry the work.
- effects: LEG +0.4
- data: bedside +4, share +2, books -2

### P3-COUNTY-A2 — "Claw the dividend to care"
- tag: A
- summary: The desperate grab: take the counties' share off the top for the wards, before anyone else files a claim. The floor is saved this winter; the national bridge is shorter for it.
- effects: LEG +0.2, PRO −0.2, POLL −1
- data: bedside +7, books -6
- requires: indicator bedside <= 40 (only empty wards justify jumping the queue)
- hook: SILENT

### P3-COUNTY-B — "Savings first"
- tag: B
- summary: Bank the counties' share against next winter. Prudence with a queue attached.
- effects: PRO +0.3
- data: books +4, bedside -2

### P3-COUNTY-B2 — "Close wards to save the rest"
- tag: B
- summary: The triage nobody campaigns on: shut the thinnest wards, concentrate staff where care still works. The kept wards improve; the closed towns remember.
- effects: PRO +0.4, LEG −0.5, POLL −2
- data: care_gap -3, bedside +2, trust -4
- requires: indicator care_gap >= 18 (only a breaking system justifies triage)
- hook: SILENT

### P3-COUNTY-H — "No structural allocation"
- tag: H
- summary: The money seeps into deficits. The queues absorb the difference, as always.
- effects: LEG −0.2
- data: bedside -1

### P3-COUNTY-H2 — "Sell the care model abroad"
- tag: H
- summary: License the county's automation playbook to Dutch and Japanese systems. Money and prestige in; your scarcest nurses get poached by the buyers.
- effects: PRO +0.4
- data: pull +3, books +2, stay +2, bedside -2
- requires: indicator bedside >= 50 (nobody buys a model from empty wards)
- hook: SILENT

## HVK (modifier)

### P3-HVK-A — "Normalize the exercises"
- tag: A
- summary: Make the Gate's drills routine: budgeted, boring, permanent. Preparedness that survives elections because it stopped being news.
- effects: RES +0.4
- data: days +5, books -2

### P3-HVK-A2 — "Raid care for stockpiles"
- tag: A
- summary: The zero-sum insurance: move budget from the wards to reserves and fallback capacity, quietly. The clock runs up; the bedside pays, and nobody votes on it.
- effects: RES +0.6, LEG −0.3
- data: days +8, bedside -3, books -2, trust -1
- requires: indicator days <= 15 (only a naked clock justifies raiding care)
- hook: SILENT

### P3-HVK-B — "Securitize the audits"
- tag: B
- summary: Keep the emergency framing: powers, money and speed now, a trust bill that arrives after you have left the room.
- effects: RES +0.6, LEG −0.4
- data: days +4, trust -3
- flags: SECURITIZED=yes
- requires: CRISIS_LEG=damaged (emergency powers need an emergency the country remembers)

### P3-HVK-B2 — "Declare victory, stand down"
- tag: B
- summary: The Gate passed; hand the money back and say so. The books thank you this year. The next gate reopens the file at retail prices.
- effects: PRO +0.3, RES −0.4
- data: books +3, days -4
- hook: SILENT

### P3-HVK-H — "Close the file"
- tag: H
- summary: The Gate passed. The next one reopens it.
- effects: RES −0.2
- data: days -2

### P3-HVK-H2 — "Publish the doctrine"
- tag: H
- summary: Radical transparency: publish the whole resilience doctrine, gaps included, and let the country argue about it in daylight. Trust grows; so does the adversary's reading list.
- effects: RES +0.2, LEG +0.3
- data: days +3, trust +2
- requires: indicator days >= 25 (you can only show your hand when it is strong)
- hook: SILENT

## AALTO (modifier)

### P3-AALTO-A — "Certify the guarantee"
- tag: A
- summary: Build the evaluation regime for the retraining guarantee: what it teaches, whether it lands people in work, published yearly. The bridge gets its proof.
- effects: LEG +0.4
- data: ladder +4, share +2

### P3-AALTO-A2 — "Repair the cohort"
- tag: A
- summary: Aim the dividend at Eetu's generation specifically: bridge programs, first-job guarantees, seven years late. The already-failed get repaired; the next intake waits its turn.
- effects: LEG +0.5
- data: ladder +6, youth_u -0.8, books -4
- requires: indicator books >= 30 (repair costs money the framework must still have)
- hook: SILENT

### P3-AALTO-B — "Efficiency analytics"
- tag: B
- summary: Sell consolidation analytics: where the machine can still cut. Rigorous, lucrative, and your name is on the cuts.
- effects: PRO +0.4
- data: books +4, ladder -2, trust -2

### P3-AALTO-B2 — "Import the talent instead"
- tag: B
- summary: Give up on repairing the pipeline; recruit the missing skills from abroad at market price. The platform gets staffed; the promise to the local young quietly lapses.
- effects: PRO +0.3, LEG −0.3
- data: stay +2, pub_ai +1, ladder -4, trust -1
- requires: indicator ladder <= 55 (a working pipeline needs no substitute)
- hook: SILENT

### P3-AALTO-H — "A working paper on both"
- tag: H
- summary: Neither the bridge nor the knife; a working paper on both.
- effects: LEG +0.1
- data: ladder +1

### P3-AALTO-H2 — "Free continuous learning for all"
- tag: H
- summary: The radical universal: open, free, machine-tutored continuous learning for every adult, funded off the top of the dividend. The broadest promise ever made; the framework carries it forever.
- effects: LEG +0.5, PRO −0.3
- data: ladder +7, share +3, books -7
- requires: indicator books >= 45 (a promise this broad needs a full treasury)
- hook: SILENT

## STARTUP (modifier)

### P3-STARTUP-A — "Bid the bridge platform"
- tag: A
- summary: Build the retraining platform and reform tooling; hire juniors to do it. The state becomes a customer with knowable rules.
- effects: PRO +0.3
- data: stay +3, ladder +2, share +2

### P3-STARTUP-A2 — "The pledge"
- tag: A
- summary: A public bargain: one hundred local hires and the retraining tools at cost, in exchange for levy exemption. You buy your own carve-out; the levy's fairness pays.
- effects: PRO +0.3, LEG +0.2
- data: stay +5, ladder +3, share +2, pull -1
- requires: indicator stay >= 45 (a pledge from a company halfway out the door convinces nobody)
- hook: SILENT

### P3-STARTUP-B — "Take the exit"
- tag: B
- summary: Sell at the top of the market. The cap table moves abroad; the next hundred hires happen in someone else's city, and the ecosystem reads the signal.
- effects: PRO +0.2
- data: stay -10, pull +2, books +1
- requires: indicator pull >= 55 (exits only price at the top of the market)

### P3-STARTUP-B2 — "Move the HQ quietly"
- tag: B
- summary: No press release, just a Dublin address and a skeleton office in Turku. You save the tax bill; everyone who cited you as proof the country works pays.
- effects: PRO −0.2, LEG −0.2
- data: stay -6, pull -2, trust -1
- requires: indicator stay <= 40 (quiet exits happen where staying already lost)
- hook: SILENT

### P3-STARTUP-H — "Ship product, skip politics"
- tag: H
- summary: The defensible default, again.
- effects: PRO +0.1
- data: stay +1

### P3-STARTUP-H2 — "Open-source the stack"
- tag: H
- summary: The radical gift: open the company's platform layer to the public sector, free, forever. The sovereign stack gets a running start; your investors get a lecture on externalities.
- effects: RES +0.3, PRO −0.2
- data: sov_share +3, days +2, stay +2, pull -2
- hook: SILENT
