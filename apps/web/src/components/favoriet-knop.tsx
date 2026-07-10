"use client";

import { useState } from "react";
import { MAX_FAVORIETEN, useFavorieten } from "@/lib/favorieten/store";

const HART =
  "M12 21s-7.5-4.9-9.5-9.2C.9 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.7l1 1.6 1-1.6C14 6.1 15.6 5 17.6 5 21 5 23.1 8.4 21.5 11.8 19.5 16.1 12 21 12 21Z";

export function FavorietKnop({
  handle,
  titel,
  variantId,
  variant = "icoon",
}: {
  handle: string;
  titel: string;
  variantId?: string;
  variant?: "icoon" | "knop";
}) {
  const { bevat, toggle, geladen } = useFavorieten();
  const [vol, setVol] = useState(false);

  const bewaard = bevat(handle);

  function klik() {
    const gelukt = toggle({ handle, variantId });
    if (!gelukt) {
      setVol(true);
      window.setTimeout(() => setVol(false), 4000);
    }
  }

  // Vóór hydratatie weten we de staat niet: neutraal renderen voorkomt een verkeerd hartje.
  const gevuld = geladen && bewaard;

  if (variant === "knop") {
    return (
      <div>
        <button
          type="button"
          onClick={klik}
          aria-pressed={gevuld}
          className={`flex items-center gap-2 rounded-s border-2 px-6 py-3 font-bold transition ${
            gevuld
              ? "border-brand bg-brand-tint text-brand-text"
              : "border-ink hover:bg-ink hover:text-ivory"
          }`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill={gevuld ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d={HART} />
          </svg>
          {gevuld ? "Bewaard op uw winkellijst" : "Bewaar als favoriet"}
        </button>
        {vol ? <Vol /> : null}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={klik}
        aria-pressed={gevuld}
        aria-label={gevuld ? `${titel} staat op uw winkellijst` : `Bewaar ${titel} als favoriet`}
        className={`absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full border bg-white/95 transition hover:scale-105 ${
          gevuld ? "border-brand text-brand" : "border-line text-ink hover:border-brand hover:text-brand"
        }`}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill={gevuld ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d={HART} />
        </svg>
      </button>
      {vol ? <Vol /> : null}
    </>
  );
}

function Vol() {
  return (
    <p
      role="status"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-s bg-ink px-5 py-3 text-sm font-bold text-ivory shadow-l"
    >
      Uw winkellijst is vol — verwijder eerst een favoriet (max {MAX_FAVORIETEN}).
    </p>
  );
}
