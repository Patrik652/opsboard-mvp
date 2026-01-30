import { render, screen } from "@testing-library/react";
import IncidentList from "./IncidentList";

const incidents = [
  { id: "i1", title: "Latency spike EU", severity: "high", state: "monitoring" },
];

test("renders incident title", () => {
  render(<IncidentList incidents={incidents} />);
  expect(screen.getByText(/Latency spike EU/i)).toBeInTheDocument();
});
