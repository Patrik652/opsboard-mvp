"use client";

import { useState } from "react";
import { buildWorkspaceMetrics } from "@/features/analytics/buildWorkspaceMetrics";
import { resolveWorkspaceRepository } from "@/features/data/repositories/runtimeWorkspaceRepository";
import type { WorkspaceSnapshot } from "@/features/data/repositories/workspaceRepository";
import { recoveryKit, telemetryClient } from "@/features/platform/client";
import type { RecoverySnapshot } from "@/features/platform/recovery/recoveryKit";
import type { RuntimeMode } from "@/features/session/types";

type ReliabilityOpsPanelProps = {
  workspace: WorkspaceSnapshot | null;
  workspaceUserId: string | null;
  mode: RuntimeMode;
  isLoading?: boolean;
  error?: string | null;
  onWorkspaceRefresh: () => Promise<void>;
};

export default function ReliabilityOpsPanel({
  workspace,
  workspaceUserId,
  mode,
  isLoading = false,
  error = null,
  onWorkspaceRefresh,
}: ReliabilityOpsPanelProps) {
  const [isWorking, setIsWorking] = useState(false);
  const [snapshotJson, setSnapshotJson] = useState("");
  const telemetrySummary = telemetryClient.getSummary();
  const latestSnapshot: RecoverySnapshot | null = recoveryKit.readLatest();
  const metrics = buildWorkspaceMetrics({
    cards: workspace?.cards ?? [],
    incidents: workspace?.incidents ?? [],
    services: workspace?.services ?? [],
    auditLogs: workspace?.auditLogs ?? [],
  });

  const writeAudit = async (
    input: {
      action: string;
      message: string;
      details: string;
      metadata?: Record<string, unknown>;
    }
  ) => {
    if (!workspaceUserId) {
      return;
    }

    const repository = resolveWorkspaceRepository(mode);
    await repository.writeAuditLog({
      userId: workspaceUserId,
      actor: "ops-user",
      action: input.action,
      entityType: "operations",
      message: input.message,
      details: input.details,
      metadata: input.metadata,
    });
    await onWorkspaceRefresh();
  };

  const recordSyntheticAlert = async () => {
    setIsWorking(true);
    telemetryClient.record({
      name: "synthetic.alert",
      level: "warn",
      metadata: { source: "operations-panel" },
    });

    try {
      await writeAudit({
        action: "operations.synthetic_alert_recorded",
        message: "Recorded synthetic reliability alert.",
        details: "Recorded synthetic reliability alert from operational readiness panel.",
      });
    } finally {
      setIsWorking(false);
    }
  };

  const createSnapshot = async () => {
    if (!workspace) {
      return;
    }

    setIsWorking(true);
    const snapshot = recoveryKit.backup({
      environment: mode,
      incidents: workspace.incidents,
      cards: workspace.cards,
      auditEntryCount: workspace.auditLogs.length,
      telemetryEventCount: telemetryClient.list().length,
    });

    telemetryClient.record({
      name: "recovery.snapshot.created",
      level: "info",
      metadata: { createdAt: snapshot.createdAt },
    });

    try {
      await writeAudit({
        action: "operations.recovery_snapshot_created",
        message: "Created recovery snapshot.",
        details: `Created recovery snapshot at ${snapshot.createdAt}.`,
        metadata: {
          createdAt: snapshot.createdAt,
          snapshotVersion: snapshot.version,
          openIncidents: workspace.incidents.filter((incident) => incident.state !== "resolved").length,
        },
      });
      setSnapshotJson(JSON.stringify(snapshot, null, 2));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Operational readiness</h1>
        <p className="text-sm text-zinc-400">
          Monitoring, audit, and disaster recovery controls for production hardening.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          Loading operational workspace...
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="text-sm text-zinc-400">Telemetry events</div>
          <div className="mt-2 text-3xl font-semibold text-white">{telemetrySummary.total}</div>
          <div className="mt-2 text-xs text-zinc-500">
            Warn/Error: {telemetrySummary.byLevel.warn + telemetrySummary.byLevel.error}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="text-sm text-zinc-400">Audit entries</div>
          <div className="mt-2 text-3xl font-semibold text-white">{metrics.auditEntries}</div>
          <div className="mt-2 text-xs text-zinc-500">Persistent workspace timeline</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="text-sm text-zinc-400">Latest snapshot</div>
          <div className="mt-2 text-sm text-zinc-200">
            {latestSnapshot
              ? new Date(latestSnapshot.createdAt).toLocaleString()
              : "No snapshot yet"}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="text-sm text-zinc-400">Live workspace posture</div>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-200">
          <span>Open incidents: {metrics.openIncidents}</span>
          <span>Cards in flight: {metrics.totalCards}</span>
          <span>Estimated uptime: {metrics.uptime}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-100"
          disabled={isWorking}
          type="button"
          onClick={recordSyntheticAlert}
        >
          Record synthetic alert
        </button>
        <button
          className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-900"
          disabled={isWorking || !workspace}
          type="button"
          onClick={createSnapshot}
        >
          Create recovery snapshot
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="mb-2 text-sm text-zinc-300">Snapshot payload</div>
        <textarea
          className="h-44 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-200"
          value={snapshotJson}
          readOnly
        />
      </div>
    </section>
  );
}
