# WEBSITE_AGENT.md — build instructions for the agent implementing the war-game website

You are building the software that runs this game for a facilitated workshop (7 player teams + 1 control team + 1 facilitator screen). Every piece of content lives in this folder's MD files; **do not invent content — parse and render it.** Where a file says "render per row/flag," that is a conditional include, not a writing prompt.

## 1. Content model (what to parse from where)

| Entity | Source | Parse notes |
|---|---|---|
| Game rules & resolution | `mechanics.md` | §3 table is the resolution function; implement exactly. Pivotal trios per phase in §1 table. |
| Trend cards | `trends.md` | 8 cards, one per `## TR-n` heading. Show at briefing + persistent sidebar. |
| Indicators & baseline | `data-indicators.md` | Table of 6 indicators + baseline YAML block. |
| Actors | `actors/*.md` | One briefing page per actor; private to that team (objectives contain hidden agendas). |
| Personas | `personas/*.md` | State ladder table + movement rules → implement as pure functions of flags/outcomes. Persona cards are PUBLIC after each reveal. |
| Phase tension | `phases/*/tension.md` | Sections: fixed injects (timed reveals), entry variants (conditional on flags — show only matching), the fork (grand projects), pivotal trio. |
| Actions | `phases/*/actions.md` | Grammar below. Render each actor's menu privately; enforce `requires:`. |
| Resolution table | `phases/*/combos.md` | The 27-row table is the authority. Row notes are content: render inside the outcome screen. Flag-default sections apply after row overrides. |
| Outcomes | `phases/*/outcomes/O*.md` | Structure below. |
| Endstates | `endstates.md` | Compose per matrix; epilogue cards are control-team buttons. |

## 2. Action block grammar (`actions.md`)

Each action is a `### {ID} — "{Title}"` heading followed by a dash-list of fields:
- `tag:` A | B | H (resolution input)
- `summary:` player-facing description
- `effects:` comma-separated index deltas, may carry conditions in prose parentheses — implement conditions as flag checks
- `data:` indicator deltas (add to outcome's data block at reveal)
- `flags:` flag assignments or contribution notes ("contributes"/"enables" = apply only per combos.md flag rules)
- `hook:` key of the modifier-hook paragraph in outcome files
- `requires:` flag precondition; if unmet, hide the action (P2-HVK-A vs A2 shows the replacement pattern)

## 3. Outcome file structure (`outcomes/O*.md`)

1. Title line: `# {ID} — {Name} ("{Epigraph}")`
2. **Fires on** line: combo rows + index effects (apply these, then action effects)
3. `## What happens` — main narrative. May contain per-row/per-flag conditionals in prose ("render per row") — implement via the combo row note and flags.
4. `## Flags` — assignments (combos.md row notes override).
5. `## Data` — YAML block. Schema: indicator values (absolute numbers), `inherit`/`inherit±n` (carry from previous node), and `adjustments:` list of `{if: <flag or combo_row condition>, <indicator>: <delta>, note?: <render line>}`. Final node data = base ± action data-deltas ± matching adjustments.
6. `## Persona implications` — 5 bullets keyed **PERSONA (rung)**. Cross-check rung against persona movement rules; persona file wins on conflict.
7. `## Modifier hooks` — bullets keyed `ACTOR-TAG`. Render ONLY the 4 matching the modifier actors' chosen actions.

## 4. Game flow state machine

```
LOBBY → BRIEFING (actor pages + trends + baseline chart)
→ P1.TENSION (injects revealed in order by facilitator)
→ P1.DECIDE (each team picks secretly; enforce requires; countdown timer)
→ P1.RESOLVE (lookup combos row → outcome; apply flags/indices/data)
→ P1.REVEAL (outcome narrative → persona cards → updated branching chart → index bars)
→ P2.TENSION (render entry variants matching flags) → … → P3.REVEAL
→ ENDSTATE (archetype from matrix + composed data + final personas + debrief question + ghost chart)
→ EPILOGUE (control-team cards, optional)
```

Persist full decision log; the P3 "inquiry findings" inject (tension.md Inject 1) is **generated from the log**: show a timeline of what each team chose in P1–P2 — this is a deliberate mirror mechanic, build it.

## 5. Screens

- **Team screen (per actor):** private brief, private menu, chosen-action lock-in, public reveals.
- **Facilitator screen:** inject sequencer, timer, resolution preview (see the outcome before players do), CRISIS_LEG arbitration toggle (mechanics §8 — the two named ambiguities only), epilogue card buttons.
- **Projector screen (shared):** tension text, reveal narrative, persona cards (one at a time, they are the emotional beat — do not dump all five at once), the branching data chart, index bars (RES/LEG/PRO).

## 6. The branching data chart (the signature visual)

- 6 small multiples (one per indicator, `data-indicators.md` order), x-axis 2026→2033, nodes: BASELINE → P1-Ox → P2-Ox → P3-Ox → ENDSTATE.
- Played path: solid, colored. Unplayed outcome nodes at each phase: grey ghosts at their base values (compute without modifiers). This "roads not taken" view is required — it is referenced in `endstates.md` E8 debrief.
- Persona pins: small avatar markers on pinned indicators (mapping in `data-indicators.md`).
- `inherit` resolution: walk the played path backward to the last absolute value, apply ±n.

## 7. Rules you must not soften

1. Resolution is table lookup, never facilitator override (except the two named ambiguities).
2. `requires:` gates are hard — a missing reserve cannot be activated, and the UI should show the greyed-out action with its requirement (the absence is content).
3. Personas render AFTER resolution, never before decisions (mechanics §7 — they must not become decision aids).
4. Control-team injects fire on schedule regardless of play (README principle 2).
5. Modifier hooks: render exactly the matching 4; no more.
6. Do not display other teams' menus or choices before lock-in; simultaneity is the point.

## 8. Nice-to-have (only after core works)

- Finnish/English toggle (content currently EN; keep keys language-neutral).
- Post-game export: one-page PDF per playthrough — path taken, endstate, final personas, the debrief question. This is the artifact ministers keep.
- A "journalist mode" replay: the playthrough rendered as a 2026–2033 news timeline (headlines can be lifted from outcome narratives — e.g. HS two-speed chart, the FT profile, Aino's leaving interview).
