# Streak Tracker — an intro-Python project to walk through with Duckling

A first Python project small enough for a beginner (~40 lines, one file, no
installs) but deliberately seeded with two spots where the *obvious* mental
model is wrong. Those are exactly where [Duckling](../../packages/claude-code-plugin)'s
**Mental Model Mode** shines — so this doubles as a clean live demo / recording.

**What you're building:** a tiny habit-streak tracker. Users log practice
sessions, you back up their progress, and you compute how many days in a row
they've kept the habit.

## Run it

```bash
python3 examples/python-streak-tracker/streak.py
```

It runs and prints — but two of the lines are *not* what a beginner expects.
That surprise is the hook for each teaching moment below.

## The project, as three tasks

Work these in order. Each is a normal "make this function right" task; the
conceptual moment happens when you ask Claude *why* the surprising thing occurs.

- [ ] **Task 1 — `log_practice`: one list per learner.**
  Two different learners each log one session, yet they end up sharing a list.
  Fix it so each learner starts fresh. *(concept: mutation / shared objects)*
- [ ] **Task 2 — `back_up`: a real backup.**
  After backing Amir up and logging one more session, the "backup" changed too.
  Fix it so the backup is a true snapshot. *(concept: references / aliasing —
  this is the same idea as Task 1 in a new shape, i.e. the transfer)*
- [ ] **Task 3 — `current_streak`: read the recursion.**
  This one is already correct — the goal is to *understand* why it terminates,
  not to fix it. *(concept: recursion / base case)*

## Using Duckling to walk through it (the demo script)

Load the plugin (from the repo root), then work the tasks. Paste the prompts
verbatim — each contains a keyword that trips Duckling's concept gate, so Mental
Model Mode fires instead of Claude just answering.

```bash
claude --plugin-dir ~/Desktop/waddl-oss/packages/claude-code-plugin
rm -rf ~/.duckling      # optional: a clean slate for the recording
```

**Scene 1 — the shared list (mutation).** Prompt:

```text
In examples/python-streak-tracker/streak.py, run it — why do Amir and Bela
end up with the same sessions? Is this a mutation / shared-object thing?
```

Duckling replies with the indicator **🦆 Mental Model Mode** and asks you to
predict *before* explaining, e.g. "What does `Bela's sessions:` print — (a)
`[15]`, (b) `[20, 15]`, (c) an error?" Pick **(a)** on camera (the intuitive
wrong answer), give a confidence, and it runs the file to show reality. The
repair is one line; the pattern is one line.

**Scene 2 — transfer (aliasing).** This is the payoff of the whole project —
same concept, different shape. Prompt:

```text
Now why did `saved` (the backup from back_up) also change after Amir logged
another session? Feels related — same object again?
```

If you predict that `backup = progress` just names the *same* list (so `.copy()`
/ `list(progress)` is the fix), the concept **transferred** — which is the exact
thing Waddl measures.

**Scene 3 (optional) — recursion.** Prompt:

```text
In streak.py, explain current_streak — what's the base case and why doesn't it
recurse forever?
```

**End on the data:**

```bash
duckling log        # the sessions you just did
duckling summary    # running transfer rate
```

## Recording tips

- **~100×30 terminal**, and answer the prediction **wrong on purpose** — the
  repair step is the demo.
- **No 🦆?** The plugin didn't load or auto-run is off: `/reload-plugins`, then
  check `duckling gate` (`alwaysOn` should be `true`).
- Want to show it never traps you: type `Show Answer` at any prediction and
  Duckling drops straight to the full fix.

---

## Facilitator answer key (keep off screen)

<details>
<summary>Spoilers — real output and the fixes</summary>

Running the unfixed file prints:

```text
Amir's sessions: [20, 15]
Bela's sessions: [20, 15]
Amir now:        [20, 15, 30]
Backup:          [20, 15, 30]
Current streak:  3 days
```

**Task 1 (mutation).** `def log_practice(minutes, session=[])` — the default
list is created **once**, at definition time, and reused on every call that
omits `session`. So Amir and Bela append into the *same* list. Fix:

```python
def log_practice(minutes, session=None):
    if session is None:
        session = []
    session.append(minutes)
    return session
```

**Pattern:** default argument values are evaluated once, not per call — never
use a mutable default; use `None` and create a fresh one inside.

**Task 2 (aliasing — the transfer).** `backup = progress` binds a second **name**
to the same list, so mutating `progress` later also changes `backup`. Fix: copy
it — `backup = progress.copy()` (or `list(progress)`; `copy.deepcopy` if nested).
Same underlying idea as Task 1 ("it's the same object"), which is why predicting
it correctly counts as transfer.

**Task 3 (recursion).** Base case: an empty list, or a most-recent day that's
`False`, returns `0`. Otherwise it counts today (`1 +`) and recurses on
`days[:-1]` — a strictly shorter list each call, so it always reaches the base
case. `week = [T, T, F, T, T, T]` → counts the trailing 3 `True`s → **3**.

</details>
