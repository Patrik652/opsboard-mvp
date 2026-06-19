"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, type ReactNode } from "react";
import { subscribeToFirebaseSession } from "@/features/session/firebaseSession";
import { useSession } from "@/features/session/useSession";

export default function RequireWorkspace({ children }: { children: ReactNode }) {
  const router = useRouter();
  const {
    mode,
    status,
    setAuthenticatedSession,
    setSessionError,
    resetSession,
  } = useSession();

  const handleAuthenticated = useEffectEvent((userId: string) => {
    setAuthenticatedSession(userId);
  });

  const handleSignedOut = useEffectEvent(() => {
    resetSession();
    router.push("/");
  });

  const handleError = useEffectEvent((message: string) => {
    setSessionError(message);
  });

  useEffect(() => {
    if (mode !== "authenticated") {
      return;
    }

    return subscribeToFirebaseSession({
      onAuthenticated: handleAuthenticated,
      onSignedOut: handleSignedOut,
      onError: handleError,
    });
  }, [mode]);

  if (mode === "authenticated" && status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-panel-muted text-zinc-100">
        <div className="rounded-xl border border-border bg-panel/60 px-6 py-4 text-sm text-zinc-300">
          Preparing your workspace...
        </div>
      </div>
    );
  }

  if (mode === "authenticated" && status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-panel-muted text-zinc-100">
        <div className="rounded-xl border border-danger-muted/40 bg-danger-muted/10 px-6 py-4 text-sm text-danger">
          Unable to open authenticated workspace right now.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
