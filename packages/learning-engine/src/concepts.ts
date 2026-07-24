/**
 * The concept taxonomy — the conceptually important programming ideas Waddl
 * intervenes on. Mental Model Mode fires only when a request touches one of
 * these (not boilerplate or syntax).
 *
 * This list is intentionally small and editable: adding a concept is a
 * one-entry change and is a natural extension point for new experiments.
 */

import type { ConceptId } from "./types.js";

export interface Concept {
  id: ConceptId;
  /** Human-readable name. */
  label: string;
  /**
   * Lowercase trigger terms used by the heuristic detector. Matched as
   * word-ish substrings against the user's request. Keep them specific enough
   * to avoid firing on unrelated text.
   */
  keywords: string[];
  /** One-line description of the mental model this concept concerns. */
  mentalModel: string;
}

export const CONCEPTS: readonly Concept[] = [
  {
    id: "closures",
    label: "Closures",
    keywords: ["closure", "captured variable", "stale closure", "capture"],
    mentalModel: "A function captures the environment where it was created.",
  },
  {
    id: "react-state",
    label: "React state",
    keywords: ["usestate", "setstate", "react state", "re-render", "rerender"],
    mentalModel: "State updates are scheduled, not applied synchronously.",
  },
  {
    id: "derived-state",
    label: "Derived state",
    keywords: ["derived state", "duplicate state", "sync state", "useeffect to set"],
    mentalModel: "State that can be computed should be computed, not stored.",
  },
  {
    id: "async",
    label: "Async / await",
    keywords: ["async", "await", "promise", "then(", "microtask", "race condition"],
    mentalModel: "Async work resumes later; nothing pauses the surrounding call.",
  },
  {
    id: "event-loop",
    label: "Event loop",
    keywords: ["event loop", "settimeout", "microtask", "task queue", "callback queue"],
    mentalModel: "Callbacks run after the current stack unwinds, in a defined order.",
  },
  {
    id: "concurrency",
    label: "Concurrency",
    keywords: ["concurrency", "concurrent", "parallel", "data race", "lock", "mutex"],
    mentalModel: "Interleaved operations can observe each other's partial state.",
  },
  {
    id: "references",
    label: "References vs values",
    keywords: ["reference", "by reference", "identity", "same object", "aliasing"],
    mentalModel: "Two names can point at the same object; copies do not.",
  },
  {
    id: "mutation",
    label: "Mutation",
    keywords: ["mutate", "mutation", "in place", "mutating", "immutable"],
    mentalModel: "Mutating shared data affects everyone holding a reference to it.",
  },
  {
    id: "recursion",
    label: "Recursion",
    keywords: ["recursion", "recursive", "base case", "call stack", "stack overflow"],
    mentalModel: "Each call has its own frame; the base case ends the descent.",
  },
  {
    id: "memoization",
    label: "Memoization",
    keywords: ["memo", "memoize", "usememo", "usecallback", "cache key", "dependency array"],
    mentalModel: "Cached results are reused only when the inputs are unchanged.",
  },
];

/** Look up a concept by id. */
export function getConcept(id: ConceptId): Concept | undefined {
  return CONCEPTS.find((c) => c.id === id);
}
