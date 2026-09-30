import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { catalog } from "@/lib/catalog/repository";
import { searchCategories } from "@/lib/catalog/search";
import { facetLabelsFor, toListingItem } from "@/lib/catalog/view";
import { ancestry } from "@/lib/catalog/tree";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Icon } from "@/components/ui/icon";
import { ProductListing } from "@/components/catalog/product-listing";
import { CategoryTile } from "@/components/catalog/category-tile";
import { categoryImage } from "@/lib/catalog/imagery";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = (await searchParams).q?.trim();
  // Zoekresultaten horen niet in de index (dunne, eindeloos variërende pagina's).
  return { title: q ? `Zoeken: ${q}` : "Zoeken", robots: { index: false, follow: true } };
}

const SUGGESTIES = ["verduisterend", "linnen", "fotobehang", "bloemen", "vasttapijt", "vloerkleed", "brandvrij"];

export default async function SearchPage({ searchParams }: Props) {
  const q = (await searchParams).q?.trim() ?? "";
  const tree = await catalog.getTree();
  const results = q ? await catalog.search(q) : [];
  const items = results.map((p) => toListingItem(p, tree));
  const cats = q ? searchCategories(tree, q, 8) : [];
  const roots = await Promise.all(tree.roots.map(async (r) => ({ node: r, image: await categoryImage(r) })));

  return (
    <div className="shell-inset">
      <Breadcrumbs items={[{ label: "Zoeken" }]} />
      <div className="py-3">
        <h1 className="font-display text-[34px] leading-tight lg:text-[44px]">{q ? <>Resultaten voor “{q}”</> : "Zoeken"}</h1>
        {q && (
          <p className="mt-2 text-[15px] text-ink-80">
            {results.length} {results.length === 1 ? "product" : "producten"}
            {cats.length > 0 && ` en ${cats.length} ${cats.length === 1 ? "categorie" : "categorieën"}`} gevonden.
          </p>
        )}
      </div>

      {cats.length > 0 && (
        <nav aria-label="Gevonden categorieën" className="mt-4">
          <ul role="list" className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={routes.category(c)} className="flex min-h-10 max-w-full flex-wrap items-center gap-x-2 rounded-full border border-line-strong/50 px-4 py-2 text-[14px] leading-snug hover:border-ink">
                  <span className="text-ink-60">
                    {ancestry(tree, c.id)
                      .slice(0, -1)
                      .map((a) => a.name)
                      .join(" › ")}
                    {c.depth > 1 && " › "}
                  </span>
                  <span className="font-medium">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {q && results.length > 0 && (
        <div className="mt-6">
          <Suspense>
            <ProductListing items={items} facetLabels={facetLabelsFor(tree)} />
          </Suspense>
        </div>
      )}

      {(!q || results.length === 0) && (
        <div className="mt-6">
          <div className="rounded-[var(--radius-tile)] bg-cloud px-6 py-12 text-center">
            <Icon name="search" size={36} className="mx-auto text-ink-60" />
            <p className="mt-4 text-lg font-medium">{q ? `Geen producten gevonden voor “${q}”` : "Waar bent u naar op zoek?"}</p>
            <p className="mt-1 text-ink-80">{q ? "Controleer de spelling of probeer een algemener woord." : "Typ een zoekterm in het zoekveld bovenaan, of kies een suggestie."}</p>
            <ul role="list" className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIES.map((s) => (
                <li key={s}>
                  <Link href={routes.search(s)} className="flex min-h-10 items-center rounded-full bg-white px-4 text-[14px] ring-1 ring-line hover:ring-ink">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <h2 className="section-title mt-14">Of blader door onze afdelingen</h2>
          <div className="mt-8 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-6">
            {roots.map(({ node, image }, i) => (
              <CategoryTile key={node.id} href={routes.category(node)} title={node.name} image={image} tone={i} className="aspect-[4/5]" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
