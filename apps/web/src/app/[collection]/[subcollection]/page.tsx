import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { getCollection, laadPlp } from "@/lib/shopify/collection";
import { heeftFacets, heeftPagina, paginaUit, type SearchParams, selectedFacets } from "@/lib/shopify/facets";
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

  const sp = await searchParams;
  const gefilterd = heeftFacets(selectedFacets(sp)) || heeftPagina(paginaUit(sp));
  const leeg = collection.products.nodes.length === 0;

  return {
    title: collection.title,
    description: collection.description || undefined,
    alternates: { canonical: `/${ouder}/${sub.slug}` },
    // Nog lege subcategorie, een actieve facet-combinatie of een vervolgpagina: niet indexeren.
    // Anders vult de sitemap zich met dunne pagina's (docs/architectuur.md §Migratie).
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

  const plp = await laadPlp(sub.handle, await searchParams);
  if (!plp) notFound();

  return <CollectionView {...plp} />;
}
