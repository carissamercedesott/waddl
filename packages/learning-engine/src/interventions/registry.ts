/**
 * Intervention registry — the single place that knows every intervention,
 * built or planned. Extending Waddl with a new experiment is: implement an
 * {@link Intervention}, then `registerIntervention(...)` (or add it here).
 */

import type { InterventionKind } from "../types.js";
import {
  plannedIntervention,
  type Intervention,
} from "./index.js";
import { predictionIntervention } from "./prediction.js";
import { transferIntervention } from "./transfer.js";

const registry = new Map<InterventionKind, Intervention>();

function register(intervention: Intervention): void {
  registry.set(intervention.kind, intervention);
}

// --- v1: implemented ------------------------------------------------------
register(predictionIntervention);
register(transferIntervention);

// --- extension points: declared but not implemented -----------------------
// Each is a real registry entry so tooling/docs can enumerate the roadmap, but
// invoking it throws until someone builds it. Implement one to add a new
// experiment — see docs/interventions.md.
register(
  plannedIntervention(
    "self-explanation",
    "Self-explanation",
    "Prompt the learner to explain why the code behaves as it does.",
  ),
);
register(
  plannedIntervention(
    "worked-example",
    "Worked example",
    "Show a fully worked solution with each step justified.",
  ),
);
register(
  plannedIntervention(
    "progressive-hints",
    "Progressive hints",
    "Reveal graduated hints on demand (attention → concept → code).",
  ),
);
register(
  plannedIntervention(
    "execution-visualization",
    "Execution visualization",
    "Trace or visualize the code's execution instead of explaining in prose.",
  ),
);
register(
  plannedIntervention(
    "contrast-case",
    "Contrast case",
    "Compare two near-identical snippets to isolate the concept that matters.",
  ),
);

/** Register or override an intervention at runtime (for experiments/tests). */
export function registerIntervention(intervention: Intervention): void {
  register(intervention);
}

/** Look up an intervention by kind. */
export function getIntervention(kind: InterventionKind): Intervention | undefined {
  return registry.get(kind);
}

/** Every registered intervention, built or planned. */
export function allInterventions(): Intervention[] {
  return [...registry.values()];
}

/** Only the interventions implemented in the current version. */
export function availableInterventions(): Intervention[] {
  return allInterventions().filter((i) => i.available);
}
