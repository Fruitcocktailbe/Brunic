#!/usr/bin/env node
// publiceer-headless.mjs — publiceert actieve producten die nog NIET op "Brunic Headless"
// staan op dat kanaal. Zonder die publicatie ziet de Storefront API (en dus de site) ze niet,
// ook al staan ze op "actief" (architectuur.md / overdracht §5: productSet publiceert niet).
//
//   node packages/catalog/publiceer-headless.mjs            # DRY-RUN: telt en toont, wijzigt niets
//   node packages/catalog/publiceer-headless.mjs --go       # publiceert echt
//   node packages/catalog/publiceer-headless.mjs --go --limit 20
//
// Idempotent: reeds gepubliceerde producten worden overgeslagen; opnieuw draaien is veilig.
// Aanmelden: SHOPIFY_ADMIN_API_TOKEN, anders de Dev Dashboard-app (client credentials).
// Vereiste scopes: read_products + write_publications.
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
  /* geen .env */
}

const args = process.argv.slice(2);
const GO = args.includes("--go");
const LIMIT = args.includes("--limit") ? Number(args[args.indexOf("--limit") + 1]) : Infinity;
const KANAAL = "Brunic Headless";
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const VERSION = process.env.SHOPIFY_API_VERSION || "2025-10";

async function token() {
  if (process.env.SHOPIFY_ADMIN_API_TOKEN) return process.env.SHOPIFY_ADMIN_API_TOKEN;
  const res = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SHOPIFY_CLIENT_ID ?? "",
      client_secret: process.env.SHOPIFY_CLIENT_SECRET ?? "",
    }),
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

const pubs = (await admin(`{ publications(first: 20) { nodes { id name } } }`)).publications.nodes;
const kanaal = pubs.find((p) => p.name === KANAAL);
if (!kanaal) throw new Error(`Kanaal "${KANAAL}" niet gevonden (wel: ${pubs.map((p) => p.name).join(", ")})`);

console.log(GO ? "MODUS: --go (publiceert echt)" : "MODUS: DRY-RUN (geen wijzigingen)");
console.log(`Kanaal: ${KANAAL}\n`);

// 1. Verzamelen welke actieve producten nog niet op het kanaal staan
const teDoen = [];
let totaal = 0, alGepubliceerd = 0, nietActief = 0, after = null;
do {
  const d = await admin(
    `query($after: String, $pub: ID!) { products(first: 250, after: $after) {
      nodes { id title status publishedOnPublication(publicationId: $pub) }
      pageInfo { hasNextPage endCursor } } }`,
    { after, pub: kanaal.id },
  );
  for (const p of d.products.nodes) {
    totaal++;
    if (p.publishedOnPublication) alGepubliceerd++;
    else if (p.status !== "ACTIVE") nietActief++;
    else teDoen.push(p);
  }
  after = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
} while (after);

const selectie = teDoen.slice(0, LIMIT);
console.log(`Producten in de winkel:        ${totaal}`);
console.log(`Al op ${KANAAL}:        ${alGepubliceerd}`);
console.log(`Niet actief (overgeslagen):    ${nietActief}`);
console.log(`Te publiceren:                 ${teDoen.length}${selectie.length < teDoen.length ? ` (deze run: ${selectie.length})` : ""}`);
console.log(`Voorbeelden: ${selectie.slice(0, 5).map((p) => p.title).join(" · ")}\n`);

if (!GO) {
  console.log("Niets gewijzigd. Draai opnieuw met --go om echt te publiceren.");
  process.exitCode = 0;
} else {
  // 2. Publiceren (publishablePublish per product; fouten worden verzameld, niet stilgezwegen)
  let ok = 0;
  const fouten = [];
  for (const [i, p] of selectie.entries()) {
    const d = await admin(
      `mutation($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) { userErrors { field message } } }`,
      { id: p.id, input: [{ publicationId: kanaal.id }] },
    );
    const errs = d.publishablePublish.userErrors;
    if (errs.length) fouten.push(`${p.title}: ${errs.map((e) => e.message).join("; ")}`);
    else ok++;
    if ((i + 1) % 100 === 0 || i + 1 === selectie.length) console.log(`  ${i + 1}/${selectie.length} verwerkt (${ok} ok, ${fouten.length} fout)`);
  }
  console.log(`\nGepubliceerd: ${ok} · fouten: ${fouten.length}`);
  for (const f of fouten.slice(0, 20)) console.log("  - " + f);
}
