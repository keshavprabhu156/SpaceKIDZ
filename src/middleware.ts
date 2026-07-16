import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE, type Role } from "@/services/auth";

const protectedRoutes: { prefix: string; role: Role }[] = [
  { prefix: "/student", role: "student" },
  { prefix: "/teacher", role: "teacher" },
  { prefix: "/admin", role: "admin" },
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

  // Role gate — admins may view everything for support purposes
  if (session.role !== route.role && session.role !== "admin") {
    return NextResponse.redirect(new URL(`/${session.role}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/admin/:path*"],
};
