/**
 * FileStore — a Node, filesystem-backed store for Duckling.
 *
 * This is the concrete adapter the engine's `storage` module left as an
 * extension point: it persists the research log (LearningSession records) as
 * JSONL using the engine's own serialization helpers, and keeps in-progress
 * runtime state (SessionState) so the CLI can advance one step per process
 * invocation.
 *
 * Everything lives locally under $DUCKLING_HOME (default ~/.duckling). Nothing
 * is ever transmitted — see docs/privacy.md.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  fromJsonl,
  toJsonl,
  toRecord,
  type LearningSession,
  type SessionState,
} from "@waddl/learning-engine";

interface StateFile {
  activeId: string | null;
  sessions: Record<string, SessionState>;
}

export class FileStore {
  readonly home: string;
  private readonly statePath: string;
  private readonly recordsPath: string;

  constructor(home: string = process.env.DUCKLING_HOME ?? join(homedir(), ".duckling")) {
    this.home = home;
    this.statePath = join(home, "state.json");
    this.recordsPath = join(home, "sessions.jsonl");
    if (!existsSync(home)) mkdirSync(home, { recursive: true });
  }

  private readStateFile(): StateFile {
    if (!existsSync(this.statePath)) return { activeId: null, sessions: {} };
    return JSON.parse(readFileSync(this.statePath, "utf8")) as StateFile;
  }

  private writeStateFile(data: StateFile): void {
    writeFileSync(this.statePath, JSON.stringify(data, null, 2));
  }

  /** The id of the most recently touched session, if any. */
  getActiveId(): string | null {
    return this.readStateFile().activeId;
  }

  getState(id: string): SessionState | undefined {
    return this.readStateFile().sessions[id];
  }

  /** Save runtime state and upsert its projected research record in one step. */
  putState(state: SessionState): void {
    const data = this.readStateFile();
    data.sessions[state.id] = state;
    data.activeId = state.id;
    this.writeStateFile(data);
    this.saveRecord(toRecord(state));
  }

  /** Every persisted research record, in insertion order. */
  allRecords(): LearningSession[] {
    if (!existsSync(this.recordsPath)) return [];
    return fromJsonl(readFileSync(this.recordsPath, "utf8"));
  }

  /** Upsert a record by id (partial sessions are captured too). */
  saveRecord(record: LearningSession): void {
    const records = this.allRecords();
    const idx = records.findIndex((r) => r.id === record.id);
    if (idx >= 0) records[idx] = record;
    else records.push(record);
    writeFileSync(this.recordsPath, `${toJsonl(records)}\n`);
  }
}
