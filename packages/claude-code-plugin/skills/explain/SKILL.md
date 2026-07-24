---
description: Prompt the learner to self-explain code before revealing an answer. Use when checking understanding of a snippet, function, or file.
disable-model-invocation: true
---

<!--
STUB — not yet wired to @waddl/learning-engine.
Intended behavior: a *self-explanation prompt* (docs/design-principles.md §5).
Ask the learner to explain/predict BEFORE giving the answer, since generating an
explanation is what builds understanding.
-->

# Waddl: Explain

Target: **$ARGUMENTS**

Do NOT explain it yet. First ask the learner to self-explain, with 1–2 short,
specific questions such as:

- "What do you expect this to output, and why?"
- "Which line does the real work, and what would break if you removed it?"

Wait for their answer. Then give brief, targeted feedback that confirms what
they got right and corrects misconceptions — keep it short and skippable.

> TODO: use `@waddl/learning-engine` (`prompts/`) to decide *whether* a
> self-explanation prompt is worth showing here, and to vary the question by
> difficulty and the learner model.
