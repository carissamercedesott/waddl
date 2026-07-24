/**
 * Learning session — the Learn Mode flow modeled as a finite state machine.
 *
 * The flow is a *swappable sequence of steps* so future experiments can insert,
 * remove, or reorder steps (spaced repetition, transfer problems, retrieval
 * practice, …) without rewriting the driver. The plugin's `learn` skill walks a
 * user through these same states conversationally; this module is the typed,
 * reusable representation for any front end.
 *
 * The reducer is real (the FSM is the point), but everything it *decides* —
 * which hint to show, whether to prompt — is delegated to the other engine
 * modules, which are stubbed. See docs/design-principles.md.
 */

import type { Confidence, ConceptId, HintLevel } from "../types.js";

/** The states of the Learn Mode flow. */
export type LearningStep =
  | "idle"
  | "prediction"
  | "confidence"
  | "hint"
  | "attempt"
  | "reflection"
  | "pattern"
  | "complete";

/**
 * The default ordered sequence of steps. Experiments can provide an alternative
 * order (e.g. inserting "retrieval" before "prediction") — this array is the
 * single swap point for step composition.
 */
export const STEP_ORDER: readonly LearningStep[] = [
  "idle",
  "prediction",
  "confidence",
  "hint",
  "attempt",
  "reflection",
  "pattern",
  "complete",
];

/** Immutable snapshot of an in-progress learning session. */
export interface SessionState {
  step: LearningStep;
  concept: ConceptId;
  /** The learner's free-text prediction, or `null` if they said "I don't know". */
  prediction: string | null;
  confidence: Confidence | null;
  /** Highest hint level revealed so far. */
  hintLevel: HintLevel | null;
  attempts: number;
  /** Whether the full solution has been revealed (via success or escape hatch). */
  solutionRevealed: boolean;
}

/** Events that drive the machine. `showAnswer` is the ever-present escape hatch. */
export type SessionEvent =
  | { type: "start"; concept: ConceptId }
  | { type: "predict"; prediction: string | null }
  | { type: "setConfidence"; confidence: Confidence }
  | { type: "requestHint" }
  | { type: "attempt" }
  | { type: "showAnswer" } // escape hatch — valid in ANY step
  | { type: "reflect" }
  | { type: "reset" };

/** A fresh, idle session for a concept. */
export function createSession(concept: ConceptId = ""): SessionState {
  return {
    step: "idle",
    concept,
    prediction: null,
    confidence: null,
    hintLevel: null,
    attempts: 0,
    solutionRevealed: false,
  };
}

/** The step that follows `step` in {@link STEP_ORDER}, or "complete" at the end. */
export function nextStep(step: LearningStep): LearningStep {
  const i = STEP_ORDER.indexOf(step);
  return i >= 0 && i < STEP_ORDER.length - 1 ? STEP_ORDER[i + 1] : "complete";
}

/**
 * Advance the machine. Pure and side-effect-free: returns a new state.
 *
 * The escape hatch (`showAnswer`) is honored from any step — it reveals the
 * solution and jumps to reflection, never blocking the user. Deciding *which*
 * hint text or *which* reflection question to show is the job of the `hints/`
 * and `prompts/` modules (stubbed), not this reducer.
 */
export function reduce(state: SessionState, event: SessionEvent): SessionState {
  switch (event.type) {
    case "start":
      return { ...createSession(event.concept), step: "prediction" };

    case "predict":
      return { ...state, prediction: event.prediction, step: "confidence" };

    case "setConfidence":
      return { ...state, confidence: event.confidence, step: "hint" };

    case "requestHint":
      // Escalation of the concrete hint level lives in hints/ (stubbed here).
      return { ...state, step: "hint" };

    case "attempt":
      return { ...state, attempts: state.attempts + 1, step: "attempt" };

    case "showAnswer": // escape hatch from any step
      return { ...state, solutionRevealed: true, step: "reflection" };

    case "reflect":
      return { ...state, step: "pattern" };

    case "reset":
      return createSession(state.concept);

    default: {
      // Exhaustiveness guard — a new event type will surface here at compile time.
      const _never: never = event;
      return _never;
    }
  }
}
