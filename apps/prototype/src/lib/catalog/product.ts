import type { Availability, Price, Product, ProductImage, SalesUnit, Variant } from "./types";

const eur = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" });
const num = new Intl.NumberFormat("nl-BE", { maximumFractionDigits: 2 });

export function formatMoney(amount: number): string {
  return eur.format(amount);
}

export function formatQuantity(q: number): string {
  return num.format(q);
}

export const UNIT_SUFFIX: Record<SalesUnit, string> = {
  stuk: "",
  meter: "/ m",
  m2: "/ m²",
  rol: "/ rol",
  set: "/ set",
};

export const UNIT_NAME: Record<SalesUnit, { one: string; many: string; short: string }> = {
  stuk: { one: "stuk", many: "stuks", short: "st." },
  meter: { one: "meter", many: "meter", short: "m" },
  m2: { one: "m²", many: "m²", short: "m²" },
  rol: { one: "rol", many: "rollen", short: "rol" },
  set: { one: "set", many: "sets", short: "set" },
};

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  "op-voorraad": "Op voorraad",
  beperkt: "Beperkte voorraad",
  "op-bestelling": "Op bestelling",
  uitverkocht: "Tijdelijk uitverkocht",
};

export function isPurchasable(p: Product, v?: Variant): boolean {
  if (p.pricing !== "fixed") return false;
  const variant = v ?? p.variants[0];
  return Boolean(variant?.price) && variant.availability !== "uitverkocht";
}

/** Laagste variantprijs (de "vanaf"-prijs op kaarten). */
export function lowestPrice(p: Product): Price | null {
  let best: Price | null = null;
  for (const v of p.variants) {
    if (v.price && (!best || v.price.amount.amount < best.amount.amount)) best = v.price;
  }
  return best;
}

export function hasPriceRange(p: Product): boolean {
  const amounts = new Set(p.variants.map((v) => v.price?.amount.amount).filter((a) => a !== undefined));
  return amounts.size > 1;
}

/** Korting in procent t.o.v. de vergelijkingsprijs (enkel weergave). */
export function discountPercent(price: Price): number | null {
  if (!price.compareAt || price.compareAt.amount <= price.amount.amount) return null;
  return Math.round((1 - price.amount.amount / price.compareAt.amount) * 100);
}

export function findVariant(p: Product, selection: Record<string, string>): Variant | undefined {
  return p.variants.find((v) => Object.entries(selection).every(([k, val]) => v.options[k] === val));
}

export function variantById(p: Product, id: string | undefined): Variant | undefined {
  return id ? p.variants.find((v) => v.id === id) : undefined;
}

/**
 * Beelden voor de gekozen kleur (of andere optie): eerst die van die kleur, dan de beelden
 * die bij geen enkele kleur horen (sfeerfoto's). Beelden van andere kleuren vallen weg.
 */
export function imagesForVariant(p: Product, v: Variant | undefined): ProductImage[] {
  if (!v) return p.images;
  const values = new Set(Object.values(v.options));
  const specific = p.images.filter((img) => img.optionValue && values.has(img.optionValue));
  const shared = p.images.filter((img) => !img.optionValue);
  const list = [...specific, ...shared];
  return list.length ? list : p.images;
}

/** Omschrijving van een variant voor winkelmand/verlanglijst: "Grijs · 60 × 180 cm". */
export function variantLabel(v: Variant): string {
  return Object.values(v.options).join(" · ");
}

/** "1 product" / "3 producten". */
export function productCount(n: number): string {
  return `${n} ${n === 1 ? "product" : "producten"}`;
}

/**
 * Regeltotaal in euro, afgerond op de cent (half naar boven): eerst naar centen, dan
 * vermenigvuldigen — zo geeft 3,5 × € 29,99 netjes € 104,97 i.p.v. een zwevendekomma-
 * afronding naar € 104,96. Subtotalen = som van deze afgeronde regels.
 */
export function lineTotal(unitAmount: number, quantity: number): number {
  return Math.round(Math.round(unitAmount * 100) * quantity) / 100;
}

/** Indexeerbaar = heeft minstens één foto (fotoloze producten blijven noindex tot ze verrijkt zijn). */
export function isIndexable(p: Product): boolean {
  return p.images.some((i) => i.src);
}
