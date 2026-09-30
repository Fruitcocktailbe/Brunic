import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/catalog/repository";
import { categoryImage } from "@/lib/catalog/imagery";
import { visibleChildren } from "@/lib/catalog/tree";
import { routes } from "@/lib/routes";
import { productCount } from "@/lib/catalog/product";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CategoryHeader } from "@/components/catalog/category-header";
import { CategoryTile } from "@/components/catalog/category-tile";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Catalogus",
  description: "Gordijnen & stoffen, behang, vloerbekleding en tapijten van Brunic in Ninove — met advies, opmeting en plaatsing.",
  alternates: { canonical: "/catalogus" },
};

/** Toegang tot de webshop: alle hoofdcategorieën + hun volledige onderverdeling. */
export default async function CatalogPage() {
  const tree = await catalog.getTree();
  const roots = tree.roots.filter((r) => !r.hidden);
  const tiles = await Promise.all(roots.map(async (r) => ({ node: r, image: await categoryImage(r), count: (await catalog.getProductsInCategory(r.id)).length })));

  return (
    <div className="shell-inset">
      <Breadcrumbs items={[{ label: "Catalogus" }]} />
      <CategoryHeader
        title="Catalogus"
        intro="Ontdek het assortiment van Brunic: gordijnstoffen en vitrages, behang en wandbekleding, vasttapijt en tapijten van merken die wij al jaren vertrouwen. Veel producten maken of plaatsen we op maat — vraag vrijblijvend een offerte of kom langs in onze winkel in Ninove."
      />

      <div className="mt-6 grid grid-cols-2 gap-1 lg:grid-cols-3">
        {tiles.map(({ node, image }, i) => (
          <CategoryTile key={node.id} href={routes.category(node)} title={node.name} image={image} tone={i} size="lg" className="aspect-[4/5] md:aspect-[4/3]" />
        ))}
      </div>

      <section aria-labelledby="alle-categorieen" className="mt-16">
        <h2 id="alle-categorieen" className="section-title">
          Alle categorieën
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map(({ node, count }) => (
            <div key={node.id}>
              <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
                <Link href={routes.category(node)} className="text-lg font-semibold hover:underline">
                  {node.name}
                </Link>
                <span className="text-[13px] text-ink-60">{productCount(count)}</span>
              </div>
              <ul role="list" className="mt-4 space-y-3">
                {visibleChildren(node).map((c) => (
                  <li key={c.id}>
                    <Link href={routes.category(c)} className="font-medium hover:underline">
                      {c.name}
                    </Link>
                    {visibleChildren(c).length > 0 && (
                      <ul role="list" className="mt-2 space-y-1.5 border-l border-line pl-4">
                        {visibleChildren(c).map((g) => (
                          <li key={g.id}>
                            <Link href={routes.category(g)} className="text-[14px] text-ink-80 hover:text-ink hover:underline">
                              {g.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <Link href={routes.category(node)} className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium hover:underline">
                Alles in {node.name} <Icon name="arrowRight" size={18} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
