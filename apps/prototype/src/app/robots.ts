import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site/config";

/** Enkel de productieomgeving (SITE_INDEXEREN=1) laat crawlers binnen. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXEREN !== "1") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/winkelmand", "/verlanglijst", "/zoeken"] },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
