# FRAMEWORK — how the game is structured, and how to change it

The design rule: **each actor plays their own game.** A player needs three
things to decide — their goals, their desk brief, and their three options.
Everything else (what the whole of society is doing) is shown, not required:
it lives in the sidebar and in collapsible folds.

## What a player sees, and which file controls it

| Screen element | Source file | Contract |
|---|---|---|
| Goals ("this is what you answer for") | `goals.md` | 2–3 goals per actor. `measure:` is machine-checked after every round; `why:` is the causal explanation. |
| Desk brief (per phase) | `phases/*/briefs.md` | The ONLY text a player must read before deciding. One `## ACTOR` section each; 2–4 bullets. |
| Carried-in consequences | `phases/*/tension.md` § Entry variants | Auto-selected by flags. Shows what earlier rounds left this country. |
| The three options | `phases/*/actions.md` | Title, summary, visible costs. `requires:` gates what exists to choose. |
| Sidebar: goal status + why | computed from `goals.md` | Re-scored after every reveal. |
| Sidebar: the five Finns | `personas/*.md` + outcome files | Status word from the ladder; the "why" is the latest outcome vignette. |
| Sidebar: indices, charts, flags | `data-indicators.md` + outcome `## Data` blocks | The broader society, ambient. Never required for a decision. |
| Full picture (collapsed) | `phases/*/tension.md` | Injects + fork essays. Facilitator always sees it; players can open it. |
| Reveal narrative | `phases/*/outcomes/O*.md` + `combos.md` row note | Shared beat after simultaneous decisions. |

## The loop

1. **Brief.** Player reads their desk brief (≤ 4 bullets) and their goal chips.
2. **Decide.** Player picks one of three actions. Secretly. Simultaneously.
3. **Resolve.** The three pivotal actors' tags select the outcome from the
   27-row table (`mechanics.md` §3). Modifier actors shift indices and flags.
4. **Reveal.** Shared narrative; then the sidebar re-scores goals, moves the
   five Finns, and forks the charts. This is where the learning happens:
   you see what your move, stacked with six others, actually did.
5. Flags carry forward. Next phase's briefs, variants and menus read them.

## Writing rules for all content

- One fact per bullet. One cause per sentence where possible.
- Say what causes what: "X happened, so Y is now true, and you must decide by Z."
- Name the deadline, the price, or the owner — otherwise the claim is decoration.
- Frame from the actor's perspective: what does this fact do to *their* goals?
- No buzzwords. If a term needs a glossary, replace it.

## How to make common changes

- **Reword what a player reads before deciding** → edit their section in `phases/*/briefs.md`.
- **Change what counts as success for an actor** → edit their `measure:`/`why:` in `goals.md`.
- **Change an action or its cost** → `phases/*/actions.md` (keep the `tag:`; the resolution table depends on it).
- **Change what an outcome does to people/numbers** → `phases/*/outcomes/O*.md` (`## Persona implications`, `## Data`).
- **Change who is briefed on a shared inject** (facilitator/full-picture layer) → `relevance.md`.
- **Change the resolution logic itself** → `mechanics.md` + `combos.md` (and mirror in `site/src/game/engine.ts` if you change the *rules*, not the values).

Everything reloads on browser refresh while `npm run dev` runs.
