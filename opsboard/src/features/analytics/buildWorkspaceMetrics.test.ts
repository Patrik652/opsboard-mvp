import { buildWorkspaceMetrics } from "./buildWorkspaceMetrics";

test("buildWorkspaceMetrics derives cards, incidents, and uptime from workspace state", () => {
  const metrics = buildWorkspaceMetrics({
    cards: [{ id: "c1" }, { id: "c2" }],
    incidents: [{ id: "i1", state: "open" }],
    services: [{ id: "svc-1", status: "operational" }],
    auditLogs: [],
  } as never);

  expect(metrics.totalCards).toBe(2);
  expect(metrics.openIncidents).toBe(1);
  expect(metrics.uptime).toMatch(/%/);
});
