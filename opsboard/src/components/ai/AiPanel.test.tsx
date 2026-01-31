import { fireEvent, render, screen } from "@testing-library/react";
import AiPanel from "./AiPanel";

test("renders AI panel heading", () => {
  render(<AiPanel />);
  expect(screen.getByText(/AI Operations Copilot/i)).toBeInTheDocument();
});

test("shows status when clicking connect provider", () => {
  render(<AiPanel />);
  fireEvent.click(screen.getByRole("button", { name: /Connect provider/i }));
  expect(screen.getByText(/Provider setup coming soon/i)).toBeInTheDocument();
});
