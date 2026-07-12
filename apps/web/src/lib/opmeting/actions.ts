"use server";

import { DIENSTEN, geldigEmail, normaliseerTelefoon } from "./consent";
import { uploadOpmetingFotos } from "./fotos";
import { bewaarKlant, koppelOpmetingFotos, markeerVoorOpvolging } from "./klant";
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

  // De aanvraag is pas écht verloren als er niets duurzaams is opgeslagen.
  // De klant zit dan nergens in Shopify, dus er is geen vangnet — zeg dat eerlijk.
  if (!klantId) {
    return {
      status: "fout",
      message:
        "Er ging technisch iets mis bij het versturen. Bel ons gerust op 054 33 73 52 — dan plannen we uw opmeting meteen in.",
    };
  }

  // 2) Foto's uploaden en aan de klant koppelen. Best effort — een mislukte upload mag
  //    de lead niet kelderen. Gebeurt vóór de Flow-vlag zodat de foto's al bij de klant
  //    hangen wanneer Sandra de notificatie krijgt.
  try {
    const fotos = formData.getAll("fotos").filter((x): x is File => x instanceof File);
    const gids = await uploadOpmetingFotos(fotos);
    await koppelOpmetingFotos(klantId, gids);
  } catch (e) {
    console.error("[opmeting] foto-upload/koppeling mislukt (lead blijft behouden):", e);
  }

  // 3) "Onbehandeld"-vlag zetten → dit is wat Shopify Flow doet afgaan (Customer updated),
  //    waarna Flow Sandra mailt. Zie decisions/log.md 2026-07-10.
  try {
    await markeerVoorOpvolging(klantId);
  } catch (e) {
    // De lead is opgeslagen onder tag 'opmeting-lead' (zichtbare achterstand in de admin),
    // dus geen foutmelding aan de klant — wel luid loggen: Sandra krijgt geen mail.
    console.error(
      "[opmeting] LEAD OPGESLAGEN MAAR FLOW-VLAG MISLUKT — klant:",
      klantId,
      "| Sandra kreeg geen notificatie. Fout:",
      e,
    );
  }

  return { status: "ok" };
}
