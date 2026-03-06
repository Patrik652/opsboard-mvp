"use client";

import { useMemo, useState } from "react";
import { runIncidentResponseWorkflow } from "@/features/ai/agents/coordinator";
import type { IncidentContext, IncidentWorkflowReport } from "@/features/ai/agents/types";
import { auditLogger, telemetryClient } from "@/features/platform/client";
import { buildSeedData } from "@/lib/seed";

function formatRiskTone(score: number): string {
  if (score >= 80) return "text-red-300";
  if (score >= 60) return "text-amber-300";
  if (score >= 35) return "text-yellow-300";
  return "text-emerald-300";
}

export default function AiPanel() {
  const seed = useMemo(() => buildSeedData("demo"), []);
  const [selectedIncidentId, setSelectedIncidentId] = useState(seed.incidents[0]?.id ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [report, setReport] = useState<IncidentWorkflowReport | null>(null);

  const selectedIncident =
    seed.incidents.find((incident) => incident.id === selectedIncidentId) ?? seed.incidents[0];

  const runWorkflow = () => {
    if (!selectedIncident) {
      setStatus("No incident selected.");
      return;
    }

    const context: IncidentContext = {
      incident: selectedIncident,
      openIncidents: seed.incidents.filter((incident) => incident.state !== "resolved"),
      relatedCards: seed.cards.filter((card) => card.priority === "high"),
      recentAuditLogs: seed.auditLogs,
    };
    const workflowReport = runIncidentResponseWorkflow(context);

    setReport(workflowReport);
    setStatus(`Workflow executed for ${selectedIncident.title}.`);

    telemetryClient.record({
      name: "ai.workflow.executed",
      level: workflowReport.risk.level === "critical" ? "warn" : "info",
      metadata: {
        incidentId: selectedIncident.id,
        riskScore: workflowReport.risk.score,
      },
    });
    auditLogger.log({
      actor: "ai-copilot",
      action: "incident-workflow-run",
      details: `Generated response plan for ${selectedIncident.id} (${workflowReport.risk.level})`,
    });
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">AI Operations Copilot</h1>
        <p className="text-sm text-zinc-400">
          Multi-agent workflow for incident triage, summary drafting, and action planning.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="text-sm text-zinc-300">Agent workflow</div>
        <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <select
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
            value={selectedIncidentId}
            onChange={(event) => setSelectedIncidentId(event.target.value)}
          >
            {seed.incidents.map((incident) => (
              <option key={incident.id} value={incident.id}>
                {incident.title}
              </option>
            ))}
          </select>
          <button
            className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-900"
            type="button"
            onClick={runWorkflow}
          >
            Run workflow
          </button>
        </div>
        {status ? <div className="mt-4 text-xs text-emerald-200">{status}</div> : null}
      </div>

      {report ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h2 className="text-base font-semibold text-white">Incident summary</h2>
            <div className={`mt-2 text-sm font-semibold ${formatRiskTone(report.risk.score)}`}>
              Risk score: {report.risk.score} ({report.risk.level.toUpperCase()})
            </div>
            <div className="mt-3 text-sm text-zinc-200">{report.summary.headline}</div>
            <p className="mt-2 text-sm text-zinc-300">{report.summary.narrative}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h2 className="text-base font-semibold text-white">Recommended actions</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-200">
              {report.actionPlan.immediate.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 lg:col-span-2">
            <h2 className="text-base font-semibold text-white">Agent execution trace</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {report.trace.map((item) => (
                <div key={item.agent} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">{item.agent}</div>
                  <div className="mt-2 text-sm text-zinc-200">{item.durationMs}ms</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs text-emerald-200">
        Agent layer is deterministic by default and ready to swap each agent with LLM/MCP calls.
      </div>
    </section>
  );
}
