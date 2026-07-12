import type { StorefrontFilter } from "./types";

/**
 * Generieke facet-filters (kleur, materiaal, poolklasse…) — in tegenstelling tot de
 * maat-bucketfilter (eigen route /[collection]/maat/[bucket]) leven deze in de query-string
 * (?kleur=Beige&materiaal=Wol). Meerdere waarden binnen één facet = OR; verschillende
 * facets = AND (native Search & Discovery-gedrag). Waarden zijn exact-match: Storefront
 * ondersteunt géén ranges op metafields (zie docs/architectuur.md §Datamodel).
 *
 * Nieuwe filters toevoegen = één regel hier + het filter in de Search & Discovery-app.
 */
export type FacetDef = {
  /** query-param in de URL */ param: string;
  /** Shopify-filter-id uit de Storefront `filters` */ filterId: string;
  namespace: string;
  key: string;
  level: "product" | "variant";
  label: string;
};

export const FACET_DEFS: FacetDef[] = [
  { param: "kleur", filterId: "filter.p.m.brunic.kleurfamilie", namespace: "brunic", key: "kleurfamilie", level: "product", label: "Kleur" },
  { param: "materiaal", filterId: "filter.p.m.brunic.materiaal", namespace: "brunic", key: "materiaal", level: "product", label: "Materiaal" },
  { param: "poolklasse", filterId: "filter.p.m.brunic.poolklasse", namespace: "brunic", key: "poolklasse", level: "product", label: "Poolklasse" },
];

export type SearchParams = Record<string, string | string[] | undefined>;

/** searchParams -> { param: [waarden] }, enkel de gekende facets. */
export function selectedFacets(sp: SearchParams): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const def of FACET_DEFS) {
    const v = sp[def.param];
    if (v == null) continue;
    out[def.param] = Array.isArray(v) ? v : [v];
  }
  return out;
}

/** Gekozen facets -> Storefront ProductFilter[] (metafield exact-match). */
export function facetProductFilters(selected: Record<string, string[]>): unknown[] {
  const filters: unknown[] = [];
  for (const def of FACET_DEFS) {
    for (const value of selected[def.param] ?? []) {
      const mf = { namespace: def.namespace, key: def.key, value };
      filters.push(def.level === "product" ? { productMetafield: mf } : { variantMetafield: mf });
    }
  }
  return filters;
}

export function heeftFacets(selected: Record<string, string[]>): boolean {
  return Object.values(selected).some((v) => v.length > 0);
}

/** Bouwt de href die één facetwaarde aan/uit zet, met behoud van de andere facets. */
export function toggleFacetHref(
  basePath: string,
  selected: Record<string, string[]>,
  param: string,
  value: string,
): string {
  const next: Record<string, string[]> = {};
  for (const [p, vals] of Object.entries(selected)) next[p] = [...vals];

  const huidig = new Set(next[param] ?? []);
  if (huidig.has(value)) huidig.delete(value);
  else huidig.add(value);
  if (huidig.size) next[param] = [...huidig];
  else delete next[param];

  const usp = new URLSearchParams();
  for (const [p, vals] of Object.entries(next)) for (const v of vals) usp.append(p, v);
  const qs = usp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** De facet-querystring (zonder ?) — om aan de maat-bucketlinks te plakken. */
export function facetQueryString(selected: Record<string, string[]>): string {
  const usp = new URLSearchParams();
  for (const [p, vals] of Object.entries(selected)) for (const v of vals) usp.append(p, v);
  return usp.toString();
}

/** Welke facet-groepen tonen we? Enkel die met waarden in deze collectie. */
export function beschikbareFacets(filters: StorefrontFilter[]) {
  return FACET_DEFS.map((def) => ({ def, filter: filters.find((f) => f.id === def.filterId) })).filter(
    (g): g is { def: FacetDef; filter: StorefrontFilter } => !!g.filter && g.filter.values.length > 0,
  );
}
