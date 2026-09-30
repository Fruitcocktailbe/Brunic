import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { catalog } from "@/lib/catalog/repository";
import { allPaths, resolveDisplay, visibleChildren } from "@/lib/catalog/tree";
import { categoryImage, sfeerfotos } from "@/lib/catalog/imagery";
import { toListingItem } from "@/lib/catalog/view";
import type { CategoryNode } from "@/lib/catalog/types";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, categoryCrumbs } from "@/lib/site/seo";
import { isOpMaat, maatwerkVoor } from "@/lib/site/maatwerk";
import { ARTICLES } from "@/data/content";
import { BEELD } from "@/data/beelden";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CategoryHeader } from "@/components/catalog/category-header";
import { CategoryLanding } from "@/components/catalog/category-landing";
import { SubcategoryStrip } from "@/components/catalog/subcategory-strip";
import { ProductListing } from "@/components/catalog/product-listing";
import { PromoBanner } from "@/components/catalog/promo-banner";
import { JsonLd } from "@/components/seo/json-ld";

type Props = { params: Promise<{ pad: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Alle categoriepaden vooraf renderen — komt rechtstreeks uit de categorieboom. */
export async function generateStaticParams() {
  return allPaths(await catalog.getTree()).map((pad) => ({ pad }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const node = await catalog.getCategoryByPath((await params).pad);
  if (!node) return { title: "Categorie niet gevonden" };
  const trail = await catalog.getCategoryTrail(node.id);
  const image = await categoryImage(node);
  // Gefilterde of "alle producten"-weergaven: noindex + canonical naar het kale pad
  // (geen facet-explosie in de index, architectuur.md §Filters).
  const gefilterd = Object.keys(await searchParams).length > 0;
  return {
    title: trail.map((t) => t.name).reverse().join(" · "),
    description: node.intro?.slice(0, 160),
    alternates: { canonical: routes.category(node) },
    openGraph: image ? { images: [{ url: image.src, alt: image.alt }] } : undefined,
    ...(gefilterd ? { robots: { index: false, follow: true } } : {}),
  };
}

async function stripData(nodes: CategoryNode[]) {
  return Promise.all(
    nodes.map(async (c) => ({
      href: routes.category(c),
      name: c.name,
      image: await categoryImage(c),
      count: (await catalog.getProductsInCategory(c.id)).length,
    })),
  );
}

/**
 * Eén template voor elke categoriediepte; de weergave volgt uit de boom (resolveDisplay):
 * - overview (hoofdcategorie met kinderen): landingspagina zoals de referentie, met
 *   daaronder alle producten van de categorie; `?weergave=producten` = enkel de lijst
 * - mixed (diepere categorie met kinderen): strook subcategorieën + productlijst
 * - products (eindcategorie): strook zustercategorieën + productlijst
 */
export default async function CategoryPage({ params, searchParams }: Props) {
  const { pad } = await params;
  const { weergave } = await searchParams;
  const node = await catalog.getCategoryByPath(pad);
  if (!node) notFound();

  const tree = await catalog.getTree();
  const trail = await catalog.getCategoryTrail(node.id);
  const display = resolveDisplay(node);
  const children = visibleChildren(node);
  const parent = node.parentId ? tree.byId.get(node.parentId) : undefined;
  const siblings = parent ? visibleChildren(parent) : [];
  const inCategory = await catalog.getProductsInCategory(node.id);
  const crumbs = [{ label: "Catalogus", href: routes.catalog() }, ...trail.map((t) => ({ label: t.name, href: routes.category(t) }))];
  const jsonLd = <JsonLd data={breadcrumbJsonLd(categoryCrumbs(trail))} />;
  const artikels = ARTICLES.filter((a) => a.relatedCategoryId === node.id || a.relatedCategoryId === trail[0].id);
  // Op-maatverhaal enkel waar Brunic maatwerk levert (stoffen, tapijten, vasttapijt); elders: kom naar de winkel.
  const maatwerk = maatwerkVoor(trail[0].id);
  const promo = <PromoBanner soort={maatwerk} />;

  if (display === "overview" && weergave !== "producten") {
    const banner = await categoryImage(node);
    const subCards = await Promise.all(
      children.map(async (c) => ({
        href: routes.category(c),
        name: c.name,
        image: await categoryImage(c),
        links: visibleChildren(c).map((g) => ({ href: routes.category(g), name: g.name })),
        allHref: routes.category(c),
      })),
    );
    // Campagnebeelden: sfeerfoto's uit deze categorie die nog niet op de pagina staan.
    const [beeldAdvies, beeldNieuw] = sfeerfotos(inCategory, 2, [banner?.src ?? "", ...subCards.map((c) => c.image?.src ?? "")]);
    return (
      <>
        {jsonLd}
        <CategoryLanding
          crumbs={crumbs}
          title={node.name}
          subtitle={node.subtitle}
          intro={node.intro}
          image={banner}
          subCards={subCards}
          listing={
            <Suspense>
              <ProductListing items={inCategory.map((p) => toListingItem(p))} promo={promo} />
            </Suspense>
          }
          total={inCategory.length}
          campaigns={[
            maatwerk === "tapijten"
              ? { title: "Tapijt op maat", subtitle: "In de afmeting die u kiest, met advies over maat en kwaliteit", cta: "Meer weten", href: routes.service("tapijt-op-maat"), image: beeldAdvies ?? BEELD.dienstTapijtOpMaat }
              : isOpMaat(maatwerk)
                ? {
                    title: "Gratis opmeting aan huis",
                    subtitle: "Wij meten op, adviseren en plaatsen met onze eigen mensen",
                    cta: "Opmeting aanvragen",
                    href: routes.measurement(),
                    image: beeldAdvies ?? BEELD.dienstOpmeting,
                  }
                : { title: "Kom langs in onze winkel", subtitle: "Stalenboeken bekijken en persoonlijk advies in Ninove", cta: "Route & openingsuren", href: routes.store(), image: beeldAdvies ?? BEELD.tegelInspiratie },
            { title: "Nieuw binnen", subtitle: `Het nieuwste in ${node.name.toLowerCase()}`, cta: "Ontdek", href: routes.newArrivals(node.slug), image: beeldNieuw ?? BEELD.tegelNieuw },
          ]}
          articles={artikels}
        />
      </>
    );
  }

  const products = inCategory.map((p) => toListingItem(p));
  const listCrumbs = weergave === "producten" ? [...crumbs, { label: "Alle producten" }] : crumbs;

  return (
    <div className="shell-inset">
      {jsonLd}
      <Breadcrumbs items={listCrumbs} />
      <CategoryHeader title={weergave === "producten" ? `Alle producten: ${node.name}` : node.name} intro={node.intro} />

      {(display === "mixed" || display === "overview") && children.length > 0 && (
        <section aria-label={`Onderverdeling van ${node.name}`} className="mt-6">
          <SubcategoryStrip items={await stripData(children)} />
        </section>
      )}

      {display === "products" && siblings.length > 1 && (
        <section aria-label="Verwante categorieën" className="mt-6">
          <SubcategoryStrip items={await stripData(siblings)} activeHref={routes.category(node)} />
        </section>
      )}

      <section aria-label={`Producten in ${node.name}`} className="mt-6">
        <Suspense>
          <ProductListing items={products} promo={promo} />
        </Suspense>
      </section>
    </div>
  );
}
