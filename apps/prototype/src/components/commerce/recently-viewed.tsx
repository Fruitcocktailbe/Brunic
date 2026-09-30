"use client";

import { useRecentlyViewed } from "@/lib/store/stores";
import { useProducts } from "@/lib/store/use-products";
import { Carousel } from "@/components/ui/carousel";
import { ProductCard } from "@/components/catalog/product-card";

/** "Uw laatst bekeken producten" — lokaal bijgehouden (geen tracking). */
export function RecentlyViewed({ excludeId, className = "", title = "Uw laatst bekeken producten" }: { excludeId?: string; className?: string; title?: string }) {
  const { ids, hydrated } = useRecentlyViewed();
  const list = ids.filter((id) => id !== excludeId).slice(0, 10);
  const { map } = useProducts(list);
  const cards = list.map((id) => map.get(id)?.card).filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (!hydrated || cards.length === 0) return null;
  return (
    <section aria-labelledby="recent-titel" className={className}>
      <h2 id="recent-titel" className="mb-5 text-xl font-medium lg:text-2xl">
        {title}
      </h2>
      <Carousel label={title}>
        {cards.map((c, i) => (
          <ProductCard key={c.id} product={c} tone={i} />
        ))}
      </Carousel>
    </section>
  );
}
