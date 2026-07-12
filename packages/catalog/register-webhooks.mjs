#!/usr/bin/env node
// register-webhooks.mjs — koppelt de Shopify-webhooks aan de gedeployde site,
// zodat admin-wijzigingen via /api/webhooks/shopify meteen revalideren.
//
// Idempotent: bestaande subscriptions op hetzelfde topic + dezelfde URL worden
// overgeslagen; wijst een topic naar een ándere URL, dan wordt die vervangen.
//
// Draai NA elke deploy (de callback-URL moet publiek bereikbaar zijn — Shopify kan
// localhost niet bereiken):
//   node packages/catalog/register-webhooks.mjs https://brunic.be
//   node packages/catalog/register-webhooks.mjs https://brunic.be --dry-run
//
// Leest SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_TOKEN, SHOPIFY_API_VERSION uit de
// repo-root .env.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Minimalistische .env-parser (geen dependency nodig).
function laadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env"), "utf8");
    for (const regel of raw.split("\n")) {
      const m = regel.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* geen .env: dan moeten de vars al in de omgeving staan (bv. CI) */
  }
}
laadEnv();

const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const base = argv.find((a) => !a.startsWith("--"));

if (!base) {
  console.error("Gebruik: node register-webhooks.mjs <https://basis-url> [--dry-run]");
  process.exit(1);
}

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

if (!DOMAIN || !TOKEN) {
  console.error("SHOPIFY_STORE_DOMAIN of SHOPIFY_ADMIN_API_TOKEN ontbreekt (.env).");
  process.exit(1);
}

const CALLBACK = `${base.replace(/\/$/, "")}/api/webhooks/shopify`;

const TOPICS = [
  "PRODUCTS_CREATE",
  "PRODUCTS_UPDATE",
  "PRODUCTS_DELETE",
  "COLLECTIONS_CREATE",
  "COLLECTIONS_UPDATE",
  "COLLECTIONS_DELETE",
];

async function admin(query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const LIST = `query { webhookSubscriptions(first: 100) { nodes { id topic uri } } }`;
const CREATE = `mutation($topic: WebhookSubscriptionTopic!, $uri: String!) {
  webhookSubscriptionCreate(topic: $topic, webhookSubscription: { uri: $uri, format: JSON }) {
    webhookSubscription { id topic uri } userErrors { field message }
  }
}`;
const DELETE = `mutation($id: ID!) {
  webhookSubscriptionDelete(id: $id) { deletedWebhookSubscriptionId userErrors { field message } }
}`;

console.log(`Store   : ${DOMAIN}`);
console.log(`Callback: ${CALLBACK}`);
console.log(dryRun ? "Modus   : DRY RUN\n" : "");

const bestaand = (await admin(LIST)).webhookSubscriptions.nodes;

for (const topic of TOPICS) {
  const zelfdeTopic = bestaand.filter((w) => w.topic === topic);
  const juist = zelfdeTopic.find((w) => w.uri === CALLBACK);

  if (juist) {
    console.log(`✓ ${topic} — al gekoppeld`);
    continue;
  }

  // Topic wijst naar een oude URL (bv. vorige deploy-preview): opruimen.
  for (const oud of zelfdeTopic) {
    console.log(`↻ ${topic} — verwijder oude URL ${oud.uri}`);
    if (!dryRun) await admin(DELETE, { id: oud.id });
  }

  console.log(`+ ${topic} — aanmaken`);
  if (!dryRun) {
    const r = await admin(CREATE, { topic, uri: CALLBACK });
    const err = r.webhookSubscriptionCreate.userErrors;
    if (err.length) console.error(`  ! ${topic}: ${err.map((e) => e.message).join(", ")}`);
  }
}

console.log("\nKlaar.");
