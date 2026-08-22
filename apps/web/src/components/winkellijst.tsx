"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFavorieten } from "@/lib/favorieten/store";
import { beeldloosWoord, formatPrijs } from "@/lib/format";

type FavVariant = {
  id: string;
  title: string;
  sku: string | null;
  price: { amount: string };
  breedte: { value: string } | null;
  lengte: { value: string } | null;
};

type FavProduct = {
  handle: string;
  title: string;
  productType: string;
  etalage: { value: string } | null;
  featuredImage: { url: string; altText: string | null } | null;
  variants: { nodes: FavVariant[] };
};

export function Winkellijst() {
  const { lijst, geladen, verwijder, kiesVariant } = useFavorieten();
  const [producten, setProducten] = useState<FavProduct[]>([]);
  const [bezig, setBezig] = useState(true);

  const handles = lijst.map((f) => f.handle).join(",");

  useEffect(() => {
    if (!geladen) return;
    const hs = handles ? handles.split(",") : [];
    if (hs.length === 0) {
      setProducten([]);
      setBezig(false);
      return;
    }

    let afgebroken = false;
    setBezig(true);
    fetch("/api/favorieten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handles: hs }),
    })
      .then((r) => (r.ok ? r.json() : { producten: [] }))
      .then((d: { producten: FavProduct[] }) => {
        if (!afgebroken) setProducten(d.producten ?? []);
      })
      .catch(() => {
        if (!afgebroken) setProducten([]);
      })
      .finally(() => !afgebroken && setBezig(false));

    return () => {
      afgebroken = true;
    };
  }, [handles, geladen]);

  if (!geladen || bezig) {
    return <p className="text-ink-soft">Uw winkellijst wordt geladen…</p>;
  }

  if (producten.length === 0) {
    return (
      <div className="rounded-m border border-dashed border-line bg-white p-12 text-center">
        <h2 className="font-display text-2xl">Nog geen favorieten</h2>
        <p className="mx-auto mt-2 max-w-[42ch] text-ink-soft">
          Blader door de collectie en tik op het hartje om producten te bewaren — daarna maakt u
          hier uw meeneemdocument.
        </p>
        <Link
          href="/tapijten"
          className="mt-6 inline-block rounded-s bg-brand px-6 py-3 font-bold text-white transition hover:bg-brand-deep"
        >
          Bekijk de collectie
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_.85fr] lg:items-start">
      {/* HET MEENEEMDOCUMENT */}
      <div id="meeneemdoc" className="overflow-hidden rounded-m border border-line bg-white shadow-s">
        <div className="flex items-start justify-between gap-4 border-b-[3px] border-ink p-6">
          <p className="font-display text-2xl font-bold">
            BRUNIC<span className="text-brand">.</span>
            <span className="mt-1 block font-body text-[0.62rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
              Meeneemdocument · winkellijst
            </span>
          </p>
          <div className="text-right text-sm text-ink-soft">
            <strong className="block font-display text-base text-ink">Uw selectie</strong>
            <span>Ring-West 19, 9400 Ninove · 054 33 73 52</span>
          </div>
        </div>

        <ul>
          {producten.map((p) => {
            const fav = lijst.find((f) => f.handle === p.handle);
            const varianten = p.variants.nodes;
            const gekozen = varianten.find((v) => v.id === fav?.variantId) ?? (varianten.length === 1 ? varianten[0] : undefined);
            const etalage = p.etalage?.value === "true";

            return (
              <li key={p.handle} className="flex flex-wrap items-center gap-4 border-b border-line p-4 last:border-b-0">
                <span className="relative h-24 w-24 flex-none overflow-hidden rounded-s border border-line bg-ivory-2">
                  {p.featuredImage ? (
                    <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} fill sizes="96px" className="object-cover" />
                  ) : (
                    <span className="stripes-red grid h-full w-full place-items-center font-display text-lg font-semibold italic text-brand">
                      {beeldloosWoord(p.title)}
                    </span>
                  )}
                </span>

                <div className="min-w-52 flex-1">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-brand-text">
                    {p.productType || "Product"}
                  </p>
                  <Link href={`/product/${p.handle}`} className="font-display text-lg hover:text-brand-text">
                    {p.title}
                  </Link>

                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
                    {gekozen?.sku ? (
                      <span className="whitespace-nowrap rounded-[4px] bg-geel px-2 py-0.5 font-extrabold text-ink">
                        Art. {gekozen.sku}
                      </span>
                    ) : null}

                    {gekozen?.breedte?.value && gekozen?.lengte?.value ? (
                      <span>
                        {gekozen.breedte.value} × {gekozen.lengte.value} cm
                      </span>
                    ) : null}
                  </p>

                  {/* Zonder maat is er geen artikelnummer — dus laat de bezoeker hier kiezen. */}
                  {!gekozen && varianten.length > 1 ? (
                    <label className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold">Kies uw maat</span>
                      <select
                        defaultValue=""
                        onChange={(e) => e.target.value && kiesVariant(p.handle, e.target.value)}
                        className="rounded-s border-[1.5px] border-line-strong bg-ivory px-2 py-1"
                      >
                        <option value="" disabled>
                          Maat kiezen…
                        </option>
                        {varianten.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.title}
                          </option>
                        ))}
                      </select>
                      <span className="text-ink-soft">→ dan verschijnt het artikelnummer</span>
                    </label>
                  ) : null}
                </div>

                <p className="w-28 text-right font-body text-lg font-extrabold">
                  {etalage || !gekozen ? (
                    <span className="text-sm font-bold text-brand-text">Op aanvraag</span>
                  ) : (
                    formatPrijs(gekozen.price.amount)
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => verwijder(p.handle)}
                  className="fav-verwijder text-sm text-ink-soft underline hover:text-brand-text"
                >
                  Verwijderen
                </button>
              </li>
            );
          })}
        </ul>

        <p className="border-t border-line bg-ivory-2 p-4 text-sm text-ink-soft">
          Toon dit document — of gewoon de artikelnummers — aan de toonbank. Sandra vindt elk stuk
          meteen terug. Producten <b className="text-ink">op maat</b> tonen geen webprijs: die volgt
          na opmeting.
        </p>
      </div>

      {/* ACTIES */}
      <aside className="fav-acties grid gap-5 lg:sticky lg:top-6">
        <div className="on-red stripes-light rounded-m bg-brand-deep p-6 text-white">
          <h2 className="font-display text-xl text-white">Liever eerst advies?</h2>
          <p className="mt-1 text-sm" style={{ color: "#FFE3E0" }}>
            Onze mensen komen gratis bij u langs, meten op en adviseren — vrijblijvend.
          </p>
          <Link
            href="/opmeting"
            className="mt-4 block rounded-s bg-white px-6 py-3 text-center font-bold text-brand transition hover:bg-geel hover:text-ink"
          >
            Plan een gratis opmeting
          </Link>
        </div>

        <div className="rounded-m border border-line bg-white p-6">
          <h2 className="font-display text-xl">Naar de winkel</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Print uw lijst of bewaar hem als PDF, en neem hem mee.
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-4 w-full rounded-s border-2 border-ink px-6 py-3 font-bold transition hover:bg-ink hover:text-ivory"
          >
            Print of bewaar als PDF
          </button>
        </div>
      </aside>
    </div>
  );
}
