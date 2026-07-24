import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeTransfer, type LearningSession } from "./index.js";

const rec = (over: Partial<LearningSession>): LearningSession => ({
  id: "x",
  timestamp: 0,
  concept: "closures",
  intervention: "transfer",
  prediction: null,
  confidence: null,
  actualBehavior: null,
  transferAnswer: null,
  transferCorrect: null,
  ...over,
});

test("summarizeTransfer ignores ungraded sessions and computes the rate", () => {
  const s = summarizeTransfer([
    rec({ transferCorrect: true }),
    rec({ transferCorrect: false }),
    rec({ transferCorrect: true }),
    rec({ transferCorrect: null }), // not graded — excluded from rate
  ]);
  assert.equal(s.total, 4);
  assert.equal(s.graded, 3);
  assert.equal(s.transferred, 2);
  assert.equal(s.rate, 2 / 3);
});

test("rate is null when nothing has been graded", () => {
  const s = summarizeTransfer([rec({}), rec({})]);
  assert.equal(s.graded, 0);
  assert.equal(s.rate, null);
});
