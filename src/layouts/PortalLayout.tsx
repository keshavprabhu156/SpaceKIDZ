import Link from "next/link";
import LogoutButton from "@/components/common/LogoutButton";
import PortalSidebar from "@/components/sidebar/PortalSidebar";
import AuthProvider from "@/context/AuthProvider";
import type { NavItem } from "@/types/nav";
import type { Role, SessionPayload } from "@/types/user";

/**
 * Shell for the student/teacher/admin portals — sidebar + mobile bar + content.
 * (Replaces the former components/portal/PortalShell.)
 *
 * Wraps children in AuthProvider so client components inside a portal can call
 * useAuth() without re-fetching the session.
 */
export default function PortalLayout({
  title,
  role,
  roleValue,
  userName,
  userId,
  nav,
  children,
}: {
  title: string;
  /** Human-readable label shown in the sidebar, e.g. "Teacher" or "Student · Grade 6". */
  role: string;
  /** The actual Role enum value — NOT derived from `role`, which is free text
   *  and often doesn't lowercase into a valid Role (e.g. "Student · Grade 6"). */
  roleValue: Role;
  userName: string;
  userId: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const user: SessionPayload = {
    sub: userId,
    name: userName,
    role: roleValue,
  };

  return (
    <AuthProvider initialUser={user}>
      {/* A flat ground + a faint static brand tint — not the marketing site's
          animated, twinkling starfield. A tool you use for hours shouldn't
          have decorative motion running behind every page. */}
      <div className="relative min-h-screen bg-space-black">
        <div className="pointer-events-none absolute inset-0 bg-nebula-radial" aria-hidden />
        <div className="relative flex min-h-screen">
          <PortalSidebar
            title={title}
            role={role}
            userName={userName}
            userId={userId}
            nav={nav}
          />

          <div className="min-w-0 flex-1 lg:pl-64">
            {/* Mobile top bar */}
            <div className="flex items-center justify-between border-b border-star/10 bg-space-deep/80 px-4 py-3 backdrop-blur-xl lg:hidden">
              <Link
                href="/"
                className="font-display text-sm font-bold tracking-[0.28em] text-star"
              >
                SPACE
              </Link>
              <LogoutButton compact />
            </div>
            <main className="relative px-4 py-8 sm:px-8">{children}</main>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
