import { admin } from "@/lib/shopify/admin";
import { MARKETING_CONSENT_TEKST, SERVICE_CONSENT_TEKST } from "./consent";
import type { Lead } from "./types";

/**
 * Elke aanvraag (opmeting, offerte, contact) wordt een klantfiche in Brunics eigen
 * Shopify — de bron van waarheid, zonder extra systeem (eigendomsprincipe). Overgenomen
 * uit apps/web/src/lib/opmeting, veralgemeend naar alle formulieren.
 *
 * Opvolging: na het opslaan zetten we in een APARTE call de tag `opmeting-nieuw`. Dat is
 * een "Customer updated"-gebeurtenis, waarop Shopify Flow een interne mail stuurt en de
 * tag weer weghaalt (zie .env.example → Shopify Flow). Draait Flow niet, dan blijft de
 * tag staan als zichtbare achterstand in de admin.
 */
export const TAG_NIEUW = "opmeting-nieuw";

const ZOEK_OP_EMAIL = /* GraphQL */ `
  query ZoekOpEmail($email: String!) {
    customerByIdentifier(identifier: { emailAddress: $email }) { id note }
  }
`;
const ZOEK_OP_TELEFOON = /* GraphQL */ `
  query ZoekOpTelefoon($phone: String!) {
    customerByIdentifier(identifier: { phoneNumber: $phone }) { id note }
  }
`;
const MAAK_KLANT = /* GraphQL */ `
  mutation MaakKlant($input: CustomerInput!) {
    customerCreate(input: $input) { customer { id } userErrors { field message } }
  }
`;
const WERK_KLANT_BIJ = /* GraphQL */ `
  mutation WerkKlantBij($input: CustomerInput!) {
    customerUpdate(input: $input) { customer { id } userErrors { field message } }
  }
`;
const CONSENT_BIJWERKEN = /* GraphQL */ `
  mutation ConsentBijwerken($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) { customer { id } userErrors { field message } }
  }
`;
const TAGS_TOEVOEGEN = /* GraphQL */ `
  mutation TagsToevoegen($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) { node { id } userErrors { field message } }
  }
`;
const METAFIELDS = /* GraphQL */ `
  mutation Metafields($mfs: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $mfs) { userErrors { field message } }
  }
`;

type Klant = { id: string; note: string | null };
type Result = { customer: { id: string } | null; userErrors: { field: string[] | null; message: string }[] };

const SOORT_LABEL: Record<Lead["soort"], string> = {
  opmeting: "Opmeting aan huis",
  aanvraag: "Aanvraag maatwerk/plaatsing",
  offerte: "Offerteaanvraag",
  contact: "Contactformulier",
};

export function samenvatting(lead: Lead): string {
  return [
    `${SOORT_LABEL[lead.soort]} via de website — ${new Date(lead.tijdstip).toLocaleString("nl-BE", { timeZone: "Europe/Brussels" })}`,
    lead.onderwerp ? `Onderwerp: ${lead.onderwerp}` : null,
    lead.telefoonRuw ? `Telefoon: ${lead.telefoonRuw}` : null,
    lead.postcode ? `Postcode: ${lead.postcode}` : null,
    lead.producten.length ? `Producten:\n${lead.producten.map((p) => `• ${p}`).join("\n")}` : null,
    `Pagina: ${lead.bron}`,
    "",
    lead.bericht || "(geen bericht)",
  ]
    .filter((r) => r !== null)
    .join("\n");
}

/**
 * Toestemming bewijsbaar vastleggen: de letterlijke tekst, de bron en het tijdstip. Ook een
 * geweigerde marketing-opt-in — dat bewijst dat het gevraagd werd.
 */
function metafields(lead: Lead) {
  return [
    { namespace: "brunic", key: "laatste_aanvraag", type: "multi_line_text_field", value: samenvatting(lead) },
    { namespace: "brunic", key: "consent_service_tekst", type: "multi_line_text_field", value: SERVICE_CONSENT_TEKST },
    {
      namespace: "brunic",
      key: "consent_marketing_tekst",
      type: "multi_line_text_field",
      value: lead.marketing ? MARKETING_CONSENT_TEKST : `NIET aangevinkt: ${MARKETING_CONSENT_TEKST}`,
    },
    { namespace: "brunic", key: "consent_bron", type: "single_line_text_field", value: lead.bron },
    { namespace: "brunic", key: "consent_tijdstip", type: "date_time", value: lead.tijdstip },
  ];
}

/** Single opt-in met tijdstip; wie niets aanvinkt staat expliciet op NOT_SUBSCRIBED. */
function emailConsent(email: string, marketing: boolean, tijdstip: string) {
  if (!email) return undefined;
  return marketing
    ? { marketingState: "SUBSCRIBED" as const, marketingOptInLevel: "SINGLE_OPT_IN" as const, consentUpdatedAt: tijdstip }
    : { marketingState: "NOT_SUBSCRIBED" as const, consentUpdatedAt: tijdstip };
}

