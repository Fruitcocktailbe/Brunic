import { BREEDTE_FILTER_ID } from "./buckets";
import { storefront } from "./client";
import { COLLECTION_QUERY } from "./queries";
import type { Collection } from "./types";

export const PAGE_SIZE = 24;

/** Handle van de door Brunic gecureerde homepage-selectie (sortOrder MANUAL in de admin). */
export const IN_DE_KIJKER = "in-de-kijker";

/**
 * Collecties die géén categoriepagina zijn. Zonder deze uitsluiting zou /[collection]
 * ook /in-de-kijker en /frontpage genereren: indexeerbare kopieën van de Tapijten-PLP
 * (duplicate content — precies wat architectuur.md §Migratie wil vermijden).
 */
const SYSTEEM_COLLECTIES = new Set([IN_DE_KIJKER, "frontpage"]);

export function isSysteemCollectie(handle: string): boolean {
  return SYSTEEM_COLLECTIES.has(handle);
}

/**
 * Eén plek voor de collectie-fetch. Next dedupliceert identieke fetches binnen dezelfde
 * render, dus generateMetadata en de page delen dit resultaat zonder extra API-call.
 *
 * `filters` mag NOOIT een lege array zijn: Shopify negeert die en geeft dan álle
 * producten terug i.p.v. geen enkel. Vandaar `undefined` bij lengte 0.
 */
export async function getCollection(handle: string, filters?: unknown[]) {
  const data = await storefront<{ collection: Collection | null }>(COLLECTION_QUERY, {
    handle,
    first: PAGE_SIZE,
    filters: filters && filters.length > 0 ? filters : undefined,
  });
  return data.collection;
}

/** Heeft deze collectie überhaupt een maat-dimensie? (Behang/verf: nee.) */
export function heeftMaatFilter(collection: Collection): boolean {
  return collection.products.filters.some((f) => f.id === BREEDTE_FILTER_ID);
}
