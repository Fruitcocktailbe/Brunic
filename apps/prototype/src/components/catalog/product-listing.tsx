"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useOptimistic, useRef, useState, useTransition, type ReactNode } from "react";
import type { ListingData } from "@/lib/catalog/listing";
import { activeFilterCount, labelFor, PAGE_SIZE, serializeListState, SORTS, type FacetGroup, type FacetLabelMap, type ListState, type SortKey } from "@/lib/catalog/filters";
import { Drawer } from "@/components/ui/drawer";
import { Icon } from "@/components/ui/icon";
import { ProductCard } from "./product-card";

const NO_LABELS: FacetLabelMap = {};

/**
 * Productlijst met filters, sortering en "meer laden". De toestand leeft in de URL
 * (deelbaar, terugknop werkt). Filteren, tellen en pagineren gebeurt op de server
 * (lib/catalog/listing.ts, B11): deze component krijgt enkel de getoonde producten en de
 * filtergroepen, en vraagt bij elke keuze een nieuwe serverrender via router.replace.
 * Keuzes verschijnen meteen (optimistisch); het raster dimt tot de nieuwe lijst er is.
 */
export function ProductListing({
  data,
  promo,
  emptyState,
  showOffersToggle = true,
  facetLabels = NO_LABELS,
}: {
  data: ListingData;
  /** Labels voor filterwaarden die slugs zijn (bv. hoofdcategorie). */
  facetLabels?: FacetLabelMap;
  /** Brede campagnetegel die na de 8e kaart in het raster verschijnt (referentie). */
  promo?: ReactNode;
  emptyState?: ReactNode;
  showOffersToggle?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setOptimisticState] = useOptimistic(data.state);
  // Blijft true tot de serverrender van de nieuwe URL binnen is (router.replace in een transition).
  const [pending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const update = useCallback(
    (next: Partial<ListState>, resetPage = true) => {
      const merged: ListState = { ...state, ...next, page: resetPage ? 1 : (next.page ?? state.page) };
      // Andere parameters (?q=, ?weergave=) blijven staan. Gelezen bij de klik en niet via
      // useSearchParams: zo blijft de lijst in de server-HTML (geen client-side bailout).
      const url = `${pathname}${serializeListState(merged, new URLSearchParams(window.location.search))}`;
      startTransition(() => {
        setOptimisticState(merged);
        router.replace(url, { scroll: false });
      });
    },
    [state, router, pathname, setOptimisticState],
  );

  const toggleValue = (key: string, value: string) => {
    const cur = state.selection[key] ?? [];
    const nextVals = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
    update({ selection: { ...state.selection, [key]: nextVals } });
  };
  const clearKey = (key: string) => update({ selection: { ...state.selection, [key]: [] } });
  const clearAll = () => update({ selection: {}, offersOnly: false });

  const { items: shown, total, groups, hasOffers } = data;
  const activeCount = activeFilterCount(state);

  // Kleeft de filterbalk (desktop)? Dan schuift hij mee omhoog wanneer de header inklapt
  // (transform, geen top-wijziging: dat zou als layoutverschuiving tellen — B10).
  const meetpunt = useRef<HTMLDivElement>(null);
  const [vast, setVast] = useState(false);
  useEffect(() => {
    const el = meetpunt.current;
    if (!el) return;
    let io: IntersectionObserver | undefined;
    const start = () => {
      io?.disconnect();
      const h = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 106;
      io = new IntersectionObserver(([e]) => setVast(!e.isIntersecting && e.boundingClientRect.top < h + 1), { rootMargin: `-${h + 1}px 0px 0px 0px` });
      io.observe(el);
    };
    start();
    window.addEventListener("resize", start);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", start);
    };
  }, []);

  // Na "meer tonen": focus naar het eerste nieuwe product (toetsenbordgebruikers).
  const firstNewRef = useRef<HTMLLIElement>(null);
  const [focusNew, setFocusNew] = useState(false);
  useEffect(() => {
    if (focusNew && firstNewRef.current) {
      firstNewRef.current.querySelector<HTMLAnchorElement>("a")?.focus();
      setFocusNew(false);
    }
  }, [focusNew, shown.length]);

  return (
    <div>
      <div ref={meetpunt} aria-hidden="true" />
      {/* Filterbalk */}
      <div
        className={`z-30 bg-white py-3 transition-transform duration-200 motion-reduce:transition-none lg:sticky lg:top-[var(--header-h,106px)] ${
          vast ? "lg:-translate-y-[var(--header-inklap,0px)]" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            {groups.slice(0, 6).map((g) => (
              <FacetDropdown key={g.def.key} group={g} selected={state.selection[g.def.key] ?? []} onToggle={toggleValue} onClear={clearKey} />
            ))}
          </div>
          <button type="button" onClick={() => setDrawerOpen(true)} className="btn btn-outline h-12 gap-3 px-4 text-[15px] sm:px-5" aria-haspopup="dialog">
            Alle filters
            {activeCount > 0 ? (
              <span className="flex size-6 items-center justify-center rounded-full bg-ink text-xs text-white">{activeCount}</span>
            ) : (
              <Icon name="filter" size={22} />
            )}
          </button>
          <SortSelect value={state.sort} onChange={(sort) => update({ sort })} />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-[14px] text-ink-80" role="status" aria-live="polite">
            {pending ? "Bezig met filteren…" : `${total} ${total === 1 ? "product" : "producten"}`}
          </p>
          {showOffersToggle && hasOffers && (
            <label className="flex cursor-pointer items-center gap-3 text-[14px] font-medium">
              Enkel aanbiedingen
              <input
                type="checkbox"
                role="switch"
                checked={state.offersOnly}
                onChange={(e) => update({ offersOnly: e.target.checked })}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative h-5 w-9 rounded-full bg-ink-40 transition-colors peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink after:absolute after:left-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4"
              />
            </label>
          )}
        </div>

        {activeCount > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-2" role="list" aria-label="Actieve filters">
            {Object.entries(state.selection).flatMap(([key, vals]) =>
              vals.map((v) => (
                <li key={`${key}-${v}`}>
                  <button
                    type="button"
                    onClick={() => toggleValue(key, v)}
                    className="flex min-h-9 items-center gap-1.5 rounded-full bg-mist px-3 text-[13px] hover:bg-sand"
                    aria-label={`Filter verwijderen: ${labelFor(key, v, facetLabels)}`}
                  >
                    {labelFor(key, v, facetLabels)} <Icon name="close" size={14} />
                  </button>
                </li>
              )),
            )}
            {state.offersOnly && (
              <li>
                <button type="button" onClick={() => update({ offersOnly: false })} className="flex min-h-9 items-center gap-1.5 rounded-full bg-mist px-3 text-[13px] hover:bg-sand">
                  Enkel aanbiedingen <Icon name="close" size={14} />
                </button>
              </li>
            )}
            <li>
              <button type="button" onClick={clearAll} className="min-h-9 px-2 text-[13px] font-medium underline underline-offset-2">
                Alle filters wissen
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Raster */}
      <div aria-busy={pending} className={`transition-opacity duration-150 ${pending ? "opacity-50" : ""}`}>
        {total === 0 ? (
          (emptyState ?? (
            <div className="my-10 rounded-[var(--radius-tile)] bg-cloud px-6 py-14 text-center">
              <Icon name="search" size={36} className="mx-auto text-ink-60" />
              <p className="mt-4 text-lg font-medium">Geen producten gevonden</p>
              <p className="mt-1 text-ink-80">{activeCount > 0 ? "Met deze filtercombinatie vinden we niets. Probeer minder filters." : "Hier staan nog geen producten."}</p>
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="btn btn-primary mt-6">
                  Alle filters wissen
                </button>
              )}
            </div>
          ))
        ) : (
          // Op mobiel twee kolommen (B22): één kaart per rij gaf ±440 px per product.
          <ul role="list" className="mt-4 grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-5">
            {shown.map((p, i) => (
              <FragmentWithPromo key={p.id} index={i} promo={promo && activeCount === 0 && i === 8 ? promo : null}>
                <li ref={i === (data.state.page - 1) * PAGE_SIZE && data.state.page > 1 ? firstNewRef : undefined}>
                  <ProductCard product={p} priority={i < 4} tone={i} />
                </li>
              </FragmentWithPromo>
            ))}
          </ul>
        )}
      </div>

      {/* Meer laden (referentie: "Vous avez vu 49 produits sur 49") */}
      {total > 0 && (
        <div className="mx-auto mt-10 flex max-w-sm flex-col items-center gap-3 text-center">
          <p className="text-[14px] text-ink-80">
            U hebt {shown.length} van {total} producten bekeken
          </p>
          <div className="h-1 w-full overflow-hidden rounded-full bg-mist" aria-hidden="true">
            <div className="h-full rounded-full bg-ink" style={{ width: `${(shown.length / total) * 100}%` }} />
          </div>
          {shown.length < total && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                update({ page: state.page + 1 }, false);
                setFocusNew(true);
              }}
              className="btn btn-outline mt-2"
            >
              {pending ? "Bezig met laden…" : `${Math.min(PAGE_SIZE, total - shown.length)} meer tonen`}
            </button>
          )}
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={clearAll} className="btn btn-outline flex-1" disabled={activeCount === 0}>
              Alles wissen
            </button>
            <button type="button" onClick={() => setDrawerOpen(false)} className="btn btn-primary flex-[1.4]">
              {pending ? "Bezig…" : `Toon ${total} ${total === 1 ? "product" : "producten"}`}
            </button>
          </div>
        }
      >
        <div className="px-5 pb-6">
          {showOffersToggle && hasOffers && (
            <label className="flex min-h-14 cursor-pointer items-center justify-between border-b border-line text-[15px] font-medium">
              Enkel aanbiedingen
              <input type="checkbox" checked={state.offersOnly} onChange={(e) => update({ offersOnly: e.target.checked })} className="size-5 accent-[var(--color-ink)]" />
            </label>
          )}
          {groups.map((g) => (
            <details key={g.def.key} className="group border-b border-line" open={(state.selection[g.def.key] ?? []).length > 0 || g.def.key === groups[0]?.def.key}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                <span>
                  {g.def.label}
                  {(state.selection[g.def.key] ?? []).length > 0 && <span className="ml-2 text-ink-60">({state.selection[g.def.key].length})</span>}
                </span>
                <Icon name="chevronDown" size={20} className="transition-transform group-open:rotate-180" />
              </summary>
              <FacetOptions group={g} selected={state.selection[g.def.key] ?? []} onToggle={toggleValue} />
            </details>
          ))}
        </div>
      </Drawer>
    </div>
  );
}

function FragmentWithPromo({ children, promo }: { children: ReactNode; promo: ReactNode; index: number }) {
  return (
    <>
      {promo && <li className="col-span-full">{promo}</li>}
      {children}
    </>
  );
}

function FacetOptions({ group, selected, onToggle }: { group: FacetGroup; selected: string[]; onToggle: (k: string, v: string) => void }) {
  return (
    <ul role="list" className="space-y-1 pb-4">
      {group.options.map((o) => {
        const checked = selected.includes(o.value);
        return (
          <li key={o.value}>
            <label className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-[14px] hover:bg-mist ${o.count === 0 && !checked ? "text-ink-40" : ""}`}>
              <input
                type="checkbox"
                checked={checked}
                disabled={o.count === 0 && !checked}
                onChange={() => onToggle(group.def.key, o.value)}
                className="size-[18px] shrink-0 accent-[var(--color-ink)]"
              />
              {o.swatch && <span className="size-5 shrink-0 rounded-full ring-1 ring-line-strong/40" style={{ background: o.swatch }} aria-hidden="true" />}
              <span className="flex-1">{o.label}</span>
              <span className="text-ink-60">{o.count}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

/** Filterpil met uitklappaneel (desktop). */
function FacetDropdown({
  group,
  selected,
  onToggle,
  onClear,
}: {
  group: FacetGroup;
  selected: string[];
  onToggle: (k: string, v: string) => void;
  onClear: (k: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className={`flex h-12 items-center gap-2 rounded-[var(--radius-field)] border px-3 text-[15px] font-medium text-ink-80 transition-colors hover:border-ink ${
          selected.length ? "border-ink bg-mist text-ink" : "border-line-strong"
        }`}
      >
        {group.def.label}
        {selected.length > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[11px] text-white">{selected.length}</span>}
        <Icon name="chevronDown" size={20} className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div id={id} className="absolute left-0 top-[calc(100%+6px)] z-40 w-[300px] rounded-[var(--radius-tile)] bg-white p-3 shadow-[var(--shadow-pop)] ring-1 ring-line">
          <div className="max-h-[320px] overflow-y-auto">
            <FacetOptions group={group} selected={selected} onToggle={onToggle} />
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <button type="button" onClick={() => onClear(group.def.key)} disabled={!selected.length} className="px-2 text-[13px] font-medium underline underline-offset-2 disabled:text-ink-40 disabled:no-underline">
              Wissen
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-primary btn-sm">
              Klaar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SortSelect({ value, onChange }: { value: SortKey; onChange: (s: SortKey) => void }) {
  const id = useId();
  return (
    <div className="relative ml-auto">
      <label htmlFor={id} className="sr-only">
        Sorteren op
      </label>
      <Icon name="sort" size={20} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
      {/* Zichtbaar voorvoegsel naast de keuze (desktop), zoals "Trier par" bij de referentie. */}
      <span aria-hidden="true" className="pointer-events-none absolute left-10 top-1/2 hidden -translate-y-1/2 text-[15px] font-medium text-ink-60 sm:block">
        Sorteren:
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-12 max-w-[200px] appearance-none truncate rounded-[var(--radius-field)] border border-line-strong bg-white pl-10 pr-10 text-[15px] font-medium hover:border-ink sm:max-w-none sm:pl-[112px]"
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
  );
}
