/**
 * @waddl/learning-engine
 *
 * Framework-agnostic logic for Waddl's learning-focused interaction patterns.
 * This is the reusable core the Claude Code plugin (and any other front end)
 * builds on. See ../README.md and the project design principles.
 *
 * STATUS: early scaffold — the public surface is stubbed. See each module's
 * `@todo` notes for what remains.
 */

export * from "./types.js";
export * from "./session/index.js";
export * from "./learner-model/index.js";
export * from "./hints/index.js";
export * from "./fading/index.js";
export * from "./prompts/index.js";
