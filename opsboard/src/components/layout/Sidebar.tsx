import Link from "next/link";

type SidebarProps = {
  isLoading?: boolean;
  errorMessage?: string | null;
};

const navItems = [
  { href: "/boards", label: "Boards" },
  { href: "/incidents", label: "Incidents" },
  { href: "/status", label: "Status" },
  { href: "/audit", label: "Audit" },
  { href: "/analytics", label: "Analytics" },
  { href: "/ai", label: "AI" },
  { href: "/operations", label: "Operations" },
];

export default function Sidebar({ isLoading = false, errorMessage }: SidebarProps) {
  return (
    <aside className="w-full border-b border-zinc-800 bg-zinc-950 px-4 py-4 text-zinc-100 md:w-64 md:border-b-0 md:border-r md:px-6 md:py-8">
      <div className="mb-5 md:mb-10">
        <div className="text-sm uppercase tracking-[0.3em] text-emerald-400">Opsboard</div>
        <div className="text-lg font-semibold md:text-xl">Command Center</div>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          <p className="text-xs text-zinc-400">Loading navigation...</p>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-8 animate-pulse rounded-lg bg-zinc-900/80" />
          ))}
        </div>
      ) : (
        <nav className="grid gap-2 sm:grid-cols-2 md:block md:space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </aside>
  );
}
