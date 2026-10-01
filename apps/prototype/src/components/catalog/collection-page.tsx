import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import type { ListingData } from "@/lib/catalog/listing";
import type { ImageRef } from "@/lib/catalog/types";
import type { FacetLabelMap } from "@/lib/catalog/filters";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Carousel } from "@/components/ui/carousel";
import { productCount } from "@/lib/catalog/product";
import { ImageSlot } from "@/components/ui/image-slot";
import { CategoryHeader } from "./category-header";
import { ProductListing } from "./product-listing";

/**
 * Gedeelde template voor samengestelde lijsten (Aanbiedingen, Nieuw binnen) — de lijst
 * wordt op de server gefilterd en gepagineerd (lib/catalog/listing.ts):
 * titel, strook met categoriekaartjes als snelle filter, productlijst (referentie:
 * "Promotions").
 */
export function CollectionPage({
  title,
  intro,
  listing,
  categoryChips,
  promo,
  emptyState,
  facetLabels,
}: {
  title: string;
  intro: string;
  listing: ListingData;
  categoryChips: { name: string; href: string; image?: ImageRef; count: number }[];
  promo?: ReactNode;
  emptyState?: ReactNode;
  facetLabels?: FacetLabelMap;
}) {
  return (
    <div className="shell-inset">
      <Breadcrumbs items={[{ label: title }]} />
      <CategoryHeader title={title} intro={intro} />
      {categoryChips.length > 1 && (
        <div className="mt-6">
          <Carousel label="Per categorie" itemClassName="w-[132px] md:w-[144px]" gap="gap-3">
            {categoryChips.map((c, i) => (
              <Link
                key={c.href}
                href={c.href}
                scroll={false}
                className="flex h-[200px] flex-col items-center gap-3 rounded-[var(--radius-pill)] bg-cloud p-3 text-center transition-colors hover:bg-mist"
              >
                <ImageSlot src={c.image?.src} alt="" tone={i} className="aspect-square w-full rounded-2xl" />
                <span className="text-[13px] leading-tight">
                  {c.name}
                  <span className="block text-[11px] text-ink-60">{productCount(c.count)}</span>
                </span>
              </Link>
            ))}
          </Carousel>
        </div>
      )}
      <div className="mt-6">
        <Suspense>
          <ProductListing data={listing} promo={promo} emptyState={emptyState} showOffersToggle={false} facetLabels={facetLabels} />
        </Suspense>
      </div>
    </div>
  );
}
