"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type Role = "student" | "teacher";

export default function LoginForm() {
  const router = useRouter();
  // Query params read client-side (avoids the useSearchParams Suspense
  // boundary, which blocked hydration of this form in dev)
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("student");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("role") === "teacher") setRole("teacher");
    setNextPath(params.get("next"));
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setError("Connection lost. Check your uplink and retry.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
      setError("Connection lost. Check your uplink and retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="holo-panel holo-border relative z-10 w-full max-w-md p-8 sm:p-10"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-electric/70">
        ◉ Secure Uplink · Mission Access
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-star">
        Crew Login
      </h1>

      {/* Role selector */}
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-space-panel/60 p-1">
        {(["student", "teacher"] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-lg py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-all ${
              role === r ? "bg-electric/15 text-electric shadow-holo" : "text-star/40 hover:text-star/70"
            }`}
          >
            {r === "student" ? "◈ Student" : "▣ Teacher"}
          </button>
        ))}
      </div>

      {forgotMode ? (
        <form onSubmit={requestReset} className="mt-6 space-y-5">
          {resetSent ? (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-5 text-center">
              <p className="text-2xl">📡</p>
              <p className="mt-2 text-sm text-emerald-200">
                If an account exists for <span className="font-semibold">{email}</span>, a reset
                link is on its way.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs leading-relaxed text-star/50">
                Enter your registered email and we&apos;ll transmit a password reset link.
              </p>
              <div>
                <label className="label-holo" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input-holo"
                  placeholder="you@school.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && (
                <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
                  ⚠ {error}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "Transmitting…" : "Send Reset Link"}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => { setForgotMode(false); setResetSent(false); setError(null); }}
            className="w-full text-center font-mono text-[11px] uppercase tracking-widest text-electric/70 hover:text-electric"
          >
            ← Back to login
          </button>
        </form>
      ) : (
      <form onSubmit={submit} className="mt-6 space-y-5">
        <div>
          <label className="label-holo" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="input-holo"
            placeholder={role === "student" ? "cadet@school.org" : "teacher@school.org"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label-holo" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className="input-holo"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex cursor-pointer items-center gap-2 text-star/50">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-space-panel accent-cyan-glow"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => { setForgotMode(true); setError(null); }}
            className="font-mono text-[11px] uppercase tracking-widest text-electric/70 hover:text-electric"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            ⚠ {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Authenticating…" : "Initiate Login"}
        </button>

        {/* Future-ready: Google Sign-In + OTP slots in here */}
        <button
          type="button"
          disabled
          title="Google Sign-In arrives with the production identity provider"
          className="btn-ghost w-full !normal-case opacity-40"
        >
          <span className="text-base">G</span> Continue with Google — coming soon
        </button>
      </form>
      )}

      <p className="mt-6 text-center text-xs text-star/40">
        New cadet?{" "}
        <Link href="/register" className="text-electric hover:underline">
          Register for the Academy
        </Link>
      </p>

      <div className="mt-6 rounded-lg border border-white/5 bg-white/[0.02] p-3 font-mono text-[10px] leading-relaxed text-star/35">
        DEMO ACCESS — password: space123<br />
        student@demo.isc · teacher@demo.isc · admin@demo.isc
      </div>
    </motion.div>
  );
}
