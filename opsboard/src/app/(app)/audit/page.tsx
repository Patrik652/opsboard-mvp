"use client";

import AuditTimeline from "@/components/audit/AuditTimeline";
import { useWorkspaceSnapshot } from "@/features/workspace/useWorkspaceSnapshot";

export default function AuditPage() {
  const { workspace, isLoading, error } = useWorkspaceSnapshot();
  const auditLogs = [...(workspace?.auditLogs ?? [])].sort((left, right) => right.createdAt - left.createdAt);

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Audit log</h1>
        <p className="text-sm text-zinc-400">Every action captured for compliance and review.</p>
      </div>
      {error ? (
        <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          Loading audit history...
        </div>
      ) : null}
      <AuditTimeline logs={auditLogs} />
    </section>
  );
}
