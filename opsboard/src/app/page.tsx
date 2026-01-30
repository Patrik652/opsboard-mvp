import DemoLogin from "@/components/auth/DemoLogin";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-emerald-400">
            Opsboard MVP
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
            Command your work. Prove your reliability.
          </h1>
          <p className="mt-6 text-lg text-zinc-300">
            A Trello-style operations board fused with incident response,
            audit trails, and live metrics. Built for teams who ship fast and stay
            stable.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <DemoLogin />
            <button className="rounded-xl border border-zinc-700 px-6 py-3 text-sm">
              Watch 90-sec demo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
