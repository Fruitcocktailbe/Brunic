import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Webhooks moeten altijd live verwerkt worden, nooit gecached of statisch.
export const dynamic = "force-dynamic";

/**
 * Shopify-webhook → on-demand revalidatie. Zonder dit staan Brunic's admin-wijzigingen
 * (In de kijker, prijzen, nieuwe producten) pas na de ISR-termijn (1u) live; hiermee in
 * seconden. Zie decisions/log.md.
 *
 * De HMAC wordt getekend met de API secret key (shpss_) van de custom app die de
 * webhooks aanmaakt — daarom staat die in SHOPIFY_API_SECRET.
 */
function geldigeHandtekening(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret || !hmacHeader) return false;

  const verwacht = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");

  // Lengtes moeten gelijk zijn vóór timingSafeEqual, anders gooit het.
  const a = Buffer.from(verwacht);
  const b = Buffer.from(hmacHeader);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const hmac = request.headers.get("x-shopify-hmac-sha256");

  if (!geldigeHandtekening(rawBody, hmac)) {
    // 401 → Shopify markeert de levering als mislukt en probeert opnieuw.
    return new NextResponse("ongeldige handtekening", { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";

  let handle: string | undefined;
  try {
    handle = (JSON.parse(rawBody) as { handle?: string }).handle;
  } catch {
    /* delete-payloads bevatten soms geen volledige body; tag-revalidatie volstaat dan */
  }

  // Elke catalogus-wijziging ververst de listings: alle categorie-PLP's, alle maat-buckets
  // en de home (In de kijker). revalidatePath met de dynamische route-vorm markeert álle
  // instanties van dat segment; ze regenereren lui bij het eerstvolgende bezoek.
  if (topic.startsWith("products/") || topic.startsWith("collections/")) {
    revalidatePath("/[collection]", "page");
    revalidatePath("/[collection]/maat/[bucket]", "page");
    revalidatePath("/");

    // Een productwijziging ververst bovendien meteen de eigen PDP (chirurgisch).
    if (topic.startsWith("products/") && handle) {
      revalidatePath(`/product/${handle}`);
    }
  }

  // Altijd 2xx bij een geldige, verwerkte webhook — anders blijft Shopify herproberen.
  return NextResponse.json({ ok: true, topic, handle: handle ?? null });
}
