/**
 * duckling — the plugin's session-recording CLI.
 *
 * The `mental-model` skill calls this at each state transition. Every command
 * loads the active session, applies one `reduce()` from @waddl/learning-engine,
 * persists the result, and prints a compact JSON line the skill can read. This
 * is what turns the conversational flow into real, persisted LearningSession
 * data — including the transfer outcome the project sets out to measure.
 *
 * All data stays local under $DUCKLING_HOME (default ~/.duckling).
 */

import {
  createSession,
  detectConcepts,
  isConceptuallyImportant,
  predictionIntervention,
  reduce,
  summarizeTransfer,
  toRecord,
  topConcept,
  transferIntervention,
  type Confidence,
  type SessionState,
} from "@waddl/learning-engine";
import { FileStore } from "./file-store.js";

interface Args {
  positional: string[];
  flags: Record<string, string | boolean>;
}

const parseArgs = (argv: string[]): Args => {
  const out: Args = { positional: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        out.flags[key] = true;
      } else {
        out.flags[key] = next;
        i++;
      }
    } else {
      out.positional.push(a);
    }
  }
  return out;
};

const emit = (value: unknown): void => {
  process.stdout.write(`${JSON.stringify(value)}\n`);
};

const fail = (message: string): never => {
  emit({ error: message });
  process.exit(1);
};

const str = (v: string | boolean | undefined): string | undefined =>
  typeof v === "string" ? v : undefined;

// A normal Node process, so Date.now()/Math.random() are fine here.
const newId = (): string =>
  `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const view = (state: SessionState): Record<string, unknown> => ({
  id: state.id,
  step: state.step,
  record: toRecord(state),
});

const main = (): void => {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args.positional[0] ?? "";
  const f = args.flags;
  const store = new FileStore();

  /** Resolve the target session: --id, else the active session. */
  const loadTarget = (): SessionState => {
    const id = str(f.id) ?? store.getActiveId();
    if (!id) fail("no active session; run `duckling start` first");
    const state = store.getState(id!);
    if (!state) fail(`unknown session: ${id}`);
    return state!;
  };

  const advance = (next: SessionState): void => {
    store.putState(next);
    emit(view(next));
  };

  switch (cmd) {
    case "start": {
      const input = str(f.input) ?? "";
      const explicit = str(f.concept) ?? "";
      // Gate: skip trivial/boilerplate requests unless a concept is forced.
      if (!explicit && input && !isConceptuallyImportant(input)) {
        emit({ skip: true, reason: "not conceptually important", concepts: detectConcepts(input) });
        return;
      }
      const concept = explicit || (input ? topConcept(input) ?? "" : "");
      let state = createSession({ id: newId(), timestamp: Date.now(), concept });
      state = reduce(state, { type: "start" });
      store.putState(state);
      emit({ ...view(state), concept, prompt: predictionIntervention.buildPrompt({ concept }) });
      return;
    }

    case "predict": {
      const prediction = f.idk ? null : str(f.prediction) ?? null;
      advance(reduce(loadTarget(), { type: "predict", prediction }));
      return;
    }

    case "commit": {
      const n = Number(str(f.confidence));
      if (!Number.isInteger(n) || n < 1 || n > 5) fail("--confidence must be 1..5");
      advance(reduce(loadTarget(), { type: "commit", confidence: n as Confidence }));
      return;
    }

    case "reveal": {
      const actual = str(f.actual);
      if (actual === undefined) return fail("--actual is required");
      advance(reduce(loadTarget(), { type: "reveal", actualBehavior: actual }));
      return;
    }

    case "pattern": {
      advance(reduce(loadTarget(), { type: "toPattern" }));
      return;
    }

    case "transfer": {
      const state = reduce(loadTarget(), { type: "toTransfer" });
      store.putState(state);
      emit({ ...view(state), prompt: transferIntervention.buildPrompt({ concept: state.concept }) });
      return;
    }

    case "answer-transfer": {
      const answer = str(f.answer) ?? null;
      const correct = f.correct === "true" ? true : f.correct === "false" ? false : null;
      advance(reduce(loadTarget(), { type: "answerTransfer", answer, correct }));
      return;
    }

    case "show-answer": {
      advance(reduce(loadTarget(), { type: "showAnswer" }));
      return;
    }

    case "skip": {
      advance(reduce(loadTarget(), { type: "skip" }));
      return;
    }

    case "status": {
      emit(view(loadTarget()));
      return;
    }

    case "log": {
      const limit = Number(str(f.limit) ?? "10");
      const records = store.allRecords();
      emit({ records: records.slice(-(Number.isFinite(limit) ? limit : 10)) });
      return;
    }

    case "summary": {
      // The headline research metric: did the concept transfer?
      emit(summarizeTransfer(store.allRecords()));
      return;
    }

    default:
      fail(
        "usage: duckling <start|predict|commit|reveal|pattern|transfer|answer-transfer|show-answer|skip|status|log|summary> [--id X] [flags]",
      );
  }
};

main();
