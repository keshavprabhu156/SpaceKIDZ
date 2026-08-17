"use client";

import { useCallback, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { fetchCurrentUser, logout } from "@/services/authService";
import type { SessionPayload } from "@/types/user";

/**
 * Makes the session available to client components.
 *
 * `initialUser` is passed down from a server component that already read the
 * session via getSession(), so there is no loading flash and no extra request
 * on first paint.
 */
export default function AuthProvider({
  initialUser = null,
  children,
}: {
  initialUser?: SessionPayload | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SessionPayload | null>(initialUser);

  const refresh = useCallback(async () => {
    setUser(await fetchCurrentUser());
  }, []);

  const signOut = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, refresh, signOut }),
    [user, refresh, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
