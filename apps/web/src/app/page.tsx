import Image from "next/image";
import Link from "next/link";
import {
  Atelier,
  Categorietegels,
  Kicker,
  OpmetingPaneel,
  Reviews,
  UspBand,
} from "@/components/home-secties";
import { ProductCard } from "@/components/product-card";
import { getCollection, IN_DE_KIJKER } from "@/lib/shopify/collection";

export const revalidate = 3600;

/** Door Brunic gecureerd in de admin (collectie 'in-de-kijker', sortOrder MANUAL). */
async function InDeKijker() {
  const collection = await getCollection(IN_DE_KIJKER).catch(() => null);
  const producten = collection?.products.nodes ?? [];
  if (producten.length === 0) return null;

  return (
    <section className="border-t border-line bg-ivory-2">
      <div className="mx-auto max-w-(--container-brunic) px-6 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>In de kijker</Kicker>
            <h2 className="text-3xl">Door ons geselecteerd</h2>
          </div>
          <Link href="/tapijten-karpetten" className="font-bold text-brand-text underline-offset-4 hover:underline">
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
      {/* HERO — gordijnen & stoffen, dé held (design-brief §4) */}
      <section className="mx-auto grid max-w-(--container-brunic) items-center gap-10 px-6 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-16">
        <div>
          <Kicker>Al 40 jaar in Ninove</Kicker>
          <h1 className="text-4xl sm:text-5xl">
            Gordijnen op maat,{" "}
            <em className="font-medium not-italic text-brand">genaaid in ons eigen atelier.</em>
          </h1>
          <p className="mt-4 max-w-[46ch] text-lg text-ink-soft">
            Van stofkeuze tot plaatsing: onze eigen stiksters maken uw gordijnen zoals het hoort. U
            kiest, wij meten op —{" "}
            <span className="bg-gradient-to-t from-geel from-[6%] to-transparent to-[6%] px-0.5 font-medium text-ink">
              bij u thuis, gratis bij aankoop
            </span>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/opmeting" className="rounded-s bg-brand px-7 py-4 text-lg font-bold text-white transition hover:bg-brand-deep">
              Plan een opmeting
            </Link>
            <Link href="/tapijten-karpetten" className="rounded-s border-2 border-ink px-7 py-4 text-lg font-bold transition hover:bg-ink hover:text-ivory">
              Bekijk de collectie
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.4" className="flex-none text-groen" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Geen agenda-gedoe: u beschrijft uw project, wij bellen u binnen 1–2 werkdagen.
          </p>
        </div>

        {/* Echte Brunic-stoffoto's (brunic.be); unoptimized want extern, geen Shopify-CDN. */}
        <div className="relative pb-12 pr-4 pl-0 pt-4">
          <div className="stripes-light absolute inset-y-6 left-10 right-0 rounded-m bg-brand" aria-hidden="true" />
          <Image
            src="https://brunic.be/wp-content/uploads/2021/09/2363571218-1.jpg"
            alt="Gordijnstof Ibis in grijs, soepel gedrapeerd"
            width={640}
            height={512}
            unoptimized
            priority
            className="relative aspect-[4/3.2] w-full rounded-m object-cover shadow-l"
          />
          <Image
            src="https://brunic.be/wp-content/uploads/2021/09/2337922934-1.jpg"
            alt="Bedrukte black-out stof in detail"
            width={220}
            height={220}
            unoptimized
            className="absolute -left-4 bottom-0 aspect-square w-[38%] rounded-s border-[5px] border-ivory object-cover shadow-m"
          />
          <span className="absolute right-1 top-1 z-10 rounded-[4px] bg-geel px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.09em] text-ink shadow-s">
            Uit eigen atelier
          </span>
        </div>
      </section>

      <UspBand />
      <Categorietegels />
      <Atelier />
      <InDeKijker />
      <OpmetingPaneel />
      <Reviews />
    </>
  );
}
