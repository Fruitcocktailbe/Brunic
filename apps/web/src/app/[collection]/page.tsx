import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { getCollection, isSysteemCollectie } from "@/lib/shopify/collection";
import { storefront } from "@/lib/shopify/client";
import { facetProductFilters, heeftFacets, type SearchParams, selectedFacets } from "@/lib/shopify/facets";
import { COLLECTION_HANDLES_QUERY } from "@/lib/shopify/queries";
import { isSubcollectie } from "@/lib/shopify/taxonomie";

// De basispagina is statisch + ISR. De maat-filter leeft in /[collection]/maat/[bucket].
// De generieke facets (kleur…) leven in de query-string en maken die render dynamisch —
// gefilterde combinaties zijn noindex (canonical → basispad). Zie decisions/log.md.
export const revalidate = 3600;
export const dynamicParams = true;

type Params = { collection: string };

export async function generateStaticParams(): Promise<Params[]> {
  const data = await storefront<{ collections: { nodes: { handle: string }[] } }>(
    COLLECTION_HANDLES_QUERY,
    { first: 100 },
  );
  return data.collections.nodes
    .filter((c) => !isSysteemCollectie(c.handle) && !isSubcollectie(c.handle))
    .map((c) => ({ collection: c.handle }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { collection: handle } = await params;
  if (isSubcollectie(handle)) return {};

  const collection = await getCollection(handle);
  if (!collection) return {};

  const gefilterd = heeftFacets(selectedFacets(await searchParams));
  return {
    title: collection.title,
    description: collection.description || undefined,
    // Gefilterde facet-combinaties canonicaliseren naar het basispad en gaan niet in de index.
    alternates: { canonical: `/${handle}` },
    robots: gefilterd ? { index: false, follow: true } : undefined,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { collection: handle } = await params;
  // Een subcollectie leeft op /[collection]/[subcollection]; haar kale handle mag géén
  // tweede URL voor dezelfde producten worden (duplicate content).
  if (isSysteemCollectie(handle) || isSubcollectie(handle)) notFound();

  const collection = await getCollection(handle);
  if (!collection) notFound();

  // De facetlijst voor de zijbalk komt uit de ONgefilterde fetch (opties verdwijnen niet);
  // de producten uit een tweede, gefilterde fetch.
  const selected = selectedFacets(await searchParams);
  const filters = facetProductFilters(selected);
  const gefilterd = filters.length > 0 ? await getCollection(handle, filters) : null;
  const producten = gefilterd?.products.nodes ?? collection.products.nodes;

  return <CollectionView collection={collection} producten={producten} selected={selected} />;
}
