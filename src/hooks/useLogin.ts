"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, requestPasswordReset } from "@/services/authService";
import { validateLogin } from "@/validation/authValidation";

/** Login + forgot-password submission for the login form. */
export function useLogin(nextPath?: string | null) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(email: string, password: string, remember: boolean) {
    const invalid = validateLogin({ email, password });
    if (invalid) {
      setError(invalid);
      return false;
    }

    setError(null);
    setLoading(true);
    try {
      const data = await login({ email, password, remember });
      router.push(nextPath ?? `/${data.role}`);
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function sendResetLink(email: string) {
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { signIn, sendResetLink, loading, error, setError };
}

export default useLogin;
