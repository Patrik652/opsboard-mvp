"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/session/useSession";

export default function DemoLogin() {
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const { enterDemoMode } = useSession();

  return (
    <div className="flex flex-col gap-2">
      <button
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
        onClick={async () => {
          enterDemoMode();
          setStatus("Opening demo workspace...");
          router.push("/boards");
        }}
        type="button"
      >
        Open demo workspace
      </button>
      {status ? <div className="text-xs text-emerald-200">{status}</div> : null}
    </div>
  );
}
