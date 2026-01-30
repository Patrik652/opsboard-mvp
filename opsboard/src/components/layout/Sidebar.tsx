import Link from "next/link";

const navItems = [
  { href: "/boards", label: "Boards" },
  { href: "/incidents", label: "Incidents" },
  { href: "/status", label: "Status" },
  { href: "/audit", label: "Audit" },
  { href: "/analytics", label: "Analytics" },
  { href: "/ai", label: "AI" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 px-6 py-8 text-zinc-100">
      <div className="mb-10">
        <div className="text-sm uppercase tracking-[0.3em] text-emerald-400">Opsboard</div>
        <div className="text-xl font-semibold">Command Center</div>
      </div>
      <nav className="space-y-2">
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
    </aside>
  );
}
