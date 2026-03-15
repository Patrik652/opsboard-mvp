import type { Incident, IncidentState, Severity } from "@/features/data/model";
import type { CreateIncidentInput, UpdateIncidentInput } from "@/features/data/repositories/incidentsRepository";
import { writeAuditEvent } from "@/features/audit/writeAuditEvent";

type CreateIncidentCommandInput = {
  userId: string;
  title: string;
  severity: Severity;
  summary?: string;
  impact?: string;
};

type UpdateIncidentStateCommandInput = {
  userId: string;
  incidentId: string;
  state: IncidentState;
};

type IncidentAuditDependencies = {
  saveIncident: (input: CreateIncidentInput) => Promise<Incident>;
  updateIncident: (userId: string, incidentId: string, input: UpdateIncidentInput) => Promise<Incident>;
  writeAudit: Parameters<typeof writeAuditEvent>[1]["writeAuditLog"];
  mirrorAuditEntry?: Parameters<typeof writeAuditEvent>[1]["mirrorAuditEntry"];
  now?: () => number;
};

export async function createIncident(
  input: CreateIncidentCommandInput,
  dependencies: Pick<IncidentAuditDependencies, "saveIncident" | "writeAudit" | "mirrorAuditEntry">
): Promise<Incident> {
  const incident = await dependencies.saveIncident({
    userId: input.userId,
    title: input.title,
    severity: input.severity,
    summary: input.summary,
    impact: input.impact,
    state: "open",
  });

  await writeAuditEvent(
    {
      userId: input.userId,
      actor: "ops-user",
      action: "incident.created",
      entityType: "incident",
      entityId: incident.id,
      message: `Created incident: ${incident.title}`,
      details: incident.summary ?? `Severity ${incident.severity.toUpperCase()} incident opened`,
      metadata: {
        severity: incident.severity,
        state: incident.state,
      },
    },
    {
      writeAuditLog: dependencies.writeAudit,
      mirrorAuditEntry: dependencies.mirrorAuditEntry,
    }
  );

  return incident;
}

export async function updateIncidentState(
  input: UpdateIncidentStateCommandInput,
  dependencies: Pick<
    IncidentAuditDependencies,
    "updateIncident" | "writeAudit" | "mirrorAuditEntry" | "now"
  >
): Promise<Incident> {
  const nextUpdate: UpdateIncidentInput = {
    state: input.state,
  };

  if (input.state === "resolved") {
    nextUpdate.resolvedAt = dependencies.now ? dependencies.now() : Date.now();
  }

  const incident = await dependencies.updateIncident(input.userId, input.incidentId, nextUpdate);

  await writeAuditEvent(
    {
      userId: input.userId,
      actor: "ops-user",
      action: input.state === "resolved" ? "incident.resolved" : "incident.state_changed",
      entityType: "incident",
      entityId: incident.id,
      message:
        input.state === "resolved"
          ? `Resolved incident: ${incident.title}`
          : `Updated incident state: ${incident.title}`,
      details: `Incident moved to ${incident.state.toUpperCase()}`,
      metadata: {
        state: incident.state,
        resolvedAt: incident.resolvedAt ?? null,
      },
    },
    {
      writeAuditLog: dependencies.writeAudit,
      mirrorAuditEntry: dependencies.mirrorAuditEntry,
    }
  );

  return incident;
}
