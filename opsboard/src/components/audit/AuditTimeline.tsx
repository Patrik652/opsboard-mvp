import type { AuditLog } from "@/lib/types";
import { formatTimestamp } from "@/lib/formatDateTime";

export default function AuditTimeline({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-panel/60 p-4 text-sm text-text-muted">
        No audit entries yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-4">
          <div className="mt-2 h-2 w-2 rounded-full bg-accent" />
          <div className="rounded-xl border border-border bg-panel/60 p-4">
            <div className="text-sm text-text-body">{log.message}</div>
            {log.details ? <div className="mt-2 text-sm text-text-muted">{log.details}</div> : null}
            {log.actor || log.action ? (
              <div className="mt-2 text-xs uppercase tracking-wide text-text-subtle">
                {[log.actor, log.action].filter(Boolean).join(" · ")}
              </div>
            ) : null}
            <div className="mt-2 text-xs text-text-subtle">{formatTimestamp(log.createdAt)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
