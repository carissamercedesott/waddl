/**
 * Analytics — a future extension point for measuring whether learning happens
 * and transfers. Defined now so downstream code can depend on a stable seam;
 * intentionally NOT implemented in v1.
 *
 * The research questions this will answer (see docs/research-agenda.md):
 *   - Do predictions get more accurate over repeated exposures to a concept?
 *   - Does transfer success rise as competence grows?
 *   - Which interventions most improve transfer, for whom?
 *
 * All analytics operate on anonymized, aggregated {@link LearningSession} data
 * only — never raw PII (see docs/privacy.md).
 */

import type { LearningSession } from "../types.js";

/** A sink that receives completed sessions (e.g. to aggregate metrics). */
export interface AnalyticsSink {
  record(session: LearningSession): Promise<void>;
}

/** Aggregate transfer outcome across sessions. The first metric we care about. */
export interface TransferSummary {
  total: number;
  graded: number;
  transferred: number;
  /** transferred / graded, or null when nothing has been graded yet. */
  rate: number | null;
}

/**
 * Compute a transfer summary from stored sessions. This much is safe to ship —
 * it's a pure aggregation with no PII — and gives the dashboard something real
 * to show while richer analytics remain extension points.
 */
export function summarizeTransfer(sessions: LearningSession[]): TransferSummary {
  const graded = sessions.filter((s) => s.transferCorrect !== null);
  const transferred = graded.filter((s) => s.transferCorrect === true);
  return {
    total: sessions.length,
    graded: graded.length,
    transferred: transferred.length,
    rate: graded.length === 0 ? null : transferred.length / graded.length,
  };
}
