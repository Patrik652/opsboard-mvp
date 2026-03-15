import IncidentList from "@/components/incidents/IncidentList";
import { buildSeedData } from "@/lib/seed";
import { mutedTextClassName, pageTitleClassName } from "@/lib/uiClassNames";

export default function IncidentsPage() {
  const seed = buildSeedData("demo");

  return (
    <section>
      <div className="mb-6">
        <h1 className={pageTitleClassName}>Incidents</h1>
        <p className={mutedTextClassName}>Live reliability events and response state.</p>
      </div>
      <IncidentList incidents={seed.incidents} />
    </section>
  );
}
