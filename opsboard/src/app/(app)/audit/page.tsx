import AuditTimeline from "@/components/audit/AuditTimeline";
import { buildSeedData } from "@/lib/seed";

export default function AuditPage() {
  const seed = buildSeedData("demo");

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Audit log</h1>
        <p className="text-sm text-zinc-400">Every action captured for compliance and review.</p>
      </div>
      <AuditTimeline logs={seed.auditLogs} />
    </section>
  );
}
