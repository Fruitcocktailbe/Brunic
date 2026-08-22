import Link from "next/link";
import { hrefVoorSub, type Subcategorie } from "@/lib/shopify/taxonomie";

/**
 * De subcategorieën van een webcategorie, als links bovenaan de categoriepagina — puur
 * links, geen client-JS, dus indexeerbaar en werkend zonder JavaScript (zoals de maat- en
 * facetfilters). Anders dan een facet is dit een échte pagina per subcategorie: de
 * indeling komt van de klant en is de manier waarop mensen het assortiment benoemen.
 */
export function SubcategorieNav({
  ouderHandle,
  subs,
  actiefHandle,
}: {
  /** de categorie waaronder deze subs hangen */
  ouderHandle: string;
  subs: Subcategorie[];
  /** handle van de subcollectie die nu open staat */
  actiefHandle?: string;
}) {
  if (subs.length === 0) return null;

  return (
    <nav aria-label="Subcategorieën" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={`/${ouderHandle}`}
            aria-current={!actiefHandle ? "true" : undefined}
            className={`inline-block rounded-s border px-3 py-2 text-sm transition ${
              !actiefHandle
                ? "border-brand bg-brand font-bold text-white"
                : "border-line-strong hover:border-brand hover:text-brand-text"
            }`}
          >
            Alles
          </Link>
        </li>

        {subs.map((sub) => {
          const actief = sub.handle === actiefHandle;
          return (
            <li key={sub.handle}>
              <Link
                href={hrefVoorSub(ouderHandle, sub)}
                aria-current={actief ? "true" : undefined}
                className={`inline-block rounded-s border px-3 py-2 text-sm transition ${
                  actief
                    ? "border-brand bg-brand font-bold text-white"
                    : "border-line-strong hover:border-brand hover:text-brand-text"
                }`}
              >
                {sub.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
