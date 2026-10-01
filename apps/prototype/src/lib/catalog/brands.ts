import { catalog } from "./repository";
import { sfeerfoto } from "./imagery";
import { normalize } from "./search";
import type { ImageRef, Product } from "./types";
import { MERK_LOGO, MERK_ONDER } from "@/data/merken";

export type Brand = { name: string; slug: string; count: number; types: string[]; image?: ImageRef; logo?: { src: string; wit?: boolean }; products: Product[] };

export const brandSlug = (name: string) =>
  normalize(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Het merk waaronder een Shopify-vendor op de site staat (Desso → Tarkett). */
export const merkVan = (vendor: string) => MERK_ONDER[vendor] ?? vendor;

/**
 * Alle merken (Shopify vendor) in de catalogus, meeste producten eerst — met een sfeerfoto uit hun eigen assortiment.
 * Submerken (MERK_ONDER, bv. Desso → Tarkett) tellen mee bij hun moedermerk.
 */
export async function getBrands(): Promise<Brand[]> {
  const byName = new Map<string, Product[]>();
  for (const p of await catalog.getAllProducts()) {
    if (!p.brand) continue;
    const merk = merkVan(p.brand);
    byName.set(merk, [...(byName.get(merk) ?? []), p]);
  }
  return [...byName.entries()]
    .map(([name, products]) => {
      const sorted = [...products].sort((a, b) => b.popularity - a.popularity);
      const types = [...new Set(products.flatMap((p) => p.facets.type ?? []))];
      const image = sorted.map(sfeerfoto).find(Boolean) ?? sorted.find((p) => p.images[0])?.images[0];
      const slug = brandSlug(name);
      return { name, slug, count: products.length, types, image, logo: MERK_LOGO[slug], products: sorted };
    })
    .sort((a, b) => b.count - a.count);
}

export async function getBrand(slug: string): Promise<Brand | undefined> {
  return (await getBrands()).find((b) => b.slug === slug);
}
