"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import type { MenuNode } from "@/lib/catalog/menu";
import type { NavItem } from "@/lib/site/navigation";
import { routes } from "@/lib/routes";
import { Icon } from "@/components/ui/icon";
import { ServiceBar } from "./service-bar";
import { SearchBox } from "./search-box";
import { HeaderActions } from "./header-actions";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { Logo } from "./logo";

/**
 * Header zoals de referentie: servicebalk · logo + groot zoekveld + winkeliconen ·
 * navigatierij met "Catalogus"-knop (megamenu). Blijft bovenaan kleven; de
 * navigatierij klapt weg bij naar beneden scrollen en komt terug bij omhoog scrollen.
 */
export function SiteHeader({ menu, nav }: { menu: MenuNode[]; nav: NavItem[] }) {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const catalogBtn = useRef<HTMLButtonElement>(null);

  // Menu's sluiten bij navigatie.
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Navigatierij in-/uitklappen op scrollrichting. Hysterese (48 px in dezelfde richting)
  // + korte vergrendeling na elke wissel: de hoogtewijziging van de header verschuift
  // zelf de scrollpositie en mag niet als "omhoog scrollen" gelezen worden (flikkeren).
  useEffect(() => {
    let last = window.scrollY;
    let travel = 0;
    let lockedUntil = 0;
    let isCollapsed = false;
    const set = (next: boolean) => {
      if (next === isCollapsed) return;
      isCollapsed = next;
      lockedUntil = performance.now() + 350;
      travel = 0;
      setCollapsed(next);
    };
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      if (performance.now() < lockedUntil) return;
      if (y < 140) return set(false);
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (travel > 48) set(true);
      else if (travel < -48) set(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Actuele headerhoogte als CSS-variabele: kleverige filterbalken lijnen erop uit.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty("--header-h", `${Math.round(el.getBoundingClientRect().height)}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Megamenu: sluiten bij klik buiten de header of Escape.
  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        catalogBtn.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  const isActive = (href: string) =>
    href === routes.catalog() ? pathname.startsWith("/catalogus") || pathname.startsWith("/product") : pathname.startsWith(href);

  const hideNav = collapsed && !megaOpen;

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white">
      <a href="#inhoud" className="sr-only-focusable absolute left-4 top-2 z-[60] rounded-full bg-ink px-4 py-2 text-white">
        Naar de inhoud
      </a>
      <ServiceBar />

      <div className="shell">
        {/* Rij 1: logo · zoeken · iconen */}
        <div className="flex h-[64px] items-center gap-2 lg:h-[76px] lg:gap-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="-ml-1 flex min-h-11 min-w-11 flex-col items-center justify-center rounded-lg text-[11px] leading-none lg:hidden"
            aria-label="Menu openen"
            aria-expanded={mobileOpen}
          >
            <Icon name="menu" size={24} />
            <span aria-hidden="true" className="mt-0.5">
              Menu
            </span>
          </button>
          <Logo />
          <Suspense fallback={<div className="hidden h-[46px] flex-1 lg:block" />}>
            <SearchBox className="hidden max-w-[660px] flex-1 lg:block" />
          </Suspense>
          <div className="ml-auto">
            <HeaderActions />
          </div>
        </div>

        {/* Rij 2 (mobiel/tablet): zoekveld */}
        <div className={`grid transition-[grid-template-rows] duration-200 lg:hidden ${collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
          <div className={collapsed ? "overflow-hidden" : ""}>
            <Suspense fallback={<div className="h-[46px]" />}>
              <SearchBox className="pb-3" />
            </Suspense>
          </div>
        </div>

        {/* Rij 3 (desktop): hoofdnavigatie */}
        <div className={`hidden transition-[grid-template-rows] duration-200 lg:grid ${hideNav ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
          <nav aria-label="Hoofdnavigatie" className={hideNav ? "overflow-hidden" : ""}>
            <div className="flex h-[64px] items-center justify-between gap-4">
              <ul className="flex items-center gap-1" role="list">
                {nav.map((item) =>
                  item.mega ? (
                    <li key={item.key} className="flex items-center">
                      <button
                        ref={catalogBtn}
                        type="button"
                        onClick={() => setMegaOpen((o) => !o)}
                        aria-expanded={megaOpen}
                        aria-controls="megamenu"
                        className={`flex h-11 items-center gap-2 rounded-[var(--radius-pill)] px-3 text-[14px] font-medium text-ink-80 transition-colors hover:bg-mist ${
                          megaOpen || isActive(item.href) ? "bg-mist text-ink" : ""
                        }`}
                      >
                        <Icon name={megaOpen ? "close" : "menu"} size={20} />
                        {item.label}
                      </button>
                      <span aria-hidden="true" className="ml-3 mr-2 h-8 w-px bg-line-strong/30" />
                      {/* In de DOM direct na de knop: Tab gaat meteen het menu in. */}
                      {megaOpen && <MegaMenu menu={menu} onNavigate={() => setMegaOpen(false)} />}
                    </li>
                  ) : (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={`flex h-11 items-center whitespace-nowrap rounded-[var(--radius-pill)] px-2.5 text-[14px] font-medium transition-colors hover:bg-mist xl:px-4 ${
                          isActive(item.href) ? "bg-mist text-ink" : "text-ink-80"
                        } ${item.accent === "offer" ? "!text-brand-dark" : ""}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
              <Link
                href={routes.measurement()}
                aria-label="Opmeting aanvragen"
                className="btn btn-outline h-12 shrink-0 rounded-[var(--radius-field)] px-3 text-[14px] xl:px-4"
              >
                <Icon name="ruler" size={20} />
                <span className="hidden xl:inline">Opmeting aanvragen</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
      <div className="border-b border-line" />

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} menu={menu} nav={nav} />
    </header>
  );
}
