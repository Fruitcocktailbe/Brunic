import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Eén .env in de repo-root is de bron van waarheid (lokaal). Op Vercel bestaat dat bestand
// niet en gelden de projectvariabelen; bestaande variabelen worden nooit overschreven.
try {
  for (const regel of fs.readFileSync(path.resolve(process.cwd(), "../../.env"), "utf8").split("\n")) {
    const m = regel.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* geen .env — Vercel of CI */
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  // De catalogus-momentopname (Shopify, zie scripts/voor-build.mjs) wordt at runtime met fs
  // gelezen; zonder deze regel zit ze niet in de serverless-functies op Vercel.
  outputFileTracingIncludes: { "/**": ["./.data/shopify-catalogus.json"] },
  experimental: {
    // Aanvraagformulier met foto's: de browser verkleint ze eerst (max. ±5 × 400 kB).
    serverActions: { bodySizeLimit: "4mb" },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Geen klantaccounts: offertes en de verlanglijst werken zonder login.
      { source: "/account", destination: "/verlanglijst", permanent: true },
      { source: "/info/over-dit-prototype", destination: "/info/over-ons", permanent: true },
    ];
  },
};

export default nextConfig;
