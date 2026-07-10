import path from "node:path";
import { config as loadEnv } from "dotenv";
import type { NextConfig } from "next";

// Eén .env in de repo-root is de bron van waarheid; apps/web krijgt geen eigen kopie.
// Op Vercel bestaat dit bestand niet — dotenv no-opt dan stil en de project-env wint.
loadEnv({ path: path.resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  // Foto's leven op de Shopify CDN. De custom loader gebruikt Shopify's eigen
  // transformaties (?width=…) i.p.v. Vercel Image Optimization — anders betaalt
  // Vercel-transformatiepricing op 14k producten de marge op de maandvergoeding op.
  // Zie docs/architectuur.md §Foto's & CDN.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/shopify/image-loader.ts",
  },
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
