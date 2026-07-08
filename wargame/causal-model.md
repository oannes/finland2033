# Causal model — who moves what, and when it lands

The engine's causal chain, per decision:

```
7 secret choices
  → the pivotal trio's combination selects the OUTCOME        (the big picture)
  → every actor's choice nudges POLL, the data, and flags     (the fingerprints)
  → modifier actors additionally shift indices + write hooks  (the ripples)
  → flags carry forward: they gate menus, select variants,
    and compose the endstate                                  (the memory)
```

Two timing classes matter: **immediate** effects land in the same phase's data
node; **delayed** effects are carried as flags and land one or two phases later
(education, securitisation, guarantees). The delay is the lesson.

## The seats: influence channel × signature trade-off

| Seat | Pivotal in | Influence channel | Signature trade-off | Lands |
|---|---|---|---|---|
| **PM** | D1, D2, D3 (never decisive alone) | Financial leverage (budget, statute) + political capital (POLL) | Can spend approval to force speed — or protect it and slow down. Re-election is scored in 2031. | Immediate |
| **SAK** | D1, D3 | Consent — or stalemate. A refusal from labour can deadlock the country (the O3 rows). | The strike ballot is credible exactly once per parliament; spending it is irreversible. | Immediate + carried (STRIKE_CARD, GUARANTEE) |
| **COUNTY** | D1, D2 | Execution: what is signed becomes real — or doesn't — on the service floor. County demand is the anchor order. | Dignity vs. efficiency: every rollout can be run for throughput (pub_ai up, trust down) or for the person in the queue (trust up, slower). Sharpest in D1. | Immediate (trust/pub_ai/care_gap) |
| **TI** | D3 | The order book (members' capital) + the public verdict (one press conference = industry's position). | Export access vs. securitisation: exporters need the lane; where TI leans geopolitically, the capability argument gains a constituency. In structural conflict with HVK in D2. | Immediate |
| **AALTO** | — (modifier all three) | Education and certification. Nothing the rector decides lands before ~2030; nothing lands harder by 2033. | Spearhead (staffs the stack, lifts Eetu) vs. broad retraining (bridges the displaced, lifts youth employment) — one budget, never both. | **Delayed**: TALENT_PIPE / RETRAIN flags pay out in D2, D3 and the endstate, not in D1's data. |
| **HVK** | — (modifier all three) | Requirements power: clauses written into tenders before publication bind for a decade. | Securitisation vs. resilience: emergency framing buys security fast and spends trust slowly (SECURITIZED bills the endstate); societally sound preparedness (exercises, exit clauses) pays out at the Gates. | **Delayed**: SECURE_ARCH decides the Second Gate; SECURITIZED bills 2033. |
| **STARTUP** | D2 | Mobility and jobs: can build here or leave, and everyone knows it — the location choice is the sector's forecast, the hiring plan is measurable in Eetu's cohort. | Frontier capability vs. the biobank moat (jurisdiction). The exit converts jobs into someone else's. | Immediate (signal) + jobs land next node |

## What the engine does with this (implementation map)

- **Outcome selection**: pivotal trio only (`mechanics.md` §3). SAK's stalemate
  power and PM's never-decisive rule are structural here.
- **POLL**: every actor's action can carry `POLL ±n`; the PM's options carry the
  largest swings (spending approval for speed is the PM's core trade).
- **Data**: every actor's `data:` deltas apply to the phase node — pivotal
  included. COUNTY's dignity/efficiency dial is expressed here (trust vs.
  pub_ai), STARTUP's job creation in youth_u.
- **Indices (RES/LEG/PRO)**: outcome effects + modifier actors' effects. The
  pivotal trio's index contribution is already inside the outcome.
- **Delays**: AALTO sets `TALENT_PIPE` (spearhead) or `RETRAIN=broad`; both are
  invisible in D1 data and pay out in D2/D3 nodes and the endstate drift. HVK's
  `SECURE_ARCH` decides the Second Gate's severity; `SECURITIZED=yes` (D3
  emergency framing) costs trust in the endstate.
- **Endstate**: composed from STACK × D3 class, then modulated by the carried
  flags (see `endstates.md` final data block).

## Editing guide

- Change an actor's immediate footprint → `data:`/`effects:`/`POLL` lines in `phases/*/actions.md`.
- Change a delayed payoff → the flag on the action + the `adjustments:` blocks in later outcomes + the endstate drift list.
- Change who can deadlock or decide → the pivotal table in `mechanics.md` §1.
