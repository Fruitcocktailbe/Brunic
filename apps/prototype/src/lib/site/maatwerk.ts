import type { CategoryId } from "@/lib/catalog/types";

/**
 * Welk "op maat"-verhaal past bij een afdeling. Enkel waar Brunic echt maatwerk levert,
 * spreken we van opmeting, atelier of plaatsing; elders (behang, verf …) nodigen we uit
 * in de winkel.
 *
 * - stoffen:  gordijnen op maat uit eigen atelier, opmeting + plaatsing (ook raamdecoratie)
 * - tapijten: tapijt op maat (dienst tapijt-op-maat)
 * - vloer:    vasttapijt, gratis opgemeten en gelegd door eigen mensen
 * - winkel:   geen maatwerk → stalenboeken en advies in de winkel
 */
export type Maatwerk = "stoffen" | "tapijten" | "vloer" | "winkel";

const PER_AFDELING: Record<CategoryId, Maatwerk> = {
  c05: "stoffen", // Gordijnen & stoffen
  c01: "stoffen", // Raamdecoratie (op maat, zelfde opmeting en plaatsing)
  c03: "tapijten",
  c04: "vloer",
};

/** `rootId` = de hoofdcategorie (eerste element van het kruimelpad). */
export function maatwerkVoor(rootId: CategoryId | undefined): Maatwerk {
  return (rootId && PER_AFDELING[rootId]) || "winkel";
}

export const isOpMaat = (m: Maatwerk) => m !== "winkel";
