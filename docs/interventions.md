# Interventions

> Licensed under CC BY 4.0 (see [LICENSE-CC-BY-4.0.md](LICENSE-CC-BY-4.0.md)).

An **intervention** is one cognitive strategy for turning "here's the answer"
into a learning moment. Interventions are the pluggable unit of Waddl: a new
experiment is a new intervention, added without touching the rest of the system.

## The research loop

Every intervention serves the same loop:

> **model what the learner understands → choose an intervention → let them
> attempt → diagnose the mismatch → test whether the concept transfers →
> adjust future assistance.**

The measurable outcome we care about most is **transfer** — can the learner
apply the idea to a *new* example? Getting the original example right can be
mere recall; transfer is evidence of an updated mental model.

## v1 (implemented)

**Mental Model Mode** (`/duckling:mental-model`) composes two interventions:

| Intervention | Cognitive basis | What it does |
| --- | --- | --- |
| **Prediction** | Prediction-before-feedback; expose the prior | Ask the learner to predict behavior (multiple choice preferred) before anything is revealed, surfacing their current mental model. |
| **Transfer** | Transfer as the test of learning | Pose a *different* example of the same concept and check whether the idea carried over. |

The full flow around them: `prediction → commit (confidence) → reality (show
prediction vs. actual, ideally by running the code) → repair (explain only the
mismatch) → pattern (one reusable principle) → transfer`.

## Concepts we intervene on

Mental Model Mode fires only on conceptually important ideas (never boilerplate
or syntax). The taxonomy lives in
[`packages/learning-engine/src/concepts.ts`](../packages/learning-engine/src/concepts.ts):
closures · React state · derived state · async / await · event loop ·
concurrency · references vs. values · mutation · recursion · memoization.

Adding a concept is a one-entry change to that file.

## Extension points (declared, not yet built)

These are registered in the engine so tooling and docs can enumerate the
roadmap, but they throw if invoked until someone implements them:

- **Self-explanation** — prompt the learner to explain *why* the code behaves
  as it does.
- **Worked example** — a fully worked solution with each step justified.
- **Progressive hints** — graduated hints on demand (attention → concept → code).
- **Execution visualization** — trace/visualize execution instead of prose.
- **Contrast case** — compare two near-identical snippets to isolate the concept.
- **Misconception detection**, **adaptive intervention selection**, **spaced
  repetition**, and **persistent session logging** — cross-cutting extensions
  that build on the learner model, selection policy, and storage modules.

## How to add an intervention

1. Implement the `Intervention` interface in
   `packages/learning-engine/src/interventions/` (see `prediction.ts` /
   `transfer.ts` for the shape).
2. Register it in `interventions/registry.ts` (or via `registerIntervention`).
3. If it should be auto-selected, extend
   `intervention-selection/`; if it needs a new prompt, add a generator in
   `prompts/`.
4. If it introduces a new step, add it to the `session/` state machine's
   `STEP_ORDER`.
5. Design a study for it under `studies/` before drawing conclusions — see the
   [research agenda](research-agenda.md) and [study protocols](study-protocols/).
