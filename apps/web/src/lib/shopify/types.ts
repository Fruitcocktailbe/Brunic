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
  breedte: MetafieldValue;
  lengte: MetafieldValue;
};

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  productType: string;
  featuredImage: ShopImage | null;
  etalage: MetafieldValue;
  priceRange: { minVariantPrice: Money };
};

export type Product = ProductCard & {
  descriptionHtml: string;
  vendor: string;
  collections: { nodes: { handle: string; title: string }[] };
  materiaal: MetafieldValue;
  kleurfamilie: MetafieldValue;
  poolklasse: MetafieldValue;
  erpFamilie: MetafieldValue;
  images: { nodes: ShopImage[] };
  variants: { nodes: Variant[] };
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
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
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
