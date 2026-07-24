/**
 * Concept detection — decide whether a request touches a conceptually important
 * programming idea (worth a learning intervention) versus boilerplate or syntax
 * (just answer). This is the gate that keeps Waddl from ever feeling like it
 * nags on trivial requests.
 *
 * v1 is a transparent keyword heuristic over the concept taxonomy. It is
 * deliberately simple and conservative; a future experiment can swap in an
 * embedding- or model-based detector behind the same `detectConcepts` signature.
 */

import { CONCEPTS, type Concept } from "../concepts.js";
import type { ConceptId } from "../types.js";

export interface ConceptMatch {
  concept: ConceptId;
  /** The keywords that matched, for transparency and debugging. */
  matched: string[];
  /** Naive confidence in [0, 1]: more distinct keyword hits ⇒ higher. */
  score: number;
}

/** Signals that a request is boilerplate/syntax and should NOT be intercepted. */
const TRIVIAL_MARKERS: readonly string[] = [
  "syntax error",
  "typo",
  "import",
  "how do i print",
  "format",
  "rename",
  "indent",
  "boilerplate",
  "scaffold",
];

function normalize(input: string): string {
  return input.toLowerCase();
}

function matchConcept(text: string, concept: Concept): ConceptMatch | null {
  const matched = concept.keywords.filter((k) => text.includes(k));
  if (matched.length === 0) return null;
  // Saturating score: 1 hit ⇒ 0.6, 2 ⇒ 0.8, 3+ ⇒ ~1.0.
  const score = Math.min(1, 0.4 + 0.2 * matched.length);
  return { concept: concept.id, matched, score };
}

/**
 * Return every concept the input plausibly touches, most confident first.
 * Empty array ⇒ nothing to intervene on.
 */
export function detectConcepts(input: string): ConceptMatch[] {
  const text = normalize(input);
  return CONCEPTS.map((c) => matchConcept(text, c))
    .filter((m): m is ConceptMatch => m !== null)
    .sort((a, b) => b.score - a.score);
}

/** True if the input looks like trivial boilerplate/syntax we should not gate. */
export function isTrivial(input: string): boolean {
  const text = normalize(input);
  return TRIVIAL_MARKERS.some((m) => text.includes(m));
}

/**
 * The gate for Mental Model Mode: is this a conceptually important request?
 * True only when a concept is detected AND the request isn't clearly trivial.
 */
export function isConceptuallyImportant(input: string): boolean {
  return !isTrivial(input) && detectConcepts(input).length > 0;
}

/** The single most likely concept, or null. */
export function topConcept(input: string): ConceptId | null {
  return detectConcepts(input)[0]?.concept ?? null;
}
