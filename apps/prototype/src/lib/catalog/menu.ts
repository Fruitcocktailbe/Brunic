import type { CategoryTree } from "./tree";
import type { CategoryNode, ImageRef } from "./types";
import { routes } from "@/lib/routes";

/** Serialiseerbare menuboom (server → client) — afgeleid van de categorieboom. */
export type MenuNode = {
  id: string;
  name: string;
  slug: string;
  href: string;
  image?: ImageRef;
  children: MenuNode[];
  /** Aantal producten (megamenu). */
  count?: number;
  /** Merken met producten in deze afdeling (enkel hoofdcategorieën, megamenu). */
  merken?: { name: string; href: string; logo?: string }[];
  /** Dienstkaart die bij deze afdeling past (enkel hoofdcategorieën, megamenu). */
  dienst?: { titel: string; tekst: string; href: string; icon: "ruler" | "home" | "grid" };
};

function toNode(c: CategoryNode): MenuNode {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    href: routes.category(c),
    image: c.image,
    children: c.children.filter((x) => !x.hidden).map(toNode),
  };
}

export function toMenu(tree: CategoryTree): MenuNode[] {
  return tree.roots.filter((c) => !c.hidden).map(toNode);
}
