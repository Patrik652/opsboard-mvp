"use client";

import { useState } from "react";
import { auditLogger, recoveryKit, telemetryClient } from "@/features/platform/client";
import type { RecoverySnapshot } from "@/features/platform/recovery/recoveryKit";
import { buildSeedData } from "@/lib/seed";
import {
  mutedTextClassName,
  panelClassName,
  pageTitleClassName,
  primaryActionButtonClassName,
  secondaryMetaTextClassName,
} from "@/lib/uiClassNames";

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

const EMPTY_STATE: OpsReadinessState = {
  telemetryTotal: 0,
  telemetryWarn: 0,
  auditTotal: 0,
  latestSnapshot: null,
};

export default function ReliabilityOpsPanel() {
  const [state, setState] = useState<OpsReadinessState>(() =>
    typeof window === "undefined" ? EMPTY_STATE : getState()
  );
  const [snapshotJson, setSnapshotJson] = useState("");
  const [panelError, setPanelError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const refresh = () => setState(getState());

  const recordSyntheticAlert = () => {
    setPanelError(null);
    setIsWorking(true);
    try {
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown problem";
      setPanelError(message);
    } finally {
      setIsWorking(false);
    }
  };

  const createSnapshot = () => {
    setPanelError(null);
    setIsWorking(true);
    try {
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown problem";
      setPanelError(message);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className={pageTitleClassName}>Operational readiness</h1>
        <p className={mutedTextClassName}>
          Monitoring, audit, and disaster recovery controls for production hardening.
        </p>
      </div>

      {panelError ? (
        <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {panelError}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className={panelClassName}>
          <div className={mutedTextClassName}>Telemetry events</div>
          <div className="mt-2 text-3xl font-semibold text-white">{state.telemetryTotal}</div>
          <div className={secondaryMetaTextClassName}>Warn/Error: {state.telemetryWarn}</div>
        </div>
        <div className={panelClassName}>
          <div className={mutedTextClassName}>Audit entries</div>
          <div className="mt-2 text-3xl font-semibold text-white">{state.auditTotal}</div>
          <div className={secondaryMetaTextClassName}>Persistent local timeline</div>
        </div>
        <div className={panelClassName}>
          <div className={mutedTextClassName}>Latest snapshot</div>
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
          disabled={isWorking}
        >
          Record synthetic alert
        </button>
        <button
          className={primaryActionButtonClassName}
          type="button"
          onClick={createSnapshot}
          disabled={isWorking}
        >
          Create recovery snapshot
        </button>
      </div>

      {isWorking ? (
        <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-400">
          Processing operation...
        </div>
      ) : null}

      <div className={`mt-6 ${panelClassName}`}>
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
