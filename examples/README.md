# Examples

Runnable walkthroughs of Waddl's interaction patterns.

## [`mental-model-walkthrough/`](./mental-model-walkthrough)

A tiny, self-contained bug that drives [Duckling](../packages/claude-code-plugin)'s
**Mental Model Mode** end to end — predict → commit → reality → repair → pattern
→ transfer — in under a minute. Built for a live demo or screen recording: the
bug runs with plain `node` (so "reality" is a real command), the prediction is a
clean multiple choice, and the prompt reliably trips the concept gate. Includes a
step-by-step script, recording tips, and a facilitator answer key.

## [`python-shopping-list/`](./python-shopping-list)

A ~40-line intro-Python project (a shopping-cart helper) seeded with two spots
where the obvious mental model is wrong — the classic mutable-default-argument
bug (with list **aliasing** as its transfer) and a **recursion** base case.
Work the three tasks with Duckling to see Mental Model Mode fire on real
beginner Python. Runnable with plain `python3`; includes the demo script and a
facilitator answer key.

## More to come

Each future example is self-contained with its own README explaining the
pattern, the learning-science rationale, and how to run it. Good candidates:
self-explanation prompts, progressive hint ladders, and assistance fading — the
declared-but-unbuilt interventions in
[`@waddl/learning-engine`](../packages/learning-engine). Contributions welcome —
see [CONTRIBUTING.md](../CONTRIBUTING.md) and
[`docs/interventions.md`](../docs/interventions.md).
