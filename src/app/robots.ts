import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated portals and APIs stay out of the index
      disallow: ["/student", "/teacher", "/admin", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
