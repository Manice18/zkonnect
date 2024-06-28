import type { MetadataRoute } from "next";

// To tell search engine crawlers which URLs they can access on zkonnect.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/reclaim/",
    },
    sitemap: "https://zkonnect.vercel.app/sitemap.xml",
  };
}

// Output:

// User-Agent: *
// Allow: /
// Disallow: /api/reclaim/
// Sitemap: https://zkonnect.vercel.app/sitemap.xml
