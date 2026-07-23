"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/* ---------- inline icons ---------- */

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19.5c1.2-3.2 3.8-4.8 7-4.8s5.8 1.6 7 4.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="5" y="10.5" width="14" height="9" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

function EyeIcon({ off = false }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      {off && <path d="M4 4l16 16" strokeLinecap="round" />}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.8Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.14-4.06 1.14-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.28A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.62l4 3.1C6.23 6.88 8.88 4.77 12 4.77Z" />
    </svg>
  );
}

/* ---------- form ---------- */

export default function LoginForm() {
  const router = useRouter();
  // Query params read client-side (avoids the useSearchParams Suspense
  // boundary, which blocked hydration of this form in dev)
  const [nextPath, setNextPath] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next"));
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Request failed");
        return;
      }
      setResetSent(true);
    } catch {
      setError("We couldn’t reach the server. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.push(nextPath ?? `/${data.role}`);
      router.refresh();
    } catch {
      setError("We couldn’t reach the server. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-9 w-full max-w-sm"
    >
      {forgotMode ? (
        <form onSubmit={requestReset} className="space-y-4">
          {resetSent ? (
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/5 p-5 text-center">
              <p className="text-sm text-emerald-200">
                If an account exists for <span className="font-semibold">{email}</span>,
                a reset link is on its way.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs leading-relaxed text-star/55">
                Enter your registered email and we’ll send a password reset link.
              </p>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-star/40">
                  <UserIcon />
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="input-holo pl-11"
                  placeholder="Email"
                  aria-label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && (
                <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
                  {error}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => { setForgotMode(false); setResetSent(false); setError(null); }}
            className="w-full text-center text-xs text-star/55 transition-colors hover:text-electric"
          >
            ← Back to log in
          </button>
        </form>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-star/40">
              <UserIcon />
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              className="input-holo pl-11"
              placeholder="Email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-star/40">
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className="input-holo pl-11 pr-11"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-star/40 transition-colors hover:text-star/80"
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-star/55">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-star/20 bg-space-panel accent-nebula-light"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => { setForgotMode(true); setError(null); }}
              className="text-star/55 transition-colors hover:text-electric"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg border border-star/15 bg-white/[0.03] px-4 py-2.5 text-xs text-star/70">
              {info}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Logging in…" : "Log In"}
          </button>

          <div className="flex items-center gap-4 py-1">
            <span className="h-px flex-1 bg-star/15" />
            <span className="text-xs text-star/40">or</span>
            <span className="h-px flex-1 bg-star/15" />
          </div>

          <button
            type="button"
            onClick={() => setInfo("Google sign-in is coming soon — please use your email for now.")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-star/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-star backdrop-blur-sm transition-colors hover:bg-white/[0.07]"
          >
            <GoogleIcon /> Continue with Google
          </button>
        </form>
      )}

      <p className="mt-7 text-center text-xs text-star/50">
        Don’t have an account?{" "}
        <Link href="/register" className="font-medium text-nebula-soft hover:underline">
          Sign Up
        </Link>
      </p>

      <div className="mt-7 rounded-lg border border-star/10 bg-white/[0.02] p-3 font-mono text-[10px] leading-relaxed text-star/35">
        Demo access — password: space123
        <br />
        student@demo.isc · teacher@demo.isc · admin@demo.isc
      </div>
    </motion.div>
  );
}
