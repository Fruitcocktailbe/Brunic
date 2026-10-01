#!/usr/bin/env node
// concept-zonder-foto.mjs — zet actieve producten ZONDER foto tijdelijk op "Concept" (DRAFT).
// Een conceptproduct ziet de Storefront API niet, dus de headless site toont het niet.
// Elk product krijgt ook de tag "concept-geen-foto", zodat het makkelijk terug te vinden is.
//
//   node packages/catalog/concept-zonder-foto.mjs            # DRY-RUN: zoekt en toont, wijzigt niets
//   node packages/catalog/concept-zonder-foto.mjs --go       # zet ze echt op concept (+ back-up in data/backup/)
//   node packages/catalog/concept-zonder-foto.mjs --terug    # zet alles met de tag weer op actief (DRY-RUN tenzij ook --go)
//
// Aanmelden: SHOPIFY_ADMIN_API_TOKEN, anders de Dev Dashboard-app (client credentials).
// Let op: een latere import (productSet) die status ACTIVE meestuurt, zet ze opnieuw online.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
try {
  for (const regel of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
    const m = regel.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* geen .env */
}

const args = process.argv.slice(2);
const GO = args.includes("--go");
const TERUG = args.includes("--terug");
const TAG = "concept-geen-foto";
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const VERSION = process.env.SHOPIFY_API_VERSION || "2025-10";

async function token() {
  if (process.env.SHOPIFY_ADMIN_API_TOKEN) return process.env.SHOPIFY_ADMIN_API_TOKEN;
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: process.env.SHOPIFY_CLIENT_ID ?? "", client_secret: process.env.SHOPIFY_CLIENT_SECRET ?? "" }),
  });
  const json = await res.json().catch(() => ({}));
  if (!json.access_token) throw new Error(`Aanmelden mislukt (HTTP ${res.status})`);
  return json.access_token;
}
const TOKEN = await token();

async function admin(query, variables = {}) {
  for (let poging = 1; ; poging++) {
    const res = await fetch(`https://${DOMAIN}/admin/api/${VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json().catch(() => ({}));
    const throttled = res.status === 429 || json.errors?.some?.((e) => e.extensions?.code === "THROTTLED");
    if (throttled && poging < 6) {
      await new Promise((r) => setTimeout(r, 1000 * poging));
      continue;
    }
    if (!res.ok || json.errors) throw new Error(`Admin API: HTTP ${res.status} ${JSON.stringify(json.errors ?? json).slice(0, 300)}`);
    return json.data;
  }
}

async function alle(filter) {
  const out = [];
  let after = null;
  do {
    const d = await admin(
      `query($after: String, $q: String) { products(first: 250, after: $after, query: $q) {
        pageInfo { hasNextPage endCursor }
        nodes { id handle title vendor status tags mediaCount { count } } } }`,
      { after, q: filter },
    );
    out.push(...d.products.nodes);
    after = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
  } while (after);
  return out;
}

const ZET_STATUS = `mutation($product: ProductUpdateInput!) { productUpdate(product: $product) { product { id status } userErrors { field message } } }`;
const TAG_ERBIJ = `mutation($id: ID!, $tags: [String!]!) { tagsAdd(id: $id, tags: $tags) { userErrors { message } } }`;

console.log(GO ? "MODUS: --go (wijzigt echt)" : "MODUS: DRY-RUN (geen wijzigingen)");

if (TERUG) {
  const lijst = await alle(`tag:${TAG} AND status:draft`);
  console.log(`${lijst.length} conceptproducten met tag "${TAG}":`);
  for (const p of lijst) console.log(`  ${p.vendor.padEnd(14)} ${p.handle}  (foto's: ${p.mediaCount.count})`);
  if (GO) {
    for (const p of lijst) {
      const r = await admin(ZET_STATUS, { product: { id: p.id, status: "ACTIVE" } });
      if (r.productUpdate.userErrors.length) console.error("  ✖", p.handle, r.productUpdate.userErrors);
    }
    console.log("Terug op actief. Publicatie op Brunic Headless bleef behouden; draai daarna de sync/build.");
  }
  process.exit(0);
}

const actief = await alle("status:active");
const zonderFoto = actief.filter((p) => p.mediaCount.count === 0);
console.log(`Actieve producten: ${actief.length} · zonder foto: ${zonderFoto.length}`);
const perMerk = {};
for (const p of zonderFoto) perMerk[p.vendor] = (perMerk[p.vendor] ?? 0) + 1;
console.log("Per merk:", perMerk);
for (const p of zonderFoto) console.log(`  ${p.vendor.padEnd(14)} ${p.handle}`);

if (!GO || zonderFoto.length === 0) process.exit(0);

// Back-up vóór elke wijziging (data/ is gitignored).
mkdirSync(join(ROOT, "data", "backup"), { recursive: true });
const backup = join(ROOT, "data", "backup", `concept-zonder-foto-${new Date().toISOString().slice(0, 10)}.json`);
writeFileSync(backup, JSON.stringify(zonderFoto.map(({ id, handle, title, vendor, status }) => ({ id, handle, title, vendor, vorigeStatus: status })), null, 2));
console.log(`Back-up: ${backup}`);

let ok = 0;
for (const p of zonderFoto) {
  const r = await admin(ZET_STATUS, { product: { id: p.id, status: "DRAFT" } });
  if (r.productUpdate.userErrors.length) {
    console.error("  ✖", p.handle, r.productUpdate.userErrors);
    continue;
  }
  await admin(TAG_ERBIJ, { id: p.id, tags: [TAG] });
  ok++;
}
console.log(`${ok}/${zonderFoto.length} producten op concept gezet (tag "${TAG}"). Terugzetten: --terug --go`);
