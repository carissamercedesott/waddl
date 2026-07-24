/**
 * Interventions — the pluggable unit of Waddl. An intervention is one cognitive
 * strategy for turning "here's the answer" into a learning moment. New research
 * ideas are added by implementing this interface and registering it; nothing
 * else in the engine needs to change.
 *
 * v1 implements `prediction` and `transfer`. Everything else is registered as a
 * declared-but-unavailable extension point (see `registry.ts`).
 */

import type { ConceptId, InterventionKind, PromptSpec } from "../types.js";

export interface InterventionContext {
  concept: ConceptId;
}

export interface Intervention {
  kind: InterventionKind;
  label: string;
  /** One-line description of the cognitive strategy. */
  description: string;
  /** False for declared-but-not-yet-built interventions (extension points). */
  available: boolean;
  /**
   * Produce the prompt to present for this intervention and concept.
   * Unavailable interventions throw {@link InterventionNotImplementedError}.
   */
  buildPrompt(context: InterventionContext): PromptSpec;
}

/** Thrown when an extension-point intervention is invoked before it's built. */
export class InterventionNotImplementedError extends Error {
  constructor(kind: InterventionKind) {
    super(
      `Intervention "${kind}" is a declared extension point but is not implemented yet.`,
    );
    this.name = "InterventionNotImplementedError";
  }
}

/**
 * Helper to declare a not-yet-built intervention. It appears in the registry
 * (so tooling and docs can list it) but throws if actually invoked.
 */
export function plannedIntervention(
  kind: InterventionKind,
  label: string,
  description: string,
): Intervention {
  return {
    kind,
    label,
    description,
    available: false,
    buildPrompt() {
      throw new InterventionNotImplementedError(kind);
    },
  };
}

export * from "./prediction.js";
export * from "./transfer.js";
export * from "./registry.js";
