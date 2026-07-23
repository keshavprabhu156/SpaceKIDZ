import type { Metadata } from "next";
import Link from "next/link";
import CinematicBackdrop from "@/components/fx/CinematicBackdrop";
import { Wordmark } from "@/components/layout/Navbar";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-space-black">
      <CinematicBackdrop />

      <div className="relative z-10 flex min-h-screen">
        <div className="flex w-full max-w-xl flex-col justify-center px-6 py-14 sm:px-12 lg:px-16">
          <Link href="/" aria-label="Space Education Portal — home" className="w-fit">
            <Wordmark />
          </Link>

          <h1 className="mt-10 font-display text-2xl font-bold tracking-tight text-star sm:text-3xl">
            Explore. <span className="text-grad">Learn.</span>{" "}
            <span className="text-grad">Inspire.</span>
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-star/60">
            Your journey to the stars begins here. Log in, challenge yourself, and
            become the explorer of tomorrow.
          </p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
