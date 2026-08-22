/**
 * De webcategorie-boom: welke Shopify-collectie is een categoriepagina, en welke een
 * subpagina eronder. Klant-conventies van 02/08 (J.A.R.V.I.S dossier-doc 11 §v3):
 * behang deelt op patroon/doelgroep, tapijten op stijl en vorm. Materiaal, herkomst en
 * de click-vinyl-look zijn bewust géén subcategorie maar facet (docs/architectuur.md).
 *
 * Waarom deze tabel bestaat: Shopify kent geen hiërarchie tussen collecties. De handles
 * dragen de ouder wel als voorvoegsel (`behang-effen`), maar dat is een conventie, geen
 * relatie — en `gordijnen-stoffen` › `stoffen-effen` breekt ze al. Dit is dus de enige
 * plek die weet dat `stoffen-effen` op /gordijnen-stoffen/effen hoort en niet op een
 * eigen toppagina: zonder die kennis zou /[collection] elke subcollectie een tweede,
 * indexeerbare URL geven (duplicate content).
 *
 * Categorieën zonder subcategorieën (Raamdecoratie, Verf, Slapen & wonen) staan hier
 * niet in — /[collection] blijft gewoon uit Shopify komen.
 */

export type Subcategorie = {
  /** laatste URL-segment: /behang/effen */
  slug: string;
  /** de Shopify-collectiehandle */
  handle: string;
  /** korte klant-taal voor de chips; de H1 gebruikt de Shopify-titel */
  label: string;
  /**
   * Een subcategorie onder twee ouders krijgt precies één URL — anders staan er twee
   * identieke pagina's in de index. De andere ouder toont de chip en linkt hierheen.
   */
  canoniekeOuder?: string;
};

export type Hoofdcategorie = {
  handle: string;
  label: string;
  subs: Subcategorie[];
};

/** Logotapijt hangt onder Tapijten én Vloerbekleding; Tapijten draagt de URL. */
const LOGOTAPIJT: Subcategorie = {
  slug: "logotapijt",
  handle: "logotapijt",
  label: "Logotapijt",
  canoniekeOuder: "tapijten",
};

export const TAXONOMIE: Hoofdcategorie[] = [
  {
    handle: "gordijnen-stoffen",
    label: "Gordijnen & stoffen",
    subs: [
      { slug: "effen", handle: "stoffen-effen", label: "Effen" },
      { slug: "tekening", handle: "stoffen-tekening", label: "Met tekening" },
      {
        slug: "isolerend-verduisterend",
        handle: "stoffen-isolerend-verduisterend",
        label: "Isolerend & verduisterend",
      },
      { slug: "brandvrij", handle: "stoffen-brandvrij", label: "Brandvrij" },
      { slug: "benodigdheden", handle: "stoffen-benodigdheden", label: "Benodigdheden" },
    ],
  },
  {
    handle: "behang",
    label: "Behang",
    subs: [
      { slug: "effen", handle: "behang-effen", label: "Effen" },
      { slug: "bloemen", handle: "behang-bloemen", label: "Bloemen" },
      { slug: "streep", handle: "behang-streep", label: "Streep" },
      { slug: "jeugd-jongens", handle: "behang-jeugd-jongens", label: "Jeugd jongens" },
      { slug: "jeugd-meisjes", handle: "behang-jeugd-meisjes", label: "Jeugd meisjes" },
      { slug: "baby", handle: "behang-baby", label: "Baby" },
    ],
  },
  {
    handle: "vloerbekleding",
    label: "Vloerbekleding",
    subs: [
      { slug: "vinyl", handle: "vloerbekleding-vinyl", label: "Vinyl" },
      { slug: "click-vinyl", handle: "vloerbekleding-click-vinyl", label: "Click vinyl" },
      { slug: "vasttapijt", handle: "vloerbekleding-vasttapijt", label: "Vasttapijt" },
      { slug: "grastapijt", handle: "vloerbekleding-grastapijt", label: "Grastapijt" },
      { slug: "rubber", handle: "vloerbekleding-rubber", label: "Rubber" },
      { slug: "coco", handle: "vloerbekleding-coco", label: "Coco" },
      { slug: "antivuilmatten", handle: "vloerbekleding-antivuilmatten", label: "Antivuilmatten" },
      LOGOTAPIJT,
      { slug: "benodigdheden", handle: "vloerbekleding-benodigdheden", label: "Benodigdheden" },
    ],
  },
  {
    handle: "tapijten",
    label: "Tapijten",
    subs: [
      { slug: "modern", handle: "tapijten-modern", label: "Modern" },
      { slug: "klassiek", handle: "tapijten-klassiek", label: "Klassiek" },
      { slug: "badmatten", handle: "tapijten-badmatten", label: "Badmatten" },
      { slug: "binnen-buiten", handle: "tapijten-binnen-buiten", label: "Binnen & buiten" },
      { slug: "kinder", handle: "tapijten-kinder", label: "Kinder" },
      { slug: "rond", handle: "tapijten-rond", label: "Rond" },
      { slug: "vierkant", handle: "tapijten-vierkant", label: "Vierkant" },
      { slug: "speciale-vormen", handle: "tapijten-speciale-vormen", label: "Speciale vormen" },
      LOGOTAPIJT,
      { slug: "op-maat", handle: "tapijten-op-maat", label: "Op maat" },
    ],
  },
];

