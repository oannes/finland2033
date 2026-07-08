# Goals — what each actor is trying to hold together

Machine-checkable goals per actor, scored after every reveal. A seat has done
its work when at least two of its three goals hold at the endstate; the
software says so there, quietly. Every actor's choice moves these readings
every round.

Measure grammar (one per goal):
- `index RES|LEG|PRO >= n` — game index threshold
- `poll >= n` — government approval
- `flag NAME in value1,value2` — flag test (unset flag = still open)
- `indicator id >=|<= n` — latest data-node value
- `drift <= n` — max number of deadlock outcomes tolerated
- `persona ID >= n` — persona ladder rung (1–5)

## PM

- goal: Re-elected in 2031
  measure: poll >= 48
  why: Approval moves with every decision. The 2031 election is scored from it.

- goal: A country that chose
  measure: drift <= 1
  why: Every deadlock wastes a year. Two, and Finland drifted through its one good decade.

- goal: Automation delivers
  measure: indicator pub_ai >= 30
  why: The budget already assumes AI carries 30% of public transactions. If it does not, the cuts are yours to announce.

## SAK

- goal: Rights in law
  measure: flag GUARANTEE in yes
  why: A job-security law signed in 2028 protects your members for the decade. A promise does not.

- goal: The gains are shared
  measure: flag LEVY in yes
  why: A levy on automation savings funds retraining. Without it, the machine's profits leave the room.

- goal: The young get in
  measure: indicator youth_u <= 10
  why: If youth unemployment is still high in 2033, the next generation organizes against you, not with you.

## COUNTY

- goal: Queues under control
  measure: indicator care_gap <= 14
  why: You lose 57,000 workers by 2033. Only automation done right closes the gap they leave.

- goal: Trust holds
  measure: indicator trust >= 55
  why: One botched rollout in one ward can break national trust. Careful deployment keeps it.

- goal: Services actually automate
  measure: indicator pub_ai >= 30
  why: The savings you promised exist only if AI really carries the work.

## TI

- goal: Investment keeps coming
  measure: index PRO >= 7
  why: Your members build where returns are predictable. Political drift scares capital away.

- goal: The infrastructure grows
  measure: indicator compute_mw >= 550
  why: Datacenters and grid connections take years to build and months to lose.

- goal: No open-ended levy
  measure: flag LEVY in no
  why: A capped levy is a price. An uncapped one is a precedent your members pay forever.

## HVK

- goal: Security built in early
  measure: flag SECURE_ARCH in yes
  why: Exit clauses and fallbacks cost 15% at the 2028 tender, or ten times that later.

- goal: Preparedness holds
  measure: index RES >= 6.5
  why: Finland must run core services through an access cut without improvising.

- goal: The crisis is a drill
  measure: flag CRISIS_LEG in managed
  why: When access breaks in 2031, the country either exercises a plan or improvises a trauma.

## AALTO

- goal: Eetu stays
  measure: persona EETU >= 4
  why: If graduates like Eetu find real work here, your pipeline worked. If they leave, it fed someone else's.

- goal: The pipeline feeds the platform
  measure: flag TALENT_PIPE in strong
  why: A public platform nobody local can build or audit is a rented machine.

- goal: A stack worth staffing
  measure: indicator sov_share >= 35
  why: Below a third of public AI on European machines, your certification work has no object.

## STARTUP

- goal: The round closes
  measure: index PRO >= 6
  why: Series C happens in whatever policy climate the table creates. Investors price drift first.

- goal: A clear stack
  measure: flag STACK in euro,us
  why: A country that half-decides makes every company run two stacks and pay for both.

- goal: Never the hostage
  measure: drift <= 1
  why: Repeated deadlock freezes your biggest customer and politicizes your market.
