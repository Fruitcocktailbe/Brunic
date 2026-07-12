"use client";

import { useCallback, useEffect, useState } from "react";

export const MAX_FAVORIETEN = 20;
export const FAVORIETEN_UPDATED = "favorieten:updated";

const SLEUTEL = "brunic:favorieten:v1";

export type Favoriet = {
  handle: string;
  /** Gekozen maat, indien de bezoeker er één koos op de PDP. */
  variantId?: string;
};

function lees(): Favoriet[] {
  if (typeof window === "undefined") return [];
  try {
    const ruw = window.localStorage.getItem(SLEUTEL);
    if (!ruw) return [];
    const data: unknown = JSON.parse(ruw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((x): x is Favoriet => !!x && typeof (x as Favoriet).handle === "string")
      .slice(0, MAX_FAVORIETEN);
  } catch {
    return [];
  }
}

function schrijf(lijst: Favoriet[]): void {
  try {
    window.localStorage.setItem(SLEUTEL, JSON.stringify(lijst));
  } catch {
    /* private mode / quota vol: de lijst blijft dan enkel in het geheugen */
  }
  window.dispatchEvent(new Event(FAVORIETEN_UPDATED));
}

/**
 * De winkellijst leeft in de browser, niet op een server: het is geen account-feature
 * en we willen geen persoonsgegevens opslaan voor iets wat de bezoeker zelf meeneemt.
 * Synchroniseert over componenten (header-teller, hartjes) via een window-event, en
 * over tabbladen via het native `storage`-event.
 */
export function useFavorieten() {
  const [lijst, setLijst] = useState<Favoriet[]>([]);
  const [geladen, setGeladen] = useState(false);

  const ververs = useCallback(() => setLijst(lees()), []);

  useEffect(() => {
    ververs();
    setGeladen(true);
    window.addEventListener(FAVORIETEN_UPDATED, ververs);
    window.addEventListener("storage", ververs);
    return () => {
      window.removeEventListener(FAVORIETEN_UPDATED, ververs);
      window.removeEventListener("storage", ververs);
    };
  }, [ververs]);

  const bevat = useCallback((handle: string) => lijst.some((f) => f.handle === handle), [lijst]);

  /** @returns false als de lijst vol zat (max MAX_FAVORIETEN) */
  const toggle = useCallback((fav: Favoriet): boolean => {
    const huidig = lees();
    const bestaat = huidig.some((f) => f.handle === fav.handle);

    if (bestaat) {
      schrijf(huidig.filter((f) => f.handle !== fav.handle));
      return true;
    }
    if (huidig.length >= MAX_FAVORIETEN) return false;

    schrijf([...huidig, fav]);
    return true;
  }, []);

  const verwijder = useCallback((handle: string) => {
    schrijf(lees().filter((f) => f.handle !== handle));
  }, []);

  /**
   * Het ERP-artikelnummer hangt aan de VARIANT, niet aan het product: elke maat is een
   * eigen artikel. Een favoriet zonder gekozen maat heeft dus geen artikelnummer — de
   * bezoeker kiest de maat alsnog op de winkellijst zelf.
   */
  const kiesVariant = useCallback((handle: string, variantId: string) => {
    schrijf(lees().map((f) => (f.handle === handle ? { ...f, variantId } : f)));
  }, []);

  const leeg = useCallback(() => schrijf([]), []);

  return { lijst, geladen, bevat, toggle, verwijder, kiesVariant, leeg, aantal: lijst.length };
}
