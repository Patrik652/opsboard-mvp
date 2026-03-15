"use client";

import { buildWorkspaceMetrics } from "@/features/analytics/buildWorkspaceMetrics";
import type { Service } from "@/features/data/model";
import { useWorkspaceSnapshot } from "@/features/workspace/useWorkspaceSnapshot";

export function useServicesViewModel() {
  const { workspace, isLoading, error } = useWorkspaceSnapshot();

  const services: Service[] = workspace?.services ?? [];
  const metrics = buildWorkspaceMetrics({
    cards: workspace?.cards ?? [],
    incidents: workspace?.incidents ?? [],
    services,
    auditLogs: workspace?.auditLogs ?? [],
  });

  return {
    services,
    metrics,
    isLoading,
    error,
  };
}
