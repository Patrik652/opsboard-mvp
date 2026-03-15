"use client";

import { useState } from "react";
import type { Incident, IncidentState, Severity } from "@/features/data/model";

const severityStyles: Record<Incident["severity"], string> = {
  low: "text-emerald-300 bg-emerald-500/10",
  med: "text-amber-300 bg-amber-500/10",
  high: "text-red-300 bg-red-500/10",
};

type IncidentListProps = {
  incidents: Incident[];
  isLoading?: boolean;
  isSaving?: boolean;
  error?: string | null;
  onCreateIncident?: (input: {
    title: string;
    severity: Severity;
    summary?: string;
  }) => Promise<void>;
  onUpdateIncidentState?: (incidentId: string, state: IncidentState) => Promise<void>;
};

export default function IncidentList({
  incidents,
  isLoading = false,
  isSaving = false,
  error = null,
  onCreateIncident,
  onUpdateIncidentState,
}: IncidentListProps) {
  const [showComposer, setShowComposer] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSeverity, setDraftSeverity] = useState<Severity>("med");
  const [draftSummary, setDraftSummary] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
          disabled={isLoading || isSaving || !onCreateIncident}
          type="button"
          onClick={() => setShowComposer(true)}
        >
          New incident
        </button>
      </div>

      {showComposer ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-zinc-400">New incident</div>
          <div className="grid gap-3">
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              placeholder="Incident title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
            />
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-zinc-400" htmlFor="incident-severity">
                Severity
              </label>
              <select
                id="incident-severity"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                value={draftSeverity}
                onChange={(event) => setDraftSeverity(event.target.value as Severity)}
              >
                <option value="low">Low</option>
                <option value="med">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <textarea
              className="min-h-24 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
              placeholder="Impact summary"
              value={draftSummary}
              onChange={(event) => setDraftSummary(event.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-900"
                disabled={isSaving || !draftTitle.trim() || !onCreateIncident}
                type="button"
                onClick={async () => {
                  if (!onCreateIncident || !draftTitle.trim()) {
                    return;
                  }

                  await onCreateIncident({
                    title: draftTitle.trim(),
                    severity: draftSeverity,
                    summary: draftSummary.trim() || undefined,
                  });
                  setDraftTitle("");
                  setDraftSeverity("med");
                  setDraftSummary("");
                  setShowComposer(false);
                }}
              >
                {isSaving ? "Saving..." : "Create incident"}
              </button>
              <button
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
                disabled={isSaving}
                type="button"
                onClick={() => setShowComposer(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          Loading incidents...
        </div>
      ) : null}

      {incidents.map((incident) => (
        <div key={incident.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-400">{incident.state.toUpperCase()}</div>
              <h2 className="text-lg font-semibold text-white">{incident.title}</h2>
              {incident.summary ? (
                <p className="mt-2 text-sm text-zinc-400">{incident.summary}</p>
              ) : null}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs ${severityStyles[incident.severity]}`}>
              {incident.severity.toUpperCase()}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {incident.state === "open" ? (
              <button
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200"
                disabled={isSaving || !onUpdateIncidentState}
                type="button"
                onClick={async () => {
                  if (!onUpdateIncidentState) {
                    return;
                  }

                  await onUpdateIncidentState(incident.id, "monitoring");
                }}
              >
                Move to monitoring
              </button>
            ) : null}
            {incident.state !== "resolved" ? (
              <button
                className="rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-zinc-900"
                disabled={isSaving || !onUpdateIncidentState}
                type="button"
                onClick={async () => {
                  if (!onUpdateIncidentState) {
                    return;
                  }

                  await onUpdateIncidentState(incident.id, "resolved");
                }}
              >
                Resolve
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
