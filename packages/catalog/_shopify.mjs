// _shopify.mjs — gedeelde env-loader + Admin-GraphQL-helper voor de catalog-scripts.
// Leest SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_TOKEN, SHOPIFY_API_VERSION uit repo-root .env.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function laadEnv() {
  try {
    const raw = readFileSync(join(ROOT, ".env"), "utf8");
    for (const regel of raw.split("\n")) {
      const m = regel.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* geen .env: dan moeten de vars al in de omgeving staan */
  }
}
laadEnv();

export const ROOT_DIR = ROOT;
const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

if (!DOMAIN || !TOKEN) {
  console.error("SHOPIFY_STORE_DOMAIN of SHOPIFY_ADMIN_API_TOKEN ontbreekt (.env).");
  process.exit(1);
}

export async function admin(query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 401 || res.status === 403) {
    throw new Error(`Admin API weigert de token (HTTP ${res.status}) — scopes?`);
  }
  const json = await res.json();
  if (json.errors) throw new Error("GraphQL: " + JSON.stringify(json.errors));
  return json.data;
}

export { DOMAIN, VERSION };
