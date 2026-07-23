import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Modern geometric sans — clean, technical, cinematic (Apple-meets-NASA)
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

// Restrained monospace for small data readouts and eyebrows
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "International Space Curriculum — Future Begins Here",
    template: "%s | International Space Curriculum",
  },
  description:
    "A premium international space education platform for Grades 4–10. Interactive 3D lessons, mission simulations, games, and a global community of young space explorers.",
  keywords: [
    "space education",
    "space curriculum",
    "STEM",
    "satellites",
    "astronomy for kids",
    "international curriculum",
  ],
  openGraph: {
    title: "International Space Curriculum — Future Begins Here",
    description:
      "Enter the Space Academy. Interactive 3D lessons, missions, and games for Grades 4–10, worldwide.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0e17",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
