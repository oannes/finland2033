# Goals — what each actor is trying to hold together

Each actor has three goals they try to reach. 

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
  why: You want to be re-elected because the country needs continuity in the midst of change. Your approval rating moves with every decision. The 2031 election is scored from it.

- goal: Choosing a shared direction
  measure: drift <= 1
  why: You need to get everyone to move in unison. 
  
- goal: Automation delivers
  measure: indicator pub_ai >= 30
  why: The new budget already assumes AI carries 30% of public transactions. If it does not, the additional cuts are yours to announce.

## SAK

- goal: Rights in law
  measure: flag GUARANTEE in yes
  why: You have to get a job-security law signed to protect your members for the next decade. 

- goal: The AI gains are shared
  measure: flag LEVY in yes
  why: A levy on automation savings funds retraining. Without it, common people get nothing from the AI profits.

- goal: The young get in
  measure: indicator youth_u <= 10
  why: If youth unemployment is still high in 2033, the next generation organizes against you, not with you.

## COUNTY

- goal: Queues under control
  measure: indicator care_gap <= 14
  why: By 2033, Finland will have 100,000 more people aged 75 or over while the healthcare sector will have 60,000 fewer workers. 

- goal: Social contract on care
  measure: indicator trust >= 55
  why: Care is not high tech, it's hi-touch. Can you identify correctly where the AI can be deployed?

- goal: Services actually automate
  measure: indicator pub_ai >= 30
  why: The savings you promised exist only if AI really carries the work.

## TI

- goal: Foreign investment keeps coming
  measure: index PRO >= 7
  why: Your members build where returns are predictable. Political drift scares capital away.

- goal: The infrastructure grows
  measure: indicator compute_mw >= 550
  why: Datacenters and grid connections take years to build.

- goal: No free lunches
  measure: flag LEVY in no
  why: Your member corporations cannot feed the crowds if they themselves don't participate in creating value

## HVK

- goal: Security built in early
  measure: flag SECURE_ARCH in yes
  why: Move your organisation from maintaining security to creating resilience culture.

- goal: Preparedness holds
  measure: index RES >= 6.5
  why: Uninterrupted core services through the decade.

- goal: The crisis is a drill
  measure: flag CRISIS_LEG in managed
  why: Country learns from crises.

## AALTO

- goal: Best students stay in Finland
  measure: persona EETU >= 4
  why: If graduates don't find real work here, the country does not get the benefits from education investments.

- goal: A role for research
  measure: flag TALENT_PIPE in strong
  why: When machines answer most questions, the university must find the ones only research can still own. A country that stops researching can only rent its understanding.

- goal: Universities behind competitiveness
  measure: index PRO >= 6.5
  why: Skills are the one input to competitiveness the country makes itself. If prosperity stalls, education gets the bill; if it grows, your pipeline is part of the reason.

## STARTUP

- goal: The round closes
  measure: index PRO >= 6
  why: Your aim is to grow your business sustainably. Series C should happen before the end of 2033.

- goal: Euro stack gives competitive advantage
  measure: flag STACK in euro,us
  why: You want to use the AI local stack, but can you?

- goal: Never the hostage
  measure: drift <= 1
  why: Repeated deadlock freezes your biggest customer and politicizes your market.
