"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className={
        compact
          ? "rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-star/50 hover:border-red-400/40 hover:text-red-300"
          : "mt-3 w-full rounded-lg border border-white/10 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-star/50 transition-all hover:border-red-400/40 hover:text-red-300"
      }
    >
      ⏻ End Session
    </button>
  );
}
