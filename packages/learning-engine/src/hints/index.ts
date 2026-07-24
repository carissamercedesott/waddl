/**
 * Hint laddering — represent a graduated hint sequence and decide where on
 * the ladder to start for a given learner and concept.
 *
 * Design intent (docs/design-principles.md §3): offer help on demand, starting
 * at the *lowest* level likely to unblock the learner, and escalate only when
 * asked.
 *
 * STATUS: stubbed.
 */

import { HINT_LEVELS, type HintLevel, type LearnerModel, type ConceptId } from "../types.js";
import { estimateCompetence } from "../learner-model/index.js";

/** The next level up the ladder, or `null` if already at the most revealing. */
export function escalate(level: HintLevel): HintLevel | null {
  const i = HINT_LEVELS.indexOf(level);
  return i >= 0 && i < HINT_LEVELS.length - 1 ? HINT_LEVELS[i + 1] : null;
}

/** The next level down the ladder, or `null` if already at the least revealing. */
export function deescalate(level: HintLevel): HintLevel | null {
  const i = HINT_LEVELS.indexOf(level);
  return i > 0 ? HINT_LEVELS[i - 1] : null;
}

/**
 * Choose the starting hint level for a learner on a concept.
 *
 * STUB: always starts at "nudge" (the lowest level). A real implementation
 * would use {@link estimateCompetence} — e.g. a struggling learner might start
 * at "step", while a strong one always starts at "nudge".
 *
 * @todo Make the starting level adapt to the learner model.
 */
export function startingHintLevel(
  model: LearnerModel,
  concept: ConceptId,
): HintLevel {
  void estimateCompetence(model, concept); // referenced to document intent
  return "nudge";
}
