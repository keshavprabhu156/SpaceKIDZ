import Link from "next/link";
import StarBackground from "@/components/fx/StarBackground";
import LogoutButton from "./LogoutButton";

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

export default function PortalShell({
  title,
  role,
  userName,
  userId,
  nav,
  children,
}: {
  title: string;
  role: string;
  userName: string;
  userId: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-space-black">
      <StarBackground />
      <div className="relative flex min-h-screen">
        {/* ---------------- Sidebar ---------------- */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-space-deep/80 backdrop-blur-xl lg:flex">
          <Link href="/" className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-electric/50 bg-electric/10">
              <span className="h-2.5 w-2.5 rounded-full bg-electric shadow-holo-strong" />
            </span>
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-star">
                Space<span className="text-electric">Curriculum</span>
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-star/40">{title}</p>
            </div>
          </Link>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
            {nav.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.15em] transition-all ${
                  n.active
                    ? "border border-electric/30 bg-electric/10 text-electric shadow-holo"
                    : "text-star/50 hover:bg-white/5 hover:text-star"
                }`}
              >
                <span className="text-base">{n.icon}</span> {n.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="glass-panel p-4">
              <p className="truncate text-sm font-semibold text-star">{userName}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-electric/60">{userId}</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-star/35">{role}</p>
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* ---------------- Main ---------------- */}
        <div className="min-w-0 flex-1 lg:pl-64">
          {/* Mobile top bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-space-deep/80 px-4 py-3 backdrop-blur-xl lg:hidden">
            <Link href="/" className="font-display text-xs font-bold uppercase tracking-[0.2em] text-star">
              Space<span className="text-electric">Curriculum</span>
            </Link>
            <LogoutButton compact />
          </div>
          <main className="relative px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
