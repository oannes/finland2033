# Phase 1 — Action menus

Pivotal actors (PM, SAK, COUNTY): tags feed `combos.md`. Modifier actors: effects + hooks apply to whichever outcome fires. `POLL ±n` moves government approval — the 2031 election is scored from it. Redesign v2: every menu is pole A / pole B / radical (tag H); summaries name the trade and who pays. Deal metrics: books, share, bedside, pull, days, ladder, stay.

## PM (pivotal)

### P1-PM-A — "Book the savings"
- tag: A
- summary: Send the scale-up bill to Parliament unchanged: full budget, binding savings targets, staffing cuts decided by managers. In plain terms, you promise the markets that automation will pay for the state's future, starting now. You do it because the framework is already spent: without these savings, you personally announce cuts worth 1.9% of GDP. The offices your own voters work in take the shock.
- effects: PRO +1.0, LEG −0.7, POLL −6
- data: pub_ai +2, books +8, bedside -3, share -3

### P1-PM-B — "Protect the experience"
- tag: B
- summary: Rewrite the bill before sending it: the platform still comes, but slower, with service levels and jobs guaranteed during the transition. You do it because a government elected by public-sector workers cannot automate them by decree and expect to govern afterwards. The price is paid in credibility: the savings arrive late and smaller, and the bond desks see it.
- effects: LEG +0.7, PRO −0.4, POLL +4
- data: books -4, bedside +3, share +3

### P1-PM-H — "Rent the state"
- tag: H
- summary: Cancel the state's own build and sign a turnkey contract instead: the winning global vendor runs Finland's public platform and takes a share of the savings. You do it because it is the only version where the money is certain and the delivery risk is someone else's. The catch sits in the ownership line: the state's plumbing answers to a foreign board.
- effects: PRO +0.6, LEG −0.5, POLL −3
- data: pub_ai +3, books +12, days -8, stay -6, share -4
- hook: SILENT

## SAK (pivotal)

### P1-SAK-A — "Trade jobs for terms"
- tag: A
- summary: Go to the table and sell your consent at the highest price it will ever fetch: accept that desks will close, and demand gain-sharing, retraining rights and a seat on the program board in return. You do it because the automation is coming either way, and terms negotiated now beat terms dictated later. The members who leave pay for the ones who stay.
- effects: LEG −0.4, POLL +2
- data: share +5, books +3, ladder +2
- flags: STRIKE_CARD=unused

### P1-SAK-B — "Defend every desk"
- tag: B
- summary: Refuse. Demand a law forbidding dismissals for the decade, and keep the strike ballot armed on the table. You do it because a union that trades away jobs stops being believed, and being believed is the only asset you truly hold. The program gets slower and smaller, and the young outside the walls keep waiting.
- effects: LEG +0.5
- data: share +4, books -4, ladder -2
- flags: contributes to GUARANTEE=yes (see combos); STRIKE_CARD=live

### P1-SAK-H — "The union becomes the platform"
- tag: H
- summary: Do the unheard-of: register a cooperative, buy the tools, and rent your members' machine-assisted work back to the state as a service. You do it because if work is becoming software, then the union should own some software. Nobody else at the table has a category for what you become.
- effects: LEG −0.2, PRO +0.3, POLL −2
- data: share +8, ladder +3, trust -2, books +2
- flags: STRIKE_CARD=unused
- hook: SILENT

## COUNTY (pivotal)

### P1-COUNTY-A — "Minutes to savings"
- tag: A
- summary: Sign the commitment the ministry wants: as the machine takes over the paperwork, convert the freed hours into smaller staff lists and shorter queues. You do it because you are short 57,000 workers by 2033 and arithmetic is not optional. The visits get shorter, and the people at the bedside notice first.
- effects: PRO +0.5
- data: books +5, bedside -6, care_gap -1, trust -2

### P1-COUNTY-B — "Minutes to the bedside"
- tag: B
- summary: Sign a different commitment: every hour the machine frees goes back to the patients: longer visits, fuller wards, and the paperwork simply dies. You do it because care is the one service where presence is the product, and a county that forgets that cannot be trusted with machines. The savings the state already booked from you do not come.
- effects: LEG +0.4
- data: bedside +7, books -3, trust +2

### P1-COUNTY-H — "Let the lab run care"
- tag: H
- summary: Take the meeting the others refuse: a frontier AI lab offers to run care services end to end, better and cheaper, on its own systems. You do it because your patients are waiting now and the lab's results are real. What Finland gives up is in the small print: the data, the jobs, and the ability to say no later.
- effects: PRO +0.7, LEG −0.6, POLL −2
- data: bedside +5, care_gap -3, days -8, share -5, trust -4, stay -4
- hook: SILENT

## TI (modifier)

### P1-TI-A — "Cheapest capable vendor"
- tag: A
- summary: Publish industry's position: the state must buy the best deal on earth, no home-team sentiment. You do it because your members pay the taxes behind every romantic procurement, and credible neutrality is what keeps foreign capital treating Finland as a serious place. The Finnish bidders lose their decade.
- effects: PRO +0.5, POLL −1
- data: books +4, pull +2, stay -4

