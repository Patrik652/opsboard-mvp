"use client";

import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DemoLogin() {
  const isEnabled = Boolean(auth);

  return (
    <button
      className={`rounded-xl px-6 py-3 font-semibold ${
        isEnabled ? "bg-emerald-500 text-black" : "bg-zinc-700 text-zinc-300"
      }`}
      onClick={() => {
        if (auth) {
          signInAnonymously(auth);
        }
      }}
      disabled={!isEnabled}
    >
      {isEnabled ? "Try demo account" : "Configure Firebase to login"}
    </button>
  );
}
