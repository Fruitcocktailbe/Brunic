import Link from "next/link";
import type { ImageRef } from "@/lib/catalog/types";
import { Carousel } from "@/components/ui/carousel";
import { productCount } from "@/lib/catalog/product";
import { ImageSlot } from "@/components/ui/image-slot";

/**
 * Strook met subcategorie-kaartjes boven een productlijst (referentie: "Canapé
 * modulable", "Canapé relax" …). Het actieve kaartje is donkerder.
 */
export function SubcategoryStrip({ items, activeHref }: { items: { href: string; name: string; image?: ImageRef; count?: number }[]; activeHref?: string }) {
  if (items.length === 0) return null;
  return (
    <Carousel label="Subcategorieën" itemClassName="w-[132px] md:w-[144px]" gap="gap-3">
      {items.map((it, i) => {
        const active = it.href === activeHref;
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-[212px] flex-col items-center gap-2.5 rounded-[var(--radius-pill)] p-3 text-center transition-colors ${
              active ? "bg-sand-2" : "bg-cloud hover:bg-mist"
            }`}
          >
            <ImageSlot src={it.image?.src} alt="" tone={i + 1} className="aspect-square w-full rounded-2xl" />
            <span className={`text-[13px] leading-tight ${active ? "font-semibold" : ""}`}>
              <span className="line-clamp-2 hyphens-auto break-words">{it.name}</span>
              {it.count !== undefined && <span className="mt-0.5 block text-[11px] font-normal text-ink-60">{productCount(it.count)}</span>}
            </span>
          </Link>
        );
      })}
    </Carousel>
  );
}
