"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/session/useSession";
import { auth, isGoogleAuthEnabled } from "@/lib/firebase";

const provider = new GoogleAuthProvider();

export default function GoogleLoginButton() {
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const { beginAuthenticatedFlow, setAuthenticatedSession, setSessionError } = useSession();

  return (
    <div className="flex flex-col gap-2">
      <button
        className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!isGoogleAuthEnabled || !auth}
        onClick={async () => {
          beginAuthenticatedFlow();
          setStatus("Opening Google sign-in...");

          if (!auth) {
            const message = "Firebase Auth is not configured.";
            setSessionError(message);
            setStatus(message);
            return;
          }

          try {
            const result = await signInWithPopup(auth, provider);
            setAuthenticatedSession(result.user.uid);
            setStatus("Signed in. Opening Boards...");
            router.push("/boards");
          } catch (error) {
            const message = error instanceof Error ? error.message : "Google sign-in failed";
            setSessionError(message);
            setStatus(`Google sign-in failed (${message}).`);
          }
        }}
        type="button"
      >
        Continue with Google
      </button>
      {status ? <div className="text-xs text-emerald-200">{status}</div> : null}
    </div>
  );
}
