const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

export class AdminError extends Error {
  constructor(
    message: string,
    readonly kind: "config" | "scope" | "graphql" | "http" = "graphql",
  ) {
    super(message);
    this.name = "AdminError";
  }
}

/**
 * Admin API — GEHEIME token (shpat_). Nooit NEXT_PUBLIC_, nooit vanuit de browser.
 * Enkel aanroepen vanuit server actions / route handlers.
 */
export async function admin<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!domain || !token) {
    throw new AdminError("SHOPIFY_ADMIN_API_TOKEN of SHOPIFY_STORE_DOMAIN ontbreekt.", "config");
  }

  const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    throw new AdminError(
      "Admin API weigert de token. Ontbreken de scopes read_customers/write_customers?",
      "scope",
    );
  }
  if (!res.ok) throw new AdminError(`Admin API gaf HTTP ${res.status}`, "http");

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };

  if (json.errors?.length) {
    const msg = json.errors.map((e) => e.message).join("; ");
    // Shopify meldt ontbrekende scopes als een gewone GraphQL-fout.
    const kind = /access denied|not approved|scope/i.test(msg) ? "scope" : "graphql";
    throw new AdminError(msg, kind);
  }
  if (!json.data) throw new AdminError("Admin API gaf geen data terug");

  return json.data;
}
