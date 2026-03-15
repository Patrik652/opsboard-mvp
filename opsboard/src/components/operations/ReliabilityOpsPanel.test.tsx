import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { telemetryClient } from "@/features/platform/client";
import ReliabilityOpsPanel from "./ReliabilityOpsPanel";

test("shows telemetry and recovery controls", () => {
  render(<ReliabilityOpsPanel />);

  expect(screen.getByText(/Operational readiness/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Record synthetic alert/i }));
  fireEvent.click(screen.getByRole("button", { name: /Create recovery snapshot/i }));

  expect(screen.getByText(/Telemetry events/i)).toBeInTheDocument();
  expect(screen.getByText(/Latest snapshot/i)).toBeInTheDocument();
});

test("shows error banner when synthetic alert recording fails", () => {
  const telemetrySpy = vi.spyOn(telemetryClient, "record").mockImplementationOnce(() => {
    throw new Error("Telemetry write failed");
  });

  render(<ReliabilityOpsPanel />);
  fireEvent.click(screen.getByRole("button", { name: /Record synthetic alert/i }));

  expect(screen.getByText(/Telemetry write failed/i)).toBeInTheDocument();
  telemetrySpy.mockRestore();
});
