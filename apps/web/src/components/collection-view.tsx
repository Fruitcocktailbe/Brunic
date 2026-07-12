import Link from "next/link";
import { FacetFilters } from "@/components/facet-filters";
import { MaatFilter } from "@/components/maat-filter";
import { ProductCard } from "@/components/product-card";
import type { Bucket } from "@/lib/shopify/buckets";
import { facetQueryString } from "@/lib/shopify/facets";
import type { Collection, ProductCard as ProductCardData } from "@/lib/shopify/types";

/**
 * Gedeelde PLP-weergave voor /[collection] en /[collection]/maat/[bucket].
 * Maat = eigen route (statisch, indexeerbaar); de generieke facets (kleur…) leven in de
 * query-string bovenop dat pad.
 */
export function CollectionView({
  collection,
  producten,
  bucket,
  selected = {},
}: {
  collection: Collection;
  producten: ProductCardData[];
  bucket?: Bucket;
  /** gekozen facet-waarden per param (kleur, materiaal…) */
  selected?: Record<string, string[]>;
}) {
  const basePath = `/${collection.handle}`;
  // De facets leven op het huidige pad (incl. een eventuele maat-bucket).
  const facetBase = bucket ? `${basePath}/maat/${bucket.id}` : basePath;
  const facetQuery = facetQueryString(selected);

  return (
    <div className="mx-auto max-w-(--container-brunic) px-6 py-10">
      <nav aria-label="Kruimelpad" className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-text">
          Home
        </Link>
        <span className="mx-2">/</span>
        {bucket ? (
          <>
            <Link href={basePath} className="hover:text-brand-text">
              {collection.title}
            </Link>
            <span className="mx-2">/</span>
            <span aria-current="page">{bucket.label}</span>
          </>
        ) : (
          <span aria-current="page">{collection.title}</span>
        )}
      </nav>

      <header className="mb-8 border-b border-line pb-6">
        <h1 className="text-4xl">
          {collection.title}
          {bucket ? <span className="text-ink-soft"> — {bucket.label}</span> : null}
        </h1>
        {collection.description ? (
          <p className="mt-3 max-w-[62ch] text-ink-soft">{collection.description}</p>
        ) : null}
      </header>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start lg:space-y-8">
          <MaatFilter
            filters={collection.products.filters}
            basePath={basePath}
            actief={bucket?.id}
            query={facetQuery}
          />
          <FacetFilters filters={collection.products.filters} selected={selected} basePath={facetBase} />
        </aside>

        <div>
          <p className="mb-4 text-sm text-ink-soft">
            {producten.length} {producten.length === 1 ? "product" : "producten"}
            {bucket ? ` in ${bucket.label}` : ""}
          </p>

          {producten.length === 0 ? (
            <p className="rounded-m border border-dashed border-line bg-white p-10 text-center text-ink-soft">
              Geen producten in deze maat. Wij maken ook op maat —{" "}
              <Link href="/opmeting" className="font-bold text-brand-text hover:underline">
                vraag een gratis opmeting
              </Link>
              .
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {producten.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
