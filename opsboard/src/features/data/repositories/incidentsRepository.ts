import type { Incident, IncidentState, Severity } from "../model";

export type CreateIncidentInput = {
  userId: string;
  title: string;
  summary?: string;
  severity: Severity;
  state?: IncidentState;
  impact?: string;
  relatedCardIds?: string[];
  affectedServiceIds?: string[];
};

export type UpdateIncidentInput = Partial<
  Pick<
    Incident,
    "title" | "summary" | "severity" | "state" | "impact" | "relatedCardIds" | "affectedServiceIds" | "resolvedAt"
  >
>;

export type IncidentsRepository = {
  listIncidents: (userId: string) => Promise<Incident[]>;
  createIncident: (input: CreateIncidentInput) => Promise<Incident>;
  updateIncident: (userId: string, incidentId: string, input: UpdateIncidentInput) => Promise<Incident>;
};
