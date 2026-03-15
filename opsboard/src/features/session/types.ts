export type RuntimeMode = "demo" | "authenticated";

export type SessionStatus = "signed-out" | "loading" | "ready" | "error";

export type SessionState = {
  mode: RuntimeMode;
  status: SessionStatus;
  userId: string | null;
  error: string | null;
};

export type SessionActions = {
  enterDemoMode: () => void;
  beginAuthenticatedFlow: () => void;
  setAuthenticatedSession: (userId: string) => void;
  setSessionError: (message: string) => void;
  resetSession: () => void;
};

export type SessionValue = SessionState & SessionActions;
