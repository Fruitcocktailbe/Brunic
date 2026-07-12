// Gedeelde helpers voor de catalog-scripts.

/**
 * Haalt interne codes uit de klant-zichtbare producttitel en bewaart ze apart (voor de
 * backend / winkellijst-afdruk). Verwijdert:
 *   1. ontwerp-/modelcodes = letters gevolgd door cijfers, bv. "Opa912", "CAS601", "Jiv615";
 *   2. vrijstaande ERP-/EAN-getallen van 3+ cijfers, bv. "03400866171", "057".
 * Maten blijven staan: die zijn cijfer-eerst ("18cm", "2,5L", "1,40m") en matchen dus geen
 * van beide patronen.
 * @returns {{ titel: string, nummers: string[] }}
 */
export function schoonTitel(naam) {
  const rm = [];
  const grijp = (m) => {
    rm.push(m);
    return " ";
  };
  const out = naam
    .replace(/\b[A-Za-z]{2,4}\d{2,4}\b/g, grijp) // ontwerp-/modelcodes
    .replace(/\b\d{3,}\b/g, grijp) // vrijstaande ERP-/EAN-getallen
    .replace(/\s{2,}/g, " ")
    .replace(/\s*[-–·,]\s*$/, "")
    .trim();
  return { titel: out || naam, nummers: rm };
}
