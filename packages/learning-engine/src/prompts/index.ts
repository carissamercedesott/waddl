/**
 * Prompt generation — turn a (concept, intervention) pair into a structured
 * {@link PromptSpec} a front end can render. Kept separate from intervention
 * *selection* (which decides WHICH intervention) and from the interventions
 * themselves (which own scoring), so any of the three can change independently.
 *
 * In the live plugin the wording is ultimately produced by Claude against the
 * `SKILL.md` instructions; these templates are the canonical specification of
 * what each prompt must contain, and are what a programmatic runtime or the
 * future React app would render directly.
 */

import { getConcept } from "../concepts.js";
import type { ConceptId, PromptSpec } from "../types.js";

/** The escape hatch text shown on every prompt — Waddl never traps the user. */
export const ESCAPE_HATCH = "Skip · Show Answer";

function conceptLabel(concept: ConceptId): string {
  return getConcept(concept)?.label ?? concept;
}

/**
 * Prediction prompt — expose the learner's current mental model BEFORE any
 * explanation. Multiple choice is preferred; the concrete options are filled in
 * by the runtime from the actual code, so the template leaves them empty.
 */
export function generatePredictionPrompt(concept: ConceptId): PromptSpec {
  return {
    text: `Before I explain — what do you think happens here? (${conceptLabel(
      concept,
    )}) Predict the output, the value received, or which branch runs.`,
    // Runtime fills `choices` from the real code; multiple choice is preferred.
    choices: [],
    escapeHatch: ESCAPE_HATCH,
  };
}

/**
 * Transfer prompt — a DIFFERENT small example testing the same concept, to
 * check whether the idea carried over rather than being memorized.
 */
export function generateTransferPrompt(concept: ConceptId): PromptSpec {
  return {
    text: `Quick transfer check — here's a different ${conceptLabel(
      concept,
    )} example. Same idea, new code: what does it do?`,
    choices: [],
    escapeHatch: ESCAPE_HATCH,
  };
}
