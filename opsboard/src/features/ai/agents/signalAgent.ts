import type { IncidentContext, RiskAssessment, RiskLevel } from "./types";

function mapScoreToLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export function assessIncidentRisk(context: IncidentContext): RiskAssessment {
  const factors: string[] = [];
  let score = 0;

  if (context.incident.severity === "high") {
    score += 55;
    factors.push("high-severity-incident");
  } else if (context.incident.severity === "med") {
    score += 35;
    factors.push("medium-severity-incident");
  } else {
    score += 15;
    factors.push("low-severity-incident");
  }

  if (context.incident.state === "open") {
    score += 24;
    factors.push("incident-state-open");
  } else if (context.incident.state === "monitoring") {
    score += 14;
    factors.push("incident-state-monitoring");
  } else {
    score -= 18;
    factors.push("incident-state-resolved");
  }

  const normalizedTitle = context.incident.title.toLowerCase();
  if (normalizedTitle.includes("latency")) {
    score += 10;
    factors.push("keyword-latency");
  }
  if (normalizedTitle.includes("outage") || normalizedTitle.includes("fail")) {
    score += 12;
    factors.push("keyword-outage-or-failure");
  }

  if (context.openIncidents.length >= 3) {
    score += 8;
    factors.push("multiple-open-incidents");
  }

  if (context.relatedCards.some((card) => card.priority === "high")) {
    score += 6;
    factors.push("high-priority-card-linked");
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    level: mapScoreToLevel(score),
    factors,
  };
}
