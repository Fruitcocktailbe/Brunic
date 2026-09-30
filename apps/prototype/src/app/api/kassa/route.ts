import { NextResponse } from "next/server";
import { storefront } from "@/lib/shopify/storefront";

/**
 * Winkelmand → Shopify-kassa. De winkelmand leeft lokaal in de browser; bij "Afrekenen"
 * maken we hier een Shopify-cart aan en sturen we de klant naar de beveiligde, door
 * Shopify gehoste kassa (levering/afhalen, betaling, bevestiging).
 *
 * Bewaking (zelfde regels als apps/web → bewaakVariant): Shopify zelf beschermt niet tegen
 * een etalageproduct met prijs € 0. Daarom controleren we LIVE per variant: niet
 * `brunic.etalage = true`, prijs > 0 en `availableForSale`. Faalt één regel, dan geen kassa.
 */

type Regel = { variantId: string; quantity: number };

const CONTROLE = /* GraphQL */ `
  query Controle($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        price { amount }
        product { title etalage: metafield(namespace: "brunic", key: "etalage") { value } }
      }
    }
  }
`;

const MAAK_CART = /* GraphQL */ `
  mutation MaakCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`;

type Node = { id: string; availableForSale: boolean; price: { amount: string }; product: { title: string; etalage: { value: string } | null } } | null;

const gid = (id: string) => (id.startsWith("gid://") ? id : `gid://shopify/ProductVariant/${id}`);

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { lines?: Regel[] } | null;
  const lines = (body?.lines ?? [])
    .filter((l) => typeof l?.variantId === "string" && Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 500)
    .slice(0, 100);
  if (lines.length === 0) return NextResponse.json({ error: "Uw winkelmand is leeg." }, { status: 400 });

  try {
    const { nodes } = await storefront<{ nodes: Node[] }>(CONTROLE, { ids: lines.map((l) => gid(l.variantId)) });
    const geweigerd = nodes
      .map((n, i) => ({ n, regel: lines[i] }))
      .filter(({ n }) => !n || !n.availableForSale || !(Number(n.price.amount) > 0) || n.product.etalage?.value === "true");
    if (geweigerd.length > 0) {
      const namen = geweigerd.map(({ n }) => n?.product.title ?? "een product").join(", ");
      return NextResponse.json(
        { error: `Niet online te koop of intussen niet meer beschikbaar: ${namen}. Verwijder het uit uw winkelmand of vraag er een offerte voor aan.` },
        { status: 409 },
      );
    }

    const data = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(MAAK_CART, {
      input: {
        lines: lines.map((l) => ({ merchandiseId: gid(l.variantId), quantity: l.quantity })),
        buyerIdentity: { countryCode: "BE" },
      },
    });
    const url = data.cartCreate.cart?.checkoutUrl;
    if (!url) throw new Error(data.cartCreate.userErrors.map((e) => e.message).join("; ") || "Geen kassa-URL");
    return NextResponse.json({ checkoutUrl: url });
  } catch (e) {
    console.error("[kassa] cart aanmaken mislukt:", e);
    return NextResponse.json({ error: "De kassa is even niet bereikbaar. Probeer het zo meteen opnieuw of bel ons." }, { status: 502 });
  }
}
