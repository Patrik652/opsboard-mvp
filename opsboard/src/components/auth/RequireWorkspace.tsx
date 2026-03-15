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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-4 text-sm text-zinc-300">
          Preparing your workspace...
        </div>
      </div>
    );
  }

  if (mode === "authenticated" && status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-6 py-4 text-sm text-rose-200">
          Unable to open authenticated workspace right now.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
