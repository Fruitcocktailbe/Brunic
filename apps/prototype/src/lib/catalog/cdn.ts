/**
 * Compacte beeld-URL's voor lange productlijsten (client-componenten krijgen er soms
 * duizenden): het vaste Shopify-CDN-voorvoegsel wordt "~/" en de cachebuster `?v=` valt
 * weg. `expandSrc` zet ze terug; ImageSlot doet dat automatisch.
 */
const CDN = "https://cdn.shopify.com/s/files/";

export function compactSrc(src: string): string {
  return src.startsWith(CDN) ? `~/${src.slice(CDN.length).replace(/\?v=\d+$/, "")}` : src;
}

export function expandSrc(src: string): string {
  return src.startsWith("~/") ? `${CDN}${src.slice(2)}` : src;
}

/** Kleinere variant van een CDN-beeld (Shopify transformeert on-the-fly). */
export function cdnWidth(src: string, w: number): string {
  const full = expandSrc(src);
  return /^https:\/\/cdn\.shopify\.com\//.test(full) ? `${full}${full.includes("?") ? "&" : "?"}width=${w}` : full;
}
