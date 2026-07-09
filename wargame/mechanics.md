# Mechanics — collective resolution

## 1. Actors and pivotality

Seven actors play every phase. Each phase designates **three pivotal actors** whose choice combination selects the outcome. The other four are **modifier actors**: their choices attach written modifier hooks, shift indices, and can set/deny flags — but cannot change which outcome fires. Pivotality rotates so every actor is pivotal at least once:

| Phase | Pivotal trio | Modifier actors |
|---|---|---|
| P1 (2027–28, the megaproject) | PM, AKAVA, COUNTY | TI, AALTO, STARTUP, HVK |
| P2 (2029, sovereignty or capability) | PM, COUNTY, STARTUP | AKAVA, TI, AALTO, HVK |
| P3 (2031, the dividend) | PM, AKAVA, TI | COUNTY, AALTO, STARTUP, HVK |

PM is pivotal in all three phases (government sits at every table) but **never decisive alone** — see resolution rule.

## 2. Action tags

Every action in `actions.md` carries exactly one tag:

- **A** — feeds the phase's Grand Project A
- **B** — feeds the phase's Grand Project B
- **H** — hedge: delay, split, or refuse the fork

Each pivotal actor's menu contains exactly one A, one B, one H action, so the pivotal combination space is always the full 3×3×3 = **27 combos**, each explicitly mapped in `combos.md`.

## 3. Resolution rule (identical all phases)

Count the tags of the three pivotal actors:

| Pivotal tag count | Outcome |
|---|---|
| 3×A | **O1** — Project A, decisive |
| 2×A + 1×B | **O2** — Project A, contested (the B-actor's resistance is written into the outcome) |
| 2×A + 1×H | **O2** — Project A, contested (thin mandate variant) |
| 1×A + 1×B + 1×H | **O3** — Deadlock / drift |
| 2×H + any | **O3** — Deadlock / drift (leaning toward the non-H tag; noted in combos.md) |
| 3×H | **O3** — Deadlock / drift (deep variant) |
| 2×B + 1×A | **O4** — Project B, contested |
| 2×B + 1×H | **O4** — Project B, contested (thin mandate variant) |
| 3×B | **O5** — Project B, decisive |

**No-owner guarantee:** every outcome requires at least two aligned pivotal actors. A lone actor — including the PM — can at most force a contested variant or a deadlock, never an outcome.

**Pair-conflict annotations:** specific combos carry extra narrative consequences (e.g., P2: PM chooses alliance while STARTUP migrates European → "split state" text). These are listed per-row in `combos.md` and rendered inside the outcome.

## 4. Modifier application (order matters)

1. Resolve outcome from pivotal trio.
2. Apply each modifier actor's **index effects** from `actions.md`. **Data deltas** (`data:`) apply from every actor, pivotal included — the outcome sets the big picture, the individual choices leave fingerprints (see `causal-model.md`).
3. Attach each modifier actor's **modifier hook** — a short paragraph inside the outcome file keyed to that action ID.
4. Apply **flag effects**; where a modifier flag contradicts the outcome (e.g., AKAVA strikes against a project that just won), the flag stands — it becomes ammunition for the next phase's entry variant.

## 5. Indices (0–10, start at 5.0)

- **RES — Resilience:** days Finland can run core services without frontier access.
- **LEG — Legitimacy:** consent, trust, labour peace around public AI.
- **PRO — Prosperity:** AI-driven growth, investment, talent retention.

Index effects are written as deltas in action and outcome files (e.g., `RES +1.0`). The trilemma is deliberate: no path maximizes all three.

## 6. Flags (state carried between phases)

Set by outcomes and some actions; tested by `requires:` fields on later actions and by entry variants of later tensions.

| Flag | Values | Set in | Tested in |
|---|---|---|---|
| MEGAPROJECT | full / negotiated / pilot | P1 | P2 variants, endstate |
| GUARANTEE | yes / no | P1 | P2 variants (enforceability), P3, endstate |
| SECURE_ARCH | yes / no | P1 (HVK action) | P2 variants, CRISIS_LEG rule, endstate |
| TALENT_PIPE | strong / weak | P1/P2 (AALTO action) | endstate |
| STRIKE_CARD | live / spent / unused | P1 (AKAVA), spent in P3 | P3 AKAVA menu (`requires:`), variants |
| STACK | euro / us / split | P2 | P3 variants, endstate matrix |
| CRISIS_LEG | managed / damaged | P2 (rule: SECURE_ARCH=yes AND outcome ≠ O3) | P3 variants, endstate |
| COMPACT | strong / thin / none | P3 (dividend class) | endstate matrix |
| LEVY | yes / no | P3 | endstate, persona EETU |

POLL (government approval, 0–100, starts 50) is a tracker, not a flag: actions
and outcomes carry `POLL ±n` in their effects; the 2031 election is scored from
it at the endstate.

## 7. Personas and data (rendered, never resolved)

After each outcome: render the five persona implications from the outcome file, then the `## Data` YAML block into the branching indicator chart (`data-indicators.md`). Facilitator reads persona vignettes aloud — they are the emotional cost/benefit display of the collective decision.

## 8. Control team

Plays Washington, Brussels, Moscow, capital markets and the media weather. Delivers the scheduled injects in each `tension.md` regardless of player action; may choose *tone*, not *timing*. The control team also arbitrates the two ambiguities the tables leave open (deadlock leanings, pair-conflict tone) — nothing else.

## §9 Collisions (clashes.md)

Seven standing confrontations, two per seat, fire every phase after decisions
lock. Rule: each action's tag is its posture; A (force) beats B (negotiate),
B beats H (wait), H beats A. Same posture = stand-off. The loser pays the
price listed in clashes.md, denominated in that seat's own goal currency
(PM poll, AKAVA youth_u, COUNTY trust, HVK RES, TI/STARTUP PRO, AALTO sov_share).
Balanced by construction: every seat has exactly two edges and one loss
currency. Edit clashes.md to retune; delete it to switch the mechanism off.
