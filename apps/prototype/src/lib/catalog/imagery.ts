import { catalog } from "./repository";
import type { CategoryNode, ImageRef, Product } from "./types";

const IS_SFEER = / – sfeerfoto/;

/** De eerste sfeerfoto (kamerbeeld van de leverancier) van een product, anders undefined. */
export function sfeerfoto(p: Product): ImageRef | undefined {
  return p.images.find((i) => IS_SFEER.test(i.alt));
}

/**
 * Tegelbeeld voor een categorie: het eigen categoriebeeld (src/data/categories.ts), anders
 * de sfeerfoto van het meest aanbevolen product erin, anders zijn eerste productfoto.
 * Zo toont elke subcategorie een leveranciersbeeld uit haar eigen assortiment.
 */
export async function categoryImage(node: CategoryNode): Promise<ImageRef | undefined> {
  if (node.image?.src) return node.image;
  const products = [...(await catalog.getProductsInCategory(node.id))].sort((a, b) => b.popularity - a.popularity);
  for (const p of products) {
    const s = sfeerfoto(p);
    if (s) return s;
  }
  return products.find((p) => p.images[0]?.src)?.images[0];
}

/**
 * `n` verschillende sfeerfoto's uit een lijst producten (één per product), voor
 * campagnetegels op categoriepagina's. `skip` = beelden die al op de pagina staan.
 */
export function sfeerfotos(products: Product[], n: number, skip: string[] = []): ImageRef[] {
  const out: ImageRef[] = [];
  const gezien = new Set(skip.map((s) => s.split("?")[0]));
  for (const p of [...products].sort((a, b) => b.popularity - a.popularity)) {
    const s = sfeerfoto(p);
    if (!s || gezien.has(s.src.split("?")[0])) continue;
    gezien.add(s.src.split("?")[0]);
    out.push(s);
    if (out.length === n) break;
  }
  return out;
}
