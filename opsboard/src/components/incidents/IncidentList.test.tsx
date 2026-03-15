import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import IncidentList from "./IncidentList";

const incidents = [
  { id: "i1", title: "Latency spike EU", severity: "high", state: "monitoring" },
];

function IncidentHarness() {
  const [localIncidents, setLocalIncidents] = useState(incidents);

  return (
    <IncidentList
      incidents={localIncidents}
      onCreateIncident={async ({ title, severity, summary }) => {
        setLocalIncidents((current) => [
          {
            id: "i2",
            title,
            severity,
            state: "open",
            summary,
          },
          ...current,
        ]);
      }}
      onUpdateIncidentState={async (incidentId, state) => {
        setLocalIncidents((current) =>
          current.map((incident) =>
            incident.id === incidentId ? { ...incident, state } : incident
          )
        );
      }}
    />
  );
}

test("renders incident title", () => {
  render(<IncidentList incidents={incidents} />);
  expect(screen.getByText(/Latency spike EU/i)).toBeInTheDocument();
});

test("creates an incident through the provided command", async () => {
  render(<IncidentHarness />);

  fireEvent.click(screen.getByRole("button", { name: /New incident/i }));
  fireEvent.change(screen.getByPlaceholderText(/Incident title/i), {
    target: { value: "API saturation" },
  });
  fireEvent.change(screen.getByLabelText(/Severity/i), {
    target: { value: "high" },
  });
  fireEvent.click(screen.getByRole("button", { name: /Create incident/i }));

  expect(await screen.findByText(/API saturation/i)).toBeInTheDocument();
});
