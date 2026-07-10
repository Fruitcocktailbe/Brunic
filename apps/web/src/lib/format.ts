const eur = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export function formatPrijs(amount: string | number): string {
  return eur.format(typeof amount === "string" ? Number(amount) : amount);
}

/** "Tapijt Casa CAS601 Silver" → "Casa" : het woord voor de fotoloze tegel. */
export function beeldloosWoord(title: string): string {
  const woorden = title.split(/\s+/).filter(Boolean);
  return woorden.length > 1 ? woorden[1] : (woorden[0] ?? "Brunic");
}
