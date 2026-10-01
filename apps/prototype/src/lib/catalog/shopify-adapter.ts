/**
 * Shopify-adapter: vertaalt de momentopname uit scripts/sync-shopify.mjs (Storefront API)
 * naar de modellen van de site (Category, Product, Variant). Enkel serverzijdig.
 * De rest van de app kent enkel die modellen, niet Shopify.
 */
import fs from "node:fs";
import path from "node:path";
import { CATEGORIES } from "@/data/categories";
import { CATEGORIE_TEKST } from "@/data/categorie-teksten";
import { SUBCATEGORIE_BEELD } from "@/data/beelden";
import { SHOPIFY_HOOFDCOLLECTIE, SHOPIFY_NEGEER, SHOPIFY_NIEUW_COLLECTIE, SHOPIFY_SUB_EXTRA, SHOPIFY_SUB_VOORVOEGSEL } from "@/data/shopify-bron";
import type { Category, CategoryId, Price, Product, ProductImage, ProductOption, QuantityRule, SalesUnit, Spec, Variant } from "./types";

export const SNAPSHOT_PAD = path.join(process.cwd(), ".data", "shopify-catalogus.json");

type RawImage = { url: string; altText: string | null; width: number | null; height: number | null };
type RawCollection = { handle: string; title: string; description: string; image: RawImage | null };
type RawVariant = {
  id: string;
  sku: string | null;
  availableForSale: boolean;
  price: { amount: string };
  compareAtPrice: { amount: string } | null;
  selectedOptions: { name: string; value: string }[];
  image: string | null;
  breedte: string | null;
  lengte: string | null;
};
type RawProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  createdAt: string;
  updatedAt: string;
  descriptionHtml: string;
  options: { name: string; optionValues: { name: string; swatch: { color: string | null; image: { previewImage: { url: string } | null } | null } | null }[] }[];
  images: RawImage[];
  collections: string[];
  etalage: string | null;
  eenheid: string | null;
  kleurfamilie: string | null;
  materiaal: string | null;
  collectie: string | null;
  specificaties: string | null;
  variants: RawVariant[];
};
export type Snapshot = { gesynchroniseerd: string; winkel: string; domein: string; collections: RawCollection[]; products: RawProduct[] };

export function snapshotBestaat(): boolean {
  return fs.existsSync(SNAPSHOT_PAD);
}

/** Wijzigingstijd van de momentopname (0 = geen) — om een nieuwe sync automatisch op te pikken. */
export function snapshotVersie(): number {
  try {
    return fs.statSync(SNAPSHOT_PAD).mtimeMs;
  } catch {
    return 0;
  }
}

/* ---------------- hulpfuncties ---------------- */

const kortId = (gid: string) => gid.split("/").pop() ?? gid;
const zonderQuery = (url: string) => url.split("?")[0];
/** Shopify CDN: kleinere versie voor stalen (bespaart data). */
const cdnBreedte = (url: string, w: number) => `${url}${url.includes("?") ? "&" : "?"}width=${w}`;

const EENHEID: Record<string, SalesUnit> = {
  "per stuk": "stuk",
  "per m²": "m2",
  "per m2": "m2",
  "per lopende meter": "meter",
  "per meter": "meter",
  "per rol": "rol",
  "per set": "set",
};
const EENHEID_LABEL: Record<SalesUnit, string> = { stuk: "Per stuk", meter: "Per lopende meter", m2: "Per m²", rol: "Per rol", set: "Per set" };

/**
 * Hoeveelheidsregels per verkoopeenheid. Gehele aantallen: een Shopify-winkelmand kent
 * enkel gehele hoeveelheden. Meterware in stappen van 0,1 m vraagt een apart verkoopmodel
 * (variant per 10 cm of lengte als regel-eigenschap) — beslissing ligt bij Brunic.
 */
const QTY: Record<SalesUnit, QuantityRule> = {
  stuk: { min: 1, step: 1, max: 50 },
  rol: { min: 1, step: 1, max: 60 },
  set: { min: 1, step: 1, max: 50 },
  meter: { min: 1, step: 1, max: 100 },
  m2: { min: 1, step: 1, max: 500 },
};

