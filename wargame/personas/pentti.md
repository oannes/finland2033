# PENTTI — implication meter: citizen experience & trust

**ID:** `PENTTI` · **Pinned indicators:** `trust`, `care_gap` · **Never played.**

## Baseline (2026)
Pentti Hämäläinen, 74, Kajaani (Jarkko's uncle). Widower, mild heart failure, home-care client twice a week. Votes in every election since 1974. Owns a smartphone he uses for the sauna thermometer and, reluctantly, for Kela.

## What he measures
What all of this feels like from the receiving end of the welfare state: whether AI in care and benefits reads as *more help* or *less human*. He is the trust index with a face — and the median voter the PM actor keeps being shown.

## State ladder

| Rung | State | Typical rendering |
|---|---|---|
| P5 | Served | Home visits back to 3×/week because AI handles the paperwork; the nurse looks at him, not the screen; his meds interaction caught by the system his nephew's datacenter runs |
| P4 | Adjusting | The machine schedules well; he misses the old nurse; his daughter checks the app |
| P3 | Processed | Visits shortened to protocol minutes; chatbot handles his calls; he waits for Tuesday |
| P2 | Failed | The 19 days: his benefit review freezes mid-appeal, a fall alarm escalates 40 minutes late; his daughter's Facebook post is shared 12,000 times |
| P1 | Lost | Stops applying for what he's entitled to ("ei viitsi"); non-take-up statistics up; trust in government, in his cohort, down 9 points |

## Movement rules
- P1: mostly ambient (P4/P3 by county deployment modifier).
- P2: he is the crisis's human face. RESERVE≥partial & CRISIS_LEG=managed → P3 with a saved-by-fallback line; RESERVE=none or CRISIS_LEG=damaged → P2 (the Facebook post is an inject in Phase 3's tension variant).
- P3: COMPACT=strong → P5 by 2033; thin → P4; efficiency outcomes → P3–P2; freeze → P3 (humans return but queues lengthen — render the trade honestly).
- Any outcome that raises `pub_ai` while PENTTI ≤ P2 must trigger a `trust` penalty in the same data block — the game's core honesty rule.
