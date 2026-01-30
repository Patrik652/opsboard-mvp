import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { buildSeedData } from "@/lib/seed";

export default function AnalyticsPage() {
  const seed = buildSeedData("demo");
  const openIncidents = seed.incidents.filter((incident) => incident.state !== "resolved").length;

  return (
    <AnalyticsDashboard
      metrics={{
        totalCards: seed.cards.length,
        openIncidents,
        uptime: "99.98%",
      }}
    />
  );
}
