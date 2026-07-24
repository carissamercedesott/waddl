# Duckling — the Waddl Claude Code plugin

**Mental Model Mode** — a learning layer that sits on top of Claude Code. When
you ask for debugging help or an explanation that turns on a *concept*, Duckling
runs a brief (<1 min) interaction *before* the answer, so you build an accurate
mental model instead of just receiving a fix. There is always an instant
**"Show Answer"** escape hatch — it never blocks you from shipping.

Duckling is the installable plugin; the research project behind it is
[**Waddl**](../../README.md). This is independent personal work.

## The interaction

`skills/mental-model/SKILL.md` → **`/duckling:mental-model`**. It is
**model-invoked**: Claude runs it automatically when a request turns on a
conceptually important idea (closures, async / the event loop, React state,
derived state, references, mutation, recursion, memoization, concurrency) — and
*skips* it for boilerplate, syntax, and typos. You can also invoke it explicitly.

The flow is a small finite state machine, one short step at a time:

```text
prediction → commit → reality → repair → pattern → transfer
 "what do    "how      run the   explain   one       a different
  you think   confident code,     ONLY the  reusable  example —
  happens?"   are you?" show       mismatch  principle did it
  (predict)             pred vs                        transfer?
                        actual"
```

The research loop: **expose the mental model → show reality → repair the
mismatch → test whether it transfers.** Grounded in cognitive science
(prediction-before-feedback, confidence as metacognition, minimal repair,
transfer as the real measure of learning). At **every** step the user can say
"I don't know", "Skip", or "Show Answer".

## Layout

```text
claude-code-plugin/            # the plugin root
├── .claude-plugin/
│   └── plugin.json            # manifest — name "duckling" — ONLY this goes here
└── skills/
    └── mental-model/SKILL.md  # /duckling:mental-model (model-invoked)
```

This follows the [official plugin docs](https://code.claude.com/docs/en/plugins):
the manifest lives at `.claude-plugin/plugin.json`; everything else is at the
plugin root. The skill folder name becomes the namespaced invocation.

## Try it locally

From the repo root, load the plugin directly (no install):

```bash
claude --plugin-dir ~/Desktop/waddl-oss/packages/claude-code-plugin
```

Then just ask a concept-level question (it's model-invoked), or trigger it
explicitly:

```text
/duckling:mental-model why does my useState update not show up until the next click?
```

Type **"Show Answer"** any time to bail straight to the solution. Use
`/reload-plugins` after edits.

## Install from GitHub

The repo ships a marketplace manifest
([`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json)):

```text
/plugin marketplace add carissamercedesott/waddl
```
```text
/plugin install duckling@waddl
```

Validate the manifest and structure:

```bash
claude plugin validate ./packages/claude-code-plugin
```

## Architecture & extending it

The plugin is the thin, conversational front end. The reusable logic — concept
detection, the pluggable **intervention** system, intervention selection, prompt
generation, the session state machine, local storage, and transfer analytics —
lives in [`@waddl/learning-engine`](../../learning-engine). v1 implements the
**Prediction** and **Transfer** interventions; every other intervention
(self-explanation, worked example, progressive hints, execution visualization,
contrast case, …) is a declared extension point in the engine's registry.

To add a new experiment, implement an `Intervention` and register it — see
[`docs/interventions.md`](../../docs/interventions.md) and
[CONTRIBUTING.md](../../CONTRIBUTING.md).
