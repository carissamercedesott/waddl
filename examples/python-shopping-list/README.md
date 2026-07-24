# Shopping List — an intro-Python project to walk through with Duckling

A first Python project small enough for a beginner (~40 lines, one file, no
installs) but deliberately seeded with two spots where the *obvious* mental
model is wrong. Those are exactly where [Duckling](../../packages/claude-code-plugin)'s
**Mental Model Mode** shines — so this doubles as a clean live demo / recording.

**What you're building:** a tiny shopping-cart helper. Shoppers add items to a
cart, you back a cart up before changing it, and you total up a cart that can
include a bundle of items.

## Run it

```bash
python3 examples/python-shopping-list/shopping.py
```

It runs and prints — but two of the lines are *not* what a beginner expects.
That surprise is the hook for each teaching moment below.

## The project, as three tasks

Work these in order. Each is a normal "make this function right" task; the
conceptual moment happens when you ask Claude *why* the surprising thing occurs.

- [ ] **Task 1 — `add_item`: one cart per shopper.**
  Two different shoppers each add one item, yet they end up sharing a cart.
  Fix it so each shopper starts fresh. *(concept: mutation / shared objects)*
- [ ] **Task 2 — `duplicate_cart`: a real backup.**
  After backing Amir's cart up and adding one more item, the "backup" changed
  too. Fix it so the backup is a true snapshot. *(concept: references /
  aliasing — the same idea as Task 1 in a new shape, i.e. the transfer)*
- [ ] **Task 3 — `deep_total`: read the recursion.**
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

**Scene 1 — the shared cart (mutation).** Prompt:

```text
In examples/python-shopping-list/shopping.py, run it — why do Amir and Carissa
end up with the same cart? Is this a mutation / shared-object thing?
```

Duckling replies with the indicator **🦆 Mental Model Mode** and asks you to
predict *before* explaining, e.g. "What does `Carissa's cart:` print — (a)
`['bread']`, (b) `['apples', 'bread']`, (c) an error?" Pick **(a)** on camera
(the intuitive wrong answer), give a confidence, and it runs the file to show
reality. The repair is one line; the pattern is one line.

**Scene 2 — transfer (aliasing).** This is the payoff of the whole project —
same concept, different shape. Prompt:

```text
Now why did `saved` (the backup from duplicate_cart) also change after I added
milk to Amir's cart? Feels related — same object again?
```

If you predict that `backup = cart` just names the *same* list (so `.copy()` /
`list(cart)` is the fix), the concept **transferred** — which is the exact thing
Waddl measures.

**Scene 3 (optional) — recursion.** Prompt:

```text
In shopping.py, explain deep_total — what's the base case and why doesn't it
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
Amir's cart:    ['apples', 'bread']
Carissa's cart: ['apples', 'bread']
Amir now:       ['apples', 'bread', 'milk']
Backup:         ['apples', 'bread', 'milk']
Total price:    14
```

**Task 1 (mutation).** `def add_item(item, cart=[])` — the default list is
created **once**, at definition time, and reused on every call that omits
`cart`. So Amir and Carissa append into the *same* list (Amir's cart even shows
`bread`, which he never added). Fix:

```python
def add_item(item, cart=None):
    if cart is None:
        cart = []
    cart.append(item)
    return cart
```

**Pattern:** default argument values are evaluated once, not per call — never
use a mutable default; use `None` and create a fresh one inside.

**Task 2 (aliasing — the transfer).** `backup = cart` binds a second **name** to
the same list, so mutating `cart` later also changes `backup`. Fix: copy it —
`backup = cart.copy()` (or `list(cart)`; `copy.deepcopy` if nested). Same
underlying idea as Task 1 ("it's the same object"), which is why predicting it
correctly counts as transfer.

**Task 3 (recursion).** Base case: a non-list price is added directly; the loop
over an empty list adds nothing. Each nested list recurses on something strictly
smaller, so it always bottoms out. `[3, [5, 2], 4]` → `3 + (5 + 2) + 4` = **14**.

</details>
