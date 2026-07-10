"use server";

import { DIENSTEN, geldigEmail, normaliseerTelefoon } from "./consent";
import { bewaarKlant, markeerVoorOpvolging } from "./klant";
import { stuurNotificatie } from "./notify";
import type { Lead, OpmetingState } from "./types";

const GELDIGE_DIENSTEN = new Set(DIENSTEN.map((d) => d.value));

function tekst(fd: FormData, key: string, max = 2000): string {
  return String(fd.get(key) ?? "")
    .trim()
    .slice(0, max);
}

export async function verstuurOpmeting(
  _vorige: OpmetingState,
  formData: FormData,
): Promise<OpmetingState> {
  // Honeypot: bots vullen elk veld in. Mensen zien dit veld nooit.
  if (tekst(formData, "website")) return { status: "ok" };

  const naam = tekst(formData, "naam", 120);
  const telefoonRuw = tekst(formData, "telefoon", 40);
  const email = tekst(formData, "email", 160).toLowerCase();
  const plaats = tekst(formData, "plaats", 120);
  const project = tekst(formData, "project", 2000);
  const termijn = tekst(formData, "termijn", 60);
  const belmoment = tekst(formData, "belmoment", 60);
  const marketing = formData.get("marketing") === "on";
  const serviceConsent = formData.get("consent") === "on";

  const diensten = formData
    .getAll("dienst")
    .map(String)
    .filter((d) => GELDIGE_DIENSTEN.has(d as (typeof DIENSTEN)[number]["value"]));

  const velden: Record<string, string> = {};
  if (naam.length < 2) velden.naam = "Vul uw naam in.";
  if (telefoonRuw.length < 6) velden.telefoon = "Vul een telefoonnummer in waarop we u kunnen bereiken.";
  if (email && !geldigEmail(email)) velden.email = "Dit e-mailadres lijkt niet te kloppen.";
  if (!serviceConsent) velden.consent = "We hebben uw akkoord nodig om u te mogen contacteren.";
  // Marketing zonder e-mailadres is betekenisloos: we zouden nergens heen kunnen mailen.
  if (marketing && !email) velden.email = "Vul uw e-mailadres in als u onze e-mails wilt ontvangen.";

  if (Object.keys(velden).length > 0) {
    return { status: "fout", message: "Kijk de aangeduide velden even na.", velden };
  }

  const lead: Lead = {
    naam,
    telefoonRuw,
    telefoon: normaliseerTelefoon(telefoonRuw),
    email,
    plaats,
    diensten,
    project,
    termijn,
    belmoment,
    marketing,
    tijdstip: new Date().toISOString(),
  };

  // 1) Duurzaam opslaan. Dit is de bron van waarheid; alle seintjes hangen hieraan.
  let klantId: string | null = null;
  try {
    klantId = (await bewaarKlant(lead)).id;
  } catch (e) {
    console.error("[opmeting] opslaan als Shopify-klant mislukt:", e);
  }

  // 2) "Onbehandeld"-vlag zetten → dit is wat Shopify Flow doet afgaan (Customer updated).
  let gemarkeerd = false;
  if (klantId) {
    try {
      await markeerVoorOpvolging(klantId);
      gemarkeerd = true;
    } catch (e) {
      console.error("[opmeting] markeren voor opvolging mislukt (Flow vuurt niet!):", e);
    }
  }

  // 3) Optioneel eigen mailkanaal. Zonder RESEND_API_KEY een stille no-op — Flow doet het werk.
  const mail = await stuurNotificatie(lead);

  // De aanvraag is pas écht verloren als er niets duurzaams is opgeslagen én niemand gemaild is.
  if (!klantId && !mail.verzonden) {
    return {
      status: "fout",
      message:
        "Er ging technisch iets mis bij het versturen. Bel ons gerust op 054 33 73 52 — dan plannen we uw opmeting meteen in.",
    };
  }

  // Wél opgeslagen, maar niemand verwittigd: de lead staat veilig in Shopify onder de tag
  // 'opmeting-lead', dus geen foutmelding aan de klant — wel luid loggen voor ons.
  if (klantId && !gemarkeerd && !mail.verzonden) {
    console.error(
      "[opmeting] LEAD OPGESLAGEN MAAR NIEMAND VERWITTIGD — klant:",
      klantId,
      "| Flow-vlag mislukt en geen mailkanaal geconfigureerd.",
    );
  }

  return { status: "ok" };
}
