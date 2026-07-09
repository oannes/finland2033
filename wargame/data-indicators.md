# Key data indicators

Six indicators drive the game's data visualization. Each outcome file carries a `## Data` YAML block with the indicator values *at that node*. The website renders them as a **branching time series**: baseline 2026 → P1 outcome (2028) → P2 outcome (2030) → P3 outcome (2032) → endstate (2033). Players literally watch the lines fork with their decisions.

Values for 2028–2033 are scenario constructions anchored to the sourced 2026 baselines; treat deltas, not absolute levels, as the message.

## Indicators

| ID | Indicator | Unit | Baseline 2026 | Anchor source |
|---|---|---|---|---|
| `youth_u` | Unemployment, under-30s in cognitive/office occupations | % | 11.0 | Extrapolated from Stanford −16% entry-level effect landing on Finnish graduate labour market; Statistics Finland youth unemployment |
| `care_gap` | Unfilled care & ECEC positions | thousands | 16 | Keva/wellbeing county vacancy reporting; tech sector alone needs 130k hires by 2030 |
| `pub_ai` | Public-service transactions with AI in the loop | % | 12 | Kela chatbots, county pilots, MoF human-verification regime |
| `sov_share` | Public-sector AI inference on European/national stack | % | 15 | LUMI/CSC usage vs. US-cloud procurement share |
| `trust` | Trust in national government | % | 58 | OECD Trust Survey, Finland historically top-3 |
| `compute_mw` | AI-grade datacenter capacity operating in Finland | MW | 350 | Google Hamina + Microsoft Espoo region (from 2027) + LUMI/LUMI-AI |
| `cap_gap` | EU frontier capability gap (exogenous) | months | 6 | Public benchmark spread: best EU models vs. best US/Chinese internal models |
| `intel_cost` | Cost of machine cognition (exogenous) | index, 2026=100 | 100 | Price of a fixed bundle of knowledge work bought from a machine; blended API price benchmarks |
| `books` | Budget headroom | index | 40 | Redesign v2 deal metric — fiscal room left in the framework before forced cuts |
| `share` | Workers' share | index | 50 | Redesign v2 deal metric — how much of automation's gains reach ordinary people |
| `bedside` | Time at the bedside | min/day | 40 | Redesign v2 deal metric — minutes of human care per patient day |
| `pull` | Investment pull | index | 55 | Redesign v2 deal metric — whether capital still lands in Finland |
| `days` | Days Finland runs alone | days | 7 | Redesign v2 deal metric — how long public systems survive an access cut-off |
| `ladder` | A first rung | % | 58 | Redesign v2 deal metric — graduates in matching work within two years |
| `stay` | Winners that stay | index | 50 | Redesign v2 deal metric — whether exceptional companies remain Finnish |

## Reading guide for the chart

chart: pub_ai, trust, youth_u, care_gap, sov_share, compute_mw, cap_gap, intel_cost, books, share, bedside, pull, days, ladder, stay

- `youth_u` and `care_gap` moving **together upward** = the T3 scissors (split labour market) is unmanaged.
- `pub_ai` up while `trust` down = deployment outrunning legitimacy (T2 loading); the October 2030 inject punishes exactly this gap.
- `sov_share` is the sovereignty dial: <30% at Phase 2 makes the access suspension existential; >60% by 2032 means the migration was real, not rhetorical.
- `compute_mw` is the physical substrate: Kajaani-path outcomes grow it publicly, Hamina-path grows it privately, drift outcomes let it stagnate, with 2030 consequences either way.

## Baseline block (render as t=2026 for every playthrough)

```yaml
node: BASELINE
year: 2026
youth_u: 11.0
care_gap: 16
pub_ai: 12
sov_share: 15
trust: 58
compute_mw: 350
cap_gap: 6
intel_cost: 100
books: 40
share: 50
bedside: 40
pull: 55
days: 7
ladder: 58
stay: 50
```

## Exogenous schedule (the world's line — grows regardless of play)

