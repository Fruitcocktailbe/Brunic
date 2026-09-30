/**
 * Shopify Admin API (GraphQL) — enkel serverzijdig (server actions / route handlers).
 *
 * Aanmelden: SHOPIFY_ADMIN_API_TOKEN (shpat_…) als die er is, anders de Dev Dashboard-app
 * via client credentials (SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET). Dat token leeft
 * 24 uur; we bewaren het in het geheugen en vragen een nieuw aan ruim vóór het vervalt.
 * Nodige scopes: read_customers, write_customers, write_files.
 */
const VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

export class AdminError extends Error {
  constructor(
    message: string,
    readonly kind: "config" | "scope" | "graphql" | "http" = "graphql",
  ) {
    super(message);
    this.name = "AdminError";
  }
}

let cached: { token: string; geldigTot: number } | null = null;

async function token(domain: string): Promise<string> {
  if (process.env.SHOPIFY_ADMIN_API_TOKEN) return process.env.SHOPIFY_ADMIN_API_TOKEN;
  if (cached && cached.geldigTot > Date.now()) return cached.token;
  const id = process.env.SHOPIFY_CLIENT_ID;
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!id || !secret) throw new AdminError("Geen Admin-toegang: zet SHOPIFY_ADMIN_API_TOKEN of SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET.", "config");
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new AdminError(`Aanmelden bij Shopify mislukt (HTTP ${res.status})`, "http");
  // Eén uur marge vóór het verval.
  cached = { token: json.access_token, geldigTot: Date.now() + Math.max(60, (json.expires_in ?? 3600) - 3600) * 1000 };
  return cached.token;
}

export async function admin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) throw new AdminError("SHOPIFY_STORE_DOMAIN ontbreekt.", "config");

  const res = await fetch(`https://${domain}/admin/api/${VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await token(domain) },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) {
    cached = null;
    throw new AdminError("Admin API weigert de token. Ontbreken de scopes read_customers/write_customers/write_files?", "scope");
  }
  if (!res.ok) throw new AdminError(`Admin API gaf HTTP ${res.status}`, "http");

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    const msg = json.errors.map((e) => e.message).join("; ");
    throw new AdminError(msg, /access denied|not approved|scope/i.test(msg) ? "scope" : "graphql");
  }
  if (!json.data) throw new AdminError("Admin API gaf geen data terug");
  return json.data;
}
