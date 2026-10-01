/**
 * Het megamenu (enkel serverzijdig): de menuboom uit menu.ts, aangevuld met het productaantal
 * per categorie, één sfeerfoto per afdeling, de merken per afdeling en een dienstkaart die bij de
 * afdeling past. Apart van menu.ts, zodat client-componenten dat bestand veilig kunnen
 * importeren (deze module leest de catalogus).
 */
import { catalog } from "./repository";
import { categoryImage } from "./imagery";
import { getBrands, merkVan } from "./brands";
import { compactSrc } from "./cdn";
import { toMenu, type MenuNode } from "./menu";
import type { CategoryTree } from "./tree";
import type { CategoryId, ImageRef } from "./types";
import { routes } from "@/lib/routes";
import { SITE } from "@/lib/site/config";
import { maatwerkVoor, type Maatwerk } from "@/lib/site/maatwerk";

const DIENST: Record<Maatwerk, NonNullable<MenuNode["dienst"]>> = {
  stoffen: { titel: "Gratis opmeting aan huis", tekst: "Wij meten op, maken in ons atelier en plaatsen met onze eigen mensen.", href: routes.measurement(), icon: "ruler" },
  tapijten: { titel: "Tapijt op maat", tekst: "Past geen standaardmaat? U kiest afmeting, kwaliteit en kleur.", href: routes.service("tapijt-op-maat"), icon: "ruler" },
  vloer: { titel: "Vasttapijt, vakkundig gelegd", tekst: "Gratis opmeting en plaatsing door onze eigen mensen.", href: routes.service("vasttapijt-en-vloeren"), icon: "home" },
  winkel: { titel: "Stalenboeken in de winkel", tekst: `Bekijk de collecties in het echt in ${SITE.address.city}, ${SITE.hoursShort}.`, href: routes.store(), icon: "grid" },
};

const klein = (i: ImageRef | undefined): ImageRef | undefined => (i ? { src: compactSrc(i.src), alt: "" } : undefined);

let cache: { tree: CategoryTree; menu: MenuNode[] } | undefined;

export async function toMegaMenu(): Promise<MenuNode[]> {
  const tree = await catalog.getTree();
  if (cache?.tree === tree) return cache.menu;

  // Merken per afdeling (hoofdcategorie van het product), meeste producten eerst.
  const perAfdeling = new Map<CategoryId, Map<string, number>>();
  for (const p of await catalog.getAllProducts()) {
    if (!p.brand) continue;
    const root = (await catalog.getCategoryTrail(p.primaryCategoryId))[0]?.id;
    if (!root) continue;
    const m = perAfdeling.get(root) ?? new Map<string, number>();
    m.set(merkVan(p.brand), (m.get(merkVan(p.brand)) ?? 0) + 1);
    perAfdeling.set(root, m);
  }
  const merkInfo = new Map((await getBrands()).map((b) => [b.name, b]));

  const verrijk = async (n: MenuNode, diepte: number): Promise<MenuNode> => {
    const node = tree.byId.get(n.id);
    const extra: Partial<MenuNode> = {};
    if (node) {
      extra.count = (await catalog.getProductsInCategory(node.id)).length;
      // Enkel de afdeling krijgt een beeld (één sfeerfoto in het menu); subcategorieën zijn tekstlinks.
      extra.image = diepte === 1 ? klein(await categoryImage(node)) : undefined;
    }
    if (diepte === 1) {
      extra.merken = [...(perAfdeling.get(n.id) ?? new Map()).entries()]
        .sort((a, b) => b[1] - a[1])
        .flatMap(([naam]) => {
          const b = merkInfo.get(naam);
          return b ? [{ name: b.name, href: routes.brand(b.slug), logo: b.logo?.src }] : [];
        });
      extra.dienst = DIENST[maatwerkVoor(n.id)];
    }
    return { ...n, ...extra, children: await Promise.all(n.children.map((c) => verrijk(c, diepte + 1))) };
  };

  const menu = await Promise.all(toMenu(tree).map((n) => verrijk(n, 1)));
  cache = { tree, menu };
  return menu;
}
