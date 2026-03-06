import type { IncidentContext, IncidentSummary, RiskAssessment } from "./types";

export function summarizeIncident(
  context: IncidentContext,
  risk: RiskAssessment
): IncidentSummary {
  const incident = context.incident;
  const openCount = context.openIncidents.length;
  const confidence = Math.min(0.97, 0.65 + risk.factors.length * 0.03);

  return {
    headline: `${incident.title} (${risk.level.toUpperCase()} risk)`,
    narrative: [
      `${incident.severity.toUpperCase()} severity incident is currently ${incident.state}.`,
      `${openCount} incident(s) are open in the workspace.`,
      `Risk score ${risk.score}/100 based on ${risk.factors.join(", ")}.`,
    ].join(" "),
    confidence: Number(confidence.toFixed(2)),
  };
}
