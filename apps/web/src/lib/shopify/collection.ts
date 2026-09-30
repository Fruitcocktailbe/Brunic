import { BREEDTE_FILTER_ID } from "./buckets";
import { storefront } from "./client";
import {
  facetProductFilters,
  heeftPagina,
  type Pagina,
  paginaUit,
  type SearchParams,
  selectedFacets,
} from "./facets";
import { COLLECTION_QUERY } from "./queries";
import type { Collection, PageInfo, StorefrontFilter } from "./types";

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
export async function getCollection(handle: string, filters?: unknown[], pagina: Pagina = {}) {
  const data = await storefront<{ collection: Collection | null }>(COLLECTION_QUERY, {
    handle,
    ...(pagina.before ? { last: PAGE_SIZE, before: pagina.before } : { first: PAGE_SIZE, after: pagina.after }),
    filters: filters && filters.length > 0 ? filters : undefined,
  });
  return data.collection;
}

/** Heeft deze collectie überhaupt een maat-dimensie? (Behang/verf: nee.) */
export function heeftMaatFilter(collection: Collection): boolean {
  return collection.products.filters.some((f) => f.id === BREEDTE_FILTER_ID);
}

export type Plp = {
  /** ongefilterde eerste pagina: titel, beschrijving en de volledige facetlijst */
  collection: Collection;
  selected: Record<string, string[]>;
  pagina: Pagina;
  producten: Collection["products"]["nodes"];
  pageInfo: PageInfo;
};

/**
 * Gedeelde loader voor /[collection], /[collection]/[subcollection] en de maat-buckets.
 * De facetlijst komt uit de ONgefilterde fetch (opties verdwijnen niet bij het klikken);
 * de producten uit een tweede fetch mét filters en de pagina-cursor. Filteren gebeurt dus
 * door Shopify over de hele collectie, niet over de 24 producten die toevallig geladen zijn.
 *
 * `extra` levert bijkomende filters (de maat-bucket); `vereistExtra` = zonder die filters
 * is het resultaat leeg (een bucket zonder maten toont niet de hele collectie).
 */
export async function laadPlp(
  handle: string,
  sp: SearchParams,
  opties: { extra?: (filters: StorefrontFilter[]) => unknown[]; vereistExtra?: boolean } = {},
): Promise<Plp | null> {
  const collection = await getCollection(handle);
  if (!collection) return null;

  const selected = selectedFacets(sp);
  const pagina = paginaUit(sp);
  const extra = opties.extra ? opties.extra(collection.products.filters) : [];
  const leeg = { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null };
  if (opties.vereistExtra && extra.length === 0) return { collection, selected, pagina, producten: [], pageInfo: leeg };

  const filters = [...extra, ...facetProductFilters(selected, collection.products.filters)];
  const res = filters.length > 0 || heeftPagina(pagina) ? await getCollection(handle, filters, pagina) : collection;
  return {
    collection,
    selected,
    pagina,
    producten: res?.products.nodes ?? [],
    pageInfo: res?.products.pageInfo ?? leeg,
  };
}
