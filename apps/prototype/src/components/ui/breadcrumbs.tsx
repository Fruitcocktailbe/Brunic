import Link from "next/link";
import { routes } from "@/lib/routes";
import { Icon } from "./icon";

export type Crumb = { label: string; href?: string };

/** Kruimelpad zoals de referentie: huisje / niveau / niveau — laatste item niet klikbaar. */
export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Kruimelpad" className={`text-[13px] ${className}`}>
      <ol className="no-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-3">
        <li className="flex items-center">
          <Link href={routes.home()} className="-m-3 flex items-center rounded p-3 hover:text-ink-60" aria-label="Home">
            <Icon name="home" size={16} strokeWidth={0} className="fill-current" />
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-ink-40">
              /
            </span>
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined} className="text-ink-80">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
