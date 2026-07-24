# @waddl/claude-code-plugin

**Learn Mode** — a learning layer that sits between you and Claude's normal
answer. When you ask for debugging help or ask Claude to explain code, Waddl
runs a brief (30–60s) guided pass *before* handing you the solution, so you keep
the thinking that builds understanding. There is always an instant **"Show
answer"** escape hatch — it never blocks you from getting work done.

## Learn Mode — the main skill

`skills/learn/SKILL.md` → **`/waddl:learn`**. It is **model-invoked**: Claude
runs it automatically when you ask for a debugging fix, ask why a test/error is
happening, or ask it to explain a specific piece of code. You can also invoke it
explicitly with `/waddl:learn <your question>`.

The flow is a small finite state machine, one short step at a time:

```text
prediction → confidence → hint → attempt → reflection → pattern
   "What do    "How        one    "Try it   one specific   "Pattern
   you think    confident   minimal yourself" question       learned:
   is happening?" are you?"  hint            about the bug    <chunk>"
```

Rooted in cognitive science: prediction-before-feedback, a confidence
(metacognition) check, graduated minimal hints (productive struggle), a hands-on
attempt (active recall), a targeted self-explanation, and a reusable pattern
(a new mental chunk). At **every** step the user can say "I don't know" or
"Show answer." See the project [design principles](../../docs/design-principles.md).

## À la carte skills

Three smaller, explicitly user-invoked skills expose individual steps of the
flow on demand (marked `disable-model-invocation: true`):

- **`/waddl:hint`** — a graduated hint (nudge → step → solution).
- **`/waddl:explain`** — a self-explanation prompt.
- **`/waddl:reflect`** — a reflection checkpoint before starting a task.

## Layout

```text
claude-code-plugin/            # the plugin root
├── .claude-plugin/
│   └── plugin.json            # manifest (name, version, author) — ONLY this goes here
└── skills/                    # skills, auto-discovered by Claude Code
    ├── learn/SKILL.md         # /waddl:learn   — the full Learn Mode flow (model-invoked)
    ├── hint/SKILL.md          # /waddl:hint    — graduated hint (nudge → step → solution)
    ├── explain/SKILL.md       # /waddl:explain — self-explanation prompt
    └── reflect/SKILL.md       # /waddl:reflect — reflection checkpoint
```

This follows the structure in the
[official plugin docs](https://code.claude.com/docs/en/plugins): the manifest
lives at `.claude-plugin/plugin.json`, and every other directory (`skills/`) is
at the **plugin root**, not inside `.claude-plugin/`. Each skill is a folder with
a `SKILL.md`; the folder name becomes the namespaced invocation (`/waddl:learn`).

**Status:** the skills work today as carefully-designed prompt flows. They are
not yet wired to [`@waddl/learning-engine`](../learning-engine), whose typed
state machine (`session/`) and hint/prompt logic (`hints/`, `prompts/`) are the
extension points for future experiments — adaptive hinting, spaced repetition,
retrieval practice, misconception detection. Also planned: `hooks/hooks.json` to
offer the flow proactively.

## Try it locally

From the repo root, load the plugin directly with `--plugin-dir` (no install):

```bash
claude --plugin-dir ./packages/claude-code-plugin
```

Then trigger Learn Mode — either explicitly, or just by asking for debugging
help (it's model-invoked, so Claude runs it on its own):

```text
/waddl:learn my useEffect runs on every render even though the deps array is empty
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
