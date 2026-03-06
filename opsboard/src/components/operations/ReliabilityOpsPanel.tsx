"use client";

import { useState } from "react";
import { auditLogger, recoveryKit, telemetryClient } from "@/features/platform/client";
import type { RecoverySnapshot } from "@/features/platform/recovery/recoveryKit";
import { buildSeedData } from "@/lib/seed";

type OpsReadinessState = {
  telemetryTotal: number;
  telemetryWarn: number;
  auditTotal: number;
  latestSnapshot: RecoverySnapshot | null;
};

function getState(): OpsReadinessState {
  const telemetrySummary = telemetryClient.getSummary();
  return {
    telemetryTotal: telemetrySummary.total,
    telemetryWarn: telemetrySummary.byLevel.warn + telemetrySummary.byLevel.error,
    auditTotal: auditLogger.list().length,
    latestSnapshot: recoveryKit.readLatest(),
  };
}

export default function ReliabilityOpsPanel() {
  const [state, setState] = useState<OpsReadinessState>(() => getState());
  const [snapshotJson, setSnapshotJson] = useState("");

  const refresh = () => setState(getState());

  const recordSyntheticAlert = () => {
    telemetryClient.record({
      name: "synthetic.alert",
      level: "warn",
      metadata: { source: "operations-panel" },
    });
    auditLogger.log({
      actor: "ops-user",
      action: "synthetic-alert-recorded",
      details: "Recorded synthetic reliability alert.",
    });
    refresh();
  };

  const createSnapshot = () => {
    const seed = buildSeedData("demo");
    const snapshot = recoveryKit.backup({
      environment: "demo",
      incidents: seed.incidents,
      cards: seed.cards,
      auditEntryCount: auditLogger.list().length,
      telemetryEventCount: telemetryClient.list().length,
    });

    telemetryClient.record({
      name: "recovery.snapshot.created",
      level: "info",
      metadata: { createdAt: snapshot.createdAt },
    });
    auditLogger.log({
      actor: "ops-user",
      action: "recovery-snapshot-created",
      details: `Created recovery snapshot at ${snapshot.createdAt}.`,
    });
    setSnapshotJson(JSON.stringify(snapshot, null, 2));
    refresh();
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Operational readiness</h1>
        <p className="text-sm text-zinc-400">
          Monitoring, audit, and disaster recovery controls for production hardening.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="text-sm text-zinc-400">Telemetry events</div>
          <div className="mt-2 text-3xl font-semibold text-white">{state.telemetryTotal}</div>
          <div className="mt-2 text-xs text-zinc-500">Warn/Error: {state.telemetryWarn}</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="text-sm text-zinc-400">Audit entries</div>
          <div className="mt-2 text-3xl font-semibold text-white">{state.auditTotal}</div>
          <div className="mt-2 text-xs text-zinc-500">Persistent local timeline</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="text-sm text-zinc-400">Latest snapshot</div>
          <div className="mt-2 text-sm text-zinc-200">
            {state.latestSnapshot
              ? new Date(state.latestSnapshot.createdAt).toLocaleString()
              : "No snapshot yet"}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-100"
          type="button"
          onClick={recordSyntheticAlert}
        >
          Record synthetic alert
        </button>
        <button
          className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-900"
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
