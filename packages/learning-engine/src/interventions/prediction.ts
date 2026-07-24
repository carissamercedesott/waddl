/**
 * Prediction intervention (v1) — expose the learner's mental model before any
 * explanation by asking them to predict what the code does. The cognitive basis
 * is the "prediction → feedback" loop: committing to a prediction makes the
 * later mismatch salient and memorable.
 */

import { generatePredictionPrompt } from "../prompts/index.js";
import type { PromptSpec } from "../types.js";
import type { Intervention, InterventionContext } from "./index.js";

export const predictionIntervention: Intervention = {
  kind: "prediction",
  label: "Prediction",
  description:
    "Ask the learner to predict the code's behavior before revealing it, exposing their current mental model.",
  available: true,
  buildPrompt(context: InterventionContext): PromptSpec {
    return generatePredictionPrompt(context.concept);
  },
};
