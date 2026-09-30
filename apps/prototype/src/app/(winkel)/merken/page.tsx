import type { Metadata } from "next";
import { getBrands } from "@/lib/catalog/brands";
import { productCount } from "@/lib/catalog/product";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CategoryHeader } from "@/components/catalog/category-header";
import { BrandTile } from "@/components/catalog/brand-tile";

export const metadata: Metadata = {
  title: "Onze merken",
  description: "De merken van Brunic: gordijnstoffen, behang, vasttapijt en tapijten van onze vaste leveranciers.",
  alternates: { canonical: routes.brands() },
};

/** Alle merken (leveranciers) uit de catalogus, met een sfeerfoto uit hun eigen collectie. */
export default async function BrandsPage() {
  const brands = await getBrands();
  return (
    <div className="shell-inset">
      <Breadcrumbs items={[{ label: "Merken" }]} />
      <CategoryHeader
        title="Onze merken"
        intro="Wij werken met leveranciers die we al jaren kennen en vertrouwen. Hieronder vindt u hun collecties in onze webshop; veel stalen en stalenboeken kunt u ook in de winkel in Ninove bekijken."
      />
      <ul role="list" className="mt-6 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((b, i) => (
          <li key={b.slug}>
            <BrandTile href={routes.brand(b.slug)} name={b.name} image={b.image} logo={b.logo} tone={i} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="aspect-[4/5]" />
            <p className="mt-2 px-1 text-[13px] text-ink-60">
              {b.types.join(" · ")} · {productCount(b.count)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
