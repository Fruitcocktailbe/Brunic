"use client";

import Link from "next/link";
import { useFavorieten } from "@/lib/favorieten/store";

export function FavorietenBadge() {
  const { aantal, geladen } = useFavorieten();

  return (
    <Link
      href="/favorieten"
      className="relative inline-flex items-center gap-2 rounded-s border border-line-strong px-3 py-2 text-sm font-bold transition hover:border-brand hover:text-brand-text"
      aria-label={geladen ? `Favorieten — ${aantal} bewaard` : "Favorieten"}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 21s-7.5-4.9-9.5-9.2C.9 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7l1 1.6 1-1.6C14 6.1 15.6 5 17.6 5 21 5 23.1 8.4 21.5 11.8 19.5 16.1 12 21 12 21Z" />
      </svg>
      <span className="hidden sm:inline">Favorieten</span>
      {geladen && aantal > 0 ? (
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1 text-xs font-extrabold text-white">
          {aantal}
        </span>
      ) : null}
    </Link>
  );
}
