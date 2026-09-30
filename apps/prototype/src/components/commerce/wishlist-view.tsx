"use client";

import Link from "next/link";
import { useWishlist, useCart } from "@/lib/store/stores";
import { useProducts } from "@/lib/store/use-products";
import { routes } from "@/lib/routes";
import { SITE } from "@/lib/site/config";
import { ImageSlot } from "@/components/ui/image-slot";
import { Icon } from "@/components/ui/icon";
import { Price } from "@/components/catalog/price";
import { useCartUi } from "./cart-ui";
import { RecentlyViewed } from "./recently-viewed";

/** Verlanglijst (lokaal bewaard) — ook af te drukken als meeneemlijst voor een winkelbezoek. */
export function WishlistView() {
  const wish = useWishlist();
  const cart = useCart();
  const { announceAdded } = useCartUi();
  const ids = wish.items.map((i) => i.productId);
  const { map, loading } = useProducts(ids);

  if (!wish.hydrated || (loading && ids.length > 0)) {
    return <p className="py-20 text-center text-ink-60">Uw verlanglijst wordt geladen…</p>;
  }

  if (wish.items.length === 0) {
    return (
      <div>
        <div className="rounded-[var(--radius-tile)] bg-cloud px-6 py-14 text-center">
          <Icon name="heart" size={40} className="mx-auto text-ink-60" />
          <p className="mt-4 text-lg font-medium">Uw verlanglijst is nog leeg</p>
          <p className="mx-auto mt-1 max-w-md text-ink-80">Tik op het hartje bij een product om het hier te bewaren. Handig om thuis te vergelijken of mee te nemen naar de winkel.</p>
          <Link href={routes.catalog()} className="btn btn-primary mt-6">
            Ontdek de catalogus
          </Link>
        </div>
        <RecentlyViewed className="mt-14" />
      </div>
    );
  }

  return (
    <div>
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] text-ink-80">
          {wish.items.length} {wish.items.length === 1 ? "product" : "producten"} bewaard in deze browser
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={routes.quote({ wishlist: true })} className="btn btn-primary btn-sm">
            Offerte aanvragen voor deze lijst
          </Link>
          <button type="button" onClick={() => window.print()} className="btn btn-outline btn-sm">
            <Icon name="print" size={18} /> Afdrukken als winkellijst
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Alle producten van uw verlanglijst verwijderen?")) wish.clear();
            }}
            className="btn btn-outline btn-sm"
          >
            <Icon name="trash" size={18} /> Lijst leegmaken
          </button>
        </div>
      </div>

      <ul role="list" className="mt-6 divide-y divide-line border-y border-line">
        {wish.items.map((item) => {
          const p = map.get(item.productId);
          if (!p) {
            return (
              <li key={item.productId} className="flex items-center justify-between gap-4 py-5 text-ink-60">
                Dit product is niet meer beschikbaar.
                <button type="button" onClick={() => wish.remove(item.productId)} className="btn btn-outline btn-sm">
                  Verwijderen
                </button>
              </li>
            );
          }
          const v = p.variants.find((x) => x.id === item.variantId) ?? p.variants[0];
          const canAdd = p.pricing === "fixed" && v?.price && v.availability !== "uitverkocht";
          return (
            <li key={item.productId} className="grid grid-cols-[96px_1fr] gap-4 py-5 sm:grid-cols-[140px_1fr_auto] sm:items-center">
              <Link href={routes.product(p.card.slug, v?.id)} className="block" tabIndex={-1} aria-label={p.card.title}>
                <ImageSlot src={p.card.image?.src} alt="" className="aspect-square w-full rounded-2xl" />
              </Link>
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink-60">{p.card.brand ?? "Brunic"}</p>
                <Link href={routes.product(p.card.slug, v?.id)} className="mt-0.5 block font-medium hover:underline">
                  {p.card.title}
                </Link>
                {p.variants.length > 1 && v && <p className="mt-0.5 text-[13px] text-ink-60">{v.label}</p>}
                <Price price={v?.price ?? null} pricing={p.pricing} size="sm" className="mt-1.5" />
                <p className="mt-1 text-[12px] text-ink-60">Art.nr. {v?.sku}</p>
              </div>
              <div className="no-print col-span-2 flex flex-wrap gap-2 sm:col-span-1 sm:flex-col sm:items-stretch">
                {canAdd ? (
                  <button
                    type="button"
                    onClick={() => {
                      cart.add(p.card.id, v.id, p.quantity.min, p.quantity.max);
                      announceAdded({ title: p.card.title, image: p.card.image, variantLabel: p.variants.length > 1 ? v.label : undefined, quantity: p.quantity.min, price: v.price! });
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    In winkelmand
                  </button>
                ) : (
                  <Link href={p.pricing === "on-request" ? routes.quote({ product: p.card.slug, variant: v?.id }) : routes.product(p.card.slug, v?.id)} className="btn btn-outline btn-sm">
                    {p.pricing === "on-request" ? "Offerte aanvragen" : "Bekijk product"}
                  </Link>
                )}
                <button type="button" onClick={() => wish.remove(item.productId)} className="btn btn-outline btn-sm" aria-label={`Verwijderen: ${p.card.title}`}>
                  <Icon name="trash" size={16} /> Verwijderen
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 hidden text-[12px] print:block">
        {SITE.name} · {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city} · {SITE.phone.display} — toon deze lijst in de winkel, dan vinden wij uw keuze meteen terug.
      </p>
    </div>
  );
}
