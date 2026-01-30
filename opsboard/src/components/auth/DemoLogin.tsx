"use client";

import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DemoLogin() {
  return (
    <button
      className="rounded-xl bg-emerald-500 px-6 py-3 text-black font-semibold"
      onClick={() => signInAnonymously(auth)}
    >
      Try demo account
    </button>
  );
}
