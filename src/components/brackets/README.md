# Brackets

Standalone single-elimination visualization for this app, written so the **core can later become a public npm package** (any frontend, optionally without React).

This README is the working context. Do the numbered extraction steps in order; do not skip to a published package until the core has zero app/theme/React imports.

## What it does today

- Builds a full single-elimination tree from a participant list (`T`).
- Pads non-powers of two with **byes** (standard seed pairing), size **2–256**.
- Optional **third-place** match (two semi losers), under 1st place.
- Renders left-to-right cards + SVG elbow connectors.
- Optional **window**: `{ width, height }` clips the canvas, xy-scroll on overflow, **grab/drag** to pan.

Visualization only: it does not pick winners or call the API. The tree JSON is meant to be saved/loaded later.

## Folder

```
src/components/brackets/
  types.ts                              data contract
  generate/generateSingleElimination.ts tree builder (pure TS)
  layout/computeSingleEliminationLayout.ts  positions + SVG paths (pure TS)
  render/                               React + this app's UI
    BracketView.tsx                     kind switch + viewport
    SingleEliminationBracket.tsx
    BracketViewport.tsx / useBracketPan.ts
    MatchCard.tsx / BracketConnectors.tsx
  Bracket.stories.tsx
  index.ts
```

**Portable (keep this as the future package core):** `types.ts`, `generate/`, `layout/`.

**App-specific (do not copy into a public package as-is):** `render/` uses React, `Typography`, Tailwind tokens (`bg-secondary-200`, `text-neutral-200`, `cursor-grab`).

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
  // window={{ width: 640, height: 360 }}  // optional clip + pan
/>
```

`T` can be a team, person, or registration. Optional `renderItem` replaces the default label.

Storybook: `yarn storybook` → **Brackets**. **Windowed** is 8 teams in a 640×360 box. Controls: `count`, `includeThirdPlace`, `windowWidth` / `windowHeight` (`0` = no window).

Tests: `yarn jest src/components/brackets/generate/generateSingleElimination.test.ts`

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
  };
};

type Bracket<T> = {
  kind: "single_elimination"; // union grows later (double elim, two-sided, …)
  size: number;
  rounds: BracketRound<T>[];
  thirdPlace?: BracketMatch<T>;
};
```

Bye matches: one side is `bye`, `isBye: true`, `winner` pre-set. Third place: both slots `tbd` + `outcome: "loser"` from the two semi match ids. Only emitted when `includeThirdPlace: true` **and** both semis are real (not byes). 2–3 teams never get a bronze match.

## Constraints

| Rule | Value |
| --- | --- |
| Participants | 2–256 |
| Uneven sizes | Pad to next power of two; byes spread by seed |
| Third place | Opt-in; needs two real semis |
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
- Layout: `{ width, height, nodes, connectors }` with no DOM types

Do not add React or CSS into `generate/` or `layout/`.

### Step 2 — Strip app UI from the renderer (still in-repo)

Replace `Typography` and Tailwind color classes with:

- plain `div` / `span`
- CSS variables, e.g. `--bracket-card-bg`, `--bracket-card-border`, `--bracket-line`, `--bracket-text`

Pan stays in the viewport, but the hook should be easy to rewrite as vanilla pointer + `scrollLeft`/`scrollTop`.

After this, the React renderer is generic; this app only supplies CSS variables (or a small wrapper className).

### Step 3 — Split files by dependency

```
core/     types, generate, layout     → zero imports from react / @/
react/    BracketView, viewport       → depends on core only
```

This app imports from `react/` until a package exists.

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
