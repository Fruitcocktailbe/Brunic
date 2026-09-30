import Link from "next/link";
import type { ImageRef } from "@/lib/catalog/types";
import { ImageSlot } from "@/components/ui/image-slot";

/**
 * Merktegel (referentie: merkenrij van vente-unique): sfeerfoto uit de collectie van het
 * merk, zachte donkere laag en het logo gecentreerd. Zonder logo: de merknaam in de
 * sierletter. Logo's: src/data/merken.ts.
 */
export function BrandTile({
  href,
  name,
  image,
  logo,
  tone = 0,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 70vw",
  className = "",
}: {
  href: string;
  name: string;
  image?: ImageRef;
  logo?: { src: string; wit?: boolean };
  tone?: number;
  sizes?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-[var(--radius-pill)] ${className}`}>
      <ImageSlot src={image?.src} alt="" tone={tone} sizes={sizes} className="absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-[1.04]" />
      <span className="absolute inset-0 bg-[rgb(19_12_12/0.28)] transition-colors duration-300 group-hover:bg-[rgb(19_12_12/0.4)]" aria-hidden="true" />
      <span className="absolute inset-0 flex items-center justify-center p-8">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- klein, statisch merklogo (SVG/PNG)
          <img
            src={logo.src}
            alt={name}
            className={`max-h-[34%] max-w-[78%] object-contain ${
              logo.wit === false ? "[filter:drop-shadow(0_2px_10px_rgb(0_0_0/0.35))]" : "[filter:brightness(0)_invert(1)_drop-shadow(0_2px_10px_rgb(0_0_0/0.35))]"
            }`}
          />
        ) : (
          <span className="text-center font-display text-[34px] leading-tight text-white [text-shadow:0_2px_16px_rgb(0_0_0/0.35)] lg:text-[42px]">{name}</span>
        )}
      </span>
    </Link>
  );
}
