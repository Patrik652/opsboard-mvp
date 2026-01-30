export default function Topbar() {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4 text-zinc-100">
      <div className="text-sm text-zinc-400">Operational reliability workspace</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
          Demo account
        </span>
        <span className="text-zinc-400">Status: All systems nominal</span>
      </div>
    </div>
  );
}
