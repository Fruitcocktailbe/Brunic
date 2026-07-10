import { cookies } from "next/headers";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_REMOVE,
  CART_LINES_UPDATE,
  CART_QUERY,
  VARIANT_GUARD_QUERY,
} from "@/lib/shopify/cart-queries";
import { storefront } from "@/lib/shopify/client";
import type { Cart, GuardVariant } from "@/lib/shopify/types";

const COOKIE = "brunic_cart";
const DERTIG_DAGEN = 60 * 60 * 24 * 30;

/** Winkelmand-calls mogen NOOIT gecached worden. */
const GEEN_CACHE = false as const;

type MutationResult = { cart: Cart | null; userErrors: { message: string }[] };

export async function leesCartId(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE)?.value;
}

async function schrijfCartId(id: string): Promise<void> {
  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DERTIG_DAGEN,
  });
}

export async function getCart(): Promise<Cart | null> {
  const id = await leesCartId();
  if (!id) return null;

  const data = await storefront<{ cart: Cart | null }>(CART_QUERY, { id }, GEEN_CACHE);
  return data.cart; // null = verlopen of opgeruimd door Shopify
}

export type GuardFout = { ok: false; message: string };

/**
 * DE poortgatwachter. Shopify laat een etalage-variant (prijs 0,00) gewoon toe in een
 * cart mét geldige checkoutUrl — empirisch geverifieerd 10/07. Er is dus geen enkele
 * bescherming aan Shopify-zijde: zonder deze check verkoopt de winkel een tapijt van
 * €539 voor €0. De knop verbergen volstaat niet; een client kan elk variant-ID posten.
 *
 * Twee onafhankelijke checks (defense in depth): de etalage-vlag én de prijs. Als het
 * metafield ooit ontbreekt bij een productSet-import, blokkeert de prijs-check alsnog.
 */
export async function bewaakVariant(variantId: string): Promise<GuardVariant | GuardFout> {
  const data = await storefront<{ node: GuardVariant | null }>(
    VARIANT_GUARD_QUERY,
    { id: variantId },
    GEEN_CACHE,
  );

  const variant = data.node;
  if (!variant) return { ok: false, message: "Dit product bestaat niet meer." };

  if (variant.product.etalage?.value === "true") {
    return {
      ok: false,
      message:
        "Dit stuk verkopen we enkel in de winkel, met advies. Bewaar het als favoriet of vraag een gratis opmeting.",
    };
  }

  if (!(Number(variant.price.amount) > 0)) {
    return { ok: false, message: "Voor dit product is nog geen prijs bekend." };
  }

  if (!variant.availableForSale) {
    return { ok: false, message: "Dit product is momenteel niet beschikbaar." };
  }

  return variant;
}

export function isGuardFout(x: GuardVariant | GuardFout): x is GuardFout {
  return "ok" in x && x.ok === false;
}

async function nieuweCart(variantId: string, quantity: number): Promise<Cart> {
  const data = await storefront<{ cartCreate: MutationResult }>(
    CART_CREATE,
    { lines: [{ merchandiseId: variantId, quantity }] },
    GEEN_CACHE,
  );
  const { cart, userErrors } = data.cartCreate;
  if (!cart) throw new Error(userErrors[0]?.message ?? "Winkelmand aanmaken mislukt.");

  await schrijfCartId(cart.id);
  return cart;
}

export async function voegToe(variantId: string, quantity: number): Promise<Cart> {
  const id = await leesCartId();
  if (!id) return nieuweCart(variantId, quantity);

  const data = await storefront<{ cartLinesAdd: MutationResult }>(
    CART_LINES_ADD,
    { cartId: id, lines: [{ merchandiseId: variantId, quantity }] },
    GEEN_CACHE,
  );

  // Cookie wees naar een verlopen cart → stilzwijgend een nieuwe beginnen.
  if (!data.cartLinesAdd.cart) return nieuweCart(variantId, quantity);
  return data.cartLinesAdd.cart;
}

export async function wijzigAantal(lineId: string, quantity: number): Promise<Cart | null> {
  const id = await leesCartId();
  if (!id) return null;

  if (quantity <= 0) return verwijderRegel(lineId);

  const data = await storefront<{ cartLinesUpdate: MutationResult }>(
    CART_LINES_UPDATE,
    { cartId: id, lines: [{ id: lineId, quantity }] },
    GEEN_CACHE,
  );
  return data.cartLinesUpdate.cart;
}

export async function verwijderRegel(lineId: string): Promise<Cart | null> {
  const id = await leesCartId();
  if (!id) return null;

  const data = await storefront<{ cartLinesRemove: MutationResult }>(
    CART_LINES_REMOVE,
    { cartId: id, lineIds: [lineId] },
    GEEN_CACHE,
  );
  return data.cartLinesRemove.cart;
}
