import type { Metadata } from "next";
import Link from "next/link";
import CinematicBackdrop from "@/components/fx/CinematicBackdrop";
import { Wordmark } from "@/components/layout/Navbar";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Sign up" };

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-space-black">
      <CinematicBackdrop />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-14 sm:px-8">
        <div className="mb-10 flex items-end justify-between">
          <Link href="/" aria-label="Space Education Portal — home">
            <Wordmark />
          </Link>
          <p className="text-xs text-star/55">
            Already enrolled?{" "}
            <Link href="/login" className="font-medium text-nebula-soft hover:underline">
              Log In
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
