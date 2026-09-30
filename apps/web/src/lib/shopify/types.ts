export type Money = { amount: string; currencyCode: string };

export type ShopImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

type MetafieldValue = { value: string } | null;

export type Variant = {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string }[];
  /** de hoofdfoto van deze uitvoering (Shopify variant image) */
  image: ShopImage | null;
  breedte: MetafieldValue;
  lengte: MetafieldValue;
  kleurnaam?: MetafieldValue;
  /** tekst die enkel over deze uitvoering gaat (bv. een kleur) */
  beschrijving?: MetafieldValue;
  /** JSON [{label, waarde}] — specificaties die voor deze uitvoering afwijken */
  specificaties?: MetafieldValue;
  /** alle foto's van deze uitvoering, in volgorde (brunic.afbeeldingen, list.file_reference) */
  afbeeldingen?: { references: { nodes: ({ image: ShopImage | null } | Record<string, never>)[] } | null } | null;
};

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  vendor?: string;
  featuredImage: ShopImage | null;
  etalage: MetafieldValue;
  priceRange: { minVariantPrice: Money };
};

export type Product = ProductCard & {
  descriptionHtml: string;
  vendor: string;
  collections: { nodes: { handle: string; title: string }[] };
  options: { name: string; optionValues: { name: string }[] }[];
  materiaal: MetafieldValue;
  kleurfamilie: MetafieldValue;
  poolklasse: MetafieldValue;
  erpFamilie: MetafieldValue;
  collectie?: MetafieldValue;
  verkoopEenheid?: MetafieldValue;
  /** JSON [{label, waarde}] — technische specificaties (leveranciersimport) */
  specificaties?: MetafieldValue;
  images: { nodes: ShopImage[] };
  variants: { nodes: Variant[] };
};

export type Spec = { label: string; waarde: string };

/** Veilig parsen van een JSON-specificatielijst uit een metafield. */
export function specsUit(m: MetafieldValue | undefined): Spec[] {
  if (!m?.value) return [];
  try {
    const v = JSON.parse(m.value) as unknown;
    return Array.isArray(v) ? v.filter((s): s is Spec => typeof s?.label === "string" && typeof s?.waarde === "string") : [];
  } catch {
    return [];
  }
}

/** Foto's van een uitvoering: de volledige lijst als die er is, anders de hoofdfoto. */
export function variantBeelden(v: Variant | undefined): ShopImage[] {
  if (!v) return [];
  const lijst = (v.afbeeldingen?.references?.nodes ?? [])
    .map((n) => ("image" in n ? n.image : null))
    .filter((i): i is ShopImage => Boolean(i));
  if (lijst.length) return lijst;
  return v.image ? [v.image] : [];
}

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

/** Eén concrete waarde van een Shopify-filter. `input` is de JSON die je terugstuurt. */
export type FilterValue = {
  id: string;
  label: string;
  count: number;
  input: string;
};

export type StorefrontFilter = {
  id: string;
  label: string;
  type: string;
  values: FilterValue[];
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  products: {
    filters: StorefrontFilter[];
    nodes: ProductCard[];
    pageInfo: PageInfo;
  };
};

/** `brunic.etalage` = true → tonen, niet verkopen: geen prijs, geen koopknop. */
export function isEtalage(p: { etalage: MetafieldValue }): boolean {
  return p.etalage?.value === "true";
}

/* ---------------- Winkelmand ---------------- */

export type CartMerchandise = {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: Money;
  selectedOptions: { name: string; value: string }[];
  product: { handle: string; title: string; featuredImage: ShopImage | null };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: CartMerchandise;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: CartLine[] };
};

/** Wat de guard-query teruggeeft vóór we iets in de mand leggen. */
export type GuardVariant = {
  id: string;
  availableForSale: boolean;
  price: { amount: string };
  product: { handle: string; title: string; etalage: MetafieldValue };
};
