import type { AuditLog } from "@/lib/types";
import { formatTimestamp } from "@/lib/formatDateTime";

export default function AuditTimeline({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-panel/60 p-4 text-sm text-zinc-400">
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
            <div className="text-sm text-zinc-200">{log.message}</div>
            {log.details ? <div className="mt-2 text-sm text-zinc-400">{log.details}</div> : null}
            {log.actor || log.action ? (
              <div className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
                {[log.actor, log.action].filter(Boolean).join(" · ")}
              </div>
            ) : null}
            <div className="mt-2 text-xs text-zinc-500">{formatTimestamp(log.createdAt)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
