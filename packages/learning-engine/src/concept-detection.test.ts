import { test } from "node:test";
import assert from "node:assert/strict";
import { detectConcepts, isConceptuallyImportant, isTrivial, topConcept } from "./index.js";

test("detects a React state question", () => {
  const q = "why does my useState value not update until the next re-render?";
  assert.equal(topConcept(q), "react-state");
  assert.equal(isConceptuallyImportant(q), true);
});

test("detects closures", () => {
  assert.equal(topConcept("my closure captures the wrong loop variable"), "closures");
});

test("trivial / boilerplate requests are not gated", () => {
  assert.equal(isTrivial("fix this import typo"), true);
  assert.equal(isConceptuallyImportant("fix this import typo"), false);
});

test("a non-programming sentence detects nothing", () => {
  assert.deepEqual(detectConcepts("what's the weather today"), []);
  assert.equal(topConcept("what's the weather today"), null);
  assert.equal(isConceptuallyImportant("what's the weather today"), false);
});
