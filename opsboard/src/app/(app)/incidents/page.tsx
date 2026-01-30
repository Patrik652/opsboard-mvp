import IncidentList from "@/components/incidents/IncidentList";
import { buildSeedData } from "@/lib/seed";

export default function IncidentsPage() {
  const seed = buildSeedData("demo");

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Incidents</h1>
        <p className="text-sm text-zinc-400">Live reliability events and response state.</p>
      </div>
      <IncidentList incidents={seed.incidents} />
    </section>
  );
}
