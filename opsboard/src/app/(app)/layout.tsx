import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import SeedOnLogin from "@/components/auth/SeedOnLogin";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen">
        <SeedOnLogin />
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />
          <main className="flex-1 bg-zinc-950 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
