import { render, screen } from "@testing-library/react";
import AnalyticsDashboard from "./AnalyticsDashboard";

const metrics = {
  totalCards: 4,
  openIncidents: 2,
  uptime: "99.98%",
};

test("renders analytics headline", () => {
  render(<AnalyticsDashboard metrics={metrics} />);
  expect(screen.getByText(/Reliability Pulse/i)).toBeInTheDocument();
});

test("shows loading skeleton state", () => {
  render(<AnalyticsDashboard metrics={metrics} isLoading />);
  expect(screen.getByText(/Loading analytics/i)).toBeInTheDocument();
});

test("shows error banner when analytics fail to load", () => {
  render(<AnalyticsDashboard metrics={metrics} error="Telemetry unavailable" />);
  expect(screen.getByText(/Telemetry unavailable/i)).toBeInTheDocument();
});
