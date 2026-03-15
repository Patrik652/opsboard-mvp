import { runIncidentResponseWorkflow, buildWorkspaceIncidentContext } from "@/features/ai/agents/coordinator";
import type { AgentTrace, IncidentWorkflowReport, RiskLevel } from "@/features/ai/agents/types";
import type { AuditLog, Card, Incident, Service } from "@/lib/types";

type CopilotWorkspaceSnapshot = {
  incidents: Incident[];
  cards: Card[];
  auditLogs: AuditLog[];
  services: Service[];
};

function mapScoreToLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function buildStableTrace(now: () => number): IncidentWorkflowReport["trace"] {
  const agents: AgentTrace["agent"][] = [
    "signal-agent",
    "summary-agent",
    "action-planner-agent",
  ];

  return agents.map((agent) => {
    const startedAt = now();
    const finishedAt = now();

    return {
      agent,
      startedAt,
      finishedAt,
      durationMs: Math.max(0, finishedAt - startedAt),
    };
  });
}

export function runDeterministicCopilot(
  snapshot: CopilotWorkspaceSnapshot,
  selectedIncidentId?: string,
  now: () => number = () => Date.now()
): IncidentWorkflowReport {
  const context = buildWorkspaceIncidentContext(snapshot, selectedIncidentId);
  const highPriorityCards = snapshot.cards.filter((card) => card.priority === "high" && !card.archivedAt);
  const degradedServices = snapshot.services.filter((service) => service.status === "degraded").length;
  const outageServices = snapshot.services.filter((service) => service.status === "outage").length;

  if (!context) {
    return {
      risk: {
        score: 8,
        level: "low",
        factors: ["no-open-incidents"],
      },
      summary: {
        headline: "Workspace stable",
        narrative: `No active incidents. ${highPriorityCards.length} high-priority card(s) remain in flight.`,
        confidence: 0.94,
      },
      actionPlan: {
        immediate: ["Review the highest-priority board cards and confirm service owners."],
        nextHour: ["Verify monitoring coverage and keep audit trail current."],
        owners: ["ops-user"],
      },
      trace: buildStableTrace(now),
    };
  }

  const baseReport = runIncidentResponseWorkflow(context, now);
  const unresolvedHighIncidents = snapshot.incidents.filter(
    (incident) => incident.severity === "high" && incident.state !== "resolved"
  ).length;
  const adjustment =
    outageServices * 18 +
    degradedServices * 8 +
    unresolvedHighIncidents * 10 +
    Math.max(0, highPriorityCards.length - 1) * 4;
  const score = Math.min(100, baseReport.risk.score + adjustment);
  const level = mapScoreToLevel(score);

  const immediate = [...baseReport.actionPlan.immediate];
  if (outageServices > 0) {
    immediate.unshift("Stabilize impacted services before broadening incident scope.");
  }
  if (degradedServices > 0) {
    immediate.push("Verify degraded services have explicit owners and mitigation ETA.");
  }

  const nextHour = [...baseReport.actionPlan.nextHour];
  if (snapshot.auditLogs.length > 0) {
    nextHour.unshift("Review recent audit trail to confirm the last safe change window.");
  }

  return {
    risk: {
      score,
      level,
      factors: [
        ...baseReport.risk.factors,
        ...(outageServices > 0 ? ["service-outage"] : []),
        ...(degradedServices > 0 ? ["service-degradation"] : []),
        ...(highPriorityCards.length > 0 ? ["high-priority-workload"] : []),
      ],
    },
    summary: {
      ...baseReport.summary,
      headline: `${context.incident.title} (${level.toUpperCase()} risk)`,
      narrative: `${baseReport.summary.narrative} Services degraded/outage: ${
        degradedServices + outageServices
      }. Recent audit entries: ${snapshot.auditLogs.length}.`,
    },
    actionPlan: {
      ...baseReport.actionPlan,
      immediate: Array.from(new Set(immediate)),
      nextHour: Array.from(new Set(nextHour)),
    },
    trace: baseReport.trace,
  };
}
