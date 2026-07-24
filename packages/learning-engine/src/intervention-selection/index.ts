/**
 * Intervention selection — given a concept (and, later, the learner model),
 * choose which intervention to run. Kept separate from the interventions
 * themselves so selection policy can evolve (adaptive, misconception-driven)
 * without touching any individual intervention.
 *
 * v1 policy is fixed and simple: Mental Model Mode opens with `prediction` and
 * closes with a `transfer` check. That's the whole selector today; the
 * `learnerModel` parameter is accepted now so the signature is stable when an
 * adaptive policy replaces the body.
 */

import { getIntervention } from "../interventions/registry.js";
import type { Intervention } from "../interventions/index.js";
import type { ConceptId, LearnerModel } from "../types.js";

export interface SelectionContext {
  concept: ConceptId;
  /** Optional — reserved for adaptive selection. Unused in v1. */
  learnerModel?: LearnerModel;
}

/** The intervention to open a session with. v1: always `prediction`. */
export function selectOpeningIntervention(_context: SelectionContext): Intervention {
  // Non-null: `prediction` is always registered and available.
  return getIntervention("prediction")!;
}

/** The intervention used to check whether the concept transferred. v1: `transfer`. */
export function selectTransferIntervention(_context: SelectionContext): Intervention {
  return getIntervention("transfer")!;
}
