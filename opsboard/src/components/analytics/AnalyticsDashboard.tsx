type Metrics = {
  totalCards: number;
  openIncidents: number;
  uptime: string;
};

type AnalyticsDashboardProps = {
  metrics: Metrics;
  isLoading?: boolean;
  error?: string | null;
};

export default function AnalyticsDashboard({
  metrics,
  isLoading = false,
  error = null,
}: AnalyticsDashboardProps) {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Reliability Pulse</h1>
        <p className="text-sm text-zinc-400">Signals that show operational health at a glance.</p>
      </div>
      {error ? (
        <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}
      {isLoading ? (
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
          Loading reliability metrics...
        </div>
      ) : null}
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