const IS_SFEER = / – sfeerfoto/;
/** Foto van de opgerolde rol (Boråstapeter) — gelabeld door packages/catalog/borastapeter-rolfoto-achteraan.mjs. */
const IS_ROL = / – rolfoto/;

/** HTML-beschrijving → platte alinea's (geen HTML van buitenaf in de pagina). */
function htmlNaarTekst(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function specsUit(json: string | null): Spec[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json) as unknown;
    return Array.isArray(v)
      ? v.filter((s) => typeof s?.label === "string" && typeof s?.waarde === "string").map((s) => ({ label: s.label, value: s.waarde }))
      : [];
  } catch {
    return [];
  }
}

const IS_MAAT = /breedte|lengte|hoogte|afmeting|maat|dikte|gewicht|rapport|diameter|poolhoogte/i;
const IS_TITEL_OPTIE = (o: { name: string; optionValues: { name: string }[] }) => o.name === "Title" && o.optionValues.length === 1;

/* ---------------- categorieën ---------------- */

function bouwCategorieen(snapshot: Snapshot, telling: Map<string, number>): { categories: Category[]; collectieNaarCategorie: Map<string, CategoryId> } {
  const collectieNaarCategorie = new Map<string, CategoryId>();
  for (const [id, handle] of Object.entries(SHOPIFY_HOOFDCOLLECTIE)) collectieNaarCategorie.set(handle, id);

  const subs: Category[] = [];
  for (const c of snapshot.collections) {
    if (SHOPIFY_NEGEER.has(c.handle) || collectieNaarCategorie.has(c.handle)) continue;
    const extra = SHOPIFY_SUB_EXTRA[c.handle];
    const match = SHOPIFY_SUB_VOORVOEGSEL.find(([vv]) => c.handle.startsWith(vv));
    const ouder = extra ?? match?.[1];
    if (!ouder) continue;
    if (!telling.get(c.handle)) continue; // lege collectie: niet tonen
    const id = `s-${c.handle}`;
    collectieNaarCategorie.set(c.handle, id);
    const tekst = CATEGORIE_TEKST[c.handle];
    subs.push({
      id,
      parentId: ouder,
      name: c.title,
      slug: match && !extra ? c.handle.slice(match[0].length) : c.handle,
      order: 0,
      subtitle: tekst?.subtitle,
      intro: c.description || tekst?.intro,
      image: c.image ? { src: c.image.url, alt: c.image.altText ?? c.title } : SUBCATEGORIE_BEELD[c.handle],
    });
  }
  // Volgorde onder elke ouder: meeste producten eerst.
  subs.sort((a, b) => (telling.get(b.id.slice(2)) ?? 0) - (telling.get(a.id.slice(2)) ?? 0));
  subs.forEach((s, i) => (s.order = i + 1));

  // Hoofdcategorieën zonder producten (ook niet in een subcategorie) blijven weg.
  const roots = CATEGORIES.filter((c) => c.parentId === null)
    .filter((c) => (telling.get(SHOPIFY_HOOFDCOLLECTIE[c.id]) ?? 0) > 0 || subs.some((s) => s.parentId === c.id))
    .map((c) => {
      const handle = SHOPIFY_HOOFDCOLLECTIE[c.id];
      const tekst = CATEGORIE_TEKST[handle];
      const beschrijving = snapshot.collections.find((x) => x.handle === handle)?.description;
      return { ...c, subtitle: c.subtitle ?? tekst?.subtitle, intro: c.intro ?? tekst?.intro ?? (beschrijving || undefined) };
    });
  const zichtbaar = new Set(roots.map((r) => r.id));
  return { categories: [...roots, ...subs.filter((s) => s.parentId && zichtbaar.has(s.parentId))], collectieNaarCategorie };
}

/* ---------------- producten ---------------- */

