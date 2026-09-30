import type { FilterValue, StorefrontFilter } from "./types";

/**
 * Generieke facet-filters (merk, kleur, materiaal…) — in tegenstelling tot de
 * maat-bucketfilter (eigen route /[collection]/maat/[bucket]) leven deze in de query-string
 * (?kleur=Beige&materiaal=Wol). Meerdere waarden binnen één facet = OR; verschillende
 * facets = AND (native Search & Discovery-gedrag). Waarden zijn exact-match: Storefront
 * ondersteunt géén ranges op metafields (zie docs/architectuur.md §Datamodel).
 *
 * Nieuwe filters toevoegen = één regel hier + het filter in de Search & Discovery-app.
 *
 * De ProductFilter-invoer bouwen we niet zelf na: Shopify geeft per filterwaarde de `input`
 * (JSON) terug die je letterlijk terugstuurt — dat werkt voor metafields (ook lijst- en
 * booleanvelden), merk en producttype, en blijft kloppen als Shopify de vorm wijzigt.
 * In de URL staat de canonieke waarde uit die input (bv. "ADO", "Black-out", "true").
 */
export type FacetDef = {
  /** query-param in de URL */ param: string;
  /**
   * Shopify-filter-id(s) uit de Storefront `filters`, in volgorde van voorkeur. Kleur staat
   * zowel op variantniveau (leveranciersimport: per kleur) als op productniveau (oudere
   * producten met één kleur); de eerste die in de collectie waarden heeft, wordt gebruikt.
   */
  filterIds: string[];
  label: string;
};

export const FACET_DEFS: FacetDef[] = [
  { param: "soort", filterIds: ["filter.p.product_type"], label: "Soort" },
  { param: "merk", filterIds: ["filter.p.vendor"], label: "Merk" },
  { param: "kleur", filterIds: ["filter.v.m.brunic.kleurfamilie", "filter.p.m.brunic.kleurfamilie"], label: "Kleur" },
  { param: "materiaal", filterIds: ["filter.p.m.brunic.materiaal"], label: "Materiaal" },
  { param: "type", filterIds: ["filter.p.m.brunic.type"], label: "Type" },
  { param: "transparantie", filterIds: ["filter.p.m.brunic.transparantie"], label: "Transparantie" },
  { param: "patroon", filterIds: ["filter.p.m.brunic.patroon"], label: "Patroon" },
  { param: "poolklasse", filterIds: ["filter.p.m.brunic.poolklasse"], label: "Poolklasse" },
  { param: "toepassing", filterIds: ["filter.p.m.brunic.toepassing"], label: "Toepassing" },
  { param: "gebruiksklasse", filterIds: ["filter.p.m.brunic.gebruiksklasse"], label: "Gebruiksklasse" },
  { param: "brandvertragend", filterIds: ["filter.p.m.brunic.brandvertragend"], label: "Brandvertragend" },
  { param: "wasbaar", filterIds: ["filter.p.m.brunic.wasbaar"], label: "Wasbaar" },
  { param: "vloerverwarming", filterIds: ["filter.p.m.brunic.vloerverwarming"], label: "Vloerverwarming" },
  { param: "collectie", filterIds: ["filter.p.m.brunic.collectie"], label: "Collectie" },
];

export type SearchParams = Record<string, string | string[] | undefined>;

/** Canonieke waarde van een filterwaarde, uit Shopify's eigen `input`-JSON. */
export function facetWaarde(v: FilterValue): string {
  try {
    const input = JSON.parse(v.input) as Record<string, unknown>;
    const mf = (input.productMetafield ?? input.variantMetafield) as { value?: unknown } | undefined;
    if (mf?.value !== undefined) return String(mf.value);
    if (typeof input.productVendor === "string") return input.productVendor;
    if (typeof input.productType === "string") return input.productType;
  } catch {
    /* onbekende vorm: label gebruiken */
  }
  return v.label;
}

/** Leesbaar label: booleans tonen als Ja/Nee in plaats van true/false. */
export function facetLabel(v: FilterValue): string {
  const w = facetWaarde(v);
  if (w === "true") return "Ja";
  if (w === "false") return "Nee";
  return v.label;
}

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

/** Het filter dat een facet in déze collectie gebruikt (eerste id met waarden). */
export function filterVoor(def: FacetDef, filters: StorefrontFilter[]): StorefrontFilter | undefined {
  for (const id of def.filterIds) {
    const f = filters.find((x) => x.id === id);
    if (f && f.values.length > 0) return f;
  }
  return undefined;
}

/**
 * Gekozen facets -> Storefront ProductFilter[]. `filters` = de ONgefilterde filterlijst van
 * de collectie; een waarde die daar niet (meer) bestaat, wordt genegeerd i.p.v. een lege
 * pagina te geven.
 */
export function facetProductFilters(selected: Record<string, string[]>, filters: StorefrontFilter[]): unknown[] {
  const out: unknown[] = [];
  for (const def of FACET_DEFS) {
    const gekozen = selected[def.param];
    if (!gekozen?.length) continue;
    const f = filterVoor(def, filters);
    if (!f) continue;
    for (const waarde of gekozen) {
      const v = f.values.find((x) => facetWaarde(x) === waarde);
      if (v) out.push(JSON.parse(v.input) as unknown);
    }
  }
  return out;
}

export function heeftFacets(selected: Record<string, string[]>): boolean {
  return Object.values(selected).some((v) => v.length > 0);
}

/** Bouwt de href die één facetwaarde aan/uit zet, met behoud van de andere facets. Wist de paginering. */
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

  const qs = facetQueryString(next);
  return qs ? `${basePath}?${qs}` : basePath;
}

/** De facet-querystring (zonder ?) — om aan de maat-bucket- en paginalinks te plakken. */
export function facetQueryString(selected: Record<string, string[]>): string {
  const usp = new URLSearchParams();
  for (const [p, vals] of Object.entries(selected)) for (const v of vals) usp.append(p, v);
  return usp.toString();
}

/** Welke facet-groepen tonen we? Enkel die met waarden in deze collectie. */
export function beschikbareFacets(filters: StorefrontFilter[]) {
  return FACET_DEFS.map((def) => ({ def, filter: filterVoor(def, filters) })).filter(
    (g): g is { def: FacetDef; filter: StorefrontFilter } => !!g.filter,
  );
}

/* ---------------- Paginering (cursor in de URL) ---------------- */

export type Pagina = { after?: string; before?: string };

/** ?na=<cursor> = volgende pagina, ?voor=<cursor> = vorige pagina. */
export function paginaUit(sp: SearchParams): Pagina {
  const een = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const after = een(sp.na);
  const before = een(sp.voor);
  if (after) return { after };
  if (before) return { before };
  return {};
}

export function heeftPagina(p: Pagina): boolean {
  return Boolean(p.after || p.before);
}

/** Link naar de vorige/volgende pagina, met behoud van de gekozen facets. */
export function paginaHref(
  basePath: string,
  selected: Record<string, string[]>,
  richting: "na" | "voor",
  cursor: string,
): string {
  const usp = new URLSearchParams(facetQueryString(selected));
  usp.set(richting, cursor);
  return `${basePath}?${usp.toString()}`;
}
