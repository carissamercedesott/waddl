import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createSession,
  reduce,
  nextStep,
  toRecord,
  STEP_ORDER,
  type SessionState,
} from "./index.js";

const fresh = (): SessionState =>
  createSession({ id: "t1", timestamp: 1000, concept: "react-state" });

test("a full Mental Model Mode run walks every step and records the outcome", () => {
  let s = fresh();
  assert.equal(s.step, "idle");

  s = reduce(s, { type: "start" });
  assert.equal(s.step, "prediction");

  s = reduce(s, { type: "predict", prediction: "the new value" });
  assert.equal(s.step, "commit");
  assert.equal(s.prediction, "the new value");

  s = reduce(s, { type: "commit", confidence: 4 });
  assert.equal(s.step, "reality");
  assert.equal(s.confidence, 4);

  s = reduce(s, { type: "reveal", actualBehavior: "still the old value" });
  assert.equal(s.step, "repair");
  assert.equal(s.solutionRevealed, true);
  assert.equal(s.actualBehavior, "still the old value");

  s = reduce(s, { type: "toPattern" });
  assert.equal(s.step, "pattern");

  s = reduce(s, { type: "toTransfer" });
  assert.equal(s.step, "transfer");
  assert.equal(s.intervention, "transfer");

  s = reduce(s, { type: "answerTransfer", answer: "+1", correct: true });
  assert.equal(s.step, "complete");

  const record = toRecord(s);
  assert.deepEqual(record, {
    id: "t1",
    timestamp: 1000,
    concept: "react-state",
    intervention: "transfer",
    prediction: "the new value",
    confidence: 4,
    actualBehavior: "still the old value",
    transferAnswer: "+1",
    transferCorrect: true,
  });
});

test("'I don't know' is recorded as a null prediction", () => {
  let s = reduce(fresh(), { type: "start" });
  s = reduce(s, { type: "predict", prediction: null });
  assert.equal(s.prediction, null);
  assert.equal(s.step, "commit");
});

test("the escape hatch works from any step and never blocks", () => {
  // Show Answer from the very first step jumps to repair and reveals the answer.
  let s = reduce(fresh(), { type: "start" });
  s = reduce(s, { type: "showAnswer" });
  assert.equal(s.step, "repair");
  assert.equal(s.solutionRevealed, true);

  // Skip abandons the flow.
  const skipped = reduce(reduce(fresh(), { type: "start" }), { type: "skip" });
  assert.equal(skipped.step, "complete");
});

test("nextStep follows STEP_ORDER and terminates at complete", () => {
  assert.equal(nextStep("idle"), "prediction");
  assert.equal(nextStep("pattern"), "transfer");
  assert.equal(nextStep("complete"), "complete");
  assert.equal(STEP_ORDER[0], "idle");
  assert.equal(STEP_ORDER[STEP_ORDER.length - 1], "complete");
});
