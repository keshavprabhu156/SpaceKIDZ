import type { Metadata, Viewport } from "next";
import { Orbitron, Inter, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const display = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
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
  themeColor: "#030014",
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
