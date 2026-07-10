import type { StorefrontFilter } from "./types";

/** Het variant-metafield-filter dat Search & Discovery publiceert. */
export const BREEDTE_FILTER_ID = "filter.v.m.brunic.breedte_cm";

export type Bucket = {
  id: string;
  label: string;
  /** inclusief */ min: number;
  /** inclusief */ max: number;
};

/**
 * Maat-buckets op BREEDTE. Grenzen vastgelegd in J.A.R.V.I.S decisions/log.md (2026-07-09):
 * voetmatten/badmatten/lopers (breedte < 80) horen niet in deze categorie; op de echte
 * karpetten verdelen deze vier buckets ~19/44/30/7%.
 */
export const MAAT_BUCKETS: Bucket[] = [
  { id: "tot-120", label: "tot 120 cm", min: 0, max: 119 },
  { id: "120-170", label: "120 – 170 cm", min: 120, max: 169 },
  { id: "170-240", label: "170 – 240 cm", min: 170, max: 239 },
  { id: "240-plus", label: "240 cm en meer", min: 240, max: Number.POSITIVE_INFINITY },
];

export function bucketById(id: string | null | undefined): Bucket | undefined {
  if (!id) return undefined;
  return MAAT_BUCKETS.find((b) => b.id === id);
}

function breedteFilter(filters: StorefrontFilter[]): StorefrontFilter | undefined {
  return filters.find((f) => f.id === BREEDTE_FILTER_ID);
}

/**
 * De Storefront API ondersteunt géén numerieke ranges op metafields — alleen exacte
 * waarden (zie docs/architectuur.md §Datamodel). Een bucket wordt daarom een OR-lijst
 * van alle discrete breedtes die erin vallen.
 *
 * We hergebruiken de `input`-JSON die Shopify zélf per filterwaarde teruggeeft, i.p.v.
 * de ProductFilter-vorm met de hand na te bouwen. Dat blijft correct als Shopify de
 * filtervorm ooit wijzigt.
 */
export function filtersForBucket(filters: StorefrontFilter[], bucket: Bucket): unknown[] {
  const f = breedteFilter(filters);
  if (!f) return [];

  return f.values
    .filter((v) => {
      const cm = Number(v.label);
      return Number.isFinite(cm) && cm >= bucket.min && cm <= bucket.max;
    })
    .map((v) => JSON.parse(v.input) as unknown);
}

/**
 * Welke buckets bevatten überhaupt maten in deze collectie? Lege buckets tonen we
 * uitgeschakeld i.p.v. ze te verbergen — zo blijft de maatschaal leesbaar.
 *
 * Let op: we tellen bewust géén producten per bucket. Eén product heeft meerdere
 * varianten (CASA: 60/80/120/160/200), dus de counts van Shopify optellen zou
 * dubbeltellen. Een exacte telling vraagt een query per bucket; dat is v2.
 */
export function bucketsWithAvailability(
  filters: StorefrontFilter[],
): { bucket: Bucket; hasValues: boolean }[] {
  const f = breedteFilter(filters);
  const widths = (f?.values ?? []).map((v) => Number(v.label)).filter(Number.isFinite);

  return MAAT_BUCKETS.map((bucket) => ({
    bucket,
    hasValues: widths.some((cm) => cm >= bucket.min && cm <= bucket.max),
  }));
}
