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
