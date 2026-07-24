# @waddl/learning-engine

The reusable core of the Waddl research layer. It **models what the learner
understands**, **chooses a cognitive intervention**, **drives one interaction**,
and **persists and measures** the result. The [Duckling](../claude-code-plugin)
Claude Code plugin is a thin conversational front end over these modules; a
future React app would be another. The engine is UI- and vendor-agnostic.

## Architecture — one concern per module, all pluggable

```text
learning-engine/
├── src/
│   ├── index.ts                 # public barrel export
│   ├── types.ts                 # shared types (Confidence, PromptSpec, LearningSession, …)
│   ├── concepts.ts              # the concept taxonomy (closures, async, react-state, …)
│   ├── concept-detection/       # is a request conceptually important, and about what?
│   ├── interventions/           # the pluggable Intervention interface + registry
│   │   ├── prediction.ts        #   v1: expose the mental model
│   │   ├── transfer.ts          #   v1: test whether the concept transferred
│   │   └── registry.ts          #   built + declared-but-planned interventions
│   ├── intervention-selection/  # which intervention to run (v1: fixed policy)
│   ├── prompts/                 # generate the concrete PromptSpec for an intervention
│   ├── session/                 # Mental Model Mode as a finite state machine (+ LearningSession record)
│   ├── storage/                 # local persistence of session records (in-memory + JSONL helpers)
│   ├── analytics/               # transfer measurement (extension point + a real summary)
│   ├── learner-model/           # lightweight competence estimate (shared substrate)
│   ├── hints/                   # hint ladder (for the progressive-hints intervention)
│   └── fading/                  # assistance-fading policy (shared substrate)
├── tsconfig.json
└── package.json
```

## What's real vs. an extension point

**v1 is implemented and typechecks clean:** concept detection (a transparent
keyword heuristic), the **Prediction** and **Transfer** interventions, the
registry, a fixed selection policy, prompt generation, the session state machine
+ `LearningSession` record, in-memory storage with JSONL serialization, and a
transfer-rate summary.

**Declared extension points** (typed, documented, but not built): the other
interventions (self-explanation, worked example, progressive hints, execution
visualization, contrast case), adaptive selection, transfer grading, the
learner-model update logic, and storage adapters (`localStorage` / file). These
are marked with `@todo` or throw a clear "not implemented" error. See
[`docs/interventions.md`](../../docs/interventions.md).

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # node:test via tsx — session FSM, concept detection, analytics
npm run build       # emits dist/ (JS + .d.ts)
```

## Design constraints

Follows the project [design principles](../../docs/design-principles.md) and
[privacy commitments](../../docs/privacy.md): expose before explaining, repair
only the mismatch, measure transfer, privacy by design, evidence over intuition.

## Contributing

Adding an experiment means adding an intervention — see
[`docs/interventions.md`](../../docs/interventions.md) and the repo
[CONTRIBUTING.md](../../CONTRIBUTING.md).
