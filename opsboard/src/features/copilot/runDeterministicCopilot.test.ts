import { runDeterministicCopilot } from "./runDeterministicCopilot";

test("raises risk when high severity incidents and high priority cards overlap", () => {
  const report = runDeterministicCopilot({
    incidents: [{ id: "i1", severity: "high", state: "open", title: "API outage" }],
    cards: [{ id: "c1", priority: "high", boardId: "b1", listId: "l1", title: "Scale workers" }],
    auditLogs: [],
    services: [{ id: "svc-1", status: "operational", name: "API" }],
  } as never);

  expect(report.risk.score).toBeGreaterThanOrEqual(70);
  expect(report.actionPlan.immediate.length).toBeGreaterThan(0);
});
