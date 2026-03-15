import { mutedTextClassName, pageTitleClassName } from "@/lib/uiClassNames";

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

function AnalyticsSkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-5">
      <div className="h-3 w-24 animate-pulse rounded bg-zinc-700" />
      <div className="mt-3 h-8 w-16 animate-pulse rounded bg-zinc-700" />
    </div>
  );
}

export default function AnalyticsDashboard({ metrics, isLoading = false, error }: AnalyticsDashboardProps) {
  return (
    <section>
      <div className="mb-5 md:mb-6">
        <h1 className={pageTitleClassName}>Reliability Pulse</h1>
        <p className={mutedTextClassName}>Signals that show operational health at a glance.</p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          <p className={mutedTextClassName}>Loading analytics...</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnalyticsSkeletonCard />
            <AnalyticsSkeletonCard />
            <AnalyticsSkeletonCard />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-5">
            <div className={mutedTextClassName}>Cards in flight</div>
            <div className="text-3xl font-semibold text-white">{metrics.totalCards}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-5">
            <div className={mutedTextClassName}>Open incidents</div>
            <div className="text-3xl font-semibold text-white">{metrics.openIncidents}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 md:p-5 sm:col-span-2 xl:col-span-1">
            <div className={mutedTextClassName}>Uptime</div>
            <div className="text-3xl font-semibold text-emerald-300">{metrics.uptime}</div>
          </div>
        </div>
      )}
    </section>
  );
}
