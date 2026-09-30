"use client";

import Link from "next/link";
import { Suspense, useState, type ReactNode } from "react";
import { useCart, useWishlist } from "@/lib/store/stores";
import { useProducts } from "@/lib/store/use-products";
import { routes } from "@/lib/routes";
import { SITE } from "@/lib/site/config";
import { AVAILABILITY_LABEL, formatMoney, formatQuantity, lineTotal, UNIT_NAME, UNIT_SUFFIX } from "@/lib/catalog/product";
import { ImageSlot } from "@/components/ui/image-slot";
import { Icon } from "@/components/ui/icon";
import { QuantityInput } from "@/components/product/quantity-input";
import { SearchBox } from "@/components/layout/search-box";
import { RecentlyViewed } from "./recently-viewed";

/**
 * Winkelmand: regels uit de lokale opslag, prijzen altijd vers uit de catalogus.
 * "Afrekenen" maakt een Shopify-cart aan (/api/kassa, met controle op etalage/prijs) en
 * stuurt door naar de beveiligde Shopify-kassa.
 */
export function CartView({ departments }: { departments: ReactNode }) {
  const cart = useCart();
  const wish = useWishlist();
  const { map, loading } = useProducts(cart.lines.map((l) => l.productId));
  const [bezig, setBezig] = useState(false);
  const [kassaFout, setKassaFout] = useState("");

  const afrekenen = async () => {
    setBezig(true);
    setKassaFout("");
    try {
      const res = await fetch("/api/kassa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: cart.lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })) }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setKassaFout(data.error ?? "Afrekenen lukte niet.");
    } catch {
      setKassaFout(`Afrekenen lukte niet. Probeer opnieuw of bel ons op ${SITE.phone.display}.`);
    }
    setBezig(false);
  };

  if (!cart.hydrated || (loading && cart.lines.length > 0)) {
    return <p className="py-20 text-center text-ink-60">Uw winkelmand wordt geladen…</p>;
  }

  const rows = cart.lines.map((line) => {
    const p = map.get(line.productId);
    const v = p?.variants.find((x) => x.id === line.variantId);
    return { line, p, v };
  });
  const valid = rows.filter((r) => r.p && r.v?.price);
  // Elke regel eerst afronden op de cent, dan optellen (in centen, zonder zwevendekommafouten).
  const subtotal = valid.reduce((cents, r) => cents + Math.round(lineTotal(r.v!.price!.amount.amount, r.line.quantity) * 100), 0) / 100;
  const savings =
    valid.reduce((cents, r) => {
      const p = r.v!.price!;
      return cents + Math.round((lineTotal(p.compareAt?.amount ?? p.amount.amount, r.line.quantity) - lineTotal(p.amount.amount, r.line.quantity)) * 100);
    }, 0) / 100;

  if (cart.lines.length === 0) {
    return (
      <div>
        <section aria-labelledby="leeg-titel" className="relative overflow-hidden rounded-[4px] bg-[linear-gradient(100deg,#f7b3b8_0%,#f06a6f_45%,#e21f1d_100%)] px-6 py-10 md:px-10">
          <h1 id="leeg-titel" className="font-display text-[32px] font-semibold leading-tight md:text-[40px]">
            Uw winkelmand is leeg
          </h1>
          <p className="mt-3 max-w-md text-[14px]">
            Veel van ons assortiment is maatwerk met een prijs op aanvraag. Bewaar wat u mooi vindt op uw verlanglijst en vraag er in één keer een offerte voor aan.
          </p>
          <Link href={routes.wishlist()} className="btn btn-primary btn-sm mt-5">
            Naar mijn verlanglijst
          </Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mascotte.png" alt="" className="absolute bottom-0 right-[12%] hidden h-full w-auto py-1 md:block" />
        </section>

        <h2 className="mt-10 text-[15px] font-semibold">Vind wat u zoekt</h2>
        <div className="mt-4">
          <Suspense>
            <SearchBox />
          </Suspense>
        </div>

        <RecentlyViewed className="mt-10" />

        <h2 className="section-title mt-16">Welkom in onze afdelingen</h2>
        <p className="mt-3 text-center text-base text-ink-80">Stoffen, behang, vloeren en tapijten — met het advies van onze winkel in Ninove.</p>
        <div className="mt-8">{departments}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-[34px] leading-tight lg:text-[40px]">Uw winkelmand</h1>
        <Link href={routes.catalog()} className="inline-flex items-center gap-1.5 text-[14px] font-medium underline underline-offset-2">
          <Icon name="chevronLeft" size={16} /> Verder winkelen
        </Link>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ul role="list" className="divide-y divide-line border-y border-line">
          {rows.map(({ line, p, v }) => {
            if (!p || !v) {
              return (
                <li key={line.variantId} className="flex items-center justify-between gap-4 py-5 text-ink-60">
                  Dit product is niet meer beschikbaar.
                  <button type="button" onClick={() => cart.remove(line.variantId)} className="btn btn-outline btn-sm">
                    Verwijderen
                  </button>
                </li>
              );
            }
            const unit = v.price?.unit ?? p.unit;
            const total = lineTotal(v.price?.amount.amount ?? 0, line.quantity);
            return (
              <li key={line.variantId} className="grid grid-cols-[88px_1fr] gap-4 py-5 sm:grid-cols-[120px_1fr]">
                <Link href={routes.product(p.card.slug, v.id)} tabIndex={-1} aria-label={p.card.title}>
                  <ImageSlot src={p.card.image?.src} alt="" className="aspect-square w-full rounded-2xl" />
                </Link>
                <div className="min-w-0">
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink-60">{p.card.brand ?? "Brunic"}</p>
                      <Link href={routes.product(p.card.slug, v.id)} className="font-medium hover:underline">
                        {p.card.title}
                      </Link>
                      {p.variants.length > 1 && <p className="text-[13px] text-ink-60">{v.label}</p>}
                      <p className="text-[12px] text-ink-60">Art.nr. {v.sku}</p>
                    </div>
                    <p className="text-right font-semibold" aria-label={`Regeltotaal ${formatMoney(total)}`}>
                      {formatMoney(total)}
                    </p>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-80">
                    {v.price && (
                      <>
                        {formatMoney(v.price.amount.amount)} {UNIT_SUFFIX[unit] || "/ stuk"}
                        {v.price.compareAt && <s className="ml-2 text-ink-60">{formatMoney(v.price.compareAt.amount)}</s>}
                      </>
                    )}
                    <span className={`ml-3 ${v.availability === "op-voorraad" ? "text-success" : v.availability === "uitverkocht" ? "text-brand-dark" : "text-warning"}`}>
                      {AVAILABILITY_LABEL[v.availability]}
                    </span>
                  </p>
                  {v.availability === "uitverkocht" && <p className="mt-1 text-[13px] text-brand-dark">Deze uitvoering is intussen uitverkocht — kies een andere of verwijder ze.</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <QuantityInput unit={unit} rule={p.quantity} value={line.quantity} onChange={(q) => cart.setQuantity(line.variantId, q)} compact />
                    <span className="text-[13px] text-ink-60">
                      {formatQuantity(line.quantity)} {line.quantity === 1 ? UNIT_NAME[unit].one : UNIT_NAME[unit].many}
                    </span>
                    <div className="ml-auto flex gap-1">
                      {!wish.has(p.card.id) && (
                        <button
                          type="button"
                          onClick={() => {
                            wish.toggle(p.card.id, v.id);
                            cart.remove(line.variantId);
                          }}
                          className="flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13px] hover:bg-mist"
                        >
                          <Icon name="heart" size={18} /> Naar verlanglijst
                        </button>
                      )}
                      <button type="button" onClick={() => cart.remove(line.variantId)} className="flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13px] hover:bg-mist" aria-label={`${p.card.title} verwijderen`}>
                        <Icon name="trash" size={18} /> Verwijderen
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside aria-labelledby="overzicht-titel" className="self-start rounded-[var(--radius-tile)] border border-line p-5 lg:sticky lg:top-6">
          <h2 id="overzicht-titel" className="text-lg font-semibold">
            Overzicht
          </h2>
          <dl className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between">
              <dt>Subtotaal ({cart.lines.length} {cart.lines.length === 1 ? "artikel" : "artikels"})</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
            {savings > 0.001 && (
              <div className="flex justify-between text-attention">
                <dt>U bespaart</dt>
                <dd>− {formatMoney(savings)}</dd>
              </div>
            )}
            <div className="flex justify-between text-ink-60">
              <dt>Levering of afhalen</dt>
              <dd>Kiest u bij het afrekenen</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
              <dt>Subtotaal (incl. btw)</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
          </dl>
          <button type="button" onClick={afrekenen} disabled={bezig} className="btn btn-primary mt-5 w-full">
            {bezig ? "Even geduld…" : "Veilig afrekenen"}
          </button>
          {kassaFout && (
            <p role="alert" className="mt-3 text-[13px] text-brand-dark">
              {kassaFout}
            </p>
          )}
          <p className="mt-3 text-[12px] text-ink-60">U rondt uw bestelling af in de beveiligde kassa van onze webshop (Shopify).</p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Alle producten uit uw winkelmand verwijderen?")) cart.clear();
            }}
            className="mt-4 text-[13px] underline underline-offset-2"
          >
            Winkelmand leegmaken
          </button>
        </aside>
      </div>

      <RecentlyViewed className="mt-14" />
    </div>
  );
}
