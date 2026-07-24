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
import { readFileSync } from "node:fs";
import { FileStore } from "./file-store.js";

/** The marker Claude prefixes onto Mental Model Mode replies, so it's visible. */
const MARKER = "🦆 Mental Model Mode";

/** Read piped stdin (hook/statusline payloads); empty string if none. */
const readStdin = (): string => {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
};

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
      emit({
        ...view(state),
        concept,
        enforced: store.isEnforced(),
        prompt: predictionIntervention.buildPrompt({ concept }),
      });
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

    // --- always-on + indicator ------------------------------------------
    case "gate": {
      emit({ enforced: store.isEnforced(), alwaysOn: store.alwaysOnEnabled() });
      return;
    }

    case "on": {
      store.setAlwaysOn(true);
      emit({ alwaysOn: true });
      return;
    }

    case "off": {
      if (!store.setAlwaysOn(false)) return fail("locked on; unlock first");
      emit({ alwaysOn: false });
      return;
    }

    // UserPromptSubmit hook: on a conceptual prompt, tell Claude to run the
    // flow and stamp the marker. Prints nothing otherwise, so it's silent on
    // ordinary prompts. Never blocks (always exits 0).
    case "hook": {
      if (!store.alwaysOnEnabled()) return;
      let promptText = "";
      try {
        promptText = (JSON.parse(readStdin()) as { prompt_text?: string }).prompt_text ?? "";
      } catch {
        return;
      }
      if (!promptText || !isConceptuallyImportant(promptText)) return;
      const concept = topConcept(promptText);
      process.stdout.write(
        `[Duckling] This request is conceptually important${concept ? ` (${concept})` : ""}. ` +
          `Run Mental Model Mode BEFORE answering — use the duckling:mental-model skill ` +
          `(predict → reality → repair → pattern → transfer), do not reveal the answer ` +
          `until the user predicts, keep the Skip / Show Answer escape hatch, and begin ` +
          `your reply with "${MARKER}" so the user can see it is active.\n`,
      );
      return;
    }

    // Claude Code statusLine command: a persistent on/off indicator. Prints a
    // plain line (not JSON) — that's what the status line renders.
    case "statusline": {
      readStdin(); // Claude Code pipes session JSON; we don't need it.
      const lock = store.isEnforced() ? " 🔒" : "";
      const status = store.alwaysOnEnabled() ? `🦆 duckling on${lock}` : "🦆 duckling off";
      process.stdout.write(`${status}\n`);
      return;
    }

    case "lock": {
      const passcode = str(f.passcode);
      if (!passcode) return fail("--passcode is required");
      if (!store.lock(passcode)) return fail("already locked; unlock first");
      emit({ enforced: true });
      return;
    }

    case "unlock": {
      const passcode = str(f.passcode);
      if (!passcode) return fail("--passcode is required");
      if (!store.unlock(passcode)) return fail("incorrect passcode");
      emit({ enforced: false });
      return;
    }

    default:
      fail(
        "usage: duckling <start|predict|commit|reveal|pattern|transfer|answer-transfer|" +
          "show-answer|skip|status|log|summary|gate|on|off|lock|unlock|hook|statusline> [--id X] [flags]",
      );
  }
};

main();
