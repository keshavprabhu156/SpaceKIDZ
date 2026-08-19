import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE, type Role } from "@/services/tokenService";
import { PORTAL_PATH, ROLE_RANK } from "@/utils/rolePortal";

const protectedRoutes: { prefix: string; role: Role }[] = [
  { prefix: "/student", role: "student" },
  { prefix: "/teacher", role: "teacher" },
  { prefix: "/super", role: "super_admin" },
  { prefix: "/admin", role: "admin" }, // checked after /super — "/admin" would also prefix-match "/administrator" etc, but not "/super"
];

export async function middleware(req: NextRequest) {
  const route = protectedRoutes.find((r) => req.nextUrl.pathname.startsWith(r.prefix));
  if (!route) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  const sessionRole = session.role as Role;
  const ownsRoute = sessionRole === route.role;
  // A higher-ranked role may view a lower-ranked role's portal (support access).
  // Rank is never used to grant access to a HIGHER-ranked portal — only admin
  // and super_admin outrank anything, and /super itself requires super_admin.
  const outranks = ROLE_RANK[sessionRole] > ROLE_RANK[route.role];

  if (!ownsRoute && !outranks) {
    return NextResponse.redirect(new URL(PORTAL_PATH[sessionRole] ?? "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/admin/:path*", "/super/:path*"],
};
