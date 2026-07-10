import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MaatKiezer } from "@/components/maat-kiezer";
import { beeldloosWoord } from "@/lib/format";
import { storefront } from "@/lib/shopify/client";
import { PRODUCT_QUERY, TOP_PRODUCT_HANDLES_QUERY } from "@/lib/shopify/queries";
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
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { handle } = await params;
  const product = await fetchProduct(handle);
  if (!product) notFound();

  const etalage = isEtalage(product);
  const beelden = product.images.nodes;

  const specs = [
    ["Materiaal", product.materiaal?.value],
    ["Kleurfamilie", product.kleurfamilie?.value],
    ["Poolklasse", product.poolklasse?.value],
    ["Collectie", product.erpFamilie?.value],
  ].filter(([, v]) => Boolean(v)) as [string, string][];

  return (
    <div className="mx-auto max-w-(--container-brunic) px-6 py-10">
      <nav aria-label="Kruimelpad" className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-brand-text">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/tapijten-karpetten" className="hover:text-brand-text">
          Tapijten &amp; karpetten
        </Link>
        <span className="mx-2">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Beeld — of de ontworpen beeldloze staat */}
        <div>
          {beelden.length > 0 ? (
            <div className="grid gap-3">
              <div className="relative aspect-[4/3.4] overflow-hidden rounded-m border border-line bg-ivory-2">
                <Image
                  src={beelden[0].url}
                  alt={beelden[0].altText ?? product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {beelden.length > 1 ? (
                <ul className="grid grid-cols-4 gap-3">
                  {beelden.slice(1, 5).map((b) => (
                    <li
                      key={b.url}
                      className="relative aspect-square overflow-hidden rounded-s border border-line bg-ivory-2"
                    >
                      <Image
                        src={b.url}
                        alt={b.altText ?? ""}
                        fill
                        sizes="15vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <div className="stripes-red flex aspect-[4/3.4] flex-col justify-between rounded-m border border-line bg-ivory-2 p-8">
              <span className="font-display text-5xl font-semibold italic text-brand">
                {beeldloosWoord(product.title)}
              </span>
              <span className="self-start border-t-2 border-brand pt-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                Fotoreportage volgt — dit stuk staat in de winkel
              </span>
            </div>
          )}
        </div>

        {/* Koopblok */}
        <div>
          {etalage ? (
            <p className="mb-2 inline-block rounded-[4px] bg-geel px-2 py-1 text-xs font-extrabold uppercase tracking-[0.09em] text-ink">
              Uit de winkelcollectie
            </p>
          ) : null}

          <h1 className="text-4xl">{product.title}</h1>

          {specs.length > 0 ? (
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
              {specs.map(([k, v]) => (
                <div key={k} className="flex gap-1">
                  <dt>{k}:</dt>
                  <dd className="font-bold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div
            className="mt-5 max-w-[62ch] text-ink-soft [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          <MaatKiezer
            variants={product.variants.nodes}
            etalage={etalage}
            handle={product.handle}
            titel={product.title}
          />

          <p className="mt-8 border-t border-line pt-4 text-sm text-ink-soft">
            Twijfelt u over de maat? Onze mensen meten gratis bij u thuis op —{" "}
            <Link href="/opmeting" className="font-bold text-brand-text hover:underline">
              plan een opmeting
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
