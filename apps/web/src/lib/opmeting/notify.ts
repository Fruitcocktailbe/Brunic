import type { Lead } from "./types";

export type NotifyResultaat = { verzonden: boolean; reden?: string };

/**
 * Notificatie naar Brunic. Best effort: deze functie gooit NOOIT.
 * De aanvraag is op dat moment al duurzaam opgeslagen als Shopify-klant;
 * een mislukte mail mag een lead niet laten sneuvelen.
 */
export async function stuurNotificatie(lead: Lead): Promise<NotifyResultaat> {
  const key = process.env.RESEND_API_KEY;
  const naar = process.env.OPMETING_NOTIFY_TO ?? "info@brunic.be";
  const van = process.env.OPMETING_NOTIFY_FROM;

  if (!key || !van) {
    return { verzonden: false, reden: "RESEND_API_KEY of OPMETING_NOTIFY_FROM ontbreekt" };
  }

  const regels = [
    `Naam:        ${lead.naam}`,
    `Telefoon:    ${lead.telefoonRuw}${lead.telefoon ? "" : "  (niet-herkend formaat)"}`,
    `E-mail:      ${lead.email || "—"}`,
    `Gemeente:    ${lead.plaats || "—"}`,
    `Diensten:    ${lead.diensten.length ? lead.diensten.join(", ") : "—"}`,
    `Termijn:     ${lead.termijn || "—"}`,
    `Belmoment:   ${lead.belmoment || "—"}`,
    "",
    "Project:",
    lead.project || "(geen omschrijving)",
    "",
    `Marketing-opt-in: ${lead.marketing ? "JA" : "nee"}`,
    `Ontvangen: ${lead.tijdstip}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: van,
        to: [naar],
        reply_to: lead.email || undefined,
        subject: `Nieuwe opmetingsaanvraag — ${lead.naam}${lead.plaats ? ` (${lead.plaats})` : ""}`,
        text: regels,
      }),
      cache: "no-store",
    });

    if (!res.ok) return { verzonden: false, reden: `Resend HTTP ${res.status}` };
    return { verzonden: true };
  } catch (e) {
    return { verzonden: false, reden: e instanceof Error ? e.message : "onbekende fout" };
  }
}
