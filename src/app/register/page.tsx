import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import StarBackground from "@/components/fx/StarBackground";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Student Registration — Join the Academy" };

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-space-black px-4 py-28">
      <Navbar />
      <StarBackground />
      <RegisterForm />
    </main>
  );
}
