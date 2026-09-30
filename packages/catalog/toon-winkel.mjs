#!/usr/bin/env node
// toon-winkel.mjs — ALLEEN LEZEN: toont in de terminal wat er in de Shopify-winkel staat
// (winkel, aantallen, laatst bijgewerkte producten, collecties). Wijzigt niets.
//
//   node packages/catalog/toon-winkel.mjs            # laatste 15 bijgewerkte producten
//   node packages/catalog/toon-winkel.mjs --aantal=40
//
// Aanmelden: SHOPIFY_ADMIN_API_TOKEN (shpat_…) als die in .env staat, anders de
// Dev Dashboard-app via de client credentials grant (SHOPIFY_CLIENT_ID + _SECRET).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
try {
  for (const regel of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
    const m = regel.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* geen .env: variabelen moeten dan in de omgeving staan */
}

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const VERSION = process.env.SHOPIFY_API_VERSION || "2025-10";
const aantal = Number((process.argv.find((a) => a.startsWith("--aantal=")) ?? "--aantal=15").split("=")[1]) || 15;

if (!DOMAIN) {
  console.error("SHOPIFY_STORE_DOMAIN ontbreekt in .env");
  process.exit(1);
}

async function token() {
  if (process.env.SHOPIFY_ADMIN_API_TOKEN) return process.env.SHOPIFY_ADMIN_API_TOKEN;
  const id = process.env.SHOPIFY_CLIENT_ID;
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Geen SHOPIFY_ADMIN_API_TOKEN en geen SHOPIFY_CLIENT_ID/SECRET in .env");
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Aanmelden mislukt (HTTP ${res.status}): ${text.slice(0, 300)}`);
  const json = JSON.parse(text);
  if (!json.access_token) throw new Error("Geen access_token in antwoord: " + text.slice(0, 300));
  return json.access_token;
}

async function admin(tok, query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": tok },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Admin API HTTP ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  if (json.errors) throw new Error("GraphQL: " + JSON.stringify(json.errors).slice(0, 500));
  return json.data;
}

const QUERY = /* GraphQL */ `
  query Overzicht($n: Int!) {
    shop { name myshopifyDomain currencyCode }
    productsCount { count }
    actief: productsCount(query: "status:active") { count }
    concept: productsCount(query: "status:draft") { count }
    gearchiveerd: productsCount(query: "status:archived") { count }
    collectionsCount { count }
    products(first: $n, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        title
        handle
        status
        vendor
        updatedAt
        totalInventory
        variantsCount { count }
        mediaCount { count }
        collections(first: 4) { nodes { title } }
      }
    }
    collections(first: 60, sortKey: UPDATED_AT, reverse: true) {
      nodes { title handle productsCount { count } }
    }
  }
`;

const fmt = new Intl.DateTimeFormat("nl-BE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Brussels" });
const kort = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n));

try {
  const tok = await token();
  const d = await admin(tok, QUERY, { n: aantal });
  console.log(`\nWinkel: ${d.shop.name} (${d.shop.myshopifyDomain}, ${d.shop.currencyCode}) · API ${VERSION}`);
  console.log(
    `Producten: ${d.productsCount.count} (actief ${d.actief.count} · concept ${d.concept.count} · gearchiveerd ${d.gearchiveerd.count}) · Collecties: ${d.collectionsCount.count}`,
  );
  if (d.concept.count > 0) console.log(`Let op: conceptproducten (DRAFT) verschijnen niet in de webshop tot ze actief én gepubliceerd zijn.`);
  console.log("");

  console.log(`Laatst bijgewerkte ${d.products.nodes.length} producten:`);
  console.log(`${"Bijgewerkt".padEnd(16)}  ${"Status".padEnd(8)}  ${"Titel".padEnd(46)}  Var  Foto  Collecties`);
  for (const p of d.products.nodes) {
    console.log(
      `${fmt.format(new Date(p.updatedAt)).padEnd(16)}  ${p.status.padEnd(8)}  ${kort(p.title, 46)}  ${String(p.variantsCount?.count ?? "?").padStart(3)}  ${String(p.mediaCount?.count ?? "?").padStart(4)}  ${p.collections.nodes.map((c) => c.title).join(", ") || "—"}`,
    );
  }

  console.log(`\nCollecties (laatst bijgewerkt eerst):`);
  for (const c of d.collections.nodes) console.log(`  ${kort(c.title, 40)}  ${String(c.productsCount?.count ?? "?").padStart(4)} producten   /${c.handle}`);
  console.log("");
} catch (e) {
  console.error("\n" + e.message + "\n");
  process.exit(1);
}
