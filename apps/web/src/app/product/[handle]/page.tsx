import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { storefront } from "@/lib/shopify/client";
import { isSysteemCollectie } from "@/lib/shopify/collection";
import { PRODUCT_QUERY, TOP_PRODUCT_HANDLES_QUERY } from "@/lib/shopify/queries";
import { categoriePad } from "@/lib/shopify/taxonomie";
import { isEtalage, type Product } from "@/lib/shopify/types";

export const revalidate = 3600;
export const dynamicParams = true; // ~13.9k producten: rest rendert on-demand

type Params = { handle: string };

/** Alleen de topproducten prerenderen — 14k pagina's prebuilden kost buildminuten. */
export async function generateStaticParams(): Promise<Params[]> {
  const data = await storefront<{ products: { nodes: { handle: string }[] } }>(
    TOP_PRODUCT_HANDLES_QUERY,
    { first: 20 },
  );
  return data.products.nodes.map((p) => ({ handle: p.handle }));
}

async function fetchProduct(handle: string) {
  const data = await storefront<{ product: Product | null }>(PRODUCT_QUERY, { handle });
  return data.product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await fetchProduct(handle);
  if (!product) return {};

  return {
    title: product.title,
    description: product.descriptionHtml.replace(/<[^>]+>/g, "").slice(0, 155),
    // ?variant= is een weergavekeuze op dezelfde pagina
    alternates: { canonical: `/product/${handle}` },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { handle } = await params;
  const product = await fetchProduct(handle);
  if (!product) notFound();

  const etalage = isEtalage(product);
  const v = (await searchParams).variant;
  const startVariantId = Array.isArray(v) ? v[0] : v;
  // Het kruimelpad volgt de échte collecties van het product: zit het in een subcategorie,
  // dan wordt het Home › Behang › Effen › product.
  const kruimels = categoriePad(
    product.collections.nodes.filter((c) => !isSysteemCollectie(c.handle)),
  );

  return (
    <div className="mx-auto max-w-(--container-brunic) px-6 py-10">
      <nav aria-label="Kruimelpad" className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-text">
          Home
        </Link>
        {kruimels.map((kruimel) => (
          <span key={kruimel.href}>
            <span className="mx-2">/</span>
            <Link href={kruimel.href} className="hover:text-brand-text">
              {kruimel.label}
            </Link>
          </span>
        ))}
        <span className="mx-2">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>

      <ProductDetail product={product} etalage={etalage} startVariantId={startVariantId} />

      <p className="mt-8 border-t border-line pt-4 text-sm text-ink-soft">
        Twijfelt u over de maat? Onze mensen meten bij u thuis op —{" "}
        <Link href="/opmeting" className="font-bold text-brand-text hover:underline">
          plan een opmeting
        </Link>
        .
      </p>
    </div>
  );
}
