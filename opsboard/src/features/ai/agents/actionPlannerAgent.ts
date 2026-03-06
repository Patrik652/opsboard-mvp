import type { IncidentActionPlan, IncidentContext, RiskAssessment } from "./types";

export function buildActionPlan(
  context: IncidentContext,
  risk: RiskAssessment
): IncidentActionPlan {
  const immediate = [
    `Assign incident commander for "${context.incident.title}".`,
    "Open a dedicated response channel and post first status update.",
  ];

  if (risk.level === "critical" || risk.level === "high") {
    immediate.push("Escalate to platform lead and trigger paging policy.");
  }

  if (context.relatedCards.length > 0) {
    immediate.push("Link active board cards to incident timeline for shared context.");
  }

  const nextHour = [
    "Publish customer-facing status update with mitigation ETA.",
    "Capture timeline checkpoints every 15 minutes.",
    "Prepare post-incident review notes while context is fresh.",
  ];

  return {
    immediate,
    nextHour,
    owners: ["incident-commander", "platform-oncall", "communications-lead"],
  };
}
