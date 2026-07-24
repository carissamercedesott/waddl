/**
 * Shared types for the Waddl learning engine.
 *
 * These describe the *shape* of the engine's inputs and outputs. The logic
 * that produces them lives in the sibling modules (`hints/`, `fading/`,
 * `learner-model/`, `prompts/`) and is currently stubbed.
 */

/** A concept or skill the learner is working with (e.g. "recursion", "async"). */
export type ConceptId = string;

/**
 * A graduated level of assistance, from least to most revealing.
 * The engine's goal is to offer the *lowest* level that unblocks the learner.
 */
export type HintLevel = "nudge" | "step" | "solution";

/** Ordered from least to most assistance — useful for stepping up/down. */
export const HINT_LEVELS: readonly HintLevel[] = ["nudge", "step", "solution"];

/** A kind of metacognitive prompt the engine may choose to surface. */
export type PromptKind = "self-explanation" | "reflection";

/**
 * An observed learner event that can update the learner model.
 * Kept deliberately coarse and non-identifying — see docs/privacy.md.
 */
export interface LearnerSignal {
  concept: ConceptId;
  /** What happened. */
  kind:
    | "solved-unaided"
    | "solved-with-hint"
    | "requested-hint"
    | "gave-up"
    | "self-explained";
  /** The hint level involved, when relevant. */
  hintLevel?: HintLevel;
  /** Optional monotonic timestamp (ms). The engine never requires wall-clock. */
  at?: number;
}

/**
 * A lightweight, privacy-preserving estimate of what the learner appears to
 * know. Intentionally minimal (see docs/privacy.md): a competence score in
 * [0, 1] per concept, plus the signals that produced it.
 */
export interface LearnerModel {
  /** Estimated competence per concept, in the range [0, 1]. */
  competence: Record<ConceptId, number>;
  /** The signals observed so far (bounded history in a real implementation). */
  history: LearnerSignal[];
}

/** Context the engine uses to decide what (if anything) to offer. */
export interface AssistContext {
  concept: ConceptId;
  /** Whether the learner explicitly asked for help. */
  requested: boolean;
}
