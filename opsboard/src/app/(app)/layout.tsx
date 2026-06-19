import type { ReactNode } from "react";
import RequireWorkspace from "@/components/auth/RequireWorkspace";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import SeedOnLogin from "@/components/auth/SeedOnLogin";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RequireWorkspace>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          <SeedOnLogin />
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1 bg-background px-6 py-8">{children}</main>
          </div>
        </div>
      </div>
    </RequireWorkspace>
  );
}
