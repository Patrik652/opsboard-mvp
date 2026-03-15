"use client";

import { onAuthStateChanged } from "firebase/auth";
import { getBrowserStorage } from "@/features/platform/storage/jsonStorage";
import { auth } from "@/lib/firebase";
import { initialSessionState } from "./sessionStore";
import type { RuntimeMode, SessionState } from "./types";

const RUNTIME_MODE_KEY = "opsboard.runtime.mode";

export function getPersistedRuntimeMode(): RuntimeMode | null {
  const storage = getBrowserStorage();
  const value = storage?.getItem(RUNTIME_MODE_KEY);
  return value === "demo" || value === "authenticated" ? value : null;
}

export function persistRuntimeMode(mode: RuntimeMode | null) {
  const storage = getBrowserStorage();
  if (!storage) {
    return;
  }

  if (!mode) {
    storage.removeItem(RUNTIME_MODE_KEY);
    return;
  }

  storage.setItem(RUNTIME_MODE_KEY, mode);
}

export function deriveInitialSessionState(): SessionState {
  const persistedMode = getPersistedRuntimeMode();
  if (auth?.currentUser) {
    return {
      mode: "authenticated",
      status: "ready",
      userId: auth.currentUser.uid,
      error: null,
    };
  }

  if (persistedMode === "authenticated") {
    return {
      mode: "authenticated",
      status: "loading",
      userId: null,
      error: null,
    };
  }

  return {
    ...initialSessionState,
    mode: persistedMode ?? initialSessionState.mode,
  };
}

export function subscribeToFirebaseSession(callbacks: {
  onAuthenticated: (userId: string) => void;
  onSignedOut: () => void;
  onError: (message: string) => void;
}) {
  if (!auth) {
    callbacks.onSignedOut();
    return () => {};
  }

  return onAuthStateChanged(
    auth,
    (user) => {
      if (user) {
        callbacks.onAuthenticated(user.uid);
        return;
      }

      callbacks.onSignedOut();
    },
    (error) => {
      const message = error instanceof Error ? error.message : "Authentication failed";
      callbacks.onError(message);
    }
  );
}
