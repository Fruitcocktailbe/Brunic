import { NextResponse } from "next/server";
import { storefront } from "@/lib/shopify/client";

export const dynamic = "force-dynamic";

const MAX = 5;

const FAV_FIELDS = /* GraphQL */ `
  fragment FavFields on Product {
    id
    handle
    title
    productType
    etalage: metafield(namespace: "brunic", key: "etalage") {
      value
    }
    featuredImage {
      url
      altText
      width
      height
    }
    variants(first: 20) {
      nodes {
        id
        title
        sku
        price {
          amount
          currencyCode
        }
        breedte: metafield(namespace: "brunic", key: "breedte_cm") {
          value
        }
        lengte: metafield(namespace: "brunic", key: "lengte_cm") {
          value
        }
      }
    }
  }
`;

/** Handles zijn slugs: alles daarbuiten weigeren vóór het in een query belandt. */
const HANDLE = /^[a-z0-9][a-z0-9-]{0,99}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige body" }, { status: 400 });
  }

  const ruw = (body as { handles?: unknown })?.handles;
  if (!Array.isArray(ruw)) return NextResponse.json({ error: "handles ontbreekt" }, { status: 400 });

  const handles = [...new Set(ruw.filter((h): h is string => typeof h === "string" && HANDLE.test(h)))].slice(0, MAX);
  if (handles.length === 0) return NextResponse.json({ producten: [] });

  // Eén document met aliassen: max 5 producten, dus één round-trip.
  const args = handles.map((_, i) => `$h${i}: String!`).join(", ");
  const velden = handles.map((_, i) => `p${i}: product(handle: $h${i}) { ...FavFields }`).join("\n    ");
  const query = `${FAV_FIELDS}\n  query Favorieten(${args}) {\n    ${velden}\n  }`;

  const variables = Object.fromEntries(handles.map((h, i) => [`h${i}`, h]));

  try {
    const data = await storefront<Record<string, unknown>>(query, variables, 300);
    // Volgorde van de bezoeker behouden, onbestaande handles stil overslaan.
    const producten = handles.map((_, i) => data[`p${i}`]).filter(Boolean);
    return NextResponse.json({ producten }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Kon de producten niet ophalen" }, { status: 502 });
  }
}
