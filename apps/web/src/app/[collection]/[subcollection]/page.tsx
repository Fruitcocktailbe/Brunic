import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { getCollection } from "@/lib/shopify/collection";
import { facetProductFilters, heeftFacets, type SearchParams, selectedFacets } from "@/lib/shopify/facets";
import { subBySlug, TAXONOMIE } from "@/lib/shopify/taxonomie";

// Subcategorieën zijn een collectie-niveau, geen productniveau: het product blijft op het
// platte /product/<slug> (docs/architectuur.md §URL-structuur). Anders dan producten heeft
// een subcategorie precies één ouder, dus dit pad mág genest zijn.
export const revalidate = 3600;
export const dynamicParams = false;

type Params = { collection: string; subcollection: string };

/**
 * De volledige boom is bekend (geen Shopify-call nodig). Een gedeelde subcategorie
 * (Logotapijt) krijgt alleen onder zijn canonieke ouder een pagina — de andere ouder
 * linkt ernaartoe. Met dynamicParams=false is elk ander pad meteen een 404 i.p.v. een
 * on-demand render van een niet-bestaande subcategorie.
 */
export function generateStaticParams(): Params[] {
  return TAXONOMIE.flatMap((hoofd) =>
    hoofd.subs
      .filter((sub) => (sub.canoniekeOuder ?? hoofd.handle) === hoofd.handle)
      .map((sub) => ({ collection: hoofd.handle, subcollection: sub.slug })),
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { collection: ouder, subcollection: slug } = await params;
  const sub = subBySlug(ouder, slug);
  if (!sub) return {};

  const collection = await getCollection(sub.handle);
  if (!collection) return {};

  const gefilterd = heeftFacets(selectedFacets(await searchParams));
  const leeg = collection.products.nodes.length === 0;

  return {
    title: collection.title,
    description: collection.description || undefined,
    alternates: { canonical: `/${ouder}/${sub.slug}` },
    // Nog lege subcategorie of een actieve facet-combinatie: niet indexeren. Anders vult
    // de sitemap zich met dunne pagina's (docs/architectuur.md §Migratie).
    robots: leeg || gefilterd ? { index: false, follow: true } : undefined,
  };
}

export default async function SubcollectionPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { collection: ouder, subcollection: slug } = await params;
  const sub = subBySlug(ouder, slug);
  if (!sub) notFound();

  const collection = await getCollection(sub.handle);
  if (!collection) notFound();

  // Facetlijst uit de ONgefilterde fetch (opties verdwijnen niet), producten uit de gefilterde.
  const selected = selectedFacets(await searchParams);
  const filters = facetProductFilters(selected);
  const gefilterd = filters.length > 0 ? await getCollection(sub.handle, filters) : null;
  const producten = gefilterd?.products.nodes ?? collection.products.nodes;

  return <CollectionView collection={collection} producten={producten} selected={selected} />;
}
