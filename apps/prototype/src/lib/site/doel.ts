import type { Doel } from "@/data/home";
import { ARTICLES } from "@/data/content";
import { catalog } from "@/lib/catalog/repository";
import { routes } from "@/lib/routes";

/** Vertaalt een tegeldoel naar een URL; null als de categorie/het product/artikel niet bestaat. */
export async function resolveDoel(doel: Doel): Promise<string | null> {
  if ("href" in doel) return doel.href;
  if ("categoryId" in doel) {
    const node = (await catalog.getTree()).byId.get(doel.categoryId);
    return node ? routes.category(node) : null;
  }
  if ("product" in doel) return (await catalog.getProductBySlug(doel.product)) ? routes.product(doel.product) : null;
  return ARTICLES.some((a) => a.slug === doel.article) ? routes.article(doel.article) : null;
}
