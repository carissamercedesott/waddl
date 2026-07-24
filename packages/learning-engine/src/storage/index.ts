/**
 * Storage — local persistence of {@link LearningSession} records. No backend, no
 * accounts. The engine defines the interface and ships an in-memory
 * implementation; front ends provide an adapter for their environment:
 *
 *   - Browser / React app  → a `localStorage` adapter
 *   - Node / a plugin runtime → a JSONL-file adapter
 *
 * Both are thin wrappers over {@link SessionStore} and are intentionally left as
 * extension points here so the engine stays environment-agnostic. All records
 * are minimal and non-identifying (see docs/privacy.md).
 */

import type { LearningSession } from "../types.js";

export interface SessionStore {
  save(session: LearningSession): Promise<void>;
  /** All stored sessions, newest first is not guaranteed — callers sort. */
  all(): Promise<LearningSession[]>;
  get(id: string): Promise<LearningSession | undefined>;
  clear(): Promise<void>;
}

/** In-memory store — the default; also the reference implementation for adapters. */
export class InMemorySessionStore implements SessionStore {
  private readonly sessions = new Map<string, LearningSession>();

  async save(session: LearningSession): Promise<void> {
    this.sessions.set(session.id, session);
  }

  async all(): Promise<LearningSession[]> {
    return [...this.sessions.values()];
  }

  async get(id: string): Promise<LearningSession | undefined> {
    return this.sessions.get(id);
  }

  async clear(): Promise<void> {
    this.sessions.clear();
  }
}

/**
 * Serialize sessions to newline-delimited JSON (JSONL) — the format a Node
 * file-adapter would append to. Pure, so it's usable anywhere.
 */
export function toJsonl(sessions: LearningSession[]): string {
  return sessions.map((s) => JSON.stringify(s)).join("\n");
}

/** Parse JSONL back into records. Blank lines are ignored. */
export function fromJsonl(jsonl: string): LearningSession[] {
  return jsonl
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as LearningSession);
}