async function zoekKlant(email: string, telefoon: string | null): Promise<Klant | null> {
  if (email) {
    const d = await admin<{ customerByIdentifier: Klant | null }>(ZOEK_OP_EMAIL, { email });
    if (d.customerByIdentifier) return d.customerByIdentifier;
  }
  if (telefoon) {
    const d = await admin<{ customerByIdentifier: Klant | null }>(ZOEK_OP_TELEFOON, { phone: telefoon });
    if (d.customerByIdentifier) return d.customerByIdentifier;
  }
  return null;
}

/** Nieuwe aanvraag bovenaan de klantnotitie; eerdere aanvragen blijven eronder staan. */
function notitie(nieuw: string, oud: string | null) {
  return (oud ? `${nieuw}\n\n————————\n\n${oud}` : nieuw).slice(0, 5000);
}

/** Maakt of werkt de klant bij. Gooit bij fouten — de aanroeper vangt dat af. */
export async function bewaarKlant(lead: Lead): Promise<string> {
  const gedeeld = {
    firstName: lead.voornaam || undefined,
    lastName: lead.naam || undefined,
    phone: lead.telefoon ?? undefined,
    tags: ["website", `lead-${lead.soort}`, ...(lead.marketing ? ["nieuwsbrief"] : [])],
    metafields: metafields(lead),
  };
  const consent = emailConsent(lead.email, lead.marketing, lead.tijdstip);

  async function werkBij(klant: Klant) {
    // customerUpdate weigert het consentveld: dat is een aparte call. Een bestaande
    // inschrijving zetten we nooit terug op NOT_SUBSCRIBED door een leeg vinkje.
    const data = await admin<{ customerUpdate: Result }>(WERK_KLANT_BIJ, {
      input: { id: klant.id, ...gedeeld, tags: undefined, note: notitie(samenvatting(lead), klant.note) },
    });
    if (!data.customerUpdate.customer) throw new Error(data.customerUpdate.userErrors[0]?.message ?? "Klant bijwerken mislukt.");
    await admin(TAGS_TOEVOEGEN, { id: klant.id, tags: gedeeld.tags });
    if (lead.marketing && consent) {
      const res = await admin<{ customerEmailMarketingConsentUpdate: { userErrors: { message: string }[] } }>(CONSENT_BIJWERKEN, {
        input: { customerId: klant.id, emailMarketingConsent: consent },
      });
      if (res.customerEmailMarketingConsentUpdate.userErrors.length) console.error("[aanvraag] consent bijwerken mislukt:", res.customerEmailMarketingConsentUpdate.userErrors);
    }
    return klant.id;
  }

  const bestaand = await zoekKlant(lead.email, lead.telefoon);
  if (bestaand) return werkBij(bestaand);

  const data = await admin<{ customerCreate: Result }>(MAAK_KLANT, {
    input: { email: lead.email || undefined, ...gedeeld, note: samenvatting(lead), emailMarketingConsent: consent },
  });
  const { customer, userErrors } = data.customerCreate;
  if (customer) return customer.id;

  // Vangnet tegen een race (twee aanvragen tegelijk): de klant bestond tóch al.
  if (userErrors.some((e) => /taken|already exists/i.test(e.message))) {
    const k = await zoekKlant(lead.email, lead.telefoon);
    if (k) return werkBij(k);
  }
  throw new Error(userErrors[0]?.message ?? "Klant aanmaken mislukt.");
}

/** Foto's (Shopify File-GID's) op de klantfiche, zodat ze in de admin zichtbaar zijn. */
export async function koppelFotos(klantId: string, fotoGids: string[]): Promise<void> {
  if (fotoGids.length === 0) return;
  await admin(METAFIELDS, {
    mfs: [{ ownerId: klantId, namespace: "brunic", key: "aanvraag_fotos", type: "list.file_reference", value: JSON.stringify(fotoGids) }],
  });
}

/** Zet de opvolgvlag als aparte update — dit laat Shopify Flow afgaan. */
export async function markeerVoorOpvolging(klantId: string): Promise<void> {
  await admin(TAGS_TOEVOEGEN, { id: klantId, tags: [TAG_NIEUW] });
}

/** Nieuwsbrief: klant aanmaken of bijwerken met e-mailtoestemming (single opt-in). */
export async function schrijfInVoorNieuwsbrief(email: string, tijdstip: string): Promise<void> {
  const consent = emailConsent(email, true, tijdstip)!;
  const bestaand = await zoekKlant(email, null);
  if (bestaand) {
    await admin(TAGS_TOEVOEGEN, { id: bestaand.id, tags: ["nieuwsbrief", "website"] });
    await admin(CONSENT_BIJWERKEN, { input: { customerId: bestaand.id, emailMarketingConsent: consent } });
    return;
  }
  const data = await admin<{ customerCreate: Result }>(MAAK_KLANT, {
    input: { email, tags: ["nieuwsbrief", "website"], emailMarketingConsent: consent },
  });
  if (!data.customerCreate.customer && !data.customerCreate.userErrors.some((e) => /taken|already exists/i.test(e.message))) {
    throw new Error(data.customerCreate.userErrors[0]?.message ?? "Inschrijven mislukt.");
  }
}
