# Walkthrough — Mental Model Mode in under a minute

A tiny, self-contained bug you can run live to demo (and record)
[Duckling](../../packages/claude-code-plugin)'s Mental Model Mode end to end:
**predict → commit → reality → repair → pattern → transfer**.

It's built for a recording: the bug runs with plain `node` (so "reality" is a
real command, not a claim), the prediction is a clean multiple choice, and the
prompt reliably trips the concept gate (closures / the event loop) so the mode
actually fires on camera.

## The files

| File | What it is |
|------|------------|
| [`loop-timeout.js`](./loop-timeout.js) | The main bug — `var` + `setTimeout` in a loop. |
| [`transfer.js`](./transfer.js) | The **same** concept in a different shape, for the transfer step. |

Neither file spoils its own output — that's the point. The answer key is at the
bottom of this README (facilitator notes), so don't put it on screen.

## Setup (once)

```bash
# from the repo root, load the plugin with no install
claude --plugin-dir ~/Desktop/waddl-oss/packages/claude-code-plugin
```

Optional but recommended for a clean take: allowlist the `duckling` command so
Bash prompts don't interrupt the recording, and start from a clean slate:

```bash
rm -rf ~/.duckling      # fresh session history for the demo
```

## The take (what to type, what happens)

**1. Open the file and ask — paste this verbatim** (it contains `setTimeout`, so
the gate fires):

```text
In examples/mental-model-walkthrough/loop-timeout.js, why does this setTimeout
loop log the wrong index for every button? Isn't this a closure problem?
```

**2. Duckling intercepts *before* answering.** You'll see the reply lead with the
indicator — **🦆 Mental Model Mode** — then a single prediction question, roughly:

> 🦆 Mental Model Mode
> Before I explain — when this runs, what does the **first** line log?
> (a) `Fired handler 0: Save`  (b) `Fired handler 5: undefined`  (c) an error

Pick an answer out loud (great recording moment — pick **(a)**, the intuitive
wrong one). It records your prediction and asks **how confident (1–5)**.

**3. Reality — run it for real.** Claude runs the file and shows prediction vs.
actual:

```bash
node examples/mental-model-walkthrough/loop-timeout.js
```

**4. Repair** — one sentence on *only* the mismatch (why every handler sees the
final `i`). **Pattern** — one reusable line. **Transfer** — Claude poses a
*different* example (it may point you at `transfer.js`) to check the idea
carried over. Answer, then it grades and finishes.

**5. Show the payoff.** End the recording on the data it captured:

```bash
duckling log        # the session you just did
duckling summary    # running transfer rate across sessions
```

Total on-screen time: about a minute.

## Recording tips

- **Terminal size:** ~100×30 keeps the short messages fully visible without
  scrolling.
- **Answer wrong on purpose** in step 2 — the repair step is the whole demo. A
  correct prediction gives a one-line confirm and less to show.
- **Show the escape hatch** in a second short take if you want: type
  `Show Answer` at the prediction step and Duckling drops straight to the full
  fix — proving it never blocks you.
- **No duck?** If the reply doesn't start with 🦆, the plugin didn't load or
  auto-run is off. Run `/reload-plugins`, check `duckling gate`
  (`alwaysOn` should be `true`), and confirm `node` is on your `PATH`.

---

## Facilitator answer key (keep off screen)

<details>
<summary>Spoilers — the real output and the fix</summary>

**`loop-timeout.js`** prints (all five lines identical):

```text
Fired handler 5: undefined
Fired handler 5: undefined
Fired handler 5: undefined
Fired handler 5: undefined
Fired handler 5: undefined
```

`var i` is function-scoped, so all five callbacks close over the **same** `i`.
By the time any timer fires, the loop has finished and `i === 5`, so
`buttons[5]` is `undefined`. The fix is a per-iteration binding — change `var`
to `let i` (each iteration gets its own `i`), or capture the value with an IIFE.

**Pattern:** a closure captures the *variable*, not its value at creation time;
`let` in a loop gives each iteration a fresh binding.

**`transfer.js`** prints `14 14 14` (not the intuitive `11 12 13`) for the same
reason — the three arrow functions all close over the one `var n`, which is `4`
after the loop. Same fix: `let n`. If the learner predicts `14 14 14` (or `let`
as the fix), the concept **transferred**.

</details>
