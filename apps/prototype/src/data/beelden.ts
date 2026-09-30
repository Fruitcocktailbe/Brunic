import type { ImageRef } from "@/lib/catalog/types";

/**
 * Alle redactionele beelden van de site op één plek: homepage, categoriebanners,
 * diensten en inspiratie-artikels.
 *
 * Bron: de sfeerfoto's van onze leveranciers (Arte, Boråstapeter, ADO, Artelux,
 * Associated Weavers, Balsan, Louis De Poortere …) zoals ze bij de producten in Shopify
 * staan — dus beelden van producten die Brunic effectief verkoopt, geserveerd via het
 * Shopify-CDN. Geen stockfoto's, geen beelden van de oude site.
 *
 * Eigen foto's (atelier, winkel, klanten) komen na de fotoshoot; vervang dan hier de URL.
 */
export const BEELD = {
  /* Homepage */
  hero: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-james-ado-45b467cc58.jpg?v=1790779164", alt: "Bordeauxrode velours gordijnen voor een hoog raam in een lichte inkomhal" }, // ADO · James (2048×1365)
  campagneStoffen: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-shell-ado-92acddc51c.jpg?v=1790779083", alt: "Zeegroene gordijnen in een lichte woonkamer" }, // ADO · Shell (1574×2048)
  campagneBehang: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/behang-floral-tree-borastapeter-cf99dec041.jpg?v=1790783467", alt: "Donkergroen behang met bladmotief achter een chaise longue" }, // Boråstapeter · Floral Tree (930×1240)
  trendNaturel: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/behang-hip-rose-borastapeter-4db71bb830.jpg?v=1790783824", alt: "Okergele wand onder een houten dakschuinte met een donkere ladekast" }, // Boråstapeter · Hip Rose (1536×2048)
  trendGrafisch: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/behang-nastri-arte-e17b984d4f.jpg?v=1790782558", alt: "Roze wandbekleding met grafisch lijnenspel en kleurrijke poefs" }, // Arte · Nastri (2048×1365)
  trendDiep: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-lumiere-dimout-fr-ado-7cfc9d6809.jpg?v=1790779254", alt: "Slaapkamer met nachtblauwe gordijnen en donkere wanden" }, // ADO · Lumiere Dimout FR (1536×2048)
  inspStijl: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/panoramisch-behang-under-the-sycamore-tree-arte-42180f2f5b.jpg?v=1790780669", alt: "Panoramisch behang met een zacht landschap achter een ronde zetel" }, // Arte · Under the Sycamore Tree (2048×1832)
  inspKleur: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-easy-ado-3e509eacea.jpg?v=1790779233", alt: "Kleurrijke woonkamer met blauwe wand, okergele zetel en roze tapijt" }, // ADO · Easy (1536×2048)
  inspAdvies: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-vega-ado-da154a8551.jpg?v=1790779254", alt: "Taupe gordijnen voor een hoog raam naast een rieten stoel" }, // ADO · Vega (1536×2048)
  inspOnderhoud: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vasttapijt-ultrasoft-balsan-acd280045a.jpg?v=1790783483", alt: "Grijs vasttapijt in een woonkamer met salontafel" }, // Balsan · Ultrasoft (2048×1367)
  tegelNieuw: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/behang-angsflora-borastapeter-4ca8af5559.jpg?v=1790783902", alt: "Zetel voor een wand met fijn groen bloemenbehang" }, // Boråstapeter · Angsflora (1536×2048)
  tegelOpMaat: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-tiny-ado-a79428c595.jpg?v=1790779454", alt: "Transparante vouwgordijnen in een eetkamer met tuinzicht" }, // ADO · Tiny (1536×2048)
  tegelInspiratie: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/panoramisch-behang-kerala-arte-4826156b59.jpg?v=1790780523", alt: "Panoramisch behang met palmmotief en een houten fauteuil" }, // Arte · Kerala (1820×2000)

  /* Hoofdcategorieën (banner op de categoriepagina + tegels) */
  catGordijnen: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-darjeeling-ado-3a813bf07c.jpg?v=1790779151", alt: "Oudroze linnen gordijnen in een lichte eetkamer" }, // ADO · Darjeeling (1941×1500)
  catBehang: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/panoramisch-behang-bucolique-arte-e513347987.jpg?v=1790780504", alt: "Panoramisch behang met een boslandschap in een landelijke woning" }, // Arte · Bucolique (2048×1601)
  catTapijten: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vloerkleed-kasak-louis-de-poortere-c86cbe8739.webp?v=1790784282", alt: "Rood vloerkleed in een moderne woonkamer" }, // Louis De Poortere · Kasak (1280×969)
  catVloer: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vasttapijt-silk-associated-weavers-e5e7238965.jpg?v=1790783286", alt: "Crèmekleurig vasttapijt in een woonkamer met rode wanden" }, // Associated Weavers · Silk (1920×960)

  /* Diensten (Op maat & plaatsing) */
  dienstGordijnen: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-miran-ado-870742303b.jpg?v=1790779330", alt: "Eetkamer met lichte gordijnen voor hoge boogramen" }, // ADO · Miran (1536×2048)
  dienstRaamdecoratie: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-cone-ado-103ffc08ec.jpg?v=1790779451", alt: "Vouwgordijn met blauw grafisch motief voor een keukenraam" }, // ADO · Cone (1537×2048)
  dienstOpmeting: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-stilla-ado-bdd614582a.jpg?v=1790779357", alt: "Oudroze gordijnen voor een hoog raam in een eetkamer" }, // ADO · Stilla (1536×2048)
  dienstPlaatsing: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-mik-fr-ado-3520ca621d.jpg?v=1790779216", alt: "Slaapkamer met koraalrode en okergele gordijnen" }, // ADO · Mik FR (1650×2048)
  dienstVloeren: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vasttapijt-seraph-associated-weavers-3a7dce3f87.jpg?v=1790783055", alt: "Lichte woonkamer met crèmekleurig vasttapijt" }, // Associated Weavers · Seraph (1600×800)
  dienstTapijtOpMaat: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vloerkleed-lagoon-louis-de-poortere-4f3aa5bd6f.webp?v=1790784688", alt: "Vloerkleed in een organische vorm in een lichte ruimte" }, // Louis De Poortere · Lagoon (1280×858)
  dienstBehang: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/panoramisch-behang-sundara-arte-4069344d17.jpg?v=1790780637", alt: "Panoramisch behang met een heuvellandschap achter rieten stoelen" }, // Arte · Sundara (1798×2000)
  dienstProject: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/wandbekleding-geology-arte-201d890798.jpg?v=1790781413", alt: "Restaurant met wandbekleding in marmerlook en rieten hanglampen" }, // Arte · Geology (2048×1463)

  /* Inspiratie & advies */
  artGordijnstof: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-aviva-ado-769f7a06af.jpg?v=1790779314", alt: "Gordijnen met plantenmotief naast een witte vitrinekast" }, // ADO · Aviva (1536×2048)
  artBehangKlein: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/behang-elsa-borastapeter-65bcbbaf9f.jpg?v=1790783901", alt: "Klein bureauhoekje met bloemenbehang en een spiegel" }, // Boråstapeter · Elsa (1536×2048)
  artTapijtmaat: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vloerkleed-medallion-louis-de-poortere-d5d063cc45.webp?v=1790784651", alt: "Blauw vloerkleed onder een eettafel in een lichte eetkamer" }, // Louis De Poortere · Medallion (1280×969)
  artVasttapijt: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vasttapijt-obsession-associated-weavers-d39413f0ba.jpg?v=1790782984", alt: "Slaapkamer met zacht crèmekleurig vasttapijt" }, // Associated Weavers · Obsession (1920×960)
  artCombineren: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/wandbekleding-a-walk-in-the-garden-arte-bc03ae7b2b.jpg?v=1790781412", alt: "Wandbekleding met bloemen en kussens in bijpassende tinten" }, // Arte · A walk in the garden (2048×1463)
  artWarmeTinten: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/wandbekleding-impasto-metal-x-patina-arte-303084949b.jpg?v=1790780968", alt: "Terracotta wand met houten fauteuil, vloerkleed en lichte gordijnen" }, // Arte · Impasto – Metal X Patina (2048×1241)
  artFotobehang: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/panoramisch-behang-reverie-tropicale-decors-en-panoramiques-arte-c0a934bbb8.jpg?v=1790780661", alt: "Panoramisch behang met goudkleurige palmen in een eetkamer" }, // Arte · Rêverie Tropicale – Décors & Panoramiques (2048×1875)
  artTapijtOnderhoud: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vloerkleed-ushak-louis-de-poortere-225cde612a.webp?v=1790784212", alt: "Vloerkleed op een visgraatparket met een fauteuil" }, // Louis De Poortere · Ushak (1280×854)
  artGordijnenOnderhoud: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-felina-ado-6c52db2fb4.jpg?v=1790779314", alt: "Witte vitrage met embrasse naast een fauteuil" }, // ADO · Felina (1536×2048)
  artAtelier: { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-sunset-dimout-fr-ado-a90867c757.jpg?v=1790779161", alt: "Close-up van een geweven gordijnstof in plooien" }, // ADO · Sunset Dimout FR (2048×1365)
} satisfies Record<string, ImageRef>;

/**
 * Tegelbeeld per subcategorie (Shopify-collectiehandle). Een subcategorie zonder regel hier
 * krijgt automatisch een sfeerfoto uit haar eigen producten (lib/catalog/imagery.ts); een
 * beeld dat in Shopify aan de collectie hangt, wint altijd.
 */
export const SUBCATEGORIE_BEELD: Record<string, ImageRef> = {
  "stoffen-brandvrij": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-lui-fr-ado-8c285865e4.jpg?v=1790779238", alt: "Lichte vitrages in een woonkamer met planten" }, // ADO · Lui FR (1536×2048)
  "stoffen-isolerend-verduisterend": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-new-moon-dimout-fr-ado-2885a6d09d.jpg?v=1790779291", alt: "Kinderkamer met donkergroene gordijnen voor een hoogslaper" }, // ADO · New Moon Dimout FR (1366×2048)
  "stoffen-effen": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/gordijnstof-voile-uni-ado-7b1b5c2054.jpg?v=1790779656", alt: "Effen zandkleurige vitrage in zacht tegenlicht" }, // ADO · Voile uni (2048×1536)
  "stoffen-benodigdheden": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/passement-macrame-inzetstuk-4624-ado-81c13716e7.jpg?v=1790779664", alt: "Kanten boord met bladmotief" }, // ADO · Macramé-inzetstuk 4624 (1354×1173)
  "behang-effen": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/behang-tintura-arte-9989816937.jpg?v=1790781087", alt: "Oudroze effen wandbekleding achter een witte zetel" }, // Arte · Tintura (1295×2000)
  "behang-bloemen": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/behang-stagionato-arte-ba893c0b9d.jpg?v=1790781053", alt: "Donkergroen botanisch behang met witte fauteuils" }, // Arte · Stagionato (1953×2000)
  "behang-streep": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/behang-striped-sunset-arte-6fb1eaa697.jpg?v=1790782807", alt: "Streepbehang achter een turquoise chaise longue" }, // Arte · Striped Sunset (1640×2000)
  "tapijten-binnen-buiten": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vloerkleed-suzani-louis-de-poortere-bece09ec18.webp?v=1790784268", alt: "Kleurrijk vloerkleed in een woonkamer met zicht op het bos" }, // Louis De Poortere · Suzani (1280×969)
  "tapijten-rond": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vloerkleed-jacob-s-ladder-louis-de-poortere-d4ea506b4a.webp?v=1790784644", alt: "Rond antracietkleurig vloerkleed in een woonkamer met zicht op het water" }, // Louis De Poortere · Jacob's Ladder (1500×1135)
  "tapijten-speciale-vormen": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vloerkleed-aquarelle-louis-de-poortere-3641f106a3.webp?v=1790784711", alt: "Vloerkleed in een organische vorm met een roze fauteuil" }, // Louis De Poortere · Aquarelle (1122×1536)
  "tapijten-op-maat": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vasttapijt-hydra-associated-weavers-d9a635279b.jpg?v=1790783187", alt: "Oudroze tapijt van wand tot wand onder een lange zithoek" }, // Associated Weavers · Hydra (1600×801)
  "vloerbekleding-vasttapijt": { src: "https://cdn.shopify.com/s/files/1/1072/8662/6636/files/vasttapijt-impulso-associated-weavers-bf8739eb01.jpg?v=1790783210", alt: "Crèmekleurig vasttapijt in een woonkamer met leren zetel" }, // Associated Weavers · Impulso (1920×960)
};
