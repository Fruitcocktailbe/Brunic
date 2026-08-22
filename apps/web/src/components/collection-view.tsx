import Link from "next/link";
import { FacetFilters } from "@/components/facet-filters";
import { MaatFilter } from "@/components/maat-filter";
import { ProductCard } from "@/components/product-card";
import { SubcategorieNav } from "@/components/subcategorie-nav";
import type { Bucket } from "@/lib/shopify/buckets";
import { facetQueryString } from "@/lib/shopify/facets";
import { hrefVoorSub, subsVoor, vindSub } from "@/lib/shopify/taxonomie";
import type { Collection, ProductCard as ProductCardData } from "@/lib/shopify/types";

/**
 * Gedeelde PLP-weergave voor /[collection], /[collection]/maat/[bucket] en
 * /[collection]/[subcollection]. Welke van de drie het is, leiden we af uit de collectie
 * zelf (de taxonomie weet of een handle een sub is), zodat de pagina's zelf dun blijven.
 *
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
  // Subcategoriepagina of categoriepagina? Bepaalt pad, kruimelpad en welke chips actief staan.
  const gevonden = vindSub(collection.handle);
  const ouderHandle = gevonden?.hoofd.handle ?? collection.handle;
  const subs = gevonden ? gevonden.hoofd.subs : subsVoor(collection.handle);

  const basePath = gevonden
    ? hrefVoorSub(gevonden.hoofd.handle, gevonden.sub)
    : `/${collection.handle}`;
  // De facets leven op het huidige pad (incl. een eventuele maat-bucket).
  const facetBase = bucket ? `${basePath}/maat/${bucket.id}` : basePath;
  const facetQuery = facetQueryString(selected);

  // Maat-buckets zijn een route onder de categorie (/tapijten/maat/…) — onder een
  // subcategorie bestaat dat pad niet, dus daar filtert men op de facetten.
  const toonMaat = !gevonden;

  return (
    <div className="mx-auto max-w-(--container-brunic) px-6 py-10">
      <nav aria-label="Kruimelpad" className="mb-4 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-text">
          Home
        </Link>
        {gevonden ? (
          <>
            <span className="mx-2">/</span>
            <Link href={`/${gevonden.hoofd.handle}`} className="hover:text-brand-text">
              {gevonden.hoofd.label}
            </Link>
          </>
        ) : null}
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

      <SubcategorieNav
        ouderHandle={ouderHandle}
        subs={subs}
        actiefHandle={gevonden?.sub.handle}
      />

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start lg:space-y-8">
          {toonMaat ? (
            <MaatFilter
              filters={collection.products.filters}
              basePath={basePath}
              actief={bucket?.id}
              query={facetQuery}
            />
          ) : null}
          <FacetFilters filters={collection.products.filters} selected={selected} basePath={facetBase} />
        </aside>

        <div>
          <p className="mb-4 text-sm text-ink-soft">
            {producten.length} {producten.length === 1 ? "product" : "producten"}
            {bucket ? ` in ${bucket.label}` : ""}
          </p>

          {producten.length === 0 ? (
            <p className="rounded-m border border-dashed border-line bg-white p-10 text-center text-ink-soft">
              {bucket ? "Geen producten in deze maat." : "Hier staat nog niets online."} Wij maken
              ook op maat —{" "}
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
