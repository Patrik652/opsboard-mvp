"use client";

import { useServicesViewModel } from "@/features/status/useServicesViewModel";

const overallTone = {
  operational: {
    label: "Operational",
    badge: "GREEN",
    badgeClass: "bg-emerald-500/20 text-emerald-300",
  },
  degraded: {
    label: "Degraded",
    badge: "AMBER",
    badgeClass: "bg-amber-500/20 text-amber-300",
  },
  outage: {
    label: "Outage",
    badge: "RED",
    badgeClass: "bg-rose-500/20 text-rose-200",
  },
} as const;

const serviceTone = {
  operational: "text-emerald-300",
  degraded: "text-amber-300",
  outage: "text-rose-200",
} as const;

export default function StatusPage() {
  const { services, metrics, isLoading, error } = useServicesViewModel();
  const tone = overallTone[metrics.overallStatus];

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Status</h1>
        <p className="text-sm text-zinc-400">Public-facing service health snapshot.</p>
      </div>
      {error ? (
        <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          Loading service health...
        </div>
      ) : null}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-400">Workspace status</div>
            <div className="text-xl font-semibold text-white">{tone.label}</div>
            <div className="mt-2 text-sm text-zinc-500">
              {metrics.openIncidents} open incidents, estimated uptime {metrics.uptime}
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm ${tone.badgeClass}`}>
            {tone.badge}
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-sm text-zinc-400">{service.name}</div>
              <div className={`text-lg ${serviceTone[service.status]}`}>
                {service.status === "operational"
                  ? "Operational"
                  : service.status === "degraded"
                    ? "Degraded"
                    : "Outage"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
