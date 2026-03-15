import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/features/workspace/useWorkspaceSnapshot", () => ({
  useWorkspaceSnapshot: () => ({
    mode: "demo",
    workspaceUserId: "demo-user",
    workspace: {
      userId: "demo-user",
      boards: [],
      cards: [{ id: "c1", boardId: "b1", listId: "l1", title: "Scale workers", priority: "high" }],
      incidents: [{ id: "i1", title: "Latency spike EU", severity: "high", state: "open" }],
      auditLogs: [{ id: "a1", message: "Incident opened", createdAt: 1 }],
      services: [{ id: "svc-1", name: "API", status: "degraded" }],
      snapshots: [],
    },
    isLoading: false,
    error: null,
    reload: async () => {},
  }),
}));

import AiPanel from "./AiPanel";

test("renders AI panel heading", () => {
  render(<AiPanel />);
  expect(screen.getByText(/AI Operations Copilot/i)).toBeInTheDocument();
});

test("runs agent workflow and renders recommendations", () => {
  render(<AiPanel />);
  fireEvent.click(screen.getByRole("button", { name: /Run workflow/i }));
  expect(screen.getByText(/Recommended actions/i)).toBeInTheDocument();
  expect(screen.getByText(/Agent execution trace/i)).toBeInTheDocument();
});
