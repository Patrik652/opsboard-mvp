"use client";

import { useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DemoLogin() {
  const [status, setStatus] = useState<string | null>(null);
  const isEnabled = Boolean(auth);

  return (
    <div className="flex flex-col gap-2">
      <button
        className={`rounded-xl px-6 py-3 font-semibold transition-colors ${
          isEnabled ? "bg-emerald-500 text-black hover:bg-emerald-400" : "bg-zinc-700 text-zinc-300"
        }`}
        onClick={async () => {
          if (!auth) {
            setStatus("Firebase not configured");
            return;
          }
          setStatus("Signing in...");
          try {
            await signInAnonymously(auth);
            setStatus("Signed in. Open Boards to view demo data.");
          } catch (error) {
            const message = error instanceof Error ? error.message : "Sign-in failed";
            setStatus(message);
          }
        }}
        disabled={!isEnabled}
        type="button"
      >
        {isEnabled ? "Try demo account" : "Configure Firebase to login"}
      </button>
      {status ? <div className="text-xs text-emerald-200">{status}</div> : null}
    </div>
  );
}
