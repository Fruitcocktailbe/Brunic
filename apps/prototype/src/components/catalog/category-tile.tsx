import Link from "next/link";
import type { ImageRef } from "@/lib/catalog/types";
import { ImageSlot } from "@/components/ui/image-slot";
import { Icon } from "@/components/ui/icon";

const TITLE_SIZE = {
  sm: "text-[15px] lg:text-[17px]",
  md: "text-[17px] xl:text-xl",
  lg: "text-lg md:text-xl",
} as const;

/**
 * Fototegel met naam linksonder en ronde pijlknop rechtsonder (referentie:
 * "Bienvenue dans nos rayons" / "En quête d'inspiration"). Titels breken enkel tussen
 * woorden (of met een koppelteken), nooit midden in een woord.
 */
export function CategoryTile({
  href,
  title,
  image,
  className = "",
  tone = 0,
  size = "md",
  sizes,
}: {
  href: string;
  title: string;
  image?: ImageRef;
  className?: string;
  tone?: number;
  size?: "sm" | "md" | "lg";
  /** Weergavebreedte voor de srcset (zie ImageSlot). */
  sizes?: string;
}) {
  const hasImage = Boolean(image?.src);
  return (
    <Link href={href} className={`group relative block overflow-hidden rounded-[var(--radius-tile)] ${className}`}>
      <ImageSlot
        src={image?.src}
        alt=""
        tone={tone}
        sizes={sizes}
        className="absolute inset-0"
        imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {hasImage && <span className="tile-shade pointer-events-none absolute inset-0" aria-hidden="true" />}
      <span
        className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 ${size === "lg" ? "p-6" : size === "sm" ? "p-3 lg:p-4" : "p-4 lg:p-5"} ${
          hasImage ? "text-white" : "text-ink"
        }`}
      >
        <span className={`min-w-0 hyphens-auto break-words font-medium leading-tight [text-shadow:0_1px_8px_rgb(0_0_0/0.25)] ${TITLE_SIZE[size]}`}>{title}</span>
        <span
          className={`flex shrink-0 items-center justify-center rounded-full border ${size === "sm" ? "size-9" : "size-10"} ${
            hasImage ? "border-white/40 bg-[var(--color-on-picture)] backdrop-blur-sm" : "border-line-strong/50 bg-white"
          }`}
          aria-hidden="true"
        >
          <Icon name="arrowRight" size={18} />
        </span>
      </span>
    </Link>
  );
}
