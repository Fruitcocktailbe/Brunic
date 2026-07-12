import Link from "next/link";
import { bucketsWithAvailability } from "@/lib/shopify/buckets";
import type { StorefrontFilter } from "@/lib/shopify/types";

/**
 * Maat = hét zoekcriterium bij tapijten (design-brief §5.2). Puur links, geen client-JS:
 * elke bucket is een eigen pad (/tapijten-karpetten/maat/120-170), dus statisch te
 * genereren, deelbaar, indexeerbaar en werkend zonder JavaScript.
 *
 * NB: "maat" is daarmee een gereserveerde subcategorie-slug onder /[collection]/.
 */
export function MaatFilter({
  filters,
  basePath,
  actief,
  query = "",
}: {
  filters: StorefrontFilter[];
  basePath: string;
  actief?: string;
  /** actieve facet-querystring (zonder ?) — meegevoerd zodat maat + kleur samen blijven */
  query?: string;
}) {
  const buckets = bucketsWithAvailability(filters);
  if (!buckets.some((b) => b.hasValues)) return null;
  const qs = query ? `?${query}` : "";

  return (
    <section aria-labelledby="maat-filter-titel">
      <h2 id="maat-filter-titel" className="font-display text-lg">
        Maat
      </h2>
      <p className="mb-3 text-sm text-ink-soft">Op breedte — de maat van uw ruimte.</p>

      <ul className="flex flex-wrap gap-2 lg:flex-col">
        <li>
          <Link
            href={`${basePath}${qs}`}
            aria-current={!actief ? "true" : undefined}
            className={`inline-block rounded-s border px-3 py-2 text-sm transition ${
              !actief
                ? "border-brand bg-brand font-bold text-white"
                : "border-line-strong hover:border-brand hover:text-brand-text"
            }`}
          >
            Alle maten
          </Link>
        </li>

        {buckets.map(({ bucket, hasValues }) => {
          const isActief = actief === bucket.id;

          if (!hasValues) {
            return (
              <li key={bucket.id}>
                <span
                  aria-disabled="true"
                  title="Geen tapijten in deze maat"
                  className="inline-block cursor-not-allowed rounded-s border border-line px-3 py-2 text-sm text-ink-soft/50"
                >
                  {bucket.label}
                </span>
              </li>
            );
          }

          return (
            <li key={bucket.id}>
              <Link
                href={isActief ? `${basePath}${qs}` : `${basePath}/maat/${bucket.id}${qs}`}
                aria-current={isActief ? "true" : undefined}
                className={`inline-block rounded-s border px-3 py-2 text-sm transition ${
                  isActief
                    ? "border-brand bg-brand font-bold text-white"
                    : "border-line-strong hover:border-brand hover:text-brand-text"
                }`}
              >
                {bucket.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
