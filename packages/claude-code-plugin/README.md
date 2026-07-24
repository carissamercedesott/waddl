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

## Layout

```text
claude-code-plugin/            # the plugin root
├── .claude-plugin/
│   └── plugin.json            # manifest (name, version, author) — ONLY this goes here
└── skills/                    # skills, auto-discovered by Claude Code
    ├── hint/SKILL.md          # /waddl:hint    — graduated hint (nudge → step → solution)
    ├── explain/SKILL.md       # /waddl:explain — self-explanation prompt
    └── reflect/SKILL.md       # /waddl:reflect — reflection checkpoint
```

This follows the structure in the
[official plugin docs](https://code.claude.com/docs/en/plugins): the manifest
lives at `.claude-plugin/plugin.json`, and every other directory (`skills/`) is
at the **plugin root**, not inside `.claude-plugin/`. Each skill is a folder with
a `SKILL.md`; the folder name becomes the namespaced invocation (`/waddl:hint`).
The skills are marked `disable-model-invocation: true`, so they act as explicit
user commands rather than being auto-invoked.

The skills are **stubs**: they load and run today as prompt templates, but their
behavior is not yet driven by [`@waddl/learning-engine`](../learning-engine).
Wiring them to the engine (so hint level and prompt timing adapt to the learner)
is the next step. Planned but not yet added: `hooks/hooks.json` (to offer
reflection checkpoints proactively) and `agents/`.

## Try it locally

From the repo root, load the plugin directly with `--plugin-dir` (no install):

```bash
claude --plugin-dir ./packages/claude-code-plugin
```

Then run a skill:

```text
/waddl:hint I can't get this recursion to terminate
```

Use `/reload-plugins` to pick up edits without restarting. Alternatively, the
repo ships a marketplace manifest ([`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json)),
so once it's on GitHub you can add and install it:

```text
/plugin marketplace add carissamercedesott/waddl
/plugin install waddl@waddl
```

Validate the manifest and structure with:

```bash
claude plugin validate ./packages/claude-code-plugin
```

## Contributing

Interested in building this? See the repo
[CONTRIBUTING.md](../../CONTRIBUTING.md) and open an issue to coordinate.
