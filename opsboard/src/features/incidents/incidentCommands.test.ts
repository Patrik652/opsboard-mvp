import { vi } from "vitest";
import { createIncident } from "./incidentCommands";

test("createIncident emits an audit event", async () => {
  const writeAudit = vi.fn(async () => undefined);
  const saveIncident = vi.fn(async (input) => ({
    id: "inc-1",
    state: "open",
    ...input,
  }));

  await createIncident(
    { userId: "user-1", title: "API saturation", severity: "high" },
    { saveIncident, writeAudit }
  );

  expect(writeAudit).toHaveBeenCalledWith(
    expect.objectContaining({
      action: "incident.created",
      entityType: "incident",
      entityId: "inc-1",
    })
  );
});
