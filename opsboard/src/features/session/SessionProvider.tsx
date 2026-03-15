"use client";

import { useState, type ReactNode } from "react";
import { deriveInitialSessionState, persistRuntimeMode } from "./firebaseSession";
import { SessionContext, initialSessionState } from "./sessionStore";
import type { SessionState, SessionValue } from "./types";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(deriveInitialSessionState);

  const value: SessionValue = {
    ...state,
    enterDemoMode: () => {
      persistRuntimeMode("demo");
      setState({
        mode: "demo",
        status: "signed-out",
        userId: null,
        error: null,
      });
    },
    beginAuthenticatedFlow: () => {
      persistRuntimeMode("authenticated");
      setState((current) => ({
        ...current,
        mode: "authenticated",
        status: "loading",
        error: null,
      }));
    },
    setAuthenticatedSession: (userId: string) => {
      persistRuntimeMode("authenticated");
      setState({
        mode: "authenticated",
        status: "ready",
        userId,
        error: null,
      });
    },
    setSessionError: (message: string) => {
      setState((current) => ({
        ...current,
        status: "error",
        error: message,
      }));
    },
    resetSession: () => {
      persistRuntimeMode(null);
      setState(initialSessionState);
    },
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
