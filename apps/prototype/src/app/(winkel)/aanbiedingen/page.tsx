import type { Metadata } from "next";
import { catalog } from "@/lib/catalog/repository";
import { facetLabelsFor, toListingItem } from "@/lib/catalog/view";
import { categoryChipsFor } from "@/lib/catalog/chips";
import { routes } from "@/lib/routes";
import { CollectionPage } from "@/components/catalog/collection-page";
import { PromoBanner } from "@/components/catalog/promo-banner";

export const metadata: Metadata = { title: "Aanbiedingen", alternates: { canonical: "/aanbiedingen" } };

export default async function OffersPage() {
  const tree = await catalog.getTree();
  const items = (await catalog.getOffers()).map((p) => toListingItem(p, tree));
  return (
    <CollectionPage
      title="Aanbiedingen"
      intro="Producten met een tijdelijke actieprijs. De doorstreepte prijs is de laagste prijs die in de 30 dagen vóór de actie gold. De actie loopt zolang de voorraad strekt of tot de vermelde einddatum."
      items={items}
      categoryChips={categoryChipsFor(items, tree, routes.offers)}
      facetLabels={facetLabelsFor(tree)}
      promo={<PromoBanner soort="winkel" />}
    />
  );
}
