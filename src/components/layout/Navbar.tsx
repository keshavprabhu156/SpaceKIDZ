"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#about", label: "The Method" },
  { href: "/curriculum", label: "Syllabus" },
  { href: "/demo", label: "Observatory" },
  { href: "/games", label: "Exercises" },
  { href: "/#countries", label: "The Register" },
  { href: "/#contact", label: "Contact" },
];

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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-star/10 bg-space-black/85 backdrop-blur-md"
          : "border-b border-transparent"
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
            className="rounded-md bg-electric px-4 py-2 text-sm font-semibold text-space-black transition-colors hover:bg-gold-deep"
          >
            Apply
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
                className="flex-1 rounded-md bg-electric py-2.5 text-center text-sm font-semibold text-space-black"
                onClick={() => setOpen(false)}
              >
                Apply
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
