import { assessIncidentRisk } from "./signalAgent";
import type { IncidentContext } from "./types";

function buildContext(overrides?: Partial<IncidentContext>): IncidentContext {
  return {
    incident: {
      id: "inc-1",
      title: "Latency spike in eu-west-1",
      severity: "high",
      state: "open",
    },
    openIncidents: [
      {
        id: "inc-1",
        title: "Latency spike in eu-west-1",
        severity: "high",
        state: "open",
      },
      {
        id: "inc-2",
        title: "Webhook delivery delays",
        severity: "med",
        state: "monitoring",
      },
    ],
    relatedCards: [
      {
        id: "card-1",
        boardId: "board-1",
        listId: "list-1",
        title: "Mitigate latency issue",
        priority: "high",
      },
    ],
    recentAuditLogs: [],
    ...overrides,
  };
}

test("classifies a severe open incident as critical", () => {
  const risk = assessIncidentRisk(buildContext());

  expect(risk.score).toBeGreaterThanOrEqual(80);
  expect(risk.level).toBe("critical");
  expect(risk.factors).toContain("high-severity-incident");
  expect(risk.factors).toContain("incident-state-open");
});

test("keeps resolved low-severity incidents in low risk band", () => {
  const risk = assessIncidentRisk(
    buildContext({
      incident: {
        id: "inc-3",
        title: "Minor docs typo",
        severity: "low",
        state: "resolved",
      },
      openIncidents: [],
      relatedCards: [],
    })
  );

  expect(risk.level).toBe("low");
  expect(risk.score).toBeLessThan(35);
});
