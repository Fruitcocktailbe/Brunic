#!/usr/bin/env node
/**
 * Draait vóór elke build (package.json → prebuild): haalt de actuele catalogus op uit
 * Shopify (scripts/sync-shopify.mjs, alleen lezen) zodat een deploy altijd de producten van
 * dat moment toont.
 *
 * - Sync gelukt → build gaat door met de verse momentopname.
 * - Sync mislukt maar er is al een momentopname → waarschuwing, build gaat door met die versie.
 * - Sync mislukt en geen momentopname → build stopt (liever geen site dan een lege webshop).
 *
 * Op Vercel: SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_API_TOKEN als projectvariabelen zetten.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const snapshot = path.resolve(here, "../.data/shopify-catalogus.json");

const res = spawnSync(process.execPath, [path.join(here, "sync-shopify.mjs")], { stdio: "inherit" });
if (res.status === 0) process.exit(0);

if (fs.existsSync(snapshot)) {
  const wanneer = JSON.parse(fs.readFileSync(snapshot, "utf8")).gesynchroniseerd ?? "onbekend";
  console.warn(`\n⚠️  Shopify-sync mislukt — de build gebruikt de bestaande momentopname van ${wanneer}.\n`);
  process.exit(0);
}
console.error("\n✖ Shopify-sync mislukt en er is geen momentopname: build gestopt. Controleer SHOPIFY_STORE_DOMAIN en SHOPIFY_STOREFRONT_API_TOKEN.\n");
process.exit(1);
