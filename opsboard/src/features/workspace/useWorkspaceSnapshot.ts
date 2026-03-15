"use client";

import { startTransition, useEffect, useState } from "react";
import {
  resolveWorkspaceRepository,
  resolveWorkspaceUserId,
} from "@/features/data/repositories/runtimeWorkspaceRepository";
import type { WorkspaceSnapshot } from "@/features/data/repositories/workspaceRepository";
import type { RuntimeMode } from "@/features/session/types";
import { useSession } from "@/features/session/useSession";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to load workspace.";
}

type UseWorkspaceSnapshotResult = {
  mode: RuntimeMode;
  workspaceUserId: string | null;
  workspace: WorkspaceSnapshot | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

async function readWorkspaceSnapshot(
  mode: RuntimeMode,
  workspaceUserId: string | null
): Promise<WorkspaceSnapshot | null> {
  if (!workspaceUserId) {
    return null;
  }

  const repository = resolveWorkspaceRepository(mode);
  return repository.getWorkspace(workspaceUserId);
}

export function useWorkspaceSnapshot(): UseWorkspaceSnapshotResult {
  const { mode, status, userId } = useSession();
  const [workspace, setWorkspace] = useState<WorkspaceSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const workspaceUserId = resolveWorkspaceUserId(mode, userId);

  const reload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextWorkspace = await readWorkspaceSnapshot(mode, workspaceUserId);

      startTransition(() => {
        setWorkspace(nextWorkspace);
      });
    } catch (nextError) {
      setError(getErrorMessage(nextError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "authenticated" && status !== "ready") {
      return;
    }

    let isActive = true;

    setIsLoading(true);
    setError(null);

    void readWorkspaceSnapshot(mode, workspaceUserId)
      .then((nextWorkspace) => {
        if (!isActive) {
          return;
        }

        startTransition(() => {
          setWorkspace(nextWorkspace);
        });
      })
      .catch((nextError) => {
        if (!isActive) {
          return;
        }

        setError(getErrorMessage(nextError));
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [mode, status, workspaceUserId]);

  return {
    mode,
    workspaceUserId,
    workspace,
    isLoading,
    error,
    reload,
  };
}
