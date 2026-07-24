# Research agenda

> Licensed under CC BY 4.0 (see [LICENSE-CC-BY-4.0.md](LICENSE-CC-BY-4.0.md)).

Waddl studies how AI coding assistance can be designed to support
learning — not just completion. This document sketches the questions we
care about and the order we plan to tackle them. It is a living document.

## Motivating premise

AI coding assistants are extraordinary at producing correct output
quickly. For a learner, "correct output quickly" can remove exactly the
productive struggle that builds durable skill — the *desirable
difficulties* (Bjork & Bjork) that make knowledge stick and transfer.

Waddl asks whether we can design assistance that preserves productivity
*and* learning by adapting to the learner and fading over time.

## Themes and questions

### 1. Adaptive hints
Graduated help — from a conceptual nudge, to a worked step, to a full
solution — offered on demand rather than by default.
- Do adaptive hints improve retention and transfer vs. direct solutions?
- What is the productivity cost, and for whom is it worth it?
- How should the hint ladder be structured for programming tasks?

### 2. Assistance fading
Systematically reducing scaffolding as the learner demonstrates
competence (the *expertise reversal effect*).
- Does fading improve unaided performance later?
- How do we detect competence well enough to fade responsibly?

### 3. Self-explanation prompts
Prompting learners to explain *why* code works, predict output, or
justify a choice (the *self-explanation effect*).
- Do self-explanation prompts improve conceptual understanding?
- When are they motivating vs. annoying?

### 4. Reflection checkpoints
Brief, well-timed pauses to plan, reflect, or connect to prior knowledge.
- Do checkpoints improve problem decomposition and metacognition?
- What timing/placement minimizes disruption?

### 5. Learner modeling
The shared substrate for the above: a lightweight, privacy-preserving
model of what the learner appears to know.
- What signals are informative *and* ethical to use?
- How do we avoid mislabeling and over-personalization?

## Roadmap (rough)

| Phase | Focus |
| --- | --- |
| 0 | Prototype plugin + interaction patterns; internal dogfooding |
| 1 | **experiment-001**: adaptive hints vs. direct solutions |
| 2 | Assistance fading study |
| 3 | Self-explanation / reflection studies |
| 4 | Longitudinal transfer & retention |

## Methodological commitments

- Pre-register hypotheses and analysis plans before collecting data.
- Prefer within-subjects and transfer measures over completion time alone.
- Publish protocols, materials, and (anonymized) results openly.
- Treat every finding as preliminary until replicated.
