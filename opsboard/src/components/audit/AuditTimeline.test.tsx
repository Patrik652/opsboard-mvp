import { render, screen } from "@testing-library/react";
import AuditTimeline from "./AuditTimeline";

const logs = [{ id: "a1", message: "Created incident", createdAt: 0 }];

test("renders audit message", () => {
  render(<AuditTimeline logs={logs} />);
  expect(screen.getByText(/Created incident/i)).toBeInTheDocument();
});