/**
 * `maat` is de bestaande bucket-route (/[collection]/maat/[bucket]) en mag dus nooit een
 * subcategorie-slug zijn. Losse /[collection]/maat is geen pagina.
 */
const GERESERVEERDE_SLUGS = new Set(["maat"]);

const SUB_HANDLES = new Set(TAXONOMIE.flatMap((h) => h.subs.map((s) => s.handle)));

/** Hoort deze collectie onder een categorie? Zo ja: géén eigen toppagina. */
export function isSubcollectie(handle: string): boolean {
  return SUB_HANDLES.has(handle);
}

export function hoofdcategorie(handle: string): Hoofdcategorie | undefined {
  return TAXONOMIE.find((h) => h.handle === handle);
}

export function subsVoor(ouderHandle: string): Subcategorie[] {
  return hoofdcategorie(ouderHandle)?.subs ?? [];
}

/** De URL van een subcategorie onder een ouder — gedeelde subs wijzen naar hun canonieke ouder. */
export function hrefVoorSub(ouderHandle: string, sub: Subcategorie): string {
  return `/${sub.canoniekeOuder ?? ouderHandle}/${sub.slug}`;
}

/**
 * Zoekt de subcategorie achter een URL-segment. Geeft niets terug voor een gedeelde sub
 * onder de niet-canonieke ouder (/vloerbekleding/logotapijt → 404, /tapijten/logotapijt → ok),
 * zodat er per subcategorie exact één indexeerbare URL bestaat.
 */
export function subBySlug(ouderHandle: string, slug: string): Subcategorie | undefined {
  if (GERESERVEERDE_SLUGS.has(slug)) return undefined;
  const sub = subsVoor(ouderHandle).find((s) => s.slug === slug);
  if (!sub) return undefined;
  return (sub.canoniekeOuder ?? ouderHandle) === ouderHandle ? sub : undefined;
}

/** De ouder + subcategorie achter een collectiehandle (voor kruimelpad en chips). */
export function vindSub(
  handle: string,
): { hoofd: Hoofdcategorie; sub: Subcategorie } | undefined {
  for (const hoofd of TAXONOMIE) {
    const sub = hoofd.subs.find((s) => s.handle === handle);
    // Gedeelde sub: altijd onder de canonieke ouder tonen, ook al vinden we hem hier.
    if (sub) {
      const canoniek = sub.canoniekeOuder ? hoofdcategorie(sub.canoniekeOuder) : hoofd;
      return canoniek ? { hoofd: canoniek, sub } : { hoofd, sub };
    }
  }
  return undefined;
}

export type Kruimel = { label: string; href: string };

/**
 * Het kruimelpad voor een product, afgeleid uit de collecties waarin het zit: staat het in
 * een subcategorie, dan wordt het Home › Behang › Effen › product. Verwacht een lijst
 * zonder systeemcollecties (in-de-kijker, frontpage).
 */
export function categoriePad(collections: { handle: string; title: string }[]): Kruimel[] {
  for (const c of collections) {
    const gevonden = vindSub(c.handle);
    if (gevonden) {
      return [
        { label: gevonden.hoofd.label, href: `/${gevonden.hoofd.handle}` },
        { label: gevonden.sub.label, href: hrefVoorSub(gevonden.hoofd.handle, gevonden.sub) },
      ];
    }
  }
  const hoofd = collections[0];
  return hoofd ? [{ label: hoofd.title, href: `/${hoofd.handle}` }] : [];
}
