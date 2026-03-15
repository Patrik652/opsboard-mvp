"use client";

import ReliabilityOpsPanel from "@/components/operations/ReliabilityOpsPanel";
import { useWorkspaceSnapshot } from "@/features/workspace/useWorkspaceSnapshot";

export default function OperationsPage() {
  const { mode, workspace, workspaceUserId, isLoading, error, reload } = useWorkspaceSnapshot();

  return (
    <ReliabilityOpsPanel
      workspace={workspace}
      workspaceUserId={workspaceUserId}
      mode={mode}
      isLoading={isLoading}
      error={error}
      onWorkspaceRefresh={reload}
    />
  );
}
