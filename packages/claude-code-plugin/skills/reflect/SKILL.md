---
description: Insert a reflection checkpoint before starting a task. Use to plan and connect to prior knowledge before diving into code.
disable-model-invocation: true
---

<!--
STUB — not yet wired to @waddl/learning-engine.
Intended behavior: a *reflection checkpoint* (docs/design-principles.md §5) — a
brief, skippable pause to plan and connect to prior knowledge before writing code.
-->

# Waddl: Reflect

Task: **$ARGUMENTS**

Before writing any code, run a short reflection checkpoint. Ask the learner
2–3 planning questions and wait for answers:

- "How would you break this into 2–4 smaller steps?"
- "Have you solved something like this before? What transfers?"
- "What's the riskiest part — where are you most likely to get stuck?"

Keep it brief and let the learner skip it. After they respond, help them turn
their plan into first steps.

> TODO: use `@waddl/learning-engine` (`prompts/`) to time checkpoints well and
> avoid over-prompting.
