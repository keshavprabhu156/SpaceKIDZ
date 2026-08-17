"use client";

import { createContext } from "react";
import type { SessionPayload } from "@/types/user";

export interface AuthContextValue {
  user: SessionPayload | null;
  isAuthenticated: boolean;
  /** Re-read the session from /api/auth/me */
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
