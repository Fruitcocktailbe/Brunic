import Link from "next/link";
import { beschikbareFacets, facetLabel, facetWaarde, toggleFacetHref } from "@/lib/shopify/facets";
import type { StorefrontFilter } from "@/lib/shopify/types";

/**
 * Generieke facet-filters (merk, kleur, materiaal…). Puur links op query-params, geen
 * client-JS — deelbaar en werkt zonder JavaScript, net als de maat-filter. Rendert enkel de
 * facets die in déze collectie waarden hebben (behang: kleur, type, patroon; stoffen:
 * transparantie, brandvertragend; tapijt: materiaal, poolklasse…). Nieuwe facets verschijnen
 * vanzelf zodra ze in Search & Discovery aanstaan en in FACET_DEFS staan.
 *
 * Aantallen komen van Shopify: bij variantfilters (kleur) tellen ze producten met minstens één
 * passende uitvoering.
 */
export function FacetFilters({
  filters,
  selected,
  basePath,
}: {
  filters: StorefrontFilter[];
  selected: Record<string, string[]>;
  /** pad waarop de facets leven — /[collection] óf /[collection]/maat/[bucket] */
  basePath: string;
}) {
  const groepen = beschikbareFacets(filters);
  if (groepen.length === 0) return null;

  return (
    <div className="space-y-6">
      {groepen.map(({ def, filter }) => {
        const gekozen = selected[def.param] ?? [];
        return (
          <section key={def.param} aria-labelledby={`facet-${def.param}`}>
            <h2 id={`facet-${def.param}`} className="font-display text-lg">
              {def.label}
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2 lg:flex-col">
              {filter.values.map((v) => {
                const waarde = facetWaarde(v);
                const actief = gekozen.includes(waarde);
                return (
                  <li key={v.id}>
                    <Link
                      href={toggleFacetHref(basePath, selected, def.param, waarde)}
                      aria-pressed={actief}
                      scroll={false}
                      className={`inline-flex items-center gap-2 rounded-s border px-3 py-2 text-sm transition ${
                        actief
                          ? "border-brand bg-brand font-bold text-white"
                          : "border-line-strong hover:border-brand hover:text-brand-text"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`grid h-4 w-4 place-items-center rounded-[3px] border ${
                          actief ? "border-white bg-white/20" : "border-line-strong"
                        }`}
                      >
                        {actief ? (
                          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : null}
                      </span>
                      {facetLabel(v)}
                      <span className={actief ? "text-white/80" : "text-ink-soft"}>({v.count})</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
