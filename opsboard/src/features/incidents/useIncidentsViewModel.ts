"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";
import type { Incident, IncidentState, Severity } from "@/features/data/model";
import {
  resolveWorkspaceRepository,
  resolveWorkspaceUserId,
} from "@/features/data/repositories/runtimeWorkspaceRepository";
import { auditLogger } from "@/features/platform/client";
import { useSession } from "@/features/session/useSession";
import { createIncident, updateIncidentState } from "./incidentCommands";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to load incidents.";
}

export type CreateIncidentFormInput = {
  title: string;
  severity: Severity;
  summary?: string;
};

export type IncidentsViewModel = {
  incidents: Incident[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  createIncident: (input: CreateIncidentFormInput) => Promise<void>;
  updateIncidentState: (incidentId: string, state: IncidentState) => Promise<void>;
};

export function useIncidentsViewModel(): IncidentsViewModel {
  const { mode, status, userId } = useSession();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workspaceUserId = resolveWorkspaceUserId(mode, userId);

  const loadIncidents = useEffectEvent(async () => {
    if (!workspaceUserId) {
      startTransition(() => {
        setIncidents([]);
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const repository = resolveWorkspaceRepository(mode);
      const nextIncidents = await repository.listIncidents(workspaceUserId);

      startTransition(() => {
        setIncidents(nextIncidents);
      });
    } catch (nextError) {
      setError(getErrorMessage(nextError));
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (mode === "authenticated" && status !== "ready") {
      return;
    }

    void loadIncidents();
  }, [mode, status, workspaceUserId]);

  const createIncidentFromForm = async (input: CreateIncidentFormInput) => {
    if (!workspaceUserId) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const repository = resolveWorkspaceRepository(mode);
      const incident = await createIncident(
        {
          userId: workspaceUserId,
          title: input.title,
          severity: input.severity,
          summary: input.summary,
        },
        {
        saveIncident: (nextInput) => repository.createIncident(nextInput),
        writeAudit: (auditInput) => repository.writeAuditLog(auditInput),
        mirrorAuditEntry: (entry) => {
          auditLogger.log(entry);
        },
        }
      );

      startTransition(() => {
        setIncidents((current) => [incident, ...current]);
      });
    } catch (nextError) {
      setError(getErrorMessage(nextError));
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  };

  const updateIncidentStateFromView = async (incidentId: string, state: IncidentState) => {
    if (!workspaceUserId) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const repository = resolveWorkspaceRepository(mode);
      const incident = await updateIncidentState(
        {
          userId: workspaceUserId,
          incidentId,
          state,
        },
        {
          updateIncident: (userIdValue, incidentIdValue, input) =>
            repository.updateIncident(userIdValue, incidentIdValue, input),
          writeAudit: (auditInput) => repository.writeAuditLog(auditInput),
          mirrorAuditEntry: (entry) => {
            auditLogger.log(entry);
          },
        }
      );

      startTransition(() => {
        setIncidents((current) =>
          current.map((existing) => (existing.id === incidentId ? incident : existing))
        );
      });
    } catch (nextError) {
      setError(getErrorMessage(nextError));
      throw nextError;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    incidents,
    isLoading,
    isSaving,
    error,
    createIncident: createIncidentFromForm,
    updateIncidentState: updateIncidentStateFromView,
  };
}
