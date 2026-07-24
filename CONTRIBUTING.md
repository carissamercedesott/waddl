# Contributing to Waddl

Thanks for your interest in Waddl! This is an independent, open-source
research project, and contributions of many kinds are welcome — code,
study design, replication, documentation, and thoughtful critique.

Please also read our [Code of Conduct](CODE_OF_CONDUCT.md). By
participating, you agree to uphold it.

## Ways to contribute

- **Try it and report friction.** Use the Claude Code plugin and open
  issues for bugs, confusing behavior, or missing patterns.
- **Propose or critique an interaction pattern.** Adaptive hints,
  fading, self-explanation, reflection checkpoints — or a new one. Open
  an issue describing the pattern, the learning-science rationale, and
  how it could be evaluated.
- **Help with a study.** Study design, pre-registration, replication,
  or analysis. See [`studies/`](studies/) and
  [`docs/study-protocols/`](docs/study-protocols/).
- **Improve docs or the website.**

## Ground rules

1. **Open an issue before large changes.** For anything beyond a small
   fix, discuss it first so effort isn't wasted.
2. **Keep research and code separated correctly.** Code lives under
   `packages/`, `examples/`, `website/`. Research writing lives under
   `docs/` and `studies/`. They carry different licenses (Apache 2.0 vs.
   CC BY 4.0) — see the [README](README.md#license).
3. **Never commit participant data.** No raw study data, no PII, no
   secrets. Share only anonymized/aggregated results, and only per an
   approved protocol. See [`docs/privacy.md`](docs/privacy.md).
4. **Ground claims in evidence.** When proposing a learning-focused
   pattern, cite the relevant research or clearly mark it as a hypothesis
   to be tested.

## Development workflow

```bash
# Fork, then:
git clone https://github.com/<you>/waddl.git
cd waddl
git checkout -b my-change
# make your change, then:
git commit -m "Describe what changed and why"
git push origin my-change
# open a pull request against master
```

- Write clear commit messages (imperative mood: "Add", "Fix",
  "Refactor").
- Keep pull requests focused; one logical change per PR.
- Include or update tests and docs where relevant.

## Licensing of contributions

By contributing, you agree that your contributions will be licensed
under the same terms as the part of the repository they touch:

- Code contributions → **Apache License 2.0**.
- Research/writing contributions (`docs/`, `studies/`) → **CC BY 4.0**.

## Questions

Open an issue or start a discussion. Thanks for helping build tools that
make people more capable over time — not less.
