"use client";

import { useEffect, useState } from "react";
import type { Availability, Price, QuantityRule, SalesUnit } from "@/lib/catalog/types";
import type { CardProduct } from "@/lib/catalog/view";

export type LiteVariant = { id: string; sku: string; label: string; price: Price | null; availability: Availability };
export type LiteProduct = {
  card: CardProduct;
  unit: SalesUnit;
  quantity: QuantityRule;
  pricing: "fixed" | "on-request";
  variants: LiteVariant[];
};

/** Cache per sleutelsoort (id of slug), gedeeld over alle componenten. */
const caches = { ids: new Map<string, LiteProduct>(), slugs: new Map<string, LiteProduct>() };
/** Sleutels die de catalogus niet (meer) kent — bv. een product dat verdween. */
const gone = { ids: new Set<string>(), slugs: new Set<string>() };

function useLookup(kind: "ids" | "slugs", keys: string[]) {
  const cache = caches[kind];
  const weg = gone[kind];
  const key = [...new Set(keys)].sort().join(",");
  const [, force] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const missing = key.split(",").filter((k) => k && !cache.has(k) && !weg.has(k));
    if (missing.length === 0) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/producten?${kind}=${encodeURIComponent(missing.join(","))}`)
      .then((r) => r.json())
      .then((data: { products: LiteProduct[] }) => {
        for (const p of data.products) {
          caches.ids.set(p.card.id, p);
          caches.slugs.set(p.card.slug, p);
        }
        for (const k of missing) if (!cache.has(k)) weg.add(k);
        if (!cancelled) force((n) => n + 1);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [key, kind, cache, weg]);

  const map = new Map<string, LiteProduct>();
  for (const k of keys) {
    const p = cache.get(k);
    if (p) map.set(k, p);
  }
  const complete = keys.every((k) => cache.has(k) || weg.has(k));
  return { map, loading: loading || !complete };
}

/** Haalt productgegevens op voor een lijst product-ID's (met eenvoudige cache). */
export function useProducts(ids: string[]) {
  return useLookup("ids", ids);
}

/** Idem, op slug (bv. ?product=… in de URL van het offerteformulier). */
export function useProductsBySlug(slugs: string[]) {
  return useLookup("slugs", slugs);
}
