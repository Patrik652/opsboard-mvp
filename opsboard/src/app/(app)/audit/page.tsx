import AuditTimeline from "@/components/audit/AuditTimeline";
import { buildSeedData } from "@/lib/seed";
import { mutedTextClassName, pageTitleClassName } from "@/lib/uiClassNames";

export default function AuditPage() {
  const seed = buildSeedData("demo");

  return (
    <section>
      <div className="mb-6">
        <h1 className={pageTitleClassName}>Audit log</h1>
        <p className={mutedTextClassName}>Every action captured for compliance and review.</p>
      </div>
      <AuditTimeline logs={seed.auditLogs} />
    </section>
  );
}
