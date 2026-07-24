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
 * Self-reported confidence, 1–5 (1 = very unsure … 5 = very confident).
 * Captured in the Mental Model Mode flow's commit step.
 */
export type Confidence = 1 | 2 | 3 | 4 | 5;

/** Human-readable labels for each {@link Confidence} level. */
export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  1: "Very unsure",
  2: "Somewhat unsure",
  3: "Neutral",
  4: "Fairly confident",
  5: "Very confident",
};

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

/**
 * A cognitive intervention the engine can run. Only `prediction` and `transfer`
 * are implemented in v1; the rest are registered as extension points (see
 * `interventions/registry.ts`). Adding a new intervention is the primary way to
 * extend Waddl with a new experiment.
 */
export type InterventionKind =
  | "prediction"
  | "transfer"
  | "self-explanation"
  | "worked-example"
  | "progressive-hints"
  | "execution-visualization"
  | "contrast-case";

/** One option in a multiple-choice prompt (preferred for prediction). */
export interface PromptChoice {
  id: string;
  label: string;
}

/**
 * A structured prompt to present to the learner. Front ends (the plugin skill,
 * a future React app) render this; the engine never renders UI itself.
 */
export interface PromptSpec {
  /** The single question or instruction to present. */
  text: string;
  /** Multiple-choice options, when the intervention prefers them. */
  choices?: PromptChoice[];
  /** The always-available escape hatch, e.g. "Skip" / "Show Answer". */
  escapeHatch: string;
}

/**
 * The persisted record of one learning interaction. This is the unit of
 * research data — it is what `storage/` saves and what `analytics/` will read.
 * Kept minimal and non-identifying by design (see docs/privacy.md).
 */
export interface LearningSession {
  id: string;
  /** Epoch milliseconds. Supplied by the caller — the engine never reads the clock. */
  timestamp: number;
  concept: ConceptId;
  intervention: InterventionKind;
  /** The learner's prediction (free text or a choice id), or null if skipped. */
  prediction: string | null;
  confidence: Confidence | null;
  /** What the code actually did, revealed in the "reality" step. */
  actualBehavior: string | null;
  /** The learner's answer to the transfer question, or null if not reached. */
  transferAnswer: string | null;
  /**
   * Whether the concept appeared to transfer to the new example. `null` until a
   * transfer check has been run and graded. The core research outcome.
   */
  transferCorrect: boolean | null;
}
