import type { AuditLog } from "@/lib/types";
import { panelClassName, secondaryMetaTextClassName } from "@/lib/uiClassNames";

export default function AuditTimeline({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-4">
          <div className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
          <div className={panelClassName}>
            <div className="text-sm text-zinc-200">{log.message}</div>
            <div className={secondaryMetaTextClassName}>
              {new Date(log.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
