/**
 * @waddl/learning-engine
 *
 * The research layer's reusable core: it models what a learner understands
 * (concept detection, learner model), chooses a cognitive intervention
 * (interventions + selection), drives one interaction (session FSM + prompts),
 * and persists/measures the result (storage + analytics). The Claude Code plugin
 * and any future front end build on these modules.
 *
 * Architecture (one concern per module, all pluggable):
 *   concepts / concept-detection   → what the request is about, is it worth it
 *   interventions / …-selection     → which cognitive strategy to run
 *   prompts                         → the strategy's concrete prompt spec
 *   session                         → the interaction as a finite state machine
 *   storage                         → local persistence of session records
 *   analytics                       → measuring whether learning transfers
 *   learner-model / hints / fading  → shared substrate for adaptive experiments
 *
 * STATUS: v1 implements the Prediction and Transfer interventions and the
 * Mental Model Mode flow. Everything else is a typed, documented extension
 * point. See ../README.md and the repo docs/.
 */

export * from "./types.js";
export * from "./concepts.js";
export * from "./concept-detection/index.js";
export * from "./prompts/index.js";
export * from "./interventions/index.js";
export * from "./intervention-selection/index.js";
export * from "./session/index.js";
export * from "./storage/index.js";
export * from "./analytics/index.js";
export * from "./learner-model/index.js";
export * from "./hints/index.js";
export * from "./fading/index.js";
