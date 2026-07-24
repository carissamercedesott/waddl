# Examples

Runnable and illustrative examples of Waddl's interaction patterns.

> **Status: early scaffold.** Examples will be added as the
> [learning engine](../packages/learning-engine) and
> [plugin](../packages/claude-code-plugin) take shape.

## Planned examples

- **`adaptive-hint-ladder/`** — a minimal walkthrough of a conceptual
  nudge → worked step → full solution ladder for one small task.
- **`self-explanation-prompt/`** — inserting a self-explanation prompt
  into an assisted coding turn.
- **`reflection-checkpoint/`** — a reflection checkpoint before starting
  a task.
- **`assistance-fading/`** — how scaffolding steps back as competence
  grows.

Each example will be self-contained with its own README explaining the
pattern, the learning-science rationale, and how to run it.

## Transcript sketch

Until the code lands, here is the shape of an adaptive-hint interaction
(also shown in the top-level README):

```text
You:      I need to dedupe this list of user records by email.
Waddl:    Before I write it — what makes two records "the same" here?
You:      Same email, case-insensitive.
Waddl:    Here's a conceptual hint rather than the full answer:
          use a Set keyed on the *normalized* email as you iterate.
          Want:  [ hint · step · solution ]
```

Contributions welcome — see [CONTRIBUTING.md](../CONTRIBUTING.md).
