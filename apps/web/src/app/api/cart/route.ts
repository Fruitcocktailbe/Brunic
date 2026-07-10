import { NextResponse } from "next/server";
import { getCart } from "@/lib/cart/cart";

// Leest de cart-cookie → mag nooit statisch of gecached zijn.
export const dynamic = "force-dynamic";

export async function GET() {
  const cart = await getCart();
  return NextResponse.json(
    { totalQuantity: cart?.totalQuantity ?? 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
