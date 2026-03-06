import type { AuditLog, Card, Incident } from "@/lib/types";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type IncidentContext = {
  incident: Incident;
  openIncidents: Incident[];
  relatedCards: Card[];
  recentAuditLogs: AuditLog[];
};

export type RiskAssessment = {
  score: number;
  level: RiskLevel;
  factors: string[];
};

export type IncidentSummary = {
  headline: string;
  narrative: string;
  confidence: number;
};

export type IncidentActionPlan = {
  immediate: string[];
  nextHour: string[];
  owners: string[];
};

export type AgentTrace = {
  agent: "signal-agent" | "summary-agent" | "action-planner-agent";
  startedAt: number;
  finishedAt: number;
  durationMs: number;
};

export type IncidentWorkflowReport = {
  risk: RiskAssessment;
  summary: IncidentSummary;
  actionPlan: IncidentActionPlan;
  trace: AgentTrace[];
};
