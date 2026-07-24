# Design principles

> Licensed under CC BY 4.0 (see [LICENSE-CC-BY-4.0.md](LICENSE-CC-BY-4.0.md)).

These principles guide how Waddl's interaction patterns are designed.
They exist to keep the project honest to its goal: **support the thinking
that helps people learn, without throwing away the productivity of AI
help.**

## 1. Learning is the goal; productivity is a constraint

We optimize for durable skill and transfer. Speed and convenience matter,
but they are constraints to respect — not the objective. When the two
conflict, we make the trade-off *visible and optional* to the learner
rather than deciding silently for them.

## 2. Preserve desirable difficulty, remove needless difficulty

Struggle that builds understanding (decomposition, prediction, debugging
reasoning) is protected. Struggle that is just friction (boilerplate,
environment setup, recall of trivia) is removed. The hard part is telling
these apart — err toward asking the learner.

## 3. Help on demand, not by default

The learner chooses when and how much help to receive. Assistance is
offered as a ladder (nudge → step → solution), not pushed as a finished
answer. Defaults should nudge toward thinking, but never trap.

## 4. Fade as competence grows

Scaffolding that never fades creates dependence. As a learner
demonstrates competence, assistance should step back. Fading must be
reversible — struggling is a signal to scaffold again, not to judge.

## 5. Make thinking visible

Prompt for self-explanation, prediction, and reflection at moments where
they deepen understanding. Keep them short, relevant, and skippable.
A prompt the learner resents is a prompt that failed.

## 6. Respect the learner's autonomy and time

No dark patterns, no forced friction, no guilt. The learner can always
get the direct answer. We earn the extra step by making it worthwhile.

## 7. Privacy by design

Model only what is necessary, keep it local/minimal, and never trade the
learner's data for engagement. See [privacy.md](privacy.md).

## 8. Evidence over intuition

Every pattern is a hypothesis. Ground it in learning-science literature
where possible, and treat its benefit as unproven until evaluated. Ship
patterns behind studies, not vibes.

## 9. Meet developers where they work

Interventions live inside a real coding workflow (the Claude Code
plugin), not a separate lab exercise. Ecological validity is a feature.
