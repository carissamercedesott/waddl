---
description: Give a graduated hint (nudge → step → solution) instead of a full answer. Use when the learner is stuck and wants help without being handed the solution.
disable-model-invocation: true
---

<!--
STUB — not yet wired to @waddl/learning-engine.
Intended behavior: an *adaptive hint* per docs/design-principles.md §3. Start at
the lowest-scaffolding level that could unblock the learner and let them ask for
more, rather than pushing the full solution by default.
-->

# Waddl: Hint

The learner is stuck on: **$ARGUMENTS**

Respond with the **lowest** level of assistance likely to unblock them, then
offer to escalate. Do not reveal the full solution unless asked.

Hint ladder (give ONE level, then stop and offer the next):

1. **Conceptual nudge** — name the idea/approach without code.
2. **Worked step** — show the next single step, not the whole solution.
3. **Full solution** — complete answer, with a short explanation.

End your reply with the menu `hint · step · solution` and ask which they want.

> TODO: replace this prompt-only behavior with a call into
> `@waddl/learning-engine` (`hints/`) so the starting level adapts to the
> learner model rather than always starting at level 1.
