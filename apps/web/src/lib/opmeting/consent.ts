/**
 * De létterlijke tekst naast elk vinkje. Bij een GDPR-controle moet aantoonbaar zijn
 * wáár de klant mee akkoord ging, niet enkel dát er een vinkje stond. Wijzigt de tekst
 * op de pagina, dan wijzigt hij hier — en dus ook in wat we bij de klant opslaan.
 */
export const SERVICE_CONSENT_TEKST =
  "Ik ga ermee akkoord dat Brunic mijn gegevens gebruikt om contact met mij op te nemen over deze opmetingsaanvraag.";

export const MARKETING_CONSENT_TEKST =
  "Ja, ik ontvang graag interieurinspiratie en aanbiedingen van Brunic per e-mail. Ik kan mij op elk moment uitschrijven.";

/**
 * Twee verschillende rechtsgronden, bewust gescheiden:
 *  - service: nodig om de aanvraag uit te voeren (Sandra belt terug). Verplicht vinkje.
 *  - marketing: apart, optioneel, standaard NIET aangevinkt. Nooit gebundeld.
 * Bundelen van beide in één vinkje is de klassieke GBA-inbreuk.
 */
export const DIENSTEN = [
  { value: "gordijnen", label: "Gordijnen & stoffen" },
  { value: "raamdecoratie", label: "Raamdecoratie" },
  { value: "vloeren", label: "Vloeren" },
  { value: "tapijten", label: "Tapijten & karpetten" },
  { value: "behang", label: "Behang" },
  { value: "maatwerk", label: "Atelier & maatwerk" },
] as const;

export const TERMIJNEN = [
  "Zo snel mogelijk",
  "Binnen de maand",
  "Binnen 1–3 maanden",
  "Ik oriënteer me nog",
] as const;

export const BELMOMENTEN = ["Overdag (9–17u)", "'s Avonds (17–19u)", "Op zaterdag"] as const;

/**
 * Shopify verwacht E.164. Belgische invoer ("0470 12 34 56", "054 33 73 52") normaliseren.
 * Lukt het niet, dan geven we null terug — we laten de lead NOOIT sneuvelen op een
 * telefoonformaat; het ruwe nummer belandt dan in de notitie en de e-mail.
 */
export function normaliseerTelefoon(ruw: string): string | null {
  const cijfers = ruw.replace(/[^\d+]/g, "");
  if (!cijfers) return null;

  if (cijfers.startsWith("+")) return /^\+\d{8,15}$/.test(cijfers) ? cijfers : null;
  if (cijfers.startsWith("00")) {
    const e164 = `+${cijfers.slice(2)}`;
    return /^\+\d{8,15}$/.test(e164) ? e164 : null;
  }
  if (cijfers.startsWith("0")) {
    const e164 = `+32${cijfers.slice(1)}`;
    return /^\+32\d{8,9}$/.test(e164) ? e164 : null;
  }
  return null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function geldigEmail(x: string): boolean {
  return EMAIL.test(x);
}
