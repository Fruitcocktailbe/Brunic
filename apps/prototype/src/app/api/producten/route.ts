import { NextResponse } from "next/server";
import { catalog } from "@/lib/catalog/repository";
import { toCard } from "@/lib/catalog/view";
import { variantLabel } from "@/lib/catalog/product";
import type { Product } from "@/lib/catalog/types";

/**
 * Productgegevens voor winkelmand, verlanglijst, "recent bekeken" en het offerteformulier
 * (lokaal bewaarde ID's of een slug uit de URL → actuele gegevens uit de catalogus).
 * ?ids=a,b of ?slugs=x,y
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const lijst = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean).slice(0, 60);
  const products: Product[] = [
    ...(await catalog.getProductsByIds(lijst("ids"))),
    ...(await Promise.all(lijst("slugs").map((s) => catalog.getProductBySlug(s)))).filter((p): p is Product => Boolean(p)),
  ];
  return NextResponse.json(
    {
      products: products.map((p) => ({
        card: toCard(p),
        unit: p.variants.find((v) => v.price)?.price?.unit ?? "stuk",
        quantity: p.quantity,
        pricing: p.pricing,
        variants: p.variants.map((v) => ({ id: v.id, sku: v.sku, label: variantLabel(v), price: v.price, availability: v.availability })),
      })),
    },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
  );
}
