/**
 * Shared client-side API wrapper.
 *
 * Same role as PRM's axios `apiclient.ts`, implemented with fetch (no axios
 * dependency): one place for JSON headers, error normalisation and the 401
 * redirect. Auth travels in the httpOnly `isc_session` cookie, which the
 * browser attaches automatically on same-origin requests — so there is no
 * Authorization header to set here.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const LOGIN_PATHS = ["/api/auth/login", "/api/auth/register", "/api/auth/forgot"];

async function request<T>(
  path: string,
  init: RequestInit & { skipAuthRedirect?: boolean } = {}
): Promise<T> {
  const { skipAuthRedirect, ...rest } = init;

  let res: Response;
  try {
    res = await fetch(path, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(rest.headers ?? {}),
      },
    });
  } catch {
    // Network-level failure (offline, DNS, server down)
    throw new ApiError(
      "We couldn’t reach the server. Check your connection and retry.",
      0
    );
  }

  // Body may legitimately be empty (204) or non-JSON on a proxy error
  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ??
      `Request failed (${res.status})`;

    // Session expired → bounce to login, but never from the auth endpoints
    // themselves, or a failed login would redirect-loop.
    const isAuthEndpoint = LOGIN_PATHS.some((p) => path.startsWith(p));
    if (res.status === 401 && !isAuthEndpoint && !skipAuthRedirect) {
      if (typeof window !== "undefined") {
        window.location.href = `/login?next=${encodeURIComponent(
          window.location.pathname
        )}`;
      }
    }

    throw new ApiError(message, res.status);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "GET" }),

  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),

  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "DELETE" }),
};

export default apiClient;
