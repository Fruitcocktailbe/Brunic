import Image from "next/image";
import Link from "next/link";
import { FavorietKnop } from "@/components/favoriet-knop";
import { beeldloosWoord, formatPrijs } from "@/lib/format";
import { isEtalage, type ProductCard as ProductCardData } from "@/lib/shopify/types";

/**
 * Drie fotostaten (design-brief §7): echte foto · leveranciersbeeld · géén beeld.
 * De beeldloze staat is bewust ontworpen — 12k producten hebben (nog) geen foto.
 */
export function ProductCard({ product }: { product: ProductCardData }) {
  const etalage = isEtalage(product);
  const img = product.featuredImage;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-m border border-line bg-white transition hover:-translate-y-1 hover:shadow-m">
      <FavorietKnop handle={product.handle} titel={product.title} />

      <Link href={`/product/${product.handle}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3.4] overflow-hidden bg-ivory-2">
          {img ? (
            <Image
              src={img.url}
              alt={img.altText ?? product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* fotoloos-gracieus: geen grijze placeholder maar een merkvlak */
            <div className="stripes-red flex h-full flex-col justify-between bg-ivory-2 p-5">
              <span className="font-display text-3xl font-semibold italic text-brand">
                {beeldloosWoord(product.title)}
              </span>
              <span className="self-start border-t-2 border-brand pt-2 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-ink-soft">
                Foto volgt — kom langs in de winkel
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-display text-lg leading-tight">{product.title}</h3>

          <p className="mt-auto pt-2">
            {etalage ? (
              <span className="text-sm font-bold text-brand-text">Prijs op aanvraag</span>
            ) : (
              <span className="font-body text-lg font-extrabold">
                <span className="mr-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
                  vanaf
                </span>
                {formatPrijs(product.priceRange.minVariantPrice.amount)}
              </span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
