import Link from "next/link";
import StarBackground from "@/components/fx/StarBackground";
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
  const user: SessionPayload = {
    sub: userId,
    name: userName,
    role: role.toLowerCase() as Role,
  };

  return (
    <AuthProvider initialUser={user}>
      <div className="relative min-h-screen bg-space-black">
        <StarBackground />
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
