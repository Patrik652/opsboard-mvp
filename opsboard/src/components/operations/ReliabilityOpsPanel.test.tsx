import { act, fireEvent, render, screen } from "@testing-library/react";
import ReliabilityOpsPanel from "./ReliabilityOpsPanel";

test("shows telemetry and recovery controls", async () => {
  render(
    <ReliabilityOpsPanel
      workspace={{
        userId: "demo-user",
        boards: [],
        cards: [{ id: "c1" }],
        incidents: [{ id: "i1", state: "open", severity: "high", title: "API saturation" }],
        auditLogs: [],
        services: [{ id: "svc-1", name: "API", status: "operational" }],
        snapshots: [],
      }}
      workspaceUserId="demo-user"
      mode="demo"
      onWorkspaceRefresh={async () => {}}
    />
  );

  expect(screen.getByText(/Operational readiness/i)).toBeInTheDocument();
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /Record synthetic alert/i }));
    fireEvent.click(screen.getByRole("button", { name: /Create recovery snapshot/i }));
  });

  expect(screen.getByText(/Telemetry events/i)).toBeInTheDocument();
  expect(screen.getByText(/Latest snapshot/i)).toBeInTheDocument();
});
