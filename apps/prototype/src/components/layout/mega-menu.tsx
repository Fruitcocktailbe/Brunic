"use client";

import Link from "next/link";
import { useState } from "react";
import type { MenuNode } from "@/lib/catalog/menu";
import { routes } from "@/lib/routes";
import { Icon } from "@/components/ui/icon";

/**
 * Megamenu onder "Catalogus" (zoals "Tous nos produits" bij de referentie):
 * links de hoofdcategorieën, rechts een flyout met de onderverdeling in kolommen.
 * Volledig gevoed door de categorieboom — nieuwe/hernoemde categorieën verschijnen
 * hier automatisch.
 */
export function MegaMenu({ menu, onNavigate }: { menu: MenuNode[]; onNavigate: () => void }) {
  const [activeId, setActiveId] = useState<string>(menu[0]?.id ?? "");
  const active = menu.find((m) => m.id === activeId) ?? menu[0];

  return (
    // Escape wordt in de header afgehandeld (sluiten + focus terug naar de Catalogus-knop).
    <div id="megamenu" className="absolute left-0 right-0 top-full z-40 pt-1">
      <div className="shell">
        <div className="flex min-h-[540px] overflow-hidden rounded-b-[var(--radius-tile)] rounded-tr-[var(--radius-tile)] bg-white shadow-[var(--shadow-pop)] ring-1 ring-line">
          {/* Kolom 1: hoofdcategorieën */}
          <ul className="w-[300px] shrink-0 border-r border-line py-1" role="list">
            {menu.map((m) => (
              <li key={m.id}>
                <Link
                  href={m.href}
                  onClick={onNavigate}
                  onMouseEnter={() => setActiveId(m.id)}
                  onFocus={() => setActiveId(m.id)}
                  aria-current={m.id === active?.id ? "true" : undefined}
                  className={`flex min-h-[45px] items-center justify-between border-b border-line px-3 text-sm transition-colors ${
                    m.id === active?.id ? "bg-mist" : "hover:bg-mist"
                  }`}
                >
                  {m.name}
                  {m.children.length > 0 && <Icon name="chevronRight" size={16} className="text-ink-60" />}
                </Link>
              </li>
            ))}
            <li>
              <Link href={routes.catalog()} onClick={onNavigate} className="flex min-h-[45px] items-center border-b border-line px-3 text-sm font-medium hover:bg-mist">
                Volledige catalogus
              </Link>
            </li>
            <li>
              <Link href={routes.offers()} onClick={onNavigate} className="flex min-h-[45px] items-center px-3 text-sm font-medium text-brand-dark hover:bg-mist">
                Aanbiedingen
              </Link>
            </li>
          </ul>

          {/* Kolom 2: flyout van de actieve hoofdcategorie */}
          {active && (
            <div className="flex min-w-0 flex-1 flex-col p-5 xl:p-6">
              <div className="flex items-baseline gap-4">
                <h2 className="text-lg font-semibold">{active.name}</h2>
                <Link href={active.href} onClick={onNavigate} className="inline-flex items-center gap-1.5 text-[13px] hover:underline">
                  Alles bekijken <Icon name="arrowRight" size={18} />
                </Link>
              </div>
              <div className="mt-6 grid flex-1 grid-cols-3 content-start gap-x-8 gap-y-8 xl:grid-cols-4">
                {active.children.map((sub) => (
                  <div key={sub.id}>
                    <Link href={sub.href} onClick={onNavigate} className="text-sm font-semibold hover:underline">
                      {sub.name}
                    </Link>
                    {sub.children.length > 0 && (
                      <ul className="mt-3 space-y-2.5" role="list">
                        {sub.children.map((leaf) => (
                          <li key={leaf.id}>
                            <Link href={leaf.href} onClick={onNavigate} className="text-sm text-ink-80 hover:text-ink hover:underline">
                              {leaf.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {active.children.length === 0 && <p className="text-sm text-ink-60">Nog geen onderverdeling — bekijk alle producten.</p>}
              </div>
              <div className="mt-6 flex justify-end">
                <Link href={routes.offers(active.slug)} onClick={onNavigate} className="text-sm font-semibold hover:underline">
                  Aanbiedingen {active.name}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
