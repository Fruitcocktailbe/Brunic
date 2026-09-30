"use client";

import { useState } from "react";
import { Icon } from "./icon";
import { expandSrc } from "@/lib/catalog/cdn";

/** Breedtes die het Shopify-CDN on-the-fly levert (`?width=`); de browser kiest via srcset. */
const WIDTHS = [240, 360, 540, 720, 960, 1280, 1600, 2048];

/** srcset voor beelden op het Shopify-CDN; andere bronnen krijgen er geen. */
export function shopifySrcSet(src: string): string | undefined {
  if (!/^https:\/\/cdn\.shopify\.com\//.test(src)) return undefined;
  const sep = src.includes("?") ? "&" : "?";
  return WIDTHS.map((w) => `${src}${sep}width=${w} ${w}w`).join(", ");
}

/**
 * Een beeld dat zijn kader vult. Beelden van het Shopify-CDN krijgen een srcset, zodat
 * een tegel geen foto van 2000 px inlaadt (geen Vercel-beeldoptimalisatie nodig —
 * architectuur.md §Foto's & CDN). `sizes` = hoe breed het beeld ongeveer getoond wordt.
 *
 * Geen beeld of laadt het niet: een rustig vlak met een klein icoon (geen kapot beeld).
 * `tone` wisselt de achtergrondtint zodat lege vlakken naast elkaar niet als één blok ogen.
 */
export function ImageSlot({
  src,
  alt,
  className = "",
  imgClassName = "",
  tone = 0,
  fit = "cover",
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  tone?: number;
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (src) src = expandSrc(src);
  const tones = ["bg-sand", "bg-mist", "bg-[#efe6dc]", "bg-[#ece9e4]"];
  // Zelf positioneren tenzij de aanroeper al absolute/fixed opgeeft (anders botsen de klassen).
  const pos = /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? "" : "relative";

  if (!src || failed) {
    return (
      <div
        className={`${pos} flex items-center justify-center overflow-hidden text-ink-60/70 ${tones[tone % tones.length]} ${className}`}
        {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
      >
        <Icon name="camera" size={22} />
      </div>
    );
  }

  return (
    <div className={`${pos} overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Shopify-CDN levert zelf de formaten (srcset) */}
      <img
        src={src}
        srcSet={shopifySrcSet(src)}
        sizes={shopifySrcSet(src) ? sizes : undefined}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        onError={() => setFailed(true)}
        className={`absolute inset-0 size-full ${fit === "cover" ? "object-cover" : "object-contain p-3"} ${imgClassName}`}
      />
    </div>
  );
}
