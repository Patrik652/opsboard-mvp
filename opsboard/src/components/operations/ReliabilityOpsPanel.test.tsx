import { fireEvent, render, screen } from "@testing-library/react";
import ReliabilityOpsPanel from "./ReliabilityOpsPanel";

test("shows telemetry and recovery controls", () => {
  render(<ReliabilityOpsPanel />);

  expect(screen.getByText(/Operational readiness/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Record synthetic alert/i }));
  fireEvent.click(screen.getByRole("button", { name: /Create recovery snapshot/i }));

  expect(screen.getByText(/Telemetry events/i)).toBeInTheDocument();
  expect(screen.getByText(/Latest snapshot/i)).toBeInTheDocument();
});
