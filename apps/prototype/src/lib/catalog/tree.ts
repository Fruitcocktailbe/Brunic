import type { Category, CategoryId, CategoryNode } from "./types";

/**
 * Bouwt en bevraagt de categorieboom uit een platte lijst. Puur en synchroon:
 * de Shopify-adapter levert een platte lijst, dit maakt er een boom van.
 */
export type CategoryTree = {
  roots: CategoryNode[];
  byId: Map<CategoryId, CategoryNode>;
};

export function buildCategoryTree(categories: Category[]): CategoryTree {
  const byId = new Map<CategoryId, CategoryNode>();
  for (const c of categories) {
    if (byId.has(c.id)) throw new Error(`Categorie-ID dubbel gebruikt: ${c.id}`);
    byId.set(c.id, { ...c, children: [], depth: 0, path: [] });
  }

  const roots: CategoryNode[] = [];
  for (const node of byId.values()) {
    if (node.parentId === null) {
      roots.push(node);
      continue;
    }
    const parent = byId.get(node.parentId);
    if (!parent) throw new Error(`Categorie ${node.id} verwijst naar onbekende ouder ${node.parentId}`);
    parent.children.push(node);
  }

  const byOrder = (a: CategoryNode, b: CategoryNode) => a.order - b.order || a.name.localeCompare(b.name, "nl");

  // Diepte + pad afleiden en slug-uniciteit per ouder bewaken (anders botsen URL's).
  const walk = (nodes: CategoryNode[], depth: number, parentPath: string[]) => {
    nodes.sort(byOrder);
    const seen = new Set<string>();
    for (const n of nodes) {
      if (seen.has(n.slug)) throw new Error(`Slug "${n.slug}" komt twee keer voor onder dezelfde ouder`);
      seen.add(n.slug);
      n.depth = depth;
      n.path = [...parentPath, n.slug];
      if (n.path.length > 12) throw new Error(`Categorieboom te diep of cyclisch bij ${n.id}`);
      walk(n.children, depth + 1, n.path);
    }
  };
  walk(roots, 1, []);

  return { roots, byId };
}

/** Zoekt de categorie achter een URL-pad (lijst van slugs). */
export function findByPath(tree: CategoryTree, slugs: string[]): CategoryNode | undefined {
  let level = tree.roots;
  let found: CategoryNode | undefined;
  for (const slug of slugs) {
    found = level.find((c) => c.slug === decodeURIComponent(slug));
    if (!found) return undefined;
    level = found.children;
  }
  return found;
}

/** Voorouders van hoofdcategorie tot en met de categorie zelf. */
export function ancestry(tree: CategoryTree, id: CategoryId): CategoryNode[] {
  const out: CategoryNode[] = [];
  let cur = tree.byId.get(id);
  while (cur) {
    out.unshift(cur);
    cur = cur.parentId ? tree.byId.get(cur.parentId) : undefined;
  }
  return out;
}

/** De categorie zelf plus alle nakomelingen. */
export function descendantIds(tree: CategoryTree, id: CategoryId): Set<CategoryId> {
  const out = new Set<CategoryId>();
  const stack = [tree.byId.get(id)];
  while (stack.length) {
    const n = stack.pop();
    if (!n) continue;
    out.add(n.id);
    stack.push(...n.children);
  }
  return out;
}

export function visibleChildren(node: CategoryNode): CategoryNode[] {
  return node.children.filter((c) => !c.hidden);
}

/** Welke template een categoriepagina krijgt (zie CategoryDisplay). */
export function resolveDisplay(node: CategoryNode): "overview" | "mixed" | "products" {
  if (node.display && node.display !== "auto") return node.display;
  if (visibleChildren(node).length === 0) return "products";
  return node.depth === 1 ? "overview" : "mixed";
}

/** Alle categoriepaden, voor generateStaticParams en de sitemap. */
export function allPaths(tree: CategoryTree): string[][] {
  return [...tree.byId.values()].map((n) => n.path);
}
