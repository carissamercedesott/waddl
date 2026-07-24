# Protocol — Experiment 001: Adaptive hints vs. direct solutions

> Status: **DRAFT / PILOT** — not yet pre-registered. Numbers below are
> placeholders to be fixed before data collection.
>
> Licensed under CC BY 4.0 (see [../LICENSE-CC-BY-4.0.md](../LICENSE-CC-BY-4.0.md)).

## 1. Research question

Does receiving **adaptive, graduated hints** (conceptual nudge → worked
step → full solution, on demand) — versus **immediate full solutions** —
change how well developers learn from an AI coding assistant?

## 2. Hypotheses

- **H1 (transfer):** Participants in the adaptive-hints condition perform
  better on a later *unaided* transfer task than those in the
  direct-solution condition.
- **H2 (understanding):** Participants in the adaptive-hints condition
  report higher understanding of the solution.
- **H3 (cost):** Adaptive hints increase time-on-task on the *assisted*
  problem relative to direct solutions.

(H1/H2 are the outcomes of interest; H3 quantifies the trade-off.)

## 3. Design

- **Type:** Within-subjects, counterbalanced (each participant
  experiences both conditions on matched-difficulty problems), with
  order counterbalanced to control for practice effects.
- **Conditions:**
  - *Adaptive hints* — the plugin offers `hint · step · solution` on
    demand and defaults to withholding the full solution.
  - *Direct solution* — the plugin provides the full solution
    immediately.
- **Blinding:** Participants are not told which condition is "expected"
  to help; analysis is pre-specified.

## 4. Participants

- **Target N:** _TBD_ (power analysis to be run before collection).
- **Recruitment:** Voluntary; developers/learners who opt in.
- **Inclusion:** Comfortable writing basic code in the study language.
- **Consent:** Informed, opt-in; withdrawal allowed at any time
  (see [privacy.md](../privacy.md)).

## 5. Materials

- Two matched pairs of programming tasks (assisted + transfer per
  condition), balanced for difficulty and topic.
- The Waddl Claude Code plugin configured for each condition.
- Instruments: post-task understanding self-report; short transfer task
  scored with a rubric.

## 6. Measures

- **Primary:** Transfer-task performance (unaided), rubric-scored.
- **Secondary:** Self-reported understanding (Likert); assisted
  time-on-task; number/level of hints requested (adaptive condition).

## 7. Procedure

1. Consent + brief demographic/experience questions.
2. Warm-up task (familiarize with the interface).
3. Assisted task under condition A.
4. Unaided transfer task for A + understanding self-report.
5. Repeat 3–4 for condition B (counterbalanced order).
6. Debrief.

## 8. Analysis plan

- Primary: paired comparison of transfer scores across conditions
  (test TBD after distribution check), with order as a covariate.
- Pre-specified exclusions (e.g. non-completion, technical failure).
- Stopping rule: fixed N from power analysis; no optional stopping.

## 9. Ethics & privacy

- Opt-in informed consent; right to withdraw and to deletion.
- Data minimization; only anonymized/aggregated results are published.
- Raw data is never committed to the repository.

## 10. Open questions / TODO

- [ ] Choose study language and author matched task pairs.
- [ ] Run power analysis; set N.
- [ ] Pre-register (OSF) and link here.
- [ ] Pilot (n≈5) and revise.
