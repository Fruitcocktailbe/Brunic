"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { ImageSlot } from "@/components/ui/image-slot";
import { Price } from "@/components/catalog/price";
import type { CardProduct } from "@/lib/catalog/view";
import { routes } from "@/lib/routes";

type Suggest = { categories: { id: string; name: string; href: string; trail: string }[]; products: CardProduct[]; total: number };

/**
 * Groot zoekveld met live suggesties (zoals de referentie: links categorieën,
 * rechts producten + "Alles bekijken"). Enter → zoekresultatenpagina.
 */
export function SearchBox({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(pathname === routes.search() ? (params.get("q") ?? "") : "");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Suggest | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  /** Pijltoetsen: van het veld naar de suggesties en ertussen; Escape terug naar het veld. */
  const moveFocus = (dir: 1 | -1) => {
    const links = Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("a[data-suggestie]") ?? []);
    if (links.length === 0) return;
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (i === -1) links[dir === 1 ? 0 : links.length - 1].focus();
    else if (i + dir < 0) input.current?.focus();
    else links[Math.min(links.length - 1, i + dir)].focus();
  };
  const panelId = useId();

  // Live suggesties (kleine vertraging tegen overbodige requests).
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setData(null);
      return;
    }
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      fetch(`/api/zoeken?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d: Suggest) => setData(d))
        .catch(() => {});
    }, 140);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [q]);

  // Sluiten bij klik buiten het veld en bij navigatie.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);
  useEffect(() => {
    setOpen(false);
    // Op de zoekpagina volgt het veld de actuele zoekterm (bv. na een klik op een suggestie).
    if (pathname === routes.search()) setQ(params.get("q") ?? "");
  }, [pathname, params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    setOpen(false);
    input.current?.blur();
    router.push(routes.search(term || undefined));
  };

  const showPanel = open && q.trim().length >= 2 && data !== null;

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <form role="search" onSubmit={submit} className="relative">
        <label htmlFor={`${panelId}-input`} className="sr-only">
          Zoeken in de catalogus
        </label>
        <Icon name="search" size={22} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          ref={input}
          id={`${panelId}-input`}
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault(); // anders wist de browser het zoekveld
              setOpen(false);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              moveFocus(1);
            }
          }}
          role="combobox"
          aria-autocomplete="list"
          placeholder="Zoek een product of categorie"
          autoComplete="off"
          aria-expanded={showPanel}
          aria-controls={`${panelId}-panel`}
          className="h-[46px] w-full rounded-[var(--radius-field)] border border-line-strong/70 bg-mist pl-12 pr-11 text-sm outline-none placeholder:text-ink-60 focus:border-ink focus:bg-white focus:ring-1 focus:ring-ink [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              input.current?.focus();
            }}
            className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-sand"
            aria-label="Zoekterm wissen"
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </form>

      {showPanel && (
        <div
          ref={panel}
          role="region"
          aria-label="Zoeksuggesties"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              moveFocus(e.key === "ArrowDown" ? 1 : -1);
            }
            if (e.key === "Escape") {
              setOpen(false);
              input.current?.focus();
            }
          }}
          id={`${panelId}-panel`}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[70vh] overflow-y-auto rounded-[var(--radius-tile)] bg-white p-4 shadow-[var(--shadow-pop)] ring-1 ring-line lg:-left-[110px] lg:-right-[260px] lg:p-5"
        >
          {data.total === 0 && data.categories.length === 0 ? (
            <div className="py-6 text-center">
              <p className="font-medium">Geen resultaten voor “{q.trim()}”</p>
              <p className="mt-1 text-ink-60">Probeer een ander woord, bv. rolgordijn, behang of tapijt.</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="mb-2 text-lg font-medium">Categorieën</p>
                {data.categories.length === 0 && <p className="text-ink-60">Geen categorieën gevonden.</p>}
                <ul role="list">
                  {data.categories.map((c) => (
                    <li key={c.id}>
                      <Link href={c.href} data-suggestie className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-mist focus-visible:bg-mist">
                        <span className="font-medium">{c.name}</span>
                        {c.trail && <span className="block text-xs text-ink-60">{c.trail}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-lg font-medium">Producten</p>
                  {data.total > 0 && (
                    <Link href={routes.search(q.trim())} data-suggestie className="btn btn-outline btn-sm">
                      Alle {data.total} bekijken <Icon name="chevronRight" size={16} />
                    </Link>
                  )}
                </div>
                <ul role="list" className="space-y-1">
                  {data.products.map((p) => (
                    <li key={p.id}>
                      <Link href={routes.product(p.slug)} data-suggestie className="flex items-center gap-4 rounded-xl p-2 hover:bg-mist focus-visible:bg-mist">
                        <ImageSlot src={p.image?.src} alt="" className="aspect-[4/3] w-24 shrink-0 rounded-xl" />
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-sm">{p.title}</span>
                          <Price card={p} size="sm" className="mt-1" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
