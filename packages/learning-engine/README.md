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

## Planned layout

```text
learning-engine/
├── src/
│   ├── hints/          # hint ladder + policy
│   ├── fading/         # assistance-fading policy
│   ├── learner-model/  # lightweight competence estimate
│   └── prompts/        # self-explanation & reflection prompt selection
└── README.md
```

## Design constraints

Follows the project [design principles](../../docs/design-principles.md):
help on demand, fade as competence grows, privacy by design, evidence
over intuition.

## Contributing

See the repo [CONTRIBUTING.md](../../CONTRIBUTING.md).
