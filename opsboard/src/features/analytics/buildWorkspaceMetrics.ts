import type { ServiceStatus } from "@/features/data/model";

type WorkspaceMetricsInput = {
  cards: Array<{ archivedAt?: number | null }>;
  incidents: Array<{ state: string }>;
  services: Array<{ status: ServiceStatus }>;
  auditLogs: Array<unknown>;
};

export type WorkspaceMetrics = {
  totalCards: number;
  openIncidents: number;
  uptime: string;
  overallStatus: ServiceStatus;
  overallLabel: string;
  degradedServices: number;
  outageServices: number;
  auditEntries: number;
};

const SERVICE_AVAILABILITY: Record<ServiceStatus, number> = {
  operational: 99.99,
  degraded: 98.2,
  outage: 94.5,
};

export function buildWorkspaceMetrics(snapshot: WorkspaceMetricsInput): WorkspaceMetrics {
  const totalCards = snapshot.cards.filter((card) => !card.archivedAt).length;
  const openIncidents = snapshot.incidents.filter((incident) => incident.state !== "resolved").length;
  const degradedServices = snapshot.services.filter((service) => service.status === "degraded").length;
  const outageServices = snapshot.services.filter((service) => service.status === "outage").length;
  const auditEntries = snapshot.auditLogs.length;

  const averageAvailability = snapshot.services.length
    ? snapshot.services.reduce((sum, service) => sum + SERVICE_AVAILABILITY[service.status], 0) /
      snapshot.services.length
    : SERVICE_AVAILABILITY.operational;
  const incidentPenalty = openIncidents * 0.18;
  const uptime = `${Math.max(90, averageAvailability - incidentPenalty).toFixed(2)}%`;

  const overallStatus =
    outageServices > 0
      ? "outage"
      : degradedServices > 0 || openIncidents > 0
        ? "degraded"
        : "operational";

  const overallLabel =
    overallStatus === "operational"
      ? "Operational"
      : overallStatus === "degraded"
        ? "Degraded"
        : "Outage";

  return {
    totalCards,
    openIncidents,
    uptime,
    overallStatus,
    overallLabel,
    degradedServices,
    outageServices,
    auditEntries,
  };
}
