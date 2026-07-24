/**
 * Transfer intervention (v1) — after the concept is repaired, present a
 * DIFFERENT example that exercises the same idea and check whether the learner
 * can apply it. Transfer to a novel surface is the real evidence of learning;
 * getting the original example right can be mere recall.
 */

import { generateTransferPrompt } from "../prompts/index.js";
import type { PromptSpec } from "../types.js";
import type { Intervention, InterventionContext } from "./index.js";

export const transferIntervention: Intervention = {
  kind: "transfer",
  label: "Transfer check",
  description:
    "Pose a different example of the same concept to test whether understanding transferred.",
  available: true,
  buildPrompt(context: InterventionContext): PromptSpec {
    return generateTransferPrompt(context.concept);
  },
};

/**
 * Grade a transfer answer. v1 is a stub: real grading (comparing the learner's
 * answer to expected behavior, tolerant of phrasing) is an extension point,
 * ideally model-assisted. Returns `null` = "not yet gradable".
 *
 * @todo Implement grading; feed the result into the learner model and analytics.
 */
export function gradeTransfer(_answer: string | null): boolean | null {
  return null;
}
