/**
 * Assistance fading — reduce scaffolding as competence grows, and restore it
 * when the learner struggles (docs/design-principles.md §4). Fading must be
 * reversible: struggling is a signal to scaffold again, not a judgment.
 *
 * STATUS: stubbed.
 */

import type { ConceptId, LearnerModel } from "../types.js";
import { estimateCompetence } from "../learner-model/index.js";

/** Above this estimated competence, the engine begins to fade assistance. */
export const FADE_THRESHOLD = 0.75;

/**
 * Whether assistance should currently be faded for this concept.
 *
 * STUB: a simple threshold on estimated competence. A real implementation
 * would consider trend and recency (is competence rising?), and add hysteresis
 * so assistance doesn't flicker on and off.
 *
 * @todo Replace the flat threshold with a trend-aware, hysteretic policy.
 */
export function shouldFade(model: LearnerModel, concept: ConceptId): boolean {
  return estimateCompetence(model, concept) >= FADE_THRESHOLD;
}

/**
 * A scalar assistance level in [0, 1], where 1 = full scaffolding and 0 = none.
 *
 * STUB: returns `1 - competence` as a first-order placeholder.
 *
 * @todo Shape this curve and gate it on {@link shouldFade}.
 */
export function assistanceLevel(model: LearnerModel, concept: ConceptId): number {
  return 1 - estimateCompetence(model, concept);
}