Decisions move Finland's position relative to the gap; they never move the gap.
This is exogeneity made visible: the one line on the chart no combination of
choices can bend.

```yaml
cap_gap: { 2028: 12, 2029: 20, 2031: 28, 2033: 34 }
intel_cost: { 2028: 35, 2029: 18, 2031: 6, 2033: 2 }
```

## Historical series (the grey run-up 2018 → 2026 in every chart)

Plausible history so players see each line arriving from somewhere, not starting
at an arbitrary zero. Sources of shape: COVID spike and rally (2020), post-COVID
care exodus (2022→), cloud migration eroding sovereignty (2018→), Hamina + LUMI
build-out (compute).

```yaml
years: [2018, 2020, 2022, 2024, 2026]
youth_u: [8.5, 11.6, 8.8, 9.7, 11.0]
care_gap: [6, 8, 11, 13, 16]
pub_ai: [1, 3, 5, 8, 12]
sov_share: [34, 28, 22, 18, 15]
trust: [64, 71, 65, 60, 58]
compute_mw: [120, 180, 240, 300, 350]
cap_gap: [0, 0, 1, 3, 6]
intel_cost: [12000, 8000, 2500, 400, 100]
books: [70, 58, 50, 44, 40]
share: [58, 55, 53, 51, 50]
bedside: [52, 48, 45, 42, 40]
pull: [60, 58, 57, 56, 55]
days: [4, 5, 5, 6, 7]
ladder: [70, 66, 63, 60, 58]
stay: [62, 58, 55, 52, 50]
```

## Plain-language definitions (shown to players in the sidebar)

- youth_u: Of Finns under 30 who trained for office and knowledge work, the share without a job. Rises when AI absorbs entry-level tasks faster than new work appears.
- care_gap: How many thousand care and early-education jobs stand unfilled. Rises as workers retire and too few replace them.
- pub_ai: The share of public-service transactions (benefits, permits, referrals) where AI does part of the work. Rises with deployment, with or without consent.
- sov_share: The share of public-sector AI computing that runs on Finnish or European machines. When it is low, daily services depend on foreign permission.
- trust: The share of Finns who say they trust the national government. Falls when services fail, or when change feels imposed.
- compute_mw: AI-grade datacenter capacity operating in Finland, in megawatts. The physical floor under every other number.
- cap_gap: How many months the best European models trail the best American and Chinese ones. This line grows no matter what Finland decides. Your choices change Finland's position relative to the gap, never the gap itself.
- intel_cost: What a fixed bundle of knowledge work costs to buy from a machine (2026 = 100). It collapses every year, everywhere, whatever Finland does. Cheap cognition is the tide under every decision at this table. The question is never the price, it is who is standing where when it falls.
- books: How much room the government's budget framework has left before forced cuts. Every promise spends it; only real savings refill it.
- share: How much of the machine's money reaches ordinary people, as wages, retraining and security. The employment side of the deal.
- bedside: How many minutes of human care a patient gets in a day. Automation can free these minutes for people, or harvest them as savings.
- pull: Whether capital still wants to land in Finland. Falls on unpredictability; rises on credible rules.
- days: How many days Finland's public systems keep running if foreign AI access is cut. The self-sufficiency clock; it decides how hard the next crisis hits.
- ladder: The share of graduates who find work matching their education within two years. The promise made to the young, measured.
- stay: Whether the exceptional companies stay Finnish — headquarters, hires, taxes. Falls with every exit.

## Visualization notes

- One small-multiple line chart per indicator; highlight the played path, ghost the 14 unplayed outcome nodes in grey so players see the roads not taken.
- Persona cards can pin to indicators: AINO↔`youth_u`+`care_gap`, LEILA↔`pub_ai`+`trust`, TUOMAS↔`sov_share`(+PRO), JARKKO↔`compute_mw`, PENTTI↔`trust`+`care_gap`.
- Endstate screen: spider chart of RES/LEG/PRO + the six indicator sparklines 2026→2033.
