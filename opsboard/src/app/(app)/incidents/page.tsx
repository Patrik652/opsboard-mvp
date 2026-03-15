"use client";

import IncidentList from "@/components/incidents/IncidentList";
import { useIncidentsViewModel } from "@/features/incidents/useIncidentsViewModel";

export default function IncidentsPage() {
  const { incidents, isLoading, isSaving, error, createIncident, updateIncidentState } =
    useIncidentsViewModel();

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Incidents</h1>
        <p className="text-sm text-zinc-400">Live reliability events and response state.</p>
      </div>
      <IncidentList
        incidents={incidents}
        isLoading={isLoading}
        isSaving={isSaving}
        error={error}
        onCreateIncident={createIncident}
        onUpdateIncidentState={updateIncidentState}
      />
    </section>
  );
}
