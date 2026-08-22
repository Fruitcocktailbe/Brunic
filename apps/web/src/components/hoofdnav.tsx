"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { hrefVoorSub, subsVoor } from "@/lib/shopify/taxonomie";

/**
 * De zeven webcategorieën, in omzetvolgorde (J.A.R.V.I.S doc 11: stoffen eerst, dan behang,
 * vloer en tapijt). De subcategorieën staan hier bewust NIET: die komen uit
 * `taxonomie.ts`, dezelfde bron als de routes en de chips op de categoriepagina. Eén lijst
 * bijhouden i.p.v. twee — anders wijst het menu vroeg of laat naar een pad dat niet bestaat.
 */
const NAV = [
  { href: "/gordijnen-stoffen", label: "Gordijnen & stoffen" },
  { href: "/behang", label: "Behang" },
  { href: "/vloerbekleding", label: "Vloerbekleding" },
  { href: "/tapijten", label: "Tapijten" },
  { href: "/raamdecoratie", label: "Raamdecoratie" },
  { href: "/verf", label: "Verf" },
  { href: "/slapen-wonen", label: "Slapen & wonen" },
].map((item) => {
  const handle = item.href.slice(1);
  return { ...item, handle, subs: subsVoor(handle) };
});

const SERVICE = [
  { href: "/opmeting", label: "Opmeting & plaatsing" },
  { href: "/favorieten", label: "Favorieten & winkellijst" },
];

export function Hoofdnav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Sluit het paneel bij navigatie (de link is aangeklikt) en op Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <nav aria-label="Hoofdnavigatie" className="border-t border-line">
      <div className="mx-auto max-w-(--container-brunic) px-6">
        {/* Mobiel: burger. md+ : de volledige balk. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="hoofdnav-paneel"
          className="flex items-center gap-2 py-3 font-bold md:hidden"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
          {open ? "Sluiten" : "Menu"}
        </button>

        {/* Desktopbalk. Het subpaneel opent op hover én op toetsenbordfocus (focus-within),
            zodat het zonder JavaScript en zonder muis bruikbaar blijft. */}
        <ul className="hidden flex-wrap gap-x-6 gap-y-1 py-2 text-[0.95rem] md:flex">
          {NAV.map((item) => (
            <li key={item.href} className="group relative">
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="inline-block border-b-2 border-transparent py-1 hover:border-brand hover:text-brand-dark aria-[current=page]:border-brand aria-[current=page]:text-brand-text"
              >
                {item.label}
              </Link>

              {item.subs.length > 0 ? (
                <div className="invisible absolute left-0 top-full z-20 pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="min-w-[15rem] rounded-m border border-line bg-white py-2 shadow-lg">
                    {item.subs.map((sub) => {
                      const href = hrefVoorSub(item.handle, sub);
                      return (
                        <li key={sub.slug}>
                          <Link
                            href={href}
                            aria-current={pathname === href ? "page" : undefined}
                            className="block px-4 py-2 text-sm hover:bg-brand-tint hover:text-brand-text aria-[current=page]:font-bold aria-[current=page]:text-brand-text"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobiel uitklappaneel — subcategorieën staan ingesprongen onder hun categorie. */}
      {open ? (
        <div id="hoofdnav-paneel" className="border-t border-line bg-white md:hidden">
          <ul className="mx-auto max-w-(--container-brunic) px-6 py-2">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block py-3 font-medium aria-[current=page]:text-brand-text"
                >
                  {item.label}
                </Link>
                {item.subs.length > 0 ? (
                  <ul className="pb-2 pl-4">
                    {item.subs.map((sub) => {
                      const href = hrefVoorSub(item.handle, sub);
                      return (
                        <li key={sub.slug}>
                          <Link
                            href={href}
                            aria-current={pathname === href ? "page" : undefined}
                            className="block py-2 text-sm text-ink-soft aria-[current=page]:font-bold aria-[current=page]:text-brand-text"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            ))}
            {SERVICE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b border-line py-3 font-bold text-brand-text last:border-b-0"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
