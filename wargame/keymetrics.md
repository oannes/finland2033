# Key metrics — one number per seat, realized as a sentence

Shown as the player's own headline card at the top of the 2033 endstate, and
inside "What happened to the others" for the rest of the table. Grammar:
`- if <measure>: text` using the goals.md measure grammar, or `- else: text`.
First matching line wins. {tokens} interpolate from the endstate numbers.
PM is handled in code: its metric is the 2031 election verdict.

## AKAVA — The entry door
- if indicator youth_u <= 10: Youth unemployment closes the decade at {youth_u}%. The door into working life reopened, and the union hall is younger than it has been since the nineties.
- else: Youth unemployment reads {youth_u}% in 2033. A generation learned that the economy renews itself without asking them, and stopped paying dues to anyone.

## COUNTY — The queue
- if indicator care_gap <= 14: The care queue stands at {care_gap},000 unfilled posts, and it is shrinking. Nobody thanks the county for the crisis that did not happen. On the floor, that is what success looks like.
- else: The care queue stands at {care_gap},000 unfilled posts in 2033. Every reform of the decade is measured against this number by the people who waited inside it.

## TI — The order books
- if indicator compute_mw >= 550: The build-out reached {compute_mw} megawatts. The halls hum, the order books renew, and the investment argument no longer needs making.
- else: The build-out stalled at {compute_mw} megawatts. Capital read the signal and made its next commitment somewhere with fewer open questions.

## HVK — The next gate
- if flag CRISIS_LEG in managed: The Second Gate of 2031 lasted eleven days and produced no queues worth filming. Preparedness that works is indistinguishable from nothing happening. HVK settles for that.
- if index RES >= 6.5: The gate has not truly come, and the reserve is real. The invoice for insurance nobody used arrives yearly, and yearly somebody questions it.
- else: When the Second Gate hit, the fallback was a binder. Eleven days of improvisation bought what architecture would have bought cheaper, and the inquiry has the warnings on record.

## AALTO — The pipeline
- if indicator sov_share >= 35: {sov_share}% of public AI runs on machines Finns can inspect, staffed by people who graduated from your programs. The pipeline found its object.
- else: Sovereign share reads {sov_share}% in 2033. The graduates are excellent, and they are elsewhere, certifying other countries' machines.

## STARTUP — The company
- if flag STACK in euro,us: The country picked one stack and the company scaled on it. The next funding round closed in Helsinki, and the next hundred hires argue about office space, not jurisdiction.
- else: The country never picked a stack, so the company runs two of everything. The slide about "regulatory optionality" is a euphemism, and every investor in the room knows it.
