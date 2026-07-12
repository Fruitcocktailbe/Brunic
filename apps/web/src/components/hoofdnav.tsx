"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/gordijnen-stoffen", label: "Gordijnen & stoffen" },
  { href: "/behang", label: "Behang" },
  { href: "/vloeren", label: "Vloeren" },
  { href: "/tapijten-karpetten", label: "Tapijten & karpetten" },
  { href: "/raamdecoratie", label: "Raamdecoratie" },
  { href: "/verf", label: "Verf" },
  { href: "/slapen-wonen", label: "Slapen & wonen" },
];

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

        {/* Desktop-balk */}
        <ul className="hidden flex-wrap gap-x-6 gap-y-1 py-2 text-[0.95rem] md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="inline-block border-b-2 border-transparent py-1 hover:border-brand hover:text-brand-dark aria-[current=page]:border-brand aria-[current=page]:text-brand-text"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobiel uitklappaneel */}
      {open ? (
        <div id="hoofdnav-paneel" className="border-t border-line bg-white md:hidden">
          <ul className="mx-auto max-w-(--container-brunic) px-6 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block border-b border-line py-3 font-medium aria-[current=page]:text-brand-text"
                >
                  {item.label}
                </Link>
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
