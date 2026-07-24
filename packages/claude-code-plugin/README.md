# @waddl/claude-code-plugin

The Claude Code plugin that delivers Waddl's learning-focused interaction
patterns inside a real coding workflow.

> **Status: early scaffold.** This package is not yet functional. The
> structure and intent are documented here so contributors can help
> build it.

## What it will do

Wrap ordinary coding assistance with optional, learning-oriented
behaviors driven by [`@waddl/learning-engine`](../learning-engine):

- **Adaptive hints** — offer `hint · step · solution` on demand instead
  of pushing a full answer by default.
- **Assistance fading** — reduce scaffolding as the learner demonstrates
  competence.
- **Self-explanation prompts** — invite the learner to explain or predict
  at high-value moments.
- **Reflection checkpoints** — brief, skippable pauses to plan and
  reflect.

Every behavior is optional, on-demand, and configurable per the
[design principles](../../docs/design-principles.md).

## Planned layout

```text
claude-code-plugin/
├── plugin.json        # Claude Code plugin manifest (name, commands, hooks)
├── src/               # plugin implementation
└── README.md
```

See the [Claude Code plugin docs](https://docs.claude.com/en/docs/claude-code)
for the plugin/manifest format.

## Contributing

Interested in building this? See the repo
[CONTRIBUTING.md](../../CONTRIBUTING.md) and open an issue to coordinate.
