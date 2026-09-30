import { NextResponse } from "next/server";
import { catalog } from "@/lib/catalog/repository";
import { searchCategories } from "@/lib/catalog/search";
import { toCard } from "@/lib/catalog/view";
import { ancestry } from "@/lib/catalog/tree";
import { routes } from "@/lib/routes";

/** Zoeksuggesties voor het zoekveld in de header (categorieën + producten). */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ categories: [], products: [], total: 0 });
  const tree = await catalog.getTree();
  const products = await catalog.search(q);
  const categories = searchCategories(tree, q).map((c) => ({
    id: c.id,
    name: c.name,
    href: routes.category(c),
    trail: ancestry(tree, c.id)
      .slice(0, -1)
      .map((a) => a.name)
      .join(" › "),
  }));
  return NextResponse.json({ categories, products: products.slice(0, 6).map(toCard), total: products.length });
}
