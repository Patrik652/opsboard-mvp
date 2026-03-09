"use client";

import { useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, isAnonymousAuthEnabled } from "@/lib/firebase";

export default function DemoLogin() {
  const [status, setStatus] = useState<string | null>(null);
  const canUseFirebaseAuth = Boolean(auth) && isAnonymousAuthEnabled;
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <button
        className={`rounded-xl px-6 py-3 font-semibold transition-colors ${
          canUseFirebaseAuth
            ? "bg-emerald-500 text-black hover:bg-emerald-400"
            : "border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
        }`}
        onClick={async () => {
          if (!canUseFirebaseAuth || !auth) {
            setStatus("Opening offline demo mode...");
            router.push("/boards");
            return;
          }
          setStatus("Signing in...");
          try {
            await signInAnonymously(auth);
            setStatus("Signed in. Opening Boards...");
            router.push("/boards");
          } catch (error) {
            const message = error instanceof Error ? error.message : "Sign-in failed";
            setStatus(`Firebase sign-in unavailable (${message}). Opening offline demo mode...`);
            router.push("/boards");
          }
        }}
        type="button"
      >
        {canUseFirebaseAuth ? "Try demo account" : "Open demo workspace"}
      </button>
      {status ? <div className="text-xs text-emerald-200">{status}</div> : null}
    </div>
  );
}