function mapProduct(p: RawProduct, collectieNaarCategorie: Map<string, CategoryId>, bekend: Set<CategoryId>, nieuw: Set<string>): Product | null {
  const categoryIds = [...new Set(p.collections.map((h) => collectieNaarCategorie.get(h)).filter((x): x is CategoryId => Boolean(x) && bekend.has(x!)))];
  if (categoryIds.length === 0) return null;
  // Kruimelpad: de diepste categorie (een subcollectie) wint.
  const primaryCategoryId = categoryIds.find((id) => id.startsWith("s-")) ?? categoryIds[0];

  const unit = EENHEID[(p.eenheid ?? "").trim().toLowerCase()] ?? "stuk";
  const opties = p.options.filter((o) => !IS_TITEL_OPTIE(o));
  const kleurOptie = opties.find((o) => /kleur|color|colour/i.test(o.name)) ?? (opties.length === 1 ? opties[0] : undefined);

  // Variantfoto koppelen aan de kleurwaarde → galerij en stalen wisselen mee.
  const beeldBijWaarde = new Map<string, string>();
  for (const v of p.variants) {
    const waarde = kleurOptie ? v.selectedOptions.find((o) => o.name === kleurOptie.name)?.value : undefined;
    if (waarde && v.image && !beeldBijWaarde.has(waarde)) beeldBijWaarde.set(waarde, v.image);
  }
  const waardeBijBeeld = new Map([...beeldBijWaarde.entries()].map(([w, url]) => [zonderQuery(url), w]));

  // Kleur per beeld: de variantfoto, anders de alt-tekst van de import ("… – detailfoto – kleur 110").
  const kleurwaarden = new Set(kleurOptie?.optionValues.map((v) => v.name) ?? []);
  const images: ProductImage[] = p.images.map((img) => {
    const uitAlt = img.altText?.match(/ – kleur (.+)$/)?.[1];
    const w = waardeBijBeeld.get(zonderQuery(img.url)) ?? (uitAlt && kleurwaarden.has(uitAlt) ? uitAlt : undefined);
    return { src: img.url, alt: img.altText || p.title, ...(w ? { optionValue: w } : {}) };
  });
  // Variantfoto's die niet bij de productfoto's staan, toch toevoegen.
  for (const [w, url] of beeldBijWaarde) {
    if (!images.some((i) => zonderQuery(i.src) === zonderQuery(url))) images.push({ src: url, alt: `${p.title} — ${w}`, optionValue: w });
  }
  // De rolfoto nooit vooraan: niet als kaartbeeld, niet als eerste beeld van een kleur, niet als staal.
  images.sort((a, b) => Number(IS_ROL.test(a.alt)) - Number(IS_ROL.test(b.alt)));

  const options: ProductOption[] = opties.map((o) => ({
    name: o.name,
    values: o.optionValues.map((v) => {
      const beeld = v.swatch?.image?.previewImage?.url ?? (o === kleurOptie ? beeldBijWaarde.get(v.name) : undefined);
      const swatch = v.swatch?.color ?? (beeld ? `url("${cdnBreedte(beeld, 96)}") center / cover` : undefined);
      return { value: v.name, ...(swatch ? { swatch } : {}) };
    }),
  }));

  const opAanvraag = p.etalage === "true" || p.variants.every((v) => !(Number(v.price.amount) > 0));
  const variants: Variant[] = p.variants.map((v) => {
    const amount = Number(v.price.amount);
    const compare = v.compareAtPrice ? Number(v.compareAtPrice.amount) : 0;
    const price: Price | null =
      !opAanvraag && amount > 0 ? { amount: { amount, currency: "EUR" }, unit, ...(compare > amount ? { compareAt: { amount: compare, currency: "EUR" } } : {}) } : null;
    return {
      id: kortId(v.id),
      sku: v.sku || kortId(v.id),
      options: Object.fromEntries(v.selectedOptions.filter((o) => o.name !== "Title").map((o) => [o.name, o.value])),
      price,
      availability: v.availableForSale ? "op-voorraad" : "uitverkocht",
    };
  });

  const alleSpecs = specsUit(p.specificaties);
  const specs: Spec[] = [
    ...(p.vendor ? [{ label: "Merk", value: p.vendor }] : []),
    ...(p.materiaal ? [{ label: "Materiaal", value: p.materiaal }] : []),
    { label: "Verkoopeenheid", value: EENHEID_LABEL[unit] },
    ...alleSpecs.filter((s) => !IS_MAAT.test(s.label) && !(p.vendor && s.label === "Merk")),
  ];
  const dimensions = alleSpecs.filter((s) => IS_MAAT.test(s.label));

  const facets: Record<string, string[]> = {
    eenheid: [EENHEID_LABEL[unit]],
    ...(p.vendor ? { merk: [p.vendor] } : {}),
    ...(p.productType ? { type: [p.productType] } : {}),
    ...(p.materiaal ? { materiaal: p.materiaal.split(/[,/]/).map((s) => s.trim()).filter(Boolean) } : {}),
    kleur: p.kleurfamilie ? p.kleurfamilie.split(",").map((s) => s.trim()).filter(Boolean) : [],
  };

  const heeftKorting = variants.some((v) => v.price?.compareAt);
  return {
    id: kortId(p.id),
    slug: p.handle,
    title: p.title,
    brand: p.vendor || undefined,
    line: p.collectie || undefined,
    categoryIds,
    primaryCategoryId,
    pricing: opAanvraag ? "on-request" : "fixed",
    quantity: QTY[unit],
    images,
    options,
    variants,
    highlights: [],
    description: htmlNaarTekst(p.descriptionHtml),
    specs,
    dimensions,
    facets,
    badges: [...(nieuw.has(p.id) ? (["nieuw"] as const) : []), ...(heeftKorting ? (["aanbieding"] as const) : [])],
    createdAt: p.createdAt,
    // "Aanbevolen": producten met sfeerfoto's en veel uitvoeringen eerst (er zijn nog geen
    // verkoopcijfers per product; vervangen zodra die er zijn).
    popularity: (p.images.some((i) => IS_SFEER.test(i.altText ?? "")) ? 100 : 0) + Math.min(p.images.length, 20) + Math.min(variants.length, 30),
  };
}

