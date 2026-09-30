import { catalog } from "@/lib/catalog/repository";
import { categoryImage } from "@/lib/catalog/imagery";
import { routes } from "@/lib/routes";
import { resolveDoel } from "@/lib/site/doel";
import { SMALL_TILES } from "@/data/home";
import { CategoryTile } from "@/components/catalog/category-tile";

/**
 * "Welkom in onze afdelingen": één grote tegel per zichtbare hoofdcategorie (enkel die
 * met producten) + kleine tegels naar diensten en lijsten (homepage en lege winkelmand).
 */
export async function DepartmentTiles() {
  const tree = await catalog.getTree();
  const large = await Promise.all(tree.roots.filter((r) => !r.hidden).map(async (node) => ({ href: routes.category(node), title: node.name, image: await categoryImage(node) })));
  const small = (await Promise.all(SMALL_TILES.map(async (t) => ({ href: await resolveDoel(t.doel), title: t.label, image: t.image })))).filter(
    (t): t is { href: string; title: string; image: (typeof SMALL_TILES)[number]["image"] } => t.href !== null,
  );
  const largeCols = large.length >= 4 ? "lg:grid-cols-4" : large.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <>
      <div className={`grid grid-cols-1 gap-1 sm:grid-cols-2 ${largeCols}`}>
        {large.map((t, i) => (
          <CategoryTile key={t.href} {...t} tone={i} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] sm:aspect-[4/5] lg:aspect-[333/416]" />
        ))}
      </div>
      <div className="mt-1 grid grid-cols-2 gap-1 md:grid-cols-4">
        {small.map((t, i) => (
          <CategoryTile key={t.href} {...t} tone={i + 1} size="sm" className="aspect-[4/5] md:aspect-[4/3]" />
        ))}
      </div>
    </>
  );
}
