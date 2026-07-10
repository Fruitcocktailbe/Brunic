"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export const CART_UPDATED = "cart:updated";

/**
 * Client-side geteld. Zou de teller server-side in de layout staan, dan leest die
 * `cookies()` en wordt élke route dynamisch — precies de SSG die we net hebben
 * vastgezet. Een korte flits van "0" is die statische pagina's ruimschoots waard.
 */
export function CartBadge() {
  const [aantal, setAantal] = useState<number | null>(null);

  const ververs = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { totalQuantity: number };
      setAantal(data.totalQuantity);
    } catch {
      /* offline of API stuk: teller blijft gewoon leeg */
    }
  }, []);

  useEffect(() => {
    void ververs();
    window.addEventListener(CART_UPDATED, ververs);
    return () => window.removeEventListener(CART_UPDATED, ververs);
  }, [ververs]);

  const toon = aantal !== null && aantal > 0;

  return (
    <Link
      href="/winkelmand"
      className="relative inline-flex items-center gap-2 rounded-s border border-line-strong px-3 py-2 text-sm font-bold transition hover:border-brand hover:text-brand-text"
      aria-label={toon ? `Winkelmand — ${aantal} artikel(en)` : "Winkelmand — leeg"}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 7h12l-1.2 12.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
      <span className="hidden sm:inline">Winkelmand</span>
      {toon ? (
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1 text-xs font-extrabold text-white">
          {aantal}
        </span>
      ) : null}
    </Link>
  );
}
