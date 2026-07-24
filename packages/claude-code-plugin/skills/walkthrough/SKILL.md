---
description: >-
  A short, hands-on tour of how to use Duckling / Mental Model Mode. Run it when
  the user types /duckling:walkthrough or asks to learn how Duckling works, for
  an onboarding walkthrough, a demo, or a tutorial. It gives the user a small
  coding task, asks them to predict before revealing anything, checks reality by
  running code, then tests whether the idea transfers — teaching the tool by
  doing one full loop. User-invoked only.
disable-model-invocation: true
---

# Duckling — Walkthrough (guided tour)

This is a **hands-on tutorial** that teaches someone how to use Duckling by
running them through **one real Mental Model Mode loop**, with light narration
about what's happening and why. It is invoked explicitly (`/duckling:walkthrough`)
— never auto-run.

Your job here is different from normal Mental Model Mode: you are **teaching the
tool itself**. So you do the loop *and* briefly name what each step is, so by the
end the user understands the experience and how to use it for their own work.

Keep the whole thing to a few minutes. Short messages. One idea at a time. Begin
your first message with the marker **🦆 Mental Model Mode** so the user sees the
indicator from the start.

## 0 — Welcome + pick a task

Open with a 2–3 line intro, in your own words:
- Duckling doesn't just hand you answers — on a conceptual question it runs a
  brief loop that makes *you* predict first, so you build the right mental model.
- This is a 2-minute tour of that loop. There's always a **"Show Answer"** exit.

Then offer a choice and **wait**:
- **(a) Use a built-in sample** (recommended) — a tiny Python bug, or
- **(b) Bring your own** — the user pastes a small snippet or bug they're curious
  about.

If they pick their own task, use it for the loop below instead of the sample.

### Loading the built-in sample

The sample ships next to this skill. Make a runnable copy in a temp path:

```bash
cp "$CLAUDE_PLUGIN_ROOT/skills/walkthrough/sample.py" /tmp/duckling_demo.py
```

If `$CLAUDE_PLUGIN_ROOT` is unset or the copy fails, write this to
`/tmp/duckling_demo.py` yourself (it is the same file):

```python
def add_item(item, cart=[]):
    cart.append(item)
    return cart

if __name__ == "__main__":
    first = add_item("apples")
    second = add_item("bread")
    print("First cart: ", first)
    print("Second cart:", second)
```

Show the user the code and tell them the intent: *two shoppers each add one item
to their own cart.* Do **not** hint at the bug.

## 1 — Start recording (optional but nice)

Kick off a real session so the tour also produces data the user can inspect
afterward. Include a concept word so the gate detects it:

```bash
duckling start --input "why do the two carts share items — mutation / shared object?"
```

If `duckling` is missing or errors, **just continue conversationally** — never
let a failed command block the tour. Mention once that recording is off.

## 2 — Predict (the heart of it)

Narrate one line — *"Step 1 is the whole idea: predict before you peek."* Then
ask **one** multiple-choice question about the sample, and **stop**:

> When this runs, what does `Second cart:` print?
> (a) `['bread']`   (b) `['apples', 'bread']`   (c) an error

This message contains **only** the question and options — no hint, no lead. Wait
for their answer (or "I don't know").

```bash
duckling predict --prediction "<what they chose>"   # or: duckling predict --idk
```

## 3 — Commit confidence

One tap: *"How sure? 1 (guessing) … 5 (certain)."*

```bash
duckling commit --confidence <1-5>
```

## 4 — Reality (run it for real)

Narrate *"Now we check reality — actually run it, don't take my word."* Run the
file and show prediction vs. actual:

```bash
python3 /tmp/duckling_demo.py
```

```bash
duckling reveal --actual "both carts print ['apples', 'bread']"
```

## 5 — Repair (only the mismatch)

In **one or two sentences**, explain only the surprising part: the default
`cart=[]` is created once and reused, so both calls append to the *same* list.
If they predicted correctly, just confirm in one line — don't re-teach.

## 6 — Pattern (one line)

```bash
duckling pattern
```

> **Pattern** — a mutable default argument is shared across calls; use `None`
> and create a fresh list inside.

## 7 — Transfer (did it stick?)

Narrate *"The real test: same idea, new shape."* Enter transfer and pose a
**different** example of the same concept — e.g. aliasing:

```bash
duckling transfer
```

> Quick one — same concept, different code:
> ```python
> a = [1, 2]
> b = a
> b.append(3)
> print(a)
> ```
> What does this print — `[1, 2]` or `[1, 2, 3]`?

If they say `[1, 2, 3]` (because `b` is the *same* list as `a`), the concept
**transferred** — call that out; it's exactly what the project measures.

```bash
duckling answer-transfer --answer "<their answer>" --correct <true|false>
```

## 8 — Wrap up: how to use this for real

Now zoom out (a few tight bullets, not a wall of text):

- **You don't type anything special.** When you ask a genuinely conceptual
  question (closures, async, React state, references, recursion, …), Duckling
  runs this loop automatically *before* the answer. It stays out of the way on
  typos, config, and boilerplate.
- **The 🦆 marker** at the top of a reply means the learning layer is active.
- **"Show Answer"** (or "Skip", "just tell me") at any step drops straight to the
  full answer — it never blocks you.
- **Your data is local** (`~/.duckling`, never sent anywhere). Inspect it:
  ```bash
  duckling log        # sessions, including the one you just did
  duckling summary    # your running transfer rate
  ```
- **Turn it off/on:** `duckling off` / `duckling on`. It can also be locked on as
  an accountability mode (`duckling lock --passcode <code>`).

Then a single comprehension check to close the loop:

> Last check: name one kind of request where Duckling should **stay quiet** and
> just answer.

(Any of: fixing a typo, formatting, imports, renaming, scaffolding/boilerplate.)

Finally: clean up the temp file (`rm -f /tmp/duckling_demo.py`) and invite them
to try a real question of their own.

## Guardrails

- Keep every step to one short message; the whole tour is a few minutes.
- Never reveal the answer before the prediction. That's the entire lesson.
- If the user says "Show Answer" / "Skip" / seems rushed at any point, run
  `duckling show-answer` (or `duckling skip`) and give the full explanation
  immediately, then offer to jump to the wrap-up.
- If `duckling` isn't available, run the tour conversationally without recording.