### P1-TI-B — "A domestic premium"
- tag: B
- summary: Publish the opposite: pay more, this once, and buy Finnish, because the state's platform is the reference that builds an export industry. You do it because order books are what your members ultimately need, and a domestic AI sector would feed them for twenty years. Today's taxpayer covers the difference.
- effects: PRO +0.2
- data: stay +5, pull +1, books -3

### P1-TI-H — "The state as a product"
- tag: H
- summary: Propose the deal nobody has dared write down: a joint venture of state and industry that packages the automated Finnish state and sells it to other countries. You do it because Finland's real export was always institutions, and this is the century's one chance to price them. The state stops being neutral the day it has shareholders.
- effects: PRO +0.8, LEG −0.4
- data: pull +6, stay +4, books +2, trust -3, share -3
- hook: SILENT

## AALTO (modifier)

### P1-AALTO-A — "Spearhead the few"
- tag: A
- summary: Pour the faculty budget into the top: doctoral schools and elite AI engineering, the few hundred who can build the state's machine. You do it because if Finns do not build it, Finland merely operates it, and a university's deepest duty is capability. The ten thousand displaced clerks become someone else's syllabus.
- effects: PRO +0.4
- data: ladder -3, pub_ai +1, stay +2
- flags: TALENT_PIPE=strong

### P1-AALTO-B — "A floor for the many"
- tag: B
- summary: Spread the budget wide: retraining for the displaced, AI literacy in every degree, nobody left unable to read the new state. You do it because the university's promise was never only to the brilliant, and a country of bystanders is ungovernable. The elite pipeline thins, and the platform gets built by others.
- effects: LEG +0.4
- data: ladder +6, share +2, books -2
- flags: TALENT_PIPE=weak; RETRAIN=broad

### P1-AALTO-H — "AI tutors take the lectures"
- tag: H
- summary: Accept the vendor's standing proposal: machine tutors teach the courses, and the university narrows to setting and examining the standard. You do it because it costs a tenth as much, scales to everyone at once, and, if you are honest, teaches the average course better than the average lecturer. What remains of a university afterwards is your gamble.
- effects: PRO +0.3, LEG −0.3
- data: ladder +3, books +3, trust -2, stay -3
- flags: TALENT_PIPE=weak
- hook: SILENT

## STARTUP (modifier)

### P1-STARTUP-A — "Bid as the champion"
- tag: A
- summary: Put your company's name at the front of the Finnish consortium bidding for the state platform. You do it because somebody local has to become big enough to matter, and the state's contract is the only ladder to that size. If the build fails, your name is on the failure, and everyone who backed a champion pays with you.
- effects: PRO +0.4
- data: stay +6, days +2, sov_share +2

### P1-STARTUP-B — "Fair market, no favours"
- tag: B
- summary: Stay out of the consortium, take subcontracts on merit, keep scaling your own product abroad. You do it because companies built on political favours die of them later, and your investors did not fund a national monument. The state's plumbing goes to whoever wins, and it will not be Finland.
- effects: PRO +0.2
- data: pull +4, stay -4

### P1-STARTUP-H — "The reverse acquihire"
- tag: H
- summary: Use the one asset only you hold, credibility with the labs, to broker a wild deal: golden visas and a data-access agreement that moves a frontier lab's team to Turku wholesale. You do it because talent is the only import that compounds, and homegrown scale takes a decade Finland does not have. The price is paid in data and in trust.
- effects: PRO +0.6, RES −0.3
- data: stay +5, pub_ai +2, days -3, trust -3, ladder -2
- hook: SILENT

## HVK (modifier)

### P1-HVK-A — "Pay the premium"
- tag: A
- summary: Use your statutory power over the tender: exit clauses, data on Finnish soil, tested fallbacks, in every contract, at fifteen percent extra. You do it because your office exists for the day the access stops, and cheap dependencies are how countries find out what they should have paid. The fifteen percent comes out of services people can see.
- effects: RES +1.0, PRO −0.3
- data: days +8, books -4
- flags: SECURE_ARCH=yes

### P1-HVK-B — "Capacity now"
- tag: B
- summary: Wave the annex through: let the program buy maximum capability for the money, single foreign supplier and all. You do it because services visibly failing now is also a security risk, and insurance against a maybe is a hard sell in a tight budget. You file your objection where filings go.
- effects: RES −0.3, PRO +0.3
- data: books +4, days -2
- flags: SECURE_ARCH=no

### P1-HVK-H — "The analog shadow state"
- tag: H
- summary: Order the old thing at full scale: a manual fallback administration, paper, people, yearly drills, able to run the country with every machine dark. You do it because everything digital is somebody else's eventually, and your grandparents kept grain in silos for the same reason. It costs like an army and looks like paranoia until the day it does not.
- effects: RES +1.2, PRO −0.6, POLL −2
- data: days +15, books -8, pub_ai -2
- flags: SECURE_ARCH=no
- hook: SILENT
