import Link from "next/link";
import { routes } from "@/lib/routes";
import { Icon } from "./icon";

export type Crumb = { label: string; href?: string };

/**
 * Kruimelpad zoals de referentie: huisje / niveau / niveau — laatste item niet klikbaar.
 * Te lang voor het scherm? Het laatste item krijgt een beletselteken (…) i.p.v. afgesneden te worden.
 */
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Kruimelpad" className={`text-[13px] ${className}`}>
      <ol className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap py-3">
        <li className="flex shrink-0 items-center">
          <Link href={routes.home()} className="-m-3 flex items-center rounded p-3 hover:text-ink-60" aria-label="Home">
            <Icon name="home" size={16} strokeWidth={0} className="fill-current" />
          </Link>
        </li>
        {items.map((c, i) => (
          // Op smalle schermen enkel de laatste twee stappen (ouder + huidige pagina), elk met
          // beletselteken; vanaf sm het volledige pad.
          <li
            key={`${c.label}-${i}`}
            className={`flex min-w-0 items-center gap-1.5 ${i < items.length - 2 ? "max-sm:hidden sm:shrink-0" : i === items.length - 2 ? "shrink-[2] sm:shrink-0" : ""}`}
          >
            <span aria-hidden="true" className="shrink-0 text-ink-40">
              /
            </span>
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="min-w-0 truncate hover:underline" title={c.label}>
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined} className="min-w-0 truncate text-ink-80" title={c.label}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
