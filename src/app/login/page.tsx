import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import StarBackground from "@/components/fx/StarBackground";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Login — Mission Access" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-space-black px-4 py-24">
      <Navbar />
      <StarBackground />
      <LoginForm />
    </main>
  );
}
