import apiClient from "./apiClient";
import type {
  LoginCredentials,
  RegisterPayload,
  Role,
  SessionPayload,
} from "@/types/user";

/** Client-side auth calls against the /api/auth/* route handlers. */

export interface LoginResult {
  ok: true;
  role: Role;
  name: string;
  id: string;
}

export interface RegisterResult {
  ok: true;
  studentId: string;
  name: string;
}

export const login = (credentials: LoginCredentials) =>
  apiClient.post<LoginResult>("/api/auth/login", credentials);

export const register = (payload: RegisterPayload) =>
  apiClient.post<RegisterResult>("/api/auth/register", payload);

export const logout = () => apiClient.post<{ ok: true }>("/api/auth/logout");

export const requestPasswordReset = (email: string) =>
  apiClient.post<{ ok: true }>("/api/auth/forgot", { email });

/** Current session, or null when signed out. */
export async function fetchCurrentUser(): Promise<SessionPayload | null> {
  try {
    const data = await apiClient.get<{ user: SessionPayload | null }>(
      "/api/auth/me",
      // A 401 here just means "signed out" — don't redirect.
      { skipAuthRedirect: true } as RequestInit
    );
    return data.user ?? null;
  } catch {
    return null;
  }
}
