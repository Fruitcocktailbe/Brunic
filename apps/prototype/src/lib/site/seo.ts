/**
 * Structured data (schema.org JSON-LD) en canonieke URL's. Offers enkel op producten
 * met een echte prijs (architectuur.md §Migratie & SEO): etalage/"prijs op aanvraag"
 * krijgt een Product zonder Offer.
 */
import type { CategoryNode, Product } from "@/lib/catalog/types";
import { lowestPrice } from "@/lib/catalog/product";
import { routes } from "@/lib/routes";
import { SITE } from "./config";

export const absoluteUrl = (path: string) => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

const ORG_ID = `${SITE.url}/#winkel`;

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    url: SITE.url,
    logo: absoluteUrl("/brand/logo-kleur.png"),
    image: absoluteUrl("/brand/logo-kleur.png"),
    telephone: SITE.phone.e164,
    email: SITE.email,
    foundingDate: SITE.foundingDate,
    ...(SITE.companyNumber ? { vatID: SITE.companyNumber } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.countryCode,
    },
    openingHoursSpecification: SITE.openingHours.map((o) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: o.days, opens: o.opens, closes: o.closes })),
    areaServed: "Ninove en de Denderstreek",
    sameAs: SITE.social.map((s) => s.href),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** Kruimelpad Home › Catalogus › … › categorie (voor categorie- en productpagina's). */
export function categoryCrumbs(trail: CategoryNode[]) {
  return [{ name: "Home", path: "/" }, { name: "Catalogus", path: routes.catalog() }, ...trail.map((t) => ({ name: t.name, path: routes.category(t) }))];
}

export function productJsonLd(p: Product, categoryName?: string) {
  const price = lowestPrice(p);
  const koopbaar = p.pricing === "fixed" && price && price.amount.amount > 0;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    url: absoluteUrl(routes.product(p.slug)),
    image: p.images.slice(0, 6).map((i) => i.src),
    description: p.description.slice(0, 500) || undefined,
    sku: p.variants[0]?.sku,
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(categoryName ? { category: categoryName } : {}),
    ...(koopbaar
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: price.amount.amount.toFixed(2),
            offerCount: p.variants.filter((v) => v.price).length,
            availability: p.variants.some((v) => v.availability === "op-voorraad" || v.availability === "beperkt")
              ? "https://schema.org/InStock"
              : "https://schema.org/BackOrder",
            seller: { "@id": ORG_ID },
          },
        }
      : {}),
  };
}
