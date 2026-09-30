import { ShopChrome } from "@/components/layout/shop-chrome";
import { NotFoundContent } from "@/components/content/not-found-content";

export const metadata = { title: "Pagina niet gevonden" };

/**
 * 404 voor onbekende URL's (buiten elke layout-groep): brengt zelf header en footer mee.
 * Een notFound() binnen de winkelpagina's gebruikt app/(winkel)/not-found.tsx, dat al
 * binnen de winkel-layout valt.
 */
export default function NotFound() {
  return (
    <ShopChrome>
      <NotFoundContent />
    </ShopChrome>
  );
}
