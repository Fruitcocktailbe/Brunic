import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { getCollection, isSysteemCollectie } from "@/lib/shopify/collection";
import { storefront } from "@/lib/shopify/client";
import { COLLECTION_HANDLES_QUERY } from "@/lib/shopify/queries";

// Statisch + ISR. Bewust GEEN searchParams hier: dat zou de route dynamisch maken.
// De maat-filter leeft in /[collection]/maat/[bucket]. Zie decisions/log.md 2026-07-10.
export const revalidate = 3600;
export const dynamicParams = true;

type Params = { collection: string };

export async function generateStaticParams(): Promise<Params[]> {
  const data = await storefront<{ collections: { nodes: { handle: string }[] } }>(
    COLLECTION_HANDLES_QUERY,
    { first: 20 },
  );
  return data.collections.nodes
    .filter((c) => !isSysteemCollectie(c.handle))
    .map((c) => ({ collection: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { collection: handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return {};

  return {
    title: collection.title,
    description: collection.description || undefined,
    // Vangt eventuele ?maat=-links op: die tonen dezelfde HTML, dus één canonical.
    alternates: { canonical: `/${handle}` },
  };
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { collection: handle } = await params;
  if (isSysteemCollectie(handle)) notFound();

  const collection = await getCollection(handle);
  if (!collection) notFound();

  return <CollectionView collection={collection} producten={collection.products.nodes} />;
}
