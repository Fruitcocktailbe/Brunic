"use client";

import { useState } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { FavorietKnop } from "@/components/favoriet-knop";
import { formatPrijs } from "@/lib/format";
import type { Variant } from "@/lib/shopify/types";

function maatLabel(v: Variant): string {
  return v.selectedOptions.find((o) => o.name === "Maat")?.value ?? v.title;
}

export function MaatKiezer({
  variants,
  etalage,
  handle,
  titel,
}: {
  variants: Variant[];
  etalage: boolean;
  handle: string;
  titel: string;
}) {
  const [gekozenId, setGekozenId] = useState<string>(
    () => variants.find((v) => v.availableForSale)?.id ?? variants[0]?.id ?? "",
  );

  const gekozen = variants.find((v) => v.id === gekozenId) ?? variants[0];
  if (!gekozen) return null;

  const breedte = gekozen.breedte?.value;
  const lengte = gekozen.lengte?.value;

  return (
    <div className="mt-6">
      <fieldset>
        <legend className="font-display text-lg">Kies uw maat</legend>
        <p className="mb-3 text-sm text-ink-soft">
          Onze tapijten komen in vaste handelsmaten. Past geen enkele maat? Wij maken ook op maat.
        </p>

        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const actief = v.id === gekozen.id;
            return (
              <label
                key={v.id}
                className={`cursor-pointer rounded-s border px-4 py-2 text-sm transition ${
                  actief
                    ? "border-brand bg-brand font-bold text-white"
                    : "border-line-strong hover:border-brand hover:text-brand-text"
                }`}
              >
                <input
                  type="radio"
                  name="maat"
                  value={v.id}
                  checked={actief}
                  onChange={() => setGekozenId(v.id)}
                  className="sr-only-focusable absolute"
                />
                {maatLabel(v)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {breedte && lengte ? (
        <p className="mt-4 text-sm text-ink-soft">
          Gekozen: <strong className="text-ink">{breedte} × {lengte} cm</strong>
          {gekozen.sku ? (
            <>
              {" · "}artikelnummer{" "}
              <span className="rounded-[4px] bg-geel px-2 py-0.5 font-bold text-ink">
                {gekozen.sku}
              </span>
            </>
          ) : null}
        </p>
      ) : null}

      {etalage ? (
        <div className="mt-6 rounded-m border border-line bg-ivory-2 p-5">
          <p className="font-display text-xl">Prijs op aanvraag</p>
          <p className="mt-1 text-sm text-ink-soft">
            Dit stuk verkopen we in de winkel, met advies. Bewaar het op uw winkellijst of laat ons
            gratis bij u langskomen.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/opmeting"
              className="rounded-s bg-brand px-6 py-3 font-bold text-white transition hover:bg-brand-deep"
            >
              Plan een gratis opmeting
            </a>
            {/* variantId meesturen: het ERP-artikelnummer hangt aan de maat, niet aan het product */}
            <FavorietKnop handle={handle} titel={titel} variantId={gekozen.id} variant="knop" />
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="font-body text-3xl font-extrabold">{formatPrijs(gekozen.price.amount)}</p>
          <p className="mt-1 text-sm text-groen">
            {gekozen.availableForSale ? "Op voorraad · gratis levering in de regio" : "Op aanvraag"}
          </p>
          <AddToCart variantId={gekozen.id} beschikbaar={gekozen.availableForSale} />
          <div className="mt-3">
            <FavorietKnop handle={handle} titel={titel} variantId={gekozen.id} variant="knop" />
          </div>
        </div>
      )}
    </div>
  );
}
