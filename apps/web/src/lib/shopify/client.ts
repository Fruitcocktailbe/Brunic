const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

export class ShopifyError extends Error {
  constructor(message: string, readonly detail?: unknown) {
    super(message);
    this.name = "ShopifyError";
  }
}

function endpoint(): { url: string; token: string } {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;

  if (!domain || !token) {
    throw new ShopifyError(
      "SHOPIFY_STORE_DOMAIN of SHOPIFY_STOREFRONT_API_TOKEN ontbreekt. " +
        "Vul de repo-root .env in (zie .env.example).",
    );
  }
  return { url: `https://${domain}/api/${API_VERSION}/graphql.json`, token };
}

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

/**
 * Server-side Storefront-call. De token is een public access token, maar blijft
 * bewust server-side: geen NEXT_PUBLIC_-prefix, dus nooit in de browserbundel.
 *
 * `revalidate` stuurt de Next Data Cache — de ISR-strategie uit decisions/log.md.
 * `revalidate: false` schakelt de cache volledig uit; verplicht voor alles rond de
 * winkelmand (een gecachete cart zou je andermans mandje tonen).
 */
export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate: number | false = 3600,
): Promise<T> {
  const { url, token } = endpoint();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    // On-demand revalidatie gebeurt via revalidatePath in /api/webhooks/shopify.
    ...(revalidate === false ? { cache: "no-store" as const } : { next: { revalidate } }),
  });

  if (!res.ok) {
    throw new ShopifyError(`Storefront API gaf HTTP ${res.status}`, await res.text());
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "), json.errors);
  }
  if (!json.data) throw new ShopifyError("Storefront API gaf geen data terug");

  return json.data;
}
