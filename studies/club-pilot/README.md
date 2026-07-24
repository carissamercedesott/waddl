# Club pilot — high-school feedback pilot

> **Type: informal feedback pilot (no data collection).** Research materials
> here are licensed under CC BY 4.0 (see
> [../../docs/LICENSE-CC-BY-4.0.md](../../docs/LICENSE-CC-BY-4.0.md)).
>
> This is guidance, **not legal or IRB advice.** Because participants are
> minors, get your club advisor's and school's approval first, and use the
> parental consent + student assent form in this folder.

The goal of this pilot is simple: find out whether **Duckling / Mental Model
Mode** is *usable and useful* for high-school students learning to code — not to
measure learning outcomes or collect research data. It answers "does this work,
is it clear, is it annoying?", which is exactly what an early v0.1 needs.

## Ground rules

1. **Advisor + school permission first.** A teacher or club advisor must approve
   the activity before students take part.
2. **Voluntary.** Any student can decline or stop at any time, no penalty.
3. **No central data collection.** The plugin runs 100% locally; nothing about a
   student's code or sessions leaves their machine. The *only* thing you gather
   is the **anonymous feedback survey** — no names, no code, no session logs.
4. **Minors → consent + assent.** Use [`consent-assent.md`](consent-assent.md):
   a parent/guardian consents and the student assents.
5. **Not a graded tool.** No scores, no ranking, no impact on class grades.

## What a session looks like (≈20–30 min)

1. **Intro (5 min).** The advisor explains what Duckling is: a "learning layer"
   that, before giving an answer, asks you to predict what code does. Emphasize
   the **"Show Answer"** escape hatch — they're never stuck.
2. **Install (5 min).** On each student's machine with Claude Code + `node`:
   ```text
   /plugin marketplace add carissamercedesott/waddl
   /plugin install duckling@waddl
   ```
   (Or, if a shared/managed setup, the advisor pre-installs it.)
3. **Try it (10–15 min).** Students bring a small bug or a concept they're shaky
   on (closures, loops, async, React state, recursion …) and ask Claude for help.
   Mental Model Mode kicks in. They go through predict → reality → pattern →
   transfer. Encourage them to actually guess before revealing.
4. **Feedback (5 min).** Everyone fills out the anonymous
   [`feedback-survey.md`](feedback-survey.md) (paper or a form you create — do
   **not** collect names).

## What you'll learn

- Does it trigger at the right moments (and skip trivial stuff)?
- Is it clear, or confusing? Too slow / naggy?
- Do students feel they understood more than a plain answer would give?
- What breaks, and what should change before a real study.

If it goes well and you later want to **measure** learning (not just gather
feedback), that's a different, higher-bar effort — parental consent for data,
school/IRB review, and the protocols under
[`../../docs/study-protocols`](../../docs/study-protocols). Don't collect student
data in this pilot.

## Disclaimer

Waddl/Duckling is **independent personal work** — not affiliated with, endorsed
by, or a product of any school or employer. It is an early research prototype,
not a validated educational intervention.
