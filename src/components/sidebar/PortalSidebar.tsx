import Link from "next/link";
import LogoutButton from "@/components/common/LogoutButton";
import type { NavItem } from "@/types/nav";

/** Fixed sidebar for the student/teacher/admin portals. */
export default function PortalSidebar({
  title,
  role,
  userName,
  userId,
  nav,
}: {
  title: string;
  role: string;
  userName: string;
  userId: string;
  nav: NavItem[];
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-star/10 bg-space-deep/80 backdrop-blur-xl lg:flex">
      <Link href="/" className="flex flex-col gap-1 border-b border-star/10 px-6 py-5">
        <span className="flex items-center gap-1.5">
          <span className="font-display text-base font-bold tracking-[0.3em] text-star">
            SPACE
          </span>
          <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden>
            <defs>
              <linearGradient id="sb-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#4f7df9" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path
              d="M4 16 L15 5 M15 5 v7 M15 5 h-7"
              stroke="url(#sb-grad)"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-nebula-soft">
          {title}
        </span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {nav.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
              n.active
                ? "border border-electric/30 bg-electric/10 text-electric"
                : "text-star/55 hover:bg-white/5 hover:text-star"
            }`}
          >
            <span className="text-base">{n.icon}</span> {n.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-star/10 p-4">
        <div className="glass-panel p-4">
          <p className="truncate text-sm font-semibold text-star">{userName}</p>
          <p className="mt-0.5 font-mono text-[10px] tracking-widest text-electric/70">
            {userId}
          </p>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-star/35">
            {role}
          </p>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
