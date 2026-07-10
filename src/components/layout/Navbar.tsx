"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#mission", label: "Mission" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/demo", label: "Demo" },
  { href: "/games", label: "Games" },
  { href: "/#countries", label: "Countries" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-white/10 bg-space-black/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          {/* Logo placeholder — swap for brand SVG in /public/brand when assets arrive */}
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-electric/50 bg-electric/10 shadow-holo">
            <span className="h-2.5 w-2.5 rounded-full bg-electric shadow-holo-strong" />
            <span className="absolute inset-0 animate-spin-slow rounded-full border border-transparent border-t-electric/60" />
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-star">
            Space<span className="text-electric">Curriculum</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-star/60 transition-colors hover:text-electric"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="rounded-lg border border-white/15 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-star/80 transition-all hover:border-electric/60 hover:text-electric"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-electric to-galaxy-light px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-space-black transition-all hover:shadow-holo-strong"
          >
            Join Academy
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`h-0.5 w-6 bg-electric transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-electric transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-electric transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-space-black/95 px-6 py-6 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.18em] text-star/70 hover:text-electric"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3">
              <Link href="/login" className="btn-secondary flex-1 !py-2.5 text-center" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="btn-primary flex-1 !py-2.5 text-center" onClick={() => setOpen(false)}>
                Join
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
