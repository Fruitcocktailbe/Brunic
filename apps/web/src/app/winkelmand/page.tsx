import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { verwijderUitMand, wijzigRegel } from "@/lib/cart/actions";
import { getCart } from "@/lib/cart/cart";
import { formatPrijs } from "@/lib/format";

// Leest de cart-cookie.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Winkelmand",
  robots: { index: false, follow: false },
};

export default async function WinkelmandPage() {
  const cart = await getCart();
  const regels = cart?.lines.nodes ?? [];

  if (regels.length === 0) {
    return (
      <div className="mx-auto max-w-(--container-brunic) px-6 py-16">
        <h1 className="text-4xl">Uw winkelmand</h1>
        <p className="mt-4 max-w-[52ch] text-ink-soft">
          Uw winkelmand is leeg. Veel van ons aanbod verkopen we in de winkel, met advies — en
          gordijnen maken we op maat in het eigen atelier.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/tapijten"
            className="rounded-s bg-brand px-6 py-3 font-bold text-white transition hover:bg-brand-deep"
          >
            Bekijk de tapijten
          </Link>
          <Link
            href="/opmeting"
            className="rounded-s border-2 border-ink px-6 py-3 font-bold transition hover:bg-ink hover:text-ivory"
          >
            Plan een gratis opmeting
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-(--container-brunic) px-6 py-10">
      <h1 className="text-4xl">Uw winkelmand</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <ul className="divide-y divide-line rounded-m border border-line bg-white">
          {regels.map((regel) => {
            const v = regel.merchandise;
            const maat = v.selectedOptions.find((o) => o.name === "Maat")?.value;

            return (
              <li key={regel.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="relative h-24 w-24 flex-none overflow-hidden rounded-s border border-line bg-ivory-2">
                  {v.product.featuredImage ? (
                    <Image
                      src={v.product.featuredImage.url}
                      alt={v.product.featuredImage.altText ?? v.product.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="stripes-red block h-full w-full" aria-hidden="true" />
                  )}
                </div>

                <div className="min-w-48 flex-1">
                  <Link
                    href={`/product/${v.product.handle}`}
                    className="font-display text-lg hover:text-brand-text"
                  >
                    {v.product.title}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    {maat ? <>Maat {maat}</> : null}
                    {v.sku ? <> · artikelnummer {v.sku}</> : null}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Stukprijs {formatPrijs(v.price.amount)}
                  </p>
                </div>

                {/* Werkt zonder JavaScript: gewone form-posts naar server actions. */}
                <form action={wijzigRegel} className="flex items-center gap-2">
                  <input type="hidden" name="lineId" value={regel.id} />
                  <label htmlFor={`aantal-${regel.id}`} className="text-sm text-ink-soft">
                    Aantal
                  </label>
                  <input
                    id={`aantal-${regel.id}`}
                    name="quantity"
                    type="number"
                    min={0}
                    max={20}
                    defaultValue={regel.quantity}
                    className="w-16 rounded-s border-[1.5px] border-line-strong bg-ivory px-2 py-1"
                  />
                  <button
                    type="submit"
                    className="rounded-s border border-line-strong px-3 py-1 text-sm font-bold hover:border-brand hover:text-brand-text"
                  >
                    Bijwerken
                  </button>
                </form>

                <p className="w-24 text-right font-body text-lg font-extrabold">
                  {formatPrijs(regel.cost.totalAmount.amount)}
                </p>

                <form action={verwijderUitMand}>
                  <input type="hidden" name="lineId" value={regel.id} />
                  <button
                    type="submit"
                    className="text-sm text-ink-soft underline hover:text-brand-text"
                  >
                    Verwijderen
                  </button>
                </form>
              </li>
            );
          })}
        </ul>

        <aside className="rounded-m border border-line bg-ivory-2 p-6 lg:sticky lg:top-6">
          <h2 className="font-display text-xl">Overzicht</h2>

          <dl className="mt-4 flex justify-between border-t border-line pt-4">
            <dt>Subtotaal</dt>
            <dd className="font-extrabold">{formatPrijs(cart!.cost.subtotalAmount.amount)}</dd>
          </dl>
          <p className="mt-1 text-xs text-ink-soft">
            Verzendkosten en btw worden in de volgende stap berekend.
          </p>

          {/* Shopify-hosted checkout (Basic-plan: enkel logo/kleur-branding). */}
          <a
            href={cart!.checkoutUrl}
            className="mt-5 block rounded-s bg-brand px-6 py-4 text-center text-lg font-bold text-white transition hover:bg-brand-deep"
          >
            Afrekenen
          </a>

          <p className="mt-3 text-xs text-ink-soft">
            U rekent veilig af bij Shopify. Liever afhalen? Kies <strong>click &amp; collect</strong>{" "}
            in de volgende stap.
          </p>
        </aside>
      </div>
    </div>
  );
}
