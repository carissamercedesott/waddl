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

import { createHash, randomBytes } from "node:crypto";
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

/**
 * Accountability lock. This is a *commitment device*, not a security control:
 * the config is a local file, so a determined user can bypass it. The salted
 * hash only stops the passcode from sitting in plaintext.
 */
interface LockConfig {
  enforced: boolean;
  salt?: string;
  offHash?: string;
  /** When true (the default), the hook auto-runs Mental Model Mode. */
  alwaysOn?: boolean;
}

const hashPasscode = (salt: string, passcode: string): string =>
  createHash("sha256").update(`${salt}:${passcode}`).digest("hex");

export class FileStore {
  readonly home: string;
  private readonly statePath: string;
  private readonly recordsPath: string;
  private readonly configPath: string;

  constructor(home: string = process.env.DUCKLING_HOME ?? join(homedir(), ".duckling")) {
    this.home = home;
    this.statePath = join(home, "state.json");
    this.recordsPath = join(home, "sessions.jsonl");
    this.configPath = join(home, "config.json");
    if (!existsSync(home)) mkdirSync(home, { recursive: true });
  }

  private readConfig(): LockConfig {
    if (!existsSync(this.configPath)) return { enforced: false };
    return JSON.parse(readFileSync(this.configPath, "utf8")) as LockConfig;
  }

  private writeConfig(config: LockConfig): void {
    writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }

  /** True when Learn Mode is locked on. */
  isEnforced(): boolean {
    return this.readConfig().enforced === true;
  }

  /** Lock Learn Mode on behind a passcode. Fails if already locked. */
  lock(passcode: string): boolean {
    if (this.isEnforced()) return false;
    const salt = randomBytes(16).toString("hex");
    this.writeConfig({
      ...this.readConfig(),
      enforced: true,
      salt,
      offHash: hashPasscode(salt, passcode),
    });
    return true;
  }

  /** Unlock only when the passcode matches. Returns whether it was unlocked. */
  unlock(passcode: string): boolean {
    const config = this.readConfig();
    if (!config.enforced) return true;
    if (!config.salt || !config.offHash) return false;
    if (hashPasscode(config.salt, passcode) !== config.offHash) return false;
    this.writeConfig({ ...config, enforced: false, salt: undefined, offHash: undefined });
    return true;
  }

  /**
   * Whether the always-on hook should auto-run Mental Model Mode. Defaults to
   * true; a lock forces it on.
   */
  alwaysOnEnabled(): boolean {
    const config = this.readConfig();
    if (config.enforced) return true;
    return config.alwaysOn !== false;
  }

  /** Turn always-on on/off. Turning it off is refused while locked. */
  setAlwaysOn(on: boolean): boolean {
    const config = this.readConfig();
    if (config.enforced && !on) return false;
    this.writeConfig({ ...config, alwaysOn: on });
    return true;
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
