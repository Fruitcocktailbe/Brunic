"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AddToCart } from "@/components/add-to-cart";
import { FavorietKnop } from "@/components/favoriet-knop";
import { beeldloosWoord, formatPrijs } from "@/lib/format";
import { type Product, type ShopImage, specsUit, type Variant, variantBeelden } from "@/lib/shopify/types";

/**
 * Productdetail: galerij + optiekiezer + koopblok. Werkt voor elk optiemodel — alleen Maat
 * (karpetten), Kleur (stoffen, behang), Kleur × Breedte (vasttapijt), Kleur × Maat
 * (vloerkleden) — en biedt enkel combinaties aan die als variant bestaan: een waarde die met
 * de huidige keuze niet bestaat is uitgeschakeld.
 *
 * De galerij volgt de gekozen uitvoering: `brunic.afbeeldingen` (alle foto's van die kleur/maat,
 * gezet door de leveranciersimport), anders de variantfoto; daarna de foto's die bij geen enkele
 * uitvoering horen (sfeerbeelden van het hele model).
 *
 * De keuze staat in de URL (?variant=<id>) zodat een gedeelde link dezelfde uitvoering toont.
 */
export function ProductDetail({
  product,
  etalage,
  startVariantId,
}: {
  product: Product;
  etalage: boolean;
  startVariantId?: string;
}) {
  const variants = product.variants.nodes;
  const [gekozenId, setGekozenId] = useState<string>(
    () =>
      variants.find((v) => startVariantId && v.id.endsWith(`/${startVariantId}`))?.id ??
      variants.find((v) => v.availableForSale)?.id ??
      variants[0]?.id ??
      "",
  );
  const gekozen = variants.find((v) => v.id === gekozenId) ?? variants[0];

  // opties met meer dan één waarde worden een kiezer; "Default Title" (geen opties) niet
  const opties = product.options.filter((o) => o.optionValues.length > 1);
  const waardeVan = (v: Variant, naam: string) => v.selectedOptions.find((o) => o.name === naam)?.value;

  function kies(naam: string, waarde: string) {
    const gewenst = new Map(gekozen?.selectedOptions.map((o) => [o.name, o.value]));
    gewenst.set(naam, waarde);
    // exacte combinatie, anders de eerste bestaande uitvoering met deze waarde
    const exact = variants.find((v) => v.selectedOptions.every((o) => gewenst.get(o.name) === o.value));
    const volgende = exact ?? variants.find((v) => waardeVan(v, naam) === waarde);
    if (!volgende) return;
    setGekozenId(volgende.id);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", volgende.id.split("/").pop() ?? "");
    window.history.replaceState(null, "", url.toString());
  }

  function bestaat(naam: string, waarde: string) {
    return variants.some(
      (v) =>
        waardeVan(v, naam) === waarde &&
        opties.every((o) => o.name === naam || waardeVan(v, o.name) === (gekozen && waardeVan(gekozen, o.name))),
    );
  }

  const beelden = useMemo(() => {
    const vanVariant = variantBeelden(gekozen);
    const inEenVariant = new Set(variants.flatMap((v) => variantBeelden(v).map((b) => b.url)));
    const algemeen = product.images.nodes.filter((b) => !inEenVariant.has(b.url));
    const lijst: ShopImage[] = vanVariant.length ? [...vanVariant, ...algemeen] : product.images.nodes;
    const uniek = new Map(lijst.map((b) => [b.url, b]));
    return [...uniek.values()].slice(0, 12);
  }, [gekozen, variants, product.images.nodes]);
  const [actiefBeeld, setActiefBeeld] = useState(0);
  const hoofd = beelden[Math.min(actiefBeeld, beelden.length - 1)];

  const specs = useMemo(() => {
    const basis = [
      ...specsUit(product.specificaties),
      ...(!product.specificaties?.value
        ? ([
            ["Materiaal", product.materiaal?.value],
            ["Kleurfamilie", product.kleurfamilie?.value],
            ["Poolklasse", product.poolklasse?.value],
            ["Collectie", product.erpFamilie?.value],
          ]
            .filter(([, w]) => Boolean(w))
            .map(([label, waarde]) => ({ label: label as string, waarde: waarde as string })))
        : []),
    ];
    // wat voor deze uitvoering afwijkt, vervangt de algemene waarde
    const afwijkend = specsUit(gekozen?.specificaties);
    const labels = new Set(afwijkend.map((s) => s.label));
    return [...basis.filter((s) => !labels.has(s.label)), ...afwijkend];
  }, [product, gekozen]);

  if (!gekozen) return null;
  const breedte = gekozen.breedte?.value;
  const lengte = gekozen.lengte?.value;
  const eenheid = product.verkoopEenheid?.value;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Beeld — of de ontworpen beeldloze staat */}
      <div>
        {hoofd ? (
          <div className="grid gap-3">
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-m border border-line bg-ivory-2">
              <Image
                key={hoofd.url}
                src={hoofd.url}
                alt={hoofd.altText ?? product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {beelden.length > 1 ? (
              <ul className="grid grid-cols-5 gap-3" aria-label="Foto's">
                {beelden.map((b, i) => (
                  <li key={b.url}>
                    <button
                      type="button"
                      onClick={() => setActiefBeeld(i)}
                      aria-label={b.altText ?? `Foto ${i + 1}`}
                      aria-current={i === actiefBeeld}
                      className={`relative block aspect-square w-full overflow-hidden rounded-s border bg-ivory-2 ${
                        i === actiefBeeld ? "border-brand ring-2 ring-brand" : "border-line"
                      }`}
                    >
                      <Image src={b.url} alt="" fill sizes="10vw" className="object-cover" />
                    </button>
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

      {/* Info + koopblok */}
      <div>
        {etalage ? (
          <p className="mb-2 inline-block rounded-[4px] bg-geel px-2 py-1 text-xs font-extrabold uppercase tracking-[0.09em] text-ink">
            Uit de winkelcollectie
          </p>
        ) : null}

        <p className="text-sm font-bold uppercase tracking-[0.06em] text-ink-soft">{product.vendor}</p>
        <h1 className="text-4xl">{product.title}</h1>

        <div
          className="mt-5 max-w-[62ch] text-ink-soft [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
        {gekozen.beschrijving?.value ? (
          <p className="max-w-[62ch] whitespace-pre-line text-ink-soft">{gekozen.beschrijving.value}</p>
        ) : null}

        {opties.map((optie) => (
          <fieldset key={optie.name} className="mt-6">
            <legend className="font-display text-lg">
              {optie.name}: <span className="font-body text-base font-bold">{waardeVan(gekozen, optie.name)}</span>
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {optie.optionValues.map(({ name: waarde }) => {
                const actief = waardeVan(gekozen, optie.name) === waarde;
                const mogelijk = bestaat(optie.name, waarde);
                return (
                  <label
                    key={waarde}
                    className={`cursor-pointer rounded-s border px-4 py-2 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2 ${
                      actief
                        ? "border-brand bg-brand font-bold text-white"
                        : mogelijk
                          ? "border-line-strong hover:border-brand hover:text-brand-text"
                          : "border-dashed border-line text-ink-soft"
                    }`}
                    title={mogelijk ? undefined : "Bestaat niet in combinatie met uw andere keuze — klik om te wisselen"}
                  >
                    <input
                      type="radio"
                      name={optie.name}
                      value={waarde}
                      checked={actief}
                      onChange={() => {
                        kies(optie.name, waarde);
                        setActiefBeeld(0);
                      }}
                      className="sr-only"
                    />
                    {waarde}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <p className="mt-4 text-sm text-ink-soft">
          {breedte && lengte ? (
            <>
              Gekozen: <strong className="text-ink">{breedte} × {lengte} cm</strong>
              {" · "}
            </>
          ) : null}
          {gekozen.sku ? (
            <>
              artikelnummer{" "}
              <span className="rounded-[4px] bg-geel px-2 py-0.5 font-bold text-ink">{gekozen.sku}</span>
            </>
          ) : null}
        </p>

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
              {/* variantId meesturen: het artikelnummer hangt aan de uitvoering, niet aan het product */}
              <FavorietKnop handle={product.handle} titel={product.title} variantId={gekozen.id} variant="knop" />
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <p className="font-body text-3xl font-extrabold">
              {formatPrijs(gekozen.price.amount)}
              {eenheid && eenheid !== "Per stuk" ? (
                <span className="ml-2 text-base font-bold text-ink-soft">{eenheid.toLowerCase()}</span>
              ) : null}
            </p>
            <p className="mt-1 text-sm text-groen">
              {gekozen.availableForSale ? "Op voorraad · gratis levering in de regio" : "Op aanvraag"}
            </p>
            <AddToCart variantId={gekozen.id} beschikbaar={gekozen.availableForSale} />
            <div className="mt-3">
              <FavorietKnop handle={product.handle} titel={product.title} variantId={gekozen.id} variant="knop" />
            </div>
          </div>
        )}

        {specs.length > 0 ? (
          <section className="mt-8 border-t border-line pt-4" aria-labelledby="specs">
            <h2 id="specs" className="font-display text-lg">
              Specificaties
            </h2>
            <dl className="mt-3 grid grid-cols-[minmax(8rem,auto)_1fr] gap-x-6 gap-y-1 text-sm">
              {specs.map((s) => (
                <div key={s.label} className="contents">
                  <dt className="text-ink-soft">{s.label}</dt>
                  <dd className="font-bold text-ink">{s.waarde}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>
    </div>
  );
}
