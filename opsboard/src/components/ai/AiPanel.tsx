export default function AiPanel() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">AI Operations Copilot</h1>
        <p className="text-sm text-zinc-400">
          Connect your LLM or MCP to automate incident summaries, create tasks, and draft updates.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-emerald-400/40 bg-emerald-500/5 p-6">
        <div className="text-sm text-emerald-200">AI integration ready</div>
        <div className="mt-3 text-zinc-200">
          This panel is wired for tool calls. Add your provider key to enable.
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-900">
            Connect provider
          </button>
          <button className="rounded-lg border border-emerald-400/40 px-4 py-2 text-sm text-emerald-200">
            View MCP schema
          </button>
        </div>
      </div>
    </section>
  );
}
