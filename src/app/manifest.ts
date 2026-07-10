import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "International Space Curriculum",
    short_name: "Space Academy",
    description:
      "A premium international space education platform for Grades 4–10 — interactive 3D missions, games and a global academy.",
    start_url: "/",
    display: "standalone",
    background_color: "#030014",
    theme_color: "#030014",
    orientation: "portrait-primary",
    categories: ["education", "kids"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
