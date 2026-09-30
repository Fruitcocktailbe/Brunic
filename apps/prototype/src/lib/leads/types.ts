/** Soorten aanvragen die de site verstuurt. Elk krijgt een eigen tag op de klantfiche. */
export const LEAD_SOORTEN = ["opmeting", "aanvraag", "offerte", "contact"] as const;
export type LeadSoort = (typeof LEAD_SOORTEN)[number];

export type Lead = {
  soort: LeadSoort;
  voornaam: string;
  naam: string;
  email: string;
  telefoonRuw: string;
  /** E.164, of null als het formaat niet herkend werd (een aanvraag sneuvelt daar nooit op). */
  telefoon: string | null;
  postcode: string;
  /** Dienst of onderwerp uit de keuzelijst. */
  onderwerp: string;
  bericht: string;
  /** Producten waarover de aanvraag gaat (titel · merk · uitvoering · art.nr. · URL). */
  producten: string[];
  marketing: boolean;
  /** Pagina waarop het formulier werd verstuurd. */
  bron: string;
  /** ISO-8601, het moment van versturen/toestemming. */
  tijdstip: string;
};

export type FormState = {
  status: "leeg" | "ok" | "fout";
  message?: string;
  /** Veldnaam → foutmelding, voor inline weergave. */
  velden?: Record<string, string>;
};
