/**
 * De létterlijke tekst naast elk vinkje. Bij een GDPR-controle moet aantoonbaar zijn
 * wáár de klant mee akkoord ging, niet enkel dát er een vinkje stond. Wijzigt de tekst op
 * de pagina, dan wijzigt hij hier — en dus ook in wat we bij de klant opslaan.
 *
 * Twee rechtsgronden, bewust gescheiden (nooit bundelen in één vinkje):
 *  - service: nodig om de vraag te beantwoorden. Verplicht.
 *  - marketing: optioneel, standaard NIET aangevinkt.
 */
export const SERVICE_CONSENT_TEKST = "Ik ga ermee akkoord dat Brunic mijn gegevens gebruikt om mij te contacteren over deze aanvraag.";

export const MARKETING_CONSENT_TEKST =
  "Ja, ik ontvang graag interieurinspiratie en aanbiedingen van Brunic per e-mail. Ik kan mij op elk moment uitschrijven.";

/** Wat bij de nieuwsbriefband staat: de inschrijving zelf is de toestemming. */
export const NIEUWSBRIEF_TEKST = "Schrijf u in voor inspiratie, nieuwe collecties en acties van Brunic. Uitschrijven kan altijd, met één klik.";

/**
 * Shopify verwacht E.164. Belgische invoer ("0470 12 34 56", "054 33 73 52") normaliseren.
 * Lukt het niet, dan null — het ruwe nummer belandt dan in de notitie.
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
export const geldigEmail = (x: string) => EMAIL.test(x);
