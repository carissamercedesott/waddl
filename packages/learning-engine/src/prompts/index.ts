/**
 * Prompt selection — decide *whether* and *which* metacognitive prompt
 * (self-explanation or reflection) is worth surfacing at a given moment
 * (docs/design-principles.md §5). Prompts that the learner resents are prompts
 * that failed, so the bar for showing one should be meaningful.
 *
 * STATUS: stubbed.
 */

import type { AssistContext, LearnerModel, PromptKind } from "../types.js";
import { estimateCompetence } from "../learner-model/index.js";

/** A prompt the engine has decided to surface, or `null` to stay silent. */
export interface PromptDecision {
  kind: PromptKind;
  /** Why this prompt was chosen — useful for logging and study analysis. */
  rationale: string;
}

/**
 * Decide whether to surface a metacognitive prompt.
 *
 * STUB: always returns `null` (surface nothing). Returning `null` is the safe
 * default — it means "don't interrupt." A real implementation would weigh the
 * learner model, recent prompt frequency (avoid over-prompting), and the
 * moment's value.
 *
 * @todo Implement selection; ensure it never over-prompts.
 */
export function selectPrompt(
  model: LearnerModel,
  context: AssistContext,
): PromptDecision | null {
  void estimateCompetence(model, context.concept); // referenced to document intent
  return null;
}
