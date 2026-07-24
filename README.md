# Waddl

Waddl is an open-source research project exploring how AI coding
tools can support problem-solving without replacing the thinking
that helps people learn.

Concretely, Waddl is:

> A research layer that models what the learner understands, chooses a
> cognitive intervention, and measures whether learning transfers.

It ships as **[Duckling](packages/claude-code-plugin)**, a Claude Code plugin
whose first interaction is **Mental Model Mode**: before answering a
conceptually important question, it exposes your mental model, shows reality,
repairs the mismatch, and tests whether the concept transfers — with an instant
"Show Answer" escape hatch so it never blocks real work.

---

## The research question

**When a developer uses an AI coding assistant, how do we keep the
productivity of AI help without eroding the learning that comes from
struggling productively?**

Modern coding assistants are optimized to produce a correct answer as
fast as possible. That is often the right goal — but for people who are
trying to *learn* (students, career-switchers, engineers picking up a
new stack), the fastest answer can short-circuit the desirable
difficulties that build durable skill and mental models.

Waddl investigates a middle path: assistance that first exposes and repairs the
learner's mental model, then tests whether the idea transfers — rather than just
handing over the fix. Its first experiment, **Mental Model Mode**, is described
below; other interventions (adaptive hints, assistance fading, self-explanation,
spaced repetition) are [extension points](docs/interventions.md) for later
studies.

## A 30-second demo

https://github.com/carissamercedesott/waddl/raw/master/docs/media/duckling-demo.mov

<video src="https://github.com/carissamercedesott/waddl/raw/master/docs/media/duckling-demo.mov" controls muted playsinline width="720">
  Your browser can't play this inline —
  <a href="https://github.com/carissamercedesott/waddl/raw/master/docs/media/duckling-demo.mov">watch the demo (.mov)</a>.
</video>

_Prefer text? The same flow, written out:_

```text
You:       Why does my useState update not show up until the next click?

Duckling:  Quick mental-model check first (or say "Show Answer").
           What do you think `count` is on the line right after setCount?
           (a) the new value  (b) the old value  (c) undefined
           [ predict · I don't know · Skip ]                    ← prediction

You:       (a) the new value

Duckling:  How confident?  1–5                                  ← commit
You:       4

Duckling:  Let's look. Running it:
             Your prediction:  count is the new value
             Actual behavior:  count is still the OLD value here ← reality

           State updates are scheduled; `count` doesn't change
           until the next render.                                ← repair

           Pattern — setState schedules a re-render; it doesn't
           mutate the current variable.                          ← pattern

           Transfer: if you call setCount twice in a row with
           `setCount(count + 1)`, what's the net change — +1 or +2? ← transfer
```

The demo shows one full pass of **Mental Model Mode** — prediction → commit →
reality → repair → pattern → transfer — with the escape hatch always present.

## Mental Model Mode — the experiment

**Hypothesis:** if an AI, *before* answering a conceptual coding question, makes
you **predict** what the code does, shows you **reality**, repairs only the
**mismatch**, then checks the idea on a **new example**, you build a more
accurate, transferable mental model than if it simply hands you the fix.

**What it measures:** each interaction is recorded locally — your prediction,
confidence, the actual behavior, and whether you got the *transfer* example
right. The headline outcome is the **transfer rate**: did the concept carry to
fresh code? (`duckling summary`).

- Ships now in the [Duckling](packages/claude-code-plugin) plugin as
  `/duckling:mental-model`.
- Study protocols: [`docs/study-protocols`](docs/study-protocols) · what's
  recorded and why: [`docs/privacy.md`](docs/privacy.md).

## Installation

> ⚠️ Waddl is early-stage research software. Interfaces will change.

The repository is a monorepo:

| Package | What it is |
| --- | --- |
| [`packages/claude-code-plugin`](packages/claude-code-plugin) | **Duckling** — the Claude Code plugin (Mental Model Mode) |
| [`packages/learning-engine`](packages/learning-engine) | The research engine: concept detection, interventions, session FSM, storage, analytics |
| [`packages/experiment-dashboard`](packages/experiment-dashboard) | Dashboard for viewing anonymized study data |

**Install the Duckling plugin** in Claude Code:

```text
/plugin marketplace add carissamercedesott/waddl
```
```text
/plugin install duckling@waddl
```

Then ask a concept-level debugging/explanation question, or invoke it directly
with `/duckling:mental-model`. To hack on it locally instead, clone the repo and
load the plugin straight from disk:

```bash
git clone https://github.com/carissamercedesott/waddl.git
claude --plugin-dir ./waddl/packages/claude-code-plugin
```

See the [plugin README](packages/claude-code-plugin) for details and the
[interventions reference](docs/interventions.md) for how to extend it.

## Study protocol

Waddl is a research project first and a tool second. All studies follow
the protocols in [`docs/study-protocols`](docs/study-protocols) and the
[design principles](docs/design-principles.md), and respect the
[privacy commitments](docs/privacy.md):

- Participation is voluntary and informed.
- Data collected is the minimum needed to answer the research question.
- Any shared data is anonymized/aggregated; raw data is never committed.
- Protocols and analysis plans are published *before* data collection.

See the [research agenda](docs/research-agenda.md) for the broader
roadmap.

## How to contribute

Contributions are welcome — code, study design, replication, or critique.
Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md) first. Good starting points:

- Try the plugin and file friction/bug reports.
- Propose or critique an interaction pattern (open an issue).
- Help design or replicate a study (`studies/`).
- Improve the docs or the website.

## Author and background

Created and maintained by **Carissa Ott**, a software engineer and cognitive science researcher
interested in developer tools, human–computer interaction, and the
learning sciences. Waddl grew out of a personal question: how do we
build AI assistants that make us *more* capable over time, not less?

**Contact:** carissaott0809@gmail.com · GitHub [@carissamercedesott](https://github.com/carissamercedesott)

## Disclaimer

**This is independent personal work.** Waddl is a personal, open-source
research project. It is **not** affiliated with, endorsed by, or a
product of any employer, and it does not represent the views of any
organization. It is provided for research and educational purposes.
Nothing here constitutes a validated educational intervention — findings
are preliminary until published and replicated.

## License

- **Code** (everything under `packages/`, `examples/`, `website/`, and
  tooling) is licensed under the [Apache License 2.0](LICENSE).
- **Research materials and writing** (everything under `docs/` and
  `studies/`) are licensed under
  [Creative Commons Attribution 4.0 International (CC BY 4.0)](docs/LICENSE-CC-BY-4.0.md).

If you use Waddl in academic work, please see [CITATION.cff](CITATION.cff).
