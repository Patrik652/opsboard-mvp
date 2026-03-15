"use client";

import { useState, type ReactNode } from "react";
import { SessionContext, initialSessionState } from "./sessionStore";
import type { SessionState, SessionValue } from "./types";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialSessionState);

  const value: SessionValue = {
    ...state,
    enterDemoMode: () => {
      setState({
        mode: "demo",
        status: "signed-out",
        userId: null,
        error: null,
      });
    },
    beginAuthenticatedFlow: () => {
      setState((current) => ({
        ...current,
        mode: "authenticated",
        status: "loading",
        error: null,
      }));
    },
    setAuthenticatedSession: (userId: string) => {
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
      setState(initialSessionState);
    },
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
