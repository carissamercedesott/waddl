# Waddl

Waddl is an open-source research project exploring how AI coding
tools can support problem-solving without replacing the thinking
that helps people learn.

The project develops and evaluates interaction patterns such as
adaptive hints, self-explanation prompts, assistance fading, and
reflection checkpoints.

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

Waddl investigates a middle path: assistance that adapts to what the
learner already knows, fades as competence grows, and periodically
invites the learner to explain, predict, or reflect. Concretely we ask:

- Do **adaptive hints** (graduated from conceptual nudge → worked step)
  improve retention compared with direct solutions?
- Does **assistance fading** — reducing scaffolding as the learner
  succeeds — transfer to unaided problem-solving?
- Do **self-explanation and reflection prompts** improve conceptual
  understanding without a large productivity cost?
- Can these patterns be delivered inside a real coding workflow (a
  Claude Code plugin) rather than a lab task?

## A 30-second demo

> _Placeholder — a short screen recording / GIF will live here._
> `docs/` and `website/` will host the hosted version.

```text
You:      I need to dedupe this list of user records by email.

Waddl:    Before I write it — what makes two records "the same" here?
          (reflection checkpoint)

You:      Same email, case-insensitive.

Waddl:    Good. Here's a conceptual hint rather than the full answer:
          you'll want a Set keyed on the *normalized* email as you
          iterate. Want the conceptual hint, a worked step, or the
          full solution?   [ hint · step · solution ]      (adaptive hint)

You:      Worked step.

Waddl:    ```py
          seen = set()
          # normalize before comparing — why lower()?  (self-explanation)
          ```
```

The demo shows three of the interaction patterns — a reflection
checkpoint, a graduated/adaptive hint, and a self-explanation prompt —
inside an ordinary coding request.

## Current experiment

**`studies/experiment-001` — Adaptive hints vs. direct solutions.**

A within-subjects study measuring whether graduated hints (vs. immediate
full solutions) affect (a) task completion time, (b) unaided transfer on
a follow-up task, and (c) self-reported understanding.

- Status: **protocol drafting / pilot** (see [`studies/experiment-001`](studies/experiment-001))
- Protocol: [`docs/study-protocols`](docs/study-protocols)
- Pre-registration and analysis plan: _in progress_

## Installation

> ⚠️ Waddl is early-stage research software. Interfaces will change.

The repository is a monorepo:

| Package | What it is |
| --- | --- |
| [`packages/claude-code-plugin`](packages/claude-code-plugin) | The Claude Code plugin that delivers the interaction patterns |
| [`packages/learning-engine`](packages/learning-engine) | Framework-agnostic logic: hint laddering, fading, learner model |
| [`packages/experiment-dashboard`](packages/experiment-dashboard) | Dashboard for viewing anonymized study data |

```bash
git clone https://github.com/carissamercedesott/waddl.git
cd waddl
```

Per-package setup lives in each package's own README (added as the
packages are implemented). The Claude Code plugin will be installable via
the plugin marketplace / `/plugin` once it reaches a usable state.

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

_(Feel free to expand this section with your own bio, links, and
research interests.)_

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
