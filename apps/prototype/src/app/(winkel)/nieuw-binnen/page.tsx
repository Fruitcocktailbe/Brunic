import type { Metadata } from "next";
import { catalog } from "@/lib/catalog/repository";
import { facetLabelsFor, toListingItem } from "@/lib/catalog/view";
import { buildListing, type SearchParamsRecord } from "@/lib/catalog/listing";
import { categoryChipsFor } from "@/lib/catalog/chips";
import { routes } from "@/lib/routes";
import { CollectionPage } from "@/components/catalog/collection-page";

export const metadata: Metadata = {
  title: "Nieuw binnen",
  description: "De nieuwste stoffen, behang, vasttapijten en tapijten in het assortiment van Brunic in Ninove.",
  alternates: { canonical: "/nieuw-binnen" },
};

export default async function NewArrivalsPage({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const tree = await catalog.getTree();
  const items = (await catalog.getNewArrivals()).map((p) => toListingItem(p, tree));
  return (
    <CollectionPage
      title="Nieuw binnen"
      intro="De nieuwste stoffen, behangcollecties, vasttapijten en tapijten in ons assortiment. Benieuwd hoe ze er in het echt uitzien? Veel stalen kunt u in onze winkel in Ninove bekijken en voelen."
      listing={buildListing(items, await searchParams, facetLabelsFor(tree))}
      categoryChips={categoryChipsFor(items, tree, routes.newArrivals)}
      facetLabels={facetLabelsFor(tree)}
    />
  );
}
