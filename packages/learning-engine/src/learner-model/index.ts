/**
 * Learner model — a lightweight, privacy-preserving estimate of what the
 * learner appears to know. See docs/privacy.md for the data commitments this
 * module must uphold (data minimization, no PII).
 *
 * STATUS: stubbed. Signatures are stable-ish; the estimation logic is not
 * implemented.
 */

import type { ConceptId, LearnerModel, LearnerSignal } from "../types.js";

/** Competence used when a concept has never been seen. */
export const DEFAULT_COMPETENCE = 0.5;

/** Create an empty learner model. */
export function createLearnerModel(): LearnerModel {
  return { competence: {}, history: [] };
}

/**
 * Fold a new signal into the model, returning an updated copy.
 *
 * STUB: currently only records the signal in history and leaves competence
 * unchanged. A real implementation would update `competence[signal.concept]`
 * (e.g. Bayesian knowledge tracing or a simple EWMA of success/failure).
 *
 * @todo Implement competence update from the signal.
 */
export function updateLearnerModel(
  model: LearnerModel,
  signal: LearnerSignal,
): LearnerModel {
  return {
    competence: { ...model.competence },
    history: [...model.history, signal],
  };
}

/**
 * Estimate competence for a concept, in [0, 1].
 *
 * STUB: returns the stored value or {@link DEFAULT_COMPETENCE}.
 *
 * @todo Derive from recent, relevant signals rather than a stored scalar.
 */
export function estimateCompetence(
  model: LearnerModel,
  concept: ConceptId,
): number {
  return model.competence[concept] ?? DEFAULT_COMPETENCE;
}