/** Leest de momentopname en levert categorieën + producten in het model van de site. */
export function laadShopifyCatalogus(): { categories: Category[]; products: Product[]; info: string } {
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PAD, "utf8")) as Snapshot;

  const telling = new Map<string, number>();
  for (const p of snapshot.products) for (const h of p.collections) telling.set(h, (telling.get(h) ?? 0) + 1);

  const { categories, collectieNaarCategorie } = bouwCategorieen(snapshot, telling);
  const bekend = new Set(categories.map((c) => c.id));
  // "Nieuw": de door Brunic samengestelde collectie `nieuw-binnen`. Bestaat die niet, dan
  // één product per merk: het laatst aangemaakte, bij voorkeur met een sfeerfoto. (Alle
  // producten werden in één import aangemaakt; "de laatste 48" zou één importbatch zijn.)
  const gekozen = snapshot.products.filter((p) => p.collections.includes(SHOPIFY_NIEUW_COLLECTIE));
  const perMerk = new Map<string, RawProduct>();
  const score = (p: RawProduct) => `${p.images.some((i) => IS_SFEER.test(i.altText ?? "")) ? 1 : 0}|${p.createdAt}|${p.updatedAt}`;
  for (const p of snapshot.products) {
    const huidig = perMerk.get(p.vendor);
    if (!huidig || score(p) > score(huidig)) perMerk.set(p.vendor, p);
  }
  const nieuw = new Set((gekozen.length ? gekozen : [...perMerk.values()]).map((p) => p.id));
  const products: Product[] = [];
  let zonderCategorie = 0;
  for (const raw of snapshot.products) {
    const p = mapProduct(raw, collectieNaarCategorie, bekend, nieuw);
    if (p) products.push(p);
    else zonderCategorie++;
  }
  // Unieke slugs (handles zijn uniek in Shopify, maar zeker is zeker).
  const gezien = new Set<string>();
  const uniek = products.filter((p) => (gezien.has(p.slug) ? false : (gezien.add(p.slug), true)));

  const info = `Shopify-momentopname van ${snapshot.gesynchroniseerd.slice(0, 16).replace("T", " ")} · ${uniek.length} producten · ${categories.length} categorieën${
    zonderCategorie ? ` · ${zonderCategorie} zonder gekoppelde collectie (niet getoond)` : ""
  }`;
  return { categories, products: uniek, info };
}
