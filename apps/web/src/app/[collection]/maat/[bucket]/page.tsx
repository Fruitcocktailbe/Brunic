import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { bucketById, bucketsWithAvailability, filtersForBucket } from "@/lib/shopify/buckets";
import { getCollection, heeftMaatFilter, isSysteemCollectie } from "@/lib/shopify/collection";
import { storefront } from "@/lib/shopify/client";
import { facetProductFilters, heeftFacets, type SearchParams, selectedFacets } from "@/lib/shopify/facets";
import { COLLECTION_HANDLES_QUERY } from "@/lib/shopify/queries";
import { isSubcollectie } from "@/lib/shopify/taxonomie";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { collection: string; bucket: string };

/**
 * Alleen collecties mét een maat-dimensie krijgen bucket-pagina's, en alleen buckets
 * die vandaag maten bevatten worden geprerenderd. Nieuwe buckets (bv. 240+ zodra de
 * echte catalogus binnen is) renderen on-demand dankzij dynamicParams.
 */
export async function generateStaticParams(): Promise<Params[]> {
  const data = await storefront<{ collections: { nodes: { handle: string }[] } }>(
    COLLECTION_HANDLES_QUERY,
    { first: 100 },
  );

  const params: Params[] = [];
  for (const { handle } of data.collections.nodes) {
    if (isSysteemCollectie(handle) || isSubcollectie(handle)) continue;

    const collection = await getCollection(handle);
    if (!collection || !heeftMaatFilter(collection)) continue;

    for (const { bucket, hasValues } of bucketsWithAvailability(collection.products.filters)) {
      if (hasValues) params.push({ collection: handle, bucket: bucket.id });
    }
  }
  return params;
}

/** Haalt collectie + gefilterde producten op. Gedeeld door generateMetadata en de page. */
async function laad(handle: string, bucketId: string, selected: Record<string, string[]> = {}) {
  // Bucketpagina's hangen onder de categorie, niet onder een subcategorie: /behang-effen/maat/…
  // bestaat niet (de sub-URL is /behang/effen).
  if (isSysteemCollectie(handle) || isSubcollectie(handle)) return null;

  const bucket = bucketById(bucketId);
  if (!bucket) return null;

  const collection = await getCollection(handle);
  // Maat is betekenisloos voor behang/verf: die krijgen géén (dunne, indexeerbare) bucketpagina.
  if (!collection || !heeftMaatFilter(collection)) return null;

  // Maat-bucket (breedte-OR-lijst) + de gekozen generieke facets samen toepassen.
  const filters = [...filtersForBucket(collection.products.filters, bucket), ...facetProductFilters(selected)];
  const gefilterd = filters.length > 0 ? await getCollection(handle, filters) : null;

  return { bucket, collection, producten: gefilterd?.products.nodes ?? [] };
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { collection: handle, bucket: bucketId } = await params;
  const gefilterd = heeftFacets(selectedFacets(await searchParams));
  const data = await laad(handle, bucketId);
  if (!data) return {};

  const { bucket, collection, producten } = data;

  return {
    title: `${collection.title} — ${bucket.label}`,
    description: `${collection.title} met een breedte van ${bucket.label.toLowerCase()}. Vaste handelsmaten, advies en gratis opmeting aan huis.`,
    alternates: { canonical: `/${handle}/maat/${bucket.id}` },
    // Lege bucket óf actieve facet-combinatie: niet indexeren (canonical → de kale bucket).
    robots: producten.length === 0 || gefilterd ? { index: false, follow: true } : undefined,
  };
}

export default async function MaatBucketPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { collection: handle, bucket: bucketId } = await params;

  const selected = selectedFacets(await searchParams);
  const data = await laad(handle, bucketId, selected);
  if (!data) notFound();

  return (
    <CollectionView
      collection={data.collection}
      producten={data.producten}
      bucket={data.bucket}
      selected={selected}
    />
  );
}
