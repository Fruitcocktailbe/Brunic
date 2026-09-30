/**
 * Shopify Storefront API — serverzijdig (kassa-overdracht). Een privé-token (shpat_…)
 * gaat mee als Shopify-Storefront-Private-Token, een publieke als X-Shopify-Storefront-Access-Token.
 */
const VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;
  if (!domain || !token) throw new Error("SHOPIFY_STORE_DOMAIN of SHOPIFY_STOREFRONT_API_TOKEN ontbreekt.");
  const header = token.startsWith("shpat_") ? "Shopify-Storefront-Private-Token" : "X-Shopify-Storefront-Access-Token";
  const res = await fetch(`https://${domain}/api/${VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", [header]: token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { data?: T; errors?: { message: string }[] };
  if (!res.ok || json.errors?.length || !json.data) {
    throw new Error(`Storefront API: HTTP ${res.status} ${json.errors?.map((e) => e.message).join("; ") ?? ""}`);
  }
  return json.data;
}
