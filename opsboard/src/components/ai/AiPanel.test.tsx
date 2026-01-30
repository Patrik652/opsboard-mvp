import { render, screen } from "@testing-library/react";
import AiPanel from "./AiPanel";

test("renders AI panel heading", () => {
  render(<AiPanel />);
  expect(screen.getByText(/AI Operations Copilot/i)).toBeInTheDocument();
});
