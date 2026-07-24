# @waddl/learning-engine

Framework-agnostic logic for Waddl's learning-focused interaction
patterns. This is the reusable core that the
[Claude Code plugin](../claude-code-plugin) (and any other front end)
builds on.

> **Status: early scaffold.** APIs are not yet stable.

## Responsibilities

- **Hint laddering** — represent and advance a graduated hint sequence
  (conceptual nudge → worked step → full solution).
- **Assistance fading** — policy for reducing scaffolding as competence
  grows (and restoring it when the learner struggles).
- **Learner model** — a lightweight, privacy-preserving estimate of what
  the learner appears to know, from minimal signals (see
  [privacy.md](../../docs/privacy.md)).
- **Prompt selection** — decide when a self-explanation or reflection
  prompt is worth showing.

The engine is intentionally UI- and vendor-agnostic so the same logic can
be evaluated across surfaces.

## Layout

```text
learning-engine/
├── src/
│   ├── index.ts         # public barrel export
│   ├── types.ts         # shared types (HintLevel, Confidence, LearnerModel, signals…)
│   ├── session/         # Learn Mode flow as a finite state machine (reducer + swappable STEP_ORDER)
│   ├── hints/           # hint ladder + starting-level policy
│   ├── fading/          # assistance-fading policy
│   ├── learner-model/   # lightweight competence estimate
│   └── prompts/         # self-explanation & reflection prompt selection
├── tsconfig.json
└── package.json
```

Everything under `src/` is a **typed stub**: the interfaces and function
signatures are in place and typecheck cleanly, but the bodies return
documented placeholders and are marked with `@todo`. This lets contributors
see the intended API surface before the logic exists.

```bash
npm install
npm run typecheck   # tsc --noEmit — passes today
npm run build       # emits dist/ (JS + .d.ts)
```

## Design constraints

Follows the project [design principles](../../docs/design-principles.md):
help on demand, fade as competence grows, privacy by design, evidence
over intuition.

## Contributing

See the repo [CONTRIBUTING.md](../../CONTRIBUTING.md).
