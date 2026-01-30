import type { Incident } from "@/lib/types";

const severityStyles: Record<Incident["severity"], string> = {
  low: "text-emerald-300 bg-emerald-500/10",
  med: "text-amber-300 bg-amber-500/10",
  high: "text-red-300 bg-red-500/10",
};

export default function IncidentList({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div key={incident.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-400">{incident.state.toUpperCase()}</div>
              <h2 className="text-lg font-semibold text-white">{incident.title}</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs ${severityStyles[incident.severity]}`}>
              {incident.severity.toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
