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
