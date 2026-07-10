import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getCollection, IN_DE_KIJKER } from "@/lib/shopify/collection";

export const revalidate = 3600;

/**
 * "In de kijker" wordt volledig in de Shopify-admin beheerd: Brunic voegt producten toe,
 * verwijdert ze en sleept de volgorde (de collectie staat op sortOrder MANUAL).
 * Is de collectie leeg of verwijderd, dan verdwijnt de sectie gewoon — geen lege kop.
 */
async function InDeKijker() {
  const collection = await getCollection(IN_DE_KIJKER).catch(() => null);
  const producten = collection?.products.nodes ?? [];
  if (producten.length === 0) return null;

  return (
    <section className="border-t border-line bg-ivory-2">
      <div className="mx-auto max-w-(--container-brunic) px-6 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 flex items-center gap-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-brand-text">
              <span className="h-[3px] w-[26px] rounded-[2px] bg-brand" />
              In de kijker
            </p>
            <h2 className="text-3xl">Door ons geselecteerd</h2>
          </div>
          <Link
            href="/tapijten-karpetten"
            className="font-bold text-brand-text underline-offset-4 hover:underline"
          >
            Bekijk de volledige collectie →
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {producten.slice(0, 4).map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-(--container-brunic) px-6 py-16">
        <p className="mb-3 flex items-center gap-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-brand-text">
          <span className="h-[3px] w-[26px] rounded-[2px] bg-brand" />
          Al 40 jaar in Ninove
        </p>

        <h1 className="max-w-[18ch] text-5xl">
          Vakmanschap uit <em className="font-medium not-italic text-brand">eigen atelier</em>
        </h1>

        <p className="mt-4 max-w-[46ch] text-lg text-ink-soft">
          Gordijnen op maat, raamdecoratie, vloeren en tapijten — met advies, gratis opmeting en
          plaatsing aan huis.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/opmeting"
            className="rounded-s bg-brand px-7 py-4 text-lg font-bold text-white transition hover:bg-brand-deep"
          >
            Plan een gratis opmeting
          </Link>
          <Link
            href="/tapijten-karpetten"
            className="rounded-s border-2 border-ink px-7 py-4 text-lg font-bold transition hover:bg-ink hover:text-ivory"
          >
            Bekijk de tapijten
          </Link>
        </div>
      </section>

      <InDeKijker />

      <div className="mx-auto max-w-(--container-brunic) px-6 py-10">
        <p className="max-w-[62ch] rounded-m border border-dashed border-line bg-white p-5 text-sm text-ink-soft">
          <strong className="text-ink">Bouwnotitie.</strong> De volledige homepage (hero met
          atelierbeeld, USP-band, categorietegels, reviews) is ontworpen in{" "}
          <code>design/richting-a/home.html</code> en volgt in een aparte ronde. De sectie{" "}
          <strong>In de kijker</strong> hierboven is al echt: ze leest de gelijknamige
          Shopify-collectie, die Brunic zelf beheert.
        </p>
      </div>
    </>
  );
}
