import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.milanobardufoss.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${SITE_URL}/bestill`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/om-oss`, lastModified: now, priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE_URL}/kontakt`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE_URL}/vilkar`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
    { url: `${SITE_URL}/personvern`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
  ];
}
