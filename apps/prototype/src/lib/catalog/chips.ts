import type { ListingItem } from "./view";
import type { CategoryTree } from "./tree";
import type { ImageRef } from "./types";

/**
 * Categoriekaartjes voor een samengestelde lijst: één per hoofdcategorie die erin
 * voorkomt, met als beeld de eerste productfoto. `href` = dezelfde pagina gefilterd
 * op die hoofdcategorie (routes.offers / routes.newArrivals met slug).
 */
export function categoryChipsFor(items: ListingItem[], tree: CategoryTree, href: (categorySlug: string) => string) {
  const out: { name: string; href: string; image?: ImageRef; count: number }[] = [];
  for (const root of tree.roots) {
    const inCat = items.filter((i) => i.facets.categorie?.includes(root.slug));
    if (inCat.length === 0) continue;
    out.push({ name: root.name, href: href(root.slug), image: inCat.find((i) => i.image?.src)?.image, count: inCat.length });
  }
  return out;
}
