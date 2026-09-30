import Link from "next/link";
import { FacetFilters } from "@/components/facet-filters";
import { MaatFilter } from "@/components/maat-filter";
import { ProductCard } from "@/components/product-card";
import { SubcategorieNav } from "@/components/subcategorie-nav";
import type { Bucket } from "@/lib/shopify/buckets";
import { facetQueryString, heeftFacets, heeftPagina, type Pagina, paginaHref } from "@/lib/shopify/facets";
import { hrefVoorSub, subsVoor, vindSub } from "@/lib/shopify/taxonomie";
import type { Collection, PageInfo, ProductCard as ProductCardData } from "@/lib/shopify/types";

/**
 * Gedeelde PLP-weergave voor /[collection], /[collection]/maat/[bucket] en
 * /[collection]/[subcollection]. Welke van de drie het is, leiden we af uit de collectie
 * zelf (de taxonomie weet of een handle een sub is), zodat de pagina's zelf dun blijven.
 *
 * Maat = eigen route (statisch, indexeerbaar); de generieke facets (kleur…) en de pagina
 * (?na=/?voor=, cursor van de Storefront API) leven in de query-string bovenop dat pad.
 * Een facet aan- of uitzetten begint altijd opnieuw op pagina 1.
 */
export function CollectionView({
  collection,
  producten,
  bucket,
  selected = {},
  pageInfo,
  pagina = {},
}: {
  collection: Collection;
  producten: ProductCardData[];
  bucket?: Bucket;
  /** gekozen facet-waarden per param (kleur, materiaal…) */
  selected?: Record<string, string[]>;
  pageInfo?: PageInfo;
  pagina?: Pagina;
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
  const gefilterd = heeftFacets(selected);

  // Maat-buckets zijn een route onder de categorie (/tapijten/maat/…) — onder een
  // subcategorie bestaat dat pad niet, dus daar filtert men op de facetten.
  const toonMaat = !gevonden;

  const vorige = pageInfo?.hasPreviousPage && pageInfo.startCursor ? paginaHref(facetBase, selected, "voor", pageInfo.startCursor) : null;
  const volgende = pageInfo?.hasNextPage && pageInfo.endCursor ? paginaHref(facetBase, selected, "na", pageInfo.endCursor) : null;

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
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 text-sm text-ink-soft">
            <p>
              {producten.length} {producten.length === 1 ? "product" : "producten"}
              {heeftPagina(pagina) || pageInfo?.hasNextPage ? " op deze pagina" : ""}
              {bucket ? ` in ${bucket.label}` : ""}
            </p>
            {gefilterd ? (
              <Link href={facetBase} className="font-bold text-brand-text hover:underline">
                Alle filters wissen
              </Link>
            ) : null}
          </div>

          {producten.length === 0 ? (
            <p className="rounded-m border border-dashed border-line bg-white p-10 text-center text-ink-soft">
              {gefilterd
                ? "Geen producten met deze combinatie van filters."
                : bucket
                  ? "Geen producten in deze maat."
                  : "Hier staat nog niets online."}{" "}
              Wij maken ook op maat —{" "}
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

          {vorige || volgende ? (
            <nav aria-label="Paginering" className="mt-10 flex items-center justify-between gap-4">
              {vorige ? (
                <Link href={vorige} className="rounded-s border border-line-strong px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand-text">
                  ← Vorige
                </Link>
              ) : (
                <span />
              )}
              {volgende ? (
                <Link href={volgende} className="rounded-s border border-line-strong px-4 py-2 text-sm font-bold hover:border-brand hover:text-brand-text">
                  Volgende →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}
