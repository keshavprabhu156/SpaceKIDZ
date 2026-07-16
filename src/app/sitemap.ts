import type { MetadataRoute } from "next";
import { grades } from "@/data/curriculum";
import { SITE_URL } from "@/utils/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/curriculum", "/demo", "/games", "/login", "/register"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const gradePages = grades.map((g) => ({
    url: `${SITE_URL}/curriculum/${g.grade}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...pages, ...gradePages];
}
