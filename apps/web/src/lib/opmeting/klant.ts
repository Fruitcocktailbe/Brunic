import { admin } from "@/lib/shopify/admin";
import { MARKETING_CONSENT_TEKST, SERVICE_CONSENT_TEKST } from "./consent";
import type { Lead } from "./types";

/**
 * `customers(query:)` draait op de zoekindex, die enkele seconden achterloopt: een
 * zojuist aangemaakte klant vind je daar niet terug. Bij een tweede aanvraag kort na
 * elkaar leverde dat "Email has already been taken" op — en dus een verloren lead.
 * `customerByIdentifier` doet een directe opzoeking, zonder index.
 */
const ZOEK_OP_EMAIL = /* GraphQL */ `
  query ZoekOpEmail($email: String!) {
    customerByIdentifier(identifier: { emailAddress: $email }) {
      id
    }
  }
`;

const ZOEK_OP_TELEFOON = /* GraphQL */ `
  query ZoekOpTelefoon($phone: String!) {
    customerByIdentifier(identifier: { phoneNumber: $phone }) {
      id
    }
  }
`;

const MAAK_KLANT = /* GraphQL */ `
  mutation MaakKlant($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        defaultEmailAddress {
          marketingState
          marketingOptInLevel
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const WERK_KLANT_BIJ = /* GraphQL */ `
  mutation WerkKlantBij($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        defaultEmailAddress {
          marketingState
          marketingOptInLevel
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Consent kan enkel bij `customerCreate` in de CustomerInput mee. Bij een bestaande klant
 * weigert Shopify dat veld ("please use the customerEmailMarketingConsentUpdate Mutation
 * instead") — dus voor terugkerende leads is dit een aparte call.
 */
const CONSENT_BIJWERKEN = /* GraphQL */ `
  mutation ConsentBijwerken($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const MARKEER_NIEUW = /* GraphQL */ `
  mutation MarkeerNieuw($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const KOPPEL_FOTOS = /* GraphQL */ `
  mutation KoppelFotos($mfs: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $mfs) { userErrors { field message } }
  }
`;

/**
 * Koppelt de geüploade foto's (Shopify File-GID's) aan de klant via een list.file_reference
 * metafield, zodat Sandra ze op de klantfiche in de admin ziet.
 */
export async function koppelOpmetingFotos(klantId: string, fotoGids: string[]): Promise<void> {
  if (fotoGids.length === 0) return;
  await admin<{ metafieldsSet: { userErrors: { message: string }[] } }>(KOPPEL_FOTOS, {
    mfs: [
      {
        ownerId: klantId,
        namespace: "brunic",
        key: "opmeting_fotos",
        type: "list.file_reference",
        value: JSON.stringify(fotoGids),
      },
    ],
  });
}

/** "Onbehandelde lead"-vlag. Shopify Flow verwijdert hem zodra Sandra verwittigd is. */
export const TAG_NIEUW = "opmeting-nieuw";

type Klant = { id: string };
type Result = { customer: Klant | null; userErrors: { field: string[] | null; message: string }[] };

function samenvatting(lead: Lead): string {
  return [
    `Opmetingsaanvraag via de website (${lead.tijdstip})`,
    `Telefoon: ${lead.telefoonRuw}`,
    lead.plaats ? `Gemeente: ${lead.plaats}` : null,
    lead.diensten.length ? `Diensten: ${lead.diensten.join(", ")}` : null,
    lead.termijn ? `Termijn: ${lead.termijn}` : null,
    lead.belmoment ? `Belmoment: ${lead.belmoment}` : null,
    "",
    lead.project || "(geen projectomschrijving)",
  ]
    .filter((r) => r !== null)
    .join("\n");
}

/**
 * Bouwt de metafields die de toestemming *bewijsbaar* maken: niet alleen dát er een
 * vinkje stond, maar de létterlijke tekst, de bron en het tijdstip. Ook een geweigerde
 * marketing-opt-in leggen we vast — dat is het bewijs dat we het gevraagd hebben.
 */
function consentMetafields(lead: Lead) {
  return [
    {
      namespace: "brunic",
      key: "laatste_opmeting",
      type: "multi_line_text_field",
      value: samenvatting(lead),
    },
    {
      namespace: "brunic",
      key: "consent_service_tekst",
      type: "multi_line_text_field",
      value: SERVICE_CONSENT_TEKST,
    },
    {
      namespace: "brunic",
      key: "consent_marketing_tekst",
      type: "multi_line_text_field",
      value: lead.marketing ? MARKETING_CONSENT_TEKST : `NIET aangevinkt: ${MARKETING_CONSENT_TEKST}`,
    },
    { namespace: "brunic", key: "consent_bron", type: "single_line_text_field", value: "/opmeting" },
    { namespace: "brunic", key: "consent_tijdstip", type: "date_time", value: lead.tijdstip },
  ];
}

/**
 * Marketing-consent hoort enkel bij een e-mailadres. Single opt-in, met tijdstip.
 * Wie niets aanvinkt zetten we expliciet op NOT_SUBSCRIBED i.p.v. het veld leeg te
 * laten — "niet gevraagd" en "gevraagd en geweigerd" zijn juridisch niet hetzelfde.
 */
function emailConsent(lead: Lead) {
  if (!lead.email) return undefined;

  return lead.marketing
    ? {
        marketingState: "SUBSCRIBED" as const,
        marketingOptInLevel: "SINGLE_OPT_IN" as const,
        consentUpdatedAt: lead.tijdstip,
      }
    : { marketingState: "NOT_SUBSCRIBED" as const, consentUpdatedAt: lead.tijdstip };
}

async function zoekKlantId(lead: Lead): Promise<string | null> {
  if (lead.email) {
    const d = await admin<{ customerByIdentifier: Klant | null }>(ZOEK_OP_EMAIL, {
      email: lead.email,
    });
    if (d.customerByIdentifier) return d.customerByIdentifier.id;
  }
  if (lead.telefoon) {
    const d = await admin<{ customerByIdentifier: Klant | null }>(ZOEK_OP_TELEFOON, {
      phone: lead.telefoon,
    });
    if (d.customerByIdentifier) return d.customerByIdentifier.id;
  }
  return null;
}

/** Maakt of werkt de klant bij. Gooit bij fouten — de aanroeper vangt dat af. */
export async function bewaarKlant(lead: Lead): Promise<{ id: string; nieuw: boolean }> {
  const [voornaam, ...rest] = lead.naam.trim().split(/\s+/);
  const achternaam = rest.join(" ");

  const gedeeld = {
    firstName: voornaam,
    lastName: achternaam || undefined,
    phone: lead.telefoon ?? undefined,
    tags: ["opmeting-lead", "website"],
    note: samenvatting(lead),
    metafields: consentMetafields(lead),
    emailMarketingConsent: emailConsent(lead),
  };

  async function werkBij(id: string) {
    // Consent bewust NIET meesturen: customerUpdate weigert het veld.
    const { emailMarketingConsent, ...zonderConsent } = gedeeld;

    const data = await admin<{ customerUpdate: Result }>(WERK_KLANT_BIJ, {
      input: { id, ...zonderConsent },
    });
    const { customer, userErrors } = data.customerUpdate;
    if (!customer) throw new Error(userErrors[0]?.message ?? "Klant bijwerken mislukt.");

    if (emailMarketingConsent) {
      const res = await admin<{
        customerEmailMarketingConsentUpdate: { userErrors: { message: string }[] };
      }>(CONSENT_BIJWERKEN, { input: { customerId: customer.id, emailMarketingConsent } });
      const fouten = res.customerEmailMarketingConsentUpdate.userErrors;
      // Consent mag de lead niet doen sneuvelen, maar moet luid gelogd worden.
      if (fouten.length) console.error("[opmeting] consent bijwerken mislukt:", fouten);
    }

    return { id: customer.id, nieuw: false };
  }

  const bestaandeId = await zoekKlantId(lead);
  if (bestaandeId) return werkBij(bestaandeId);

  const data = await admin<{ customerCreate: Result }>(MAAK_KLANT, {
    input: { email: lead.email || undefined, ...gedeeld },
  });
  const { customer, userErrors } = data.customerCreate;

  if (customer) return { id: customer.id, nieuw: true };

  // Vangnet tegen een race (twee aanvragen tegelijk): de klant bestond tóch al.
  if (userErrors.some((e) => /taken|already exists/i.test(e.message))) {
    const id = await zoekKlantId(lead);
    if (id) return werkBij(id);
  }

  throw new Error(userErrors[0]?.message ?? "Klant aanmaken mislukt.");
}

/**
 * Zet de "onbehandeld"-vlag als APARTE stap, ná het opslaan.
 *
 * Waarom apart: Shopify Flow's enige bruikbare trigger is "Customer updated", en die
 * vuurt niet bij een zojuist *aangemaakte* klant. Een losse tag-write is wél een update,
 * dus deze stap laat Flow afgaan voor zowel nieuwe als terugkerende leads.
 *
 * De Flow verwijdert `opmeting-nieuw` na het versturen van de mail. Daardoor blijft een
 * latere, gewone klantwijziging (bestelling, adres) stil: de conditie faalt dan.
 * Draait Flow niet, dan stapelt de tag op als zichtbare achterstand in de admin.
 */
export async function markeerVoorOpvolging(klantId: string): Promise<void> {
  await admin<{ tagsAdd: { userErrors: { message: string }[] } }>(MARKEER_NIEUW, {
    id: klantId,
    tags: [TAG_NIEUW],
  });
}
