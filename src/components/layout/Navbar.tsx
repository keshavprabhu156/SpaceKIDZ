"use client";

import Link from "next/link";
import { useState } from "react";
import { publicNavLinks as links } from "@/configs/navConfig";
import useScrolled from "@/hooks/useScrolled";

/** Brand wordmark — wide-tracked SPACE with a gradient ascending arrow */
export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className="flex items-center gap-1.5">
        <span
          className={`font-display font-bold tracking-[0.32em] text-star ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          SPACE
        </span>
        <svg
          viewBox="0 0 20 20"
          className={compact ? "h-3.5 w-3.5" : "h-4 w-4"}
          aria-hidden
        >
          <defs>
            <linearGradient id="wm-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#4f7df9" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            d="M4 16 L15 5 M15 5 v7 M15 5 h-7"
            stroke="url(#wm-grad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
      <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.42em] text-nebula-soft">
        Education Portal
      </span>
    </span>
  );
}

export default function Navbar() {
  const scrolled = useScrolled(32);
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-star/10 bg-space-black/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Space Education Portal — home">
          <Wordmark compact />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-star/65 transition-colors hover:text-electric"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm text-star/80 transition-colors hover:text-electric"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-grad px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`h-px w-6 bg-star transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-star transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-star transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-star/10 bg-space-black/95 px-6 py-6 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-star/75 hover:text-electric"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3">
              <Link
                href="/login"
                className="flex-1 rounded-md border border-star/20 py-2.5 text-center text-sm text-star"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-full bg-brand-grad py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
