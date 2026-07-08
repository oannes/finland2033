# AINO — implication meter: youth labour market

**ID:** `AINO` · **Pinned indicators:** `youth_u`, `care_gap` · **Never played.**

## Baseline (2026)
Aino Korhonen, 24, Tampere. Social services student, thesis on algorithmic casework. Graduates spring 2027 into whatever labour market the players' Finland has. Her grandmother was a practical nurse; the home-care district in Hervanta is eighty nurses short.

## What she measures
Whether the split labour market (TR-6 landing on TR-4) is managed or abandoned: do the eroding cognitive entry rungs and the starving care sector ever get bridged — and who pays for the bridge.

## State ladder (rendered per outcome; outcome files pick the rung and localize it)

| Rung | State | Typical rendering |
|---|---|---|
| A5 | Bridged | Care-AI supervisor via funded osaamistakuu; leads a 3-human, 40-agent home-care team; union member; angry only on Tuesdays |
| A4 | Climbing | Paid apprenticeship in care-tech; income low, direction real |
| A3 | Churning | Platform gigs + benefit spells processed by the systems that displaced her; CV gap growing |
| A2 | Radicalizing | Third rejection year; joins whoever names the culprit best; stops answering union surveys, starts answering others |
| A1 | Exit | Emigrates (Oslo care-tech or Berlin gig economy) or exits labour force; Finland keeps her student debt statistics |

## Movement rules (for software)
- P1: O1/O2 (Kajaani) → hold A3 (construction boom doesn't hire her); O4/O5 (Hamina) → A3 with resentment line; O3 → A2 risk flagged.
- P2: CRISIS_LEG=damaged → one rung down (the Kela backlog is her benefit spell).
- P3: COMPACT=strong & LEVY=yes → A5. COMPACT=thin → A4. Efficiency outcomes (P3-O4/O5) → A2. Freeze (P3-O3) → A2–A1.
- youth_u in the data blocks should always be consistent with her rung (±1 pp).
