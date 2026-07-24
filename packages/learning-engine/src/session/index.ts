/**
 * Learning session — Mental Model Mode modeled as a finite state machine.
 *
 * The flow is a swappable sequence of steps so future experiments can insert,
 * remove, or reorder them (add a "retrieval" step, drop "commit", …) without
 * rewriting the driver. The plugin's `mental-model` skill walks these same
 * states conversationally; this module is the typed, testable representation for
 * any front end, and the source of the persisted {@link LearningSession} record.
 *
 * The reducer is pure and real (the FSM is the point). What each step *decides*
 * — which prediction to ask, whether a transfer answer is correct — is delegated
 * to `interventions/`, `prompts/`, and `intervention-selection/`.
 */

import type {
  Confidence,
  ConceptId,
  InterventionKind,
  LearningSession,
} from "../types.js";

/** The states of the Mental Model Mode flow. */
export type LearningStep =
  | "idle"
  | "prediction"
  | "commit"
  | "reality"
  | "repair"
  | "pattern"
  | "transfer"
  | "complete";

/**
 * The default ordered sequence of steps. Experiments can define an alternative
 * order; this array is the single swap point for step composition.
 */
export const STEP_ORDER: readonly LearningStep[] = [
  "idle",
  "prediction",
  "commit",
  "reality",
  "repair",
  "pattern",
  "transfer",
  "complete",
];

/**
 * Runtime state of an in-progress session. A superset of {@link LearningSession}
 * (adds the current `step` and `solutionRevealed`); {@link toRecord} projects it
 * down to the persisted record.
 */
export interface SessionState {
  id: string;
  /** Epoch ms, supplied at creation — the engine never reads the clock. */
  timestamp: number;
  step: LearningStep;
  concept: ConceptId;
  intervention: InterventionKind;
  prediction: string | null;
  confidence: Confidence | null;
  actualBehavior: string | null;
  transferAnswer: string | null;
  transferCorrect: boolean | null;
  /** Whether the full solution has been revealed (via reality or the escape hatch). */
  solutionRevealed: boolean;
}

/**
 * Events driving the machine. `showAnswer` and `skip` are the ever-present
 * escape hatches, valid from any step — Waddl never traps the user.
 */
export type SessionEvent =
  | { type: "start" }
  | { type: "predict"; prediction: string | null }
  | { type: "commit"; confidence: Confidence }
  | { type: "reveal"; actualBehavior: string }
  | { type: "toPattern" }
  | { type: "toTransfer" }
  | { type: "answerTransfer"; answer: string | null; correct: boolean | null }
  | { type: "showAnswer" } // escape hatch: reveal solution, jump to repair
  | { type: "skip" } // escape hatch: abandon the flow
  | { type: "reset" };

export interface CreateSessionArgs {
  id: string;
  timestamp: number;
  concept?: ConceptId;
}

/** A fresh, idle session. `id` and `timestamp` are caller-supplied. */
export function createSession({
  id,
  timestamp,
  concept = "",
}: CreateSessionArgs): SessionState {
  return {
    id,
    timestamp,
    step: "idle",
    concept,
    intervention: "prediction",
    prediction: null,
    confidence: null,
    actualBehavior: null,
    transferAnswer: null,
    transferCorrect: null,
    solutionRevealed: false,
  };
}

/** The step following `step` in {@link STEP_ORDER}, or "complete" at the end. */
export function nextStep(step: LearningStep): LearningStep {
  const i = STEP_ORDER.indexOf(step);
  return i >= 0 && i < STEP_ORDER.length - 1 ? STEP_ORDER[i + 1] : "complete";
}

/** Advance the machine. Pure and side-effect-free: returns a new state. */
export function reduce(state: SessionState, event: SessionEvent): SessionState {
  switch (event.type) {
    case "start":
      return { ...state, step: "prediction", intervention: "prediction" };

    case "predict":
      return { ...state, prediction: event.prediction, step: "commit" };

    case "commit":
      return { ...state, confidence: event.confidence, step: "reality" };

    case "reveal":
      return {
        ...state,
        actualBehavior: event.actualBehavior,
        solutionRevealed: true,
        step: "repair",
      };

    case "toPattern":
      return { ...state, step: "pattern" };

    case "toTransfer":
      return { ...state, step: "transfer", intervention: "transfer" };

    case "answerTransfer":
      return {
        ...state,
        transferAnswer: event.answer,
        transferCorrect: event.correct,
        step: "complete",
      };

    case "showAnswer": // escape hatch — reveal and jump straight to repair
      return { ...state, solutionRevealed: true, step: "repair" };

    case "skip": // escape hatch — abandon the flow entirely
      return { ...state, step: "complete" };

    case "reset":
      return createSession({
        id: state.id,
        timestamp: state.timestamp,
        concept: state.concept,
      });

    default: {
      // Exhaustiveness guard — a new event type surfaces here at compile time.
      const _never: never = event;
      return _never;
    }
  }
}

/** Project runtime state down to the persisted research record. */
export function toRecord(state: SessionState): LearningSession {
  return {
    id: state.id,
    timestamp: state.timestamp,
    concept: state.concept,
    intervention: state.intervention,
    prediction: state.prediction,
    confidence: state.confidence,
    actualBehavior: state.actualBehavior,
    transferAnswer: state.transferAnswer,
    transferCorrect: state.transferCorrect,
  };
}
