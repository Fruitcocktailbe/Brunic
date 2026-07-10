export type Lead = {
  naam: string;
  telefoonRuw: string;
  /** E.164, of null als het formaat niet herkend werd (lead sneuvelt daar nooit op). */
  telefoon: string | null;
  email: string;
  plaats: string;
  diensten: string[];
  project: string;
  termijn: string;
  belmoment: string;
  marketing: boolean;
  /** ISO-8601, het moment van toestemming. */
  tijdstip: string;
};

export type OpmetingState = {
  status: "leeg" | "ok" | "fout";
  message?: string;
  /** Veldnaam → foutmelding, voor inline weergave. */
  velden?: Record<string, string>;
};
