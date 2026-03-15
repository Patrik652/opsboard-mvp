"use client";

import type { RuntimeMode } from "@/features/session/types";
import { db } from "@/lib/firebase";
import { createDemoWorkspaceRepository } from "./demoWorkspaceRepository";
import { createFirestoreWorkspaceRepository } from "./firestoreWorkspaceRepository";
import type { WorkspaceRepository } from "./workspaceRepository";

export const DEMO_WORKSPACE_USER_ID = "demo-user";

const demoWorkspaceRepository = createDemoWorkspaceRepository();
const firestoreWorkspaceRepository = db ? createFirestoreWorkspaceRepository(db) : null;

export function resolveWorkspaceRepository(mode: RuntimeMode): WorkspaceRepository {
  if (mode === "authenticated") {
    if (!firestoreWorkspaceRepository) {
      throw new Error("Firestore workspace is not configured.");
    }

    return firestoreWorkspaceRepository;
  }

  return demoWorkspaceRepository;
}

export function resolveWorkspaceUserId(mode: RuntimeMode, userId: string | null): string | null {
  if (mode === "authenticated") {
    return userId;
  }

  return DEMO_WORKSPACE_USER_ID;
}
