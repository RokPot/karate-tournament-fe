# Brackets

Standalone single-elimination visualization for this app, written so the **core can later become a public npm package** (any frontend, optionally without React).

This README is the working context. Do the numbered extraction steps in order; do not skip to a published package until the core has zero app/theme/React imports.

## What it does today

- Builds a single-elimination tree from a participant list (`T`): full by default, or **stopped early** with `stopAt` (see [Stop at a round](#stop-at-a-round)).
- Pads non-powers of two with **byes** (standard seed pairing), size **2–256**.
- Optional **third-place** match (two semi losers), under 1st place.
- Optional **score row** next to each match result: X blank cells plus a Sum cell (see [Score row](#score-row)).
- Renders left-to-right cards + SVG elbow connectors, with **Round 1, Round 2, …** above each column.
- Hosts pass **colors** (`card`, `border`, `line`, `shadow`, `text`, `highlight`, `score`, `scoreText`); the canvas is transparent.
- Each card is **name on the left, colored score well on the right**. Scores live on `match.data.score` / `score2` (empty well shows —).
- Optional **window**: `{ width, height }` clips the canvas, xy-scroll on overflow, **grab/drag** to pan.

Visualization only: it does not pick winners or call the API. The tree JSON is meant to be saved/loaded later.

## Folder

```
src/components/brackets/
  core/                                 copy this folder to the BE
    types.ts
    generateSingleElimination.ts        tree builder (pure TS)
    generateSingleElimination.test.ts
    computeSingleEliminationLayout.ts   positions + SVG paths + score cells (pure TS)
    computeSingleEliminationLayout.test.ts
    scores.ts / scores.test.ts          sumScores, resolveSum (pure TS)
    index.ts
  render/                               React + this app's UI — FE only
    BracketView.tsx
    SingleEliminationBracket.tsx
    BracketViewport.tsx / useBracketPan.ts
    MatchCard.tsx / BracketConnectors.tsx / ScoreCell.tsx
  Bracket.stories.tsx
  index.ts
```

**Portable:** copy `core/` as a folder. Same-folder imports only (`./types`); no React, DOM, or `@/` aliases. Call `generateSingleElimination(registrations, (r) => r.id, { includeThirdPlace, stopAt, singleLayerWhenAtMost })` and persist/return the `Bracket<T>` JSON. The BE can ignore layout until it needs pixel positions.

**App-specific (do not copy):** `render/` uses React, `Typography`, Tailwind layout classes. Colors are CSS strings from the host.

## Use in this app

```ts
import {
  BracketView,
  generateSingleElimination,
} from "@/components/brackets";

const bracket = generateSingleElimination(teams, (team) => team.id, {
  includeThirdPlace: true, // default false; ignored if there are not two real semis
});

<BracketView
  bracket={bracket}
  getId={(team) => team.id}
  getLabel={(team) => team.name}
  colors={{
    card: "#F3E6C8",
    border: "#B8963E",
    line: "#9A7B32",
    shadow: "#B8963E",
    text: "#1C1C1E",
    highlight: "#9A7B32",
    score: "#B8963E",
    scoreText: "#FDFCFB",
  }}
  // getRoundLabel={(columnIndex) => `Round ${columnIndex + 1}`}
  // window={{ width: 640, height: 360 }}  // optional clip + pan
/>
```

`T` can be a team, person, or registration. Optional `renderItem` replaces the default label. Optional `getRoundLabel` replaces `Round N`.

Storybook: `yarn storybook` → **Brackets**. **Windowed** is 8 teams in a 640×360 box. **Dark** uses the dark gold palette. **WithScores** fills first-round scores. **QuarterfinalSheet** is the sketch: 8 teams, `stopAt: { fromEnd: 2 }`, 5 blank cells and a Sum cell. **QuarterfinalSheetFilled** fills that row (Sum is computed). **SemifinalStop** stops at the second-to-last round. **SmallFieldSingleLayer** is 5 teams with `singleLayerWhenAtMost: 5`. **ScoresOnLastRoundOnly** / **ScoresOnAllRounds** show 16 teams cut with `fromEnd: 2` and the score row on the last round versus all rounds. Controls: `count`, `includeThirdPlace`, `showScores`, `stopFromEnd` (`0` = full tree), `singleLayerWhenAtMost` (`0` = off), `scoreCount` (`0` = no score row), `scoreOn` (`last`, `all`, `first`, `first and last`), `sumLabel`, `fillScoreRow`, `windowWidth` / `windowHeight` (`0` = no window), plus the color fields.

Tests: `yarn jest src/components/brackets`

## Stop at a round

`generateSingleElimination` takes `stopAt` to stop generating after a given layer. Rounds are counted on the padded bracket size (the same `log2` count the generator already uses).

```ts
type BracketStopAt = { fromEnd: number } | { round: number };

// 8 teams, quarterfinals only (4 games, one layer)
generateSingleElimination(teams, (team) => team.id, { stopAt: { fromEnd: 2 } });
```

| `stopAt` | 8 teams (3 rounds) | 16 teams (4 rounds) |
| --- | --- | --- |
| omitted / `{ fromEnd: 0 }` | full tree | full tree |
| `{ fromEnd: 1 }` | quarterfinals + semifinals | rounds 1–3 |
| `{ fromEnd: 2 }` | quarterfinals only (4 games) | rounds 1–2 |
| `{ round: 0 }` | round 1 only | round 1 only |

- `fromEnd` counts back from the final (`0` = final, `1` = second-to-last, …). `round` is an absolute index (`0` = first round).
- Out-of-range values clamp: a `fromEnd` that would remove every round keeps round 1; a `round` past the final gives the full tree. Negative or non-integer values throw.
- When `stopAt` is set the bracket records `stop: { fromEnd, lastRoundIndex }`. A default bracket has no `stop`.
- **Third place** needs a real final. `includeThirdPlace` is ignored when the final round is cut.
- Later rounds are not built, so the last generated round has no `tbd` slots pointing past it and bye winners are not copied forward.
- `resolveLastRoundIndex(roundCount, stopAt)` is exported if a caller needs the same clamping.

### Single layer for small fields

`singleLayerWhenAtMost` keeps a small field as one layer: when the number of real participants is at most the given value, only round 1 is generated (same as `stopAt: { round: 0 }`).

```ts
// 2–5 teams: one layer (5 teams = 4 first-round games, 3 of them byes). 6+ teams: full tree.
generateSingleElimination(teams, (team) => team.id, { singleLayerWhenAtMost: 5 });
```

- Off by default (option omitted). Must be a non-negative integer; anything else throws.
- Combines with `stopAt`: the earlier cutoff wins. A 16-team field with `{ singleLayerWhenAtMost: 5, stopAt: { fromEnd: 2 } }` follows `stopAt`.
- The bracket records `stop` when the rule applies, and `includeThirdPlace` is ignored (no final).

## Score row

A score row sits to the right of each match result card: `scoreCount` cells, then a Sum cell. It is off by default (`scoreCount: 0`), which keeps the single score well on the card. With `scoreCount > 0` the well is hidden on cards that have a row, so a match has one scoring UI. Bye matches get no row. Which rounds get a row is set by `scoreOn` (default: the last round only).

```ts
type ScoreOn = "last" | "all" | { rounds: number[] };
```

| `scoreOn` | Rows on |
| --- | --- |
| `"last"` (default) | the last generated round, plus the third-place match when present |
| `"all"` | every real match |
| `{ rounds: [0, 2] }` | the listed round indexes (`0` = first round); unknown indexes are ignored, `[]` draws none |

The third-place match follows the final: it gets a row whenever the last round does. Only columns that carry a row are widened, so with `"last"` earlier columns keep their plain spacing. A 16-team bracket cut with `stopAt: { fromEnd: 2 }` shows the row on its second (last) round only.

Parameters (`BracketView` / `SingleEliminationBracket` props, and `computeSingleEliminationLayout(bracket, options)`):

| Parameter | Default | Meaning |
| --- | --- | --- |
| `scoreCount` | `0` | Score cells per match. Invalid or negative values act as `0`. |
| `scoreOn` | `"last"` | Rounds that get the row (see above) |
| `scoreCellWidth` | `56` | Width of one score cell. Height stays the card height (40), so the cell is wider than a square and a number can be written in by hand |
| `scoreCellGap` | `4` | Gap between cells, and before the Sum cell |
| `sumCellWidth` | `72` | Width of the Sum cell (room for a handwritten two-digit total) |
| `scoreStripGap` | `12` | Gap between the result card and the first cell |
| `sumLabel` | `"Sum"` | Text in an empty Sum cell (renderer only) |

Defaults live in `BRACKET_SCORE_LAYOUT`. The layout widens each column that has a score row by the strip width, and connectors leave from the right edge of the strip. The layout returns `scoreCells: { id, matchId, kind: "score" | "sum", index, rect }[]` (empty when `scoreCount` is `0`).

Match data (all optional, `score` / `score2` stay as they were):

```ts
data: {
  scores?: Array<number | string | null | undefined> | null; // cell i = scores[i]
  sum?: number | string | null;                               // explicit total
}
```

What each cell shows:

- **Score cell:** `scores[index]`, otherwise blank.
- **Sum cell, in order:** `data.sum` if set → computed total → the `sumLabel`.
- The computed total is `sumScores(scores, scoreCount)`. It returns a number only when all `scoreCount` cells are numeric (numeric strings count) and is `undefined` otherwise. Cells beyond `scoreCount` are ignored.

This JSON is what the backend returns once the brackets code is migrated there; the core does not depend on the current schedule DTO.

## PDF

Bracket PDFs are generated on the backend from this core (the bracket tree plus the layout rectangles). This repo has no PDF library and no print code. The tournament Brackets tab downloads them through two schedule endpoints (`SchedulesApi`):

| Endpoint | Used for |
| --- | --- |
| `GET /tournaments/:tournamentId/categories/:categoryId/bracket/pdf` | **Download PDF** for the selected category. Sends `generateMissing=true` when the category has no schedule yet and the user can generate one (the server creates it first). |
| `GET /tournaments/:tournamentId/brackets/pdf` | **Download all (PDF)**: one A4 landscape page per category that already has a schedule. |

Both leave `scoreCount` unset, so the server default applies (5 blank handwritten cells plus a Sum cell; the server maximum is 8). Both functions request a `blob`; the file is saved as `{category name}.pdf` or `brackets.pdf`. A codegen run restores the generated `void` response types, so re-apply `responseType: "blob"` and the blob schema in `schedules.api.ts` afterwards.

## Data contract

```ts
type BracketSlot<T> =
  | { kind: "item"; item: T }
  | { kind: "bye" }
  | { kind: "tbd"; fromMatchId: string; outcome: "winner" | "loser" };

type BracketMatch<T> = {
  id: string;           // stable, e.g. r0-m2 — swap for BE UUIDs later
  item: BracketSlot<T>;
  item2: BracketSlot<T>;
  data: {
    winner: "item" | "item2" | null;
    metadata?: Record<string, unknown>;
    isBye: boolean;     // hide first-round fork; auto-advance
    score?: number | string | null;   // item
    score2?: number | string | null;  // item2
    scores?: Array<number | string | null | undefined> | null; // score row cells
    sum?: number | string | null;     // explicit score row total
  };
};

type Bracket<T> = {
  kind: "single_elimination"; // union grows later (double elim, two-sided, …)
  size: number;
  rounds: BracketRound<T>[];
  stop?: { fromEnd: number; lastRoundIndex: number }; // only with stopAt / singleLayerWhenAtMost
  thirdPlace?: BracketMatch<T>;
};
```

Bye matches: one side is `bye`, `isBye: true`, `winner` pre-set. Third place: both slots `tbd` + `outcome: "loser"` from the two semi match ids. Only emitted when `includeThirdPlace: true` **and** both semis are real (not byes). 2–3 teams never get a bronze match.

## Constraints

| Rule | Value |
| --- | --- |
| Participants | 2–256 |
| Uneven sizes | Pad to next power of two; byes spread by seed |
| Third place | Opt-in; needs two real semis and a kept final |
| Stop | `stopAt` clamps into the real round range; invalid numbers throw |
| Score row | Off by default; `scoreCount` cells + Sum; rows on `scoreOn` rounds (default last); no row on byes |
| Single layer | `singleLayerWhenAtMost` off by default; fields at or below it generate round 1 only |
| Interaction | View only (no clicking winners yet) |
| Other bracket kinds | `kind` is reserved; only single elim is implemented |

---

## Extracting a public package (step by step)

Goal: **core has no React and no karate-app theme.** Renderers are adapters.

Suggested npm shape (later):

1. `@you/brackets-core` — types, generate, layout, connector `d` strings  
2. `@you/brackets-dom` or a **Web Component** — mount into any element, CSS variables, window/pan  
3. Optional `@you/brackets-react` — thin wrapper for this Next app

### Step 0 — Keep using it here

Stay in `src/components/brackets`. Finish product behavior (winners, BE ids) against this tree JSON so the contract is stable before publishing.

### Step 1 — Freeze the core API

Treat generate + layout as the public surface:

- Input: `T[]`, `getId`, options (`includeThirdPlace`)
- Output: `Bracket<T>`
- Layout: `{ width, height, nodes, connectors, headers }` with no DOM types

Do not add React or CSS into `core/`.

### Step 2 — Strip app UI from the renderer (still in-repo)

Replace `Typography` and Tailwind color classes with:

- plain `div` / `span`
- CSS variables, e.g. `--bracket-card-bg`, `--bracket-card-border`, `--bracket-line`, `--bracket-text`

Pan stays in the viewport, but the hook should be easy to rewrite as vanilla pointer + `scrollLeft`/`scrollTop`.

After this, the React renderer is generic; this app only supplies CSS variables (or a small wrapper className).

### Step 3 — Split files by dependency

`core/` is already isolated (copy that folder). Later, `render/` can become a thin adapter over a published core package.

### Step 4 — Publish `brackets-core`

New repo or workspace package. `package.json` with `"type": "module"`, no `react` peer. Export generate, layout, types. This is usable from Vue, Svelte, Node, or tests with no UI.

### Step 5 — Choose a host renderer (pick one)

- **Vanilla `mount(element, bracket, options)`** — smallest, any FE calls JS  
- **Web Component** `<single-elim-bracket>` — one tag in React, Vue, HTML  

Window `{ width, height }`, overflow, grab/drag live here, not in core.

### Step 6 — Optional React wrapper

`<BracketView>` becomes a few lines over the element or `mount()`. This karate app switches its import from `@/components/brackets` to the package.

### Step 7 — Docs and extras (only after 4–6)

README on npm, Storybook or a static demo, then later: double elimination, two-sided, click-to-advance winners.

## Effort (rough)

| After step | Outcome |
| --- | --- |
| 1–2 | Same app, theme-free renderer (~1 day) |
| 3–4 | Public **core** package (~1–2 days including npm plumbing) |
| 5 | Any-framework UI (~3–5 days vanilla, ~1 week Web Component) |
| 6 | Drop-in for this Next app (~0.5 day) |

Do **not** publish the current `render/` folder: it pulls this app’s `Typography` and color tokens.

## Out of scope (until the tree is stable)

- Tournament detail / schedule page wiring  
- Backend persist (ids are ready to be replaced)  
- Double elimination / two-sided layouts  
- Interactive winner selection  
- Publishing to npm (starts at step 4)
