"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/** Reads the session from AuthProvider. Must be used inside a portal layout. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

export default useAuth;
