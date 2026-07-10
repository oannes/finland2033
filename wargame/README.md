# AI in Finland 2033 — War Game

Content repository for the decision-making war game played with Finnish key decision-makers.
Every file is a content unit the game software/website renders directly. IDs are stable; do not rename without updating cross-references.

## Core idea

Most AI development is **exogenous** to Finnish actors. The game therefore never asks "how should AI develop?" It asks: **at three inflection points where a tension breaks, which grand project does Finland collectively back — and what happens to real people and real numbers as a result?**

No actor owns the system. Each phase is resolved by the **combination** of actor choices (see `mechanics.md`). Personas are never played — they are **implication meters**: the game shows players what their combined decision did to Aino, Jarkko, Leila, Tuomas and Pentti, and to six key data indicators.

## Folder map

```
wargame/
├── README.md                 ← this file
├── mechanics.md              ← resolution algorithm, tags, indices, flags
├── trends.md                 ← the eight trend cards (background, non-decidable)
├── data-indicators.md        ← six key indicators, 2026 baselines, viz notes
├── endstates.md              ← how 2033 endstates compose from flags
├── actors/                   ← 7 player roles (Finland-specific)
│   ├── pm.md, aalto.md, startup.md, sak.md, hvk.md, county.md, ti.md
├── personas/                 ← 5 implication meters (never played)
│   ├── aino.md, jarkko.md, leila.md, tuomas.md, pentti.md
└── phases/
    ├── phase-1-compute-fork/   (2028)
    ├── phase-2-access-gate/    (2030)
    └── phase-3-compact/        (2031–32)
        ├── tension.md          ← inflection point + grand projects on the table
        ├── actions.md          ← 3 options per actor, tagged A / B / H
        ├── combos.md           ← ALL 27 pivotal combinations → outcome mapping
        └── outcomes/
            ├── O1.md … O5.md   ← narrative, data block, persona implications,
                                   modifier hooks for non-pivotal actions
```

## Play flow (one workshop day)

1. **Briefing.** Players read their actor file + `trends.md`. Trends are not debatable; they are the weather.
2. **Phase round (×3).** Facilitator presents `tension.md` (with entry variant matching current flags). Each actor secretly picks one action from `actions.md`. Software resolves via `combos.md`: pivotal trio selects the outcome O1–O5; non-pivotal choices attach their modifier hooks and index effects.
3. **Reveal.** Software renders the outcome file: narrative, updated data chart (see `data-indicators.md`), persona vignettes, new flags.
4. **Endstate.** After Phase 3, `endstates.md` composes the 2033 debrief from accumulated flags + indices + final persona readings.

## ID conventions

- Actors: `PM, AALTO, STARTUP, AKAVA, HVK, COUNTY, TI`
- Actions: `P{phase}-{ACTOR}-{A|B|H}` (A/B = the phase's rival grand projects, H = hedge)
- Outcomes: `P{phase}-O{1..5}`
- Flags: UPPER_SNAKE, set in outcome files, tested in later phases (`requires:` fields)
- Data blocks: fenced ```yaml blocks under `## Data` in each outcome file — parse these for charts.

## Design principles (bind all future content)

1. **No system owner.** No single actor's action may determine an outcome. Resolution is always combinatorial.
2. **Exogenous stays exogenous.** Control team injects (US, EU, Russia, capital markets) arrive on schedule regardless of player brilliance. Players position; they do not steer the world.
3. **Grand projects, not preferences.** Every phase's A and B are concrete, fundable, institutionally Finnish projects with named owners and price tags — not attitudes.
4. **Personas are consequences.** Persona text may never influence resolution; it renders after resolution.
5. **Data moves visibly.** Every outcome changes the six indicators; the chart is the scoreboard players remember.
