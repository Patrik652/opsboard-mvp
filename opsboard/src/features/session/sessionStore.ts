import { createContext } from "react";
import type { SessionState, SessionValue } from "./types";

export const initialSessionState: SessionState = {
  mode: "demo",
  status: "signed-out",
  userId: null,
  error: null,
};

const noop = () => {};

export const defaultSessionValue: SessionValue = {
  ...initialSessionState,
  enterDemoMode: noop,
  beginAuthenticatedFlow: noop,
  setAuthenticatedSession: noop,
  setSessionError: noop,
  resetSession: noop,
};

export const SessionContext = createContext<SessionValue>(defaultSessionValue);
