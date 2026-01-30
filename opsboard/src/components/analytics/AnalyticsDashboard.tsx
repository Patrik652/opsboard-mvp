type Metrics = {
  totalCards: number;
  openIncidents: number;
  uptime: string;
};

export default function AnalyticsDashboard({ metrics }: { metrics: Metrics }) {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Reliability Pulse</h1>
        <p className="text-sm text-zinc-400">Signals that show operational health at a glance.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="text-sm text-zinc-400">Cards in flight</div>
          <div className="text-3xl font-semibold text-white">{metrics.totalCards}</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="text-sm text-zinc-400">Open incidents</div>
          <div className="text-3xl font-semibold text-white">{metrics.openIncidents}</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="text-sm text-zinc-400">Uptime</div>
          <div className="text-3xl font-semibold text-emerald-300">{metrics.uptime}</div>
        </div>
      </div>
    </section>
  );
}
