export default function StatusPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Status</h1>
        <p className="text-sm text-zinc-400">Public-facing service health snapshot.</p>
      </div>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-400">All systems</div>
            <div className="text-xl font-semibold text-white">Operational</div>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">
            GREEN
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { name: "API Gateway", status: "Operational" },
            { name: "Webhooks", status: "Degraded" },
            { name: "Realtime Sync", status: "Operational" },
          ].map((service) => (
            <div key={service.name} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-sm text-zinc-400">{service.name}</div>
              <div className="text-lg text-white">{service.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
