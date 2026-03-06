import { runIncidentResponseWorkflow } from "./coordinator";
import type { IncidentContext } from "./types";

function buildContext(): IncidentContext {
  return {
    incident: {
      id: "inc-44",
      title: "Payment API outage in EU",
      severity: "high",
      state: "open",
    },
    openIncidents: [
      {
        id: "inc-44",
        title: "Payment API outage in EU",
        severity: "high",
        state: "open",
      },
      {
        id: "inc-55",
        title: "Webhook retry queue growing",
        severity: "med",
        state: "monitoring",
      },
    ],
    relatedCards: [
      {
        id: "card-9",
        boardId: "b1",
        listId: "l2",
        title: "Scale payment workers",
        priority: "high",
      },
    ],
    recentAuditLogs: [
      {
        id: "a1",
        message: "Incident opened by on-call",
        createdAt: 1_737_000_000_000,
      },
    ],
  };
}

test("runs all agents and returns ordered execution trace", () => {
  const times = [100, 112, 130, 145, 160, 171];
  const now = () => times.shift() ?? 171;
  const report = runIncidentResponseWorkflow(buildContext(), now);

  expect(report.risk.level).toMatch(/high|critical/);
  expect(report.summary.headline).toContain("Payment API outage in EU");
  expect(report.actionPlan.immediate.length).toBeGreaterThan(0);
  expect(report.trace.map((entry) => entry.agent)).toEqual([
    "signal-agent",
    "summary-agent",
    "action-planner-agent",
  ]);
  expect(report.trace.map((entry) => entry.durationMs)).toEqual([12, 15, 11]);
});
