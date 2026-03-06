import { fireEvent, render, screen } from "@testing-library/react";
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
