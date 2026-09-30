#!/usr/bin/env node
/**
 * Genereert src/data/products.generated.ts uit design/content-sample.json (het gecureerde,
 * publiek zichtbare staal van brunic.be — productnamen + foto-URL's).
 *
 *   node apps/prototype/scripts/genereer-demoproducten.mjs
 *
 * Alles wat hier aan prijzen, varianten, voorraad, "nieuw" en facetten staat is een
 * EXPLICIETE VOORBEELDWAARDE voor het prototype — geen echte commerciële data en geen
 * rekenregels. Productomschrijvingen zijn lorem ipsum. Het resultaat wordt vervangen
 * door de Shopify-adapter zodra die er is (README §Shopify-adapter).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const sample = JSON.parse(fs.readFileSync(path.join(root, "design/content-sample.json"), "utf8")).sample;
const out = path.resolve(here, "../src/data/products.generated.ts");

const all = Object.values(sample).flat();
const byName = (name) => {
  const p = all.find((x) => x.name.trim() === name);
  if (!p) throw new Error(`Niet in staal: ${name}`);
  return p;
};
const imgs = (name, optionValue, max = 3) =>
  byName(name)
    .images.slice(0, max)
    .map((src, i) => ({ src, alt: `${byName(name).name.trim()}${i ? ` — beeld ${i + 1}` : ""}`, ...(optionValue ? { optionValue } : {}) }));

const SWATCH = {
  Grijs: "#9b9a97", Blauw: "#3f5b7d", Wit: "#f6f4ef", Antraciet: "#3b3c3f", Beige: "#d8c6a6", Ecru: "#ece3cf",
  Naturel: "#cbb796", Zwart: "#1d1b1a", Brons: "#8a6a42", Taupe: "#8b7d6b", Zilver: "#c3c3c1", Groen: "#55703d",
  Bruin: "#6c4a2f", Ivoor: "#f2ead4", Oranje: "#d8782c", Bordeaux: "#6c1f2d", Rood: "#b3232b", Roze: "#e5b3bf",
  Meerkleurig: "conic-gradient(#d8782c, #3f5b7d, #55703d, #e5b3bf, #d8782c)",
};

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
];
const HIGHLIGHTS = ["Lorem ipsum dolor sit amet", "Consectetur adipiscing elit", "Sed do eiusmod tempor", "Ut labore et dolore magna"];

const eur = (n) => ({ amount: Math.round(n * 100) / 100, currency: "EUR" });
const price = (amount, unit, compareAt) => ({ amount: eur(amount), unit, ...(compareAt ? { compareAt: eur(compareAt) } : {}) });
const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const daysAgo = (d) => new Date(Date.UTC(2026, 8, 26) - d * 86400000).toISOString().slice(0, 10);

const UNIT_LABEL = { stuk: "Per stuk", meter: "Per lopende meter", m2: "Per m²", rol: "Per rol", set: "Per set" };
const QTY = {
  stuk: { min: 1, step: 1, max: 20 },
  rol: { min: 1, step: 1, max: 40 },
  set: { min: 1, step: 1, max: 20 },
  meter: { min: 0.5, step: 0.5, max: 50 },
  m2: { min: 1, step: 0.5, max: 200 },
};

let seq = 0;
/**
 * Maakt een product. `axes` = opties in volgorde; `priceFor(opts)` levert per variant de
 * prijs (of null bij prijs op aanvraag).
 */
function product(def) {
  seq += 1;
  const id = `p${String(seq).padStart(3, "0")}`;
  const options = def.axes ?? [];
  const combos = options.reduce(
    (acc, opt) => acc.flatMap((c) => opt.values.map((v) => ({ ...c, [opt.name]: v.value }))),
    [{}],
  );
  const variants = combos.map((opts, i) => ({
    id: `${id}-v${i + 1}`,
    sku: def.sku ? `${def.sku}${combos.length > 1 ? `-${i + 1}` : ""}` : `DEMO-${id.toUpperCase()}-${i + 1}`,
    options: opts,
    price: def.pricing === "on-request" ? null : def.priceFor(opts),
    availability: def.availabilityFor?.(opts, i) ?? def.availability ?? "op-voorraad",
  }));
  const unit = def.unit ?? "stuk";
  const kleuren = options.find((o) => o.name === "Kleur")?.values.map((v) => v.value) ?? def.kleur ?? [];
  const hasOffer = variants.some((v) => v.price?.compareAt);
  const facets = {
    kleur: kleuren,
    eenheid: [UNIT_LABEL[unit]],
    ...(def.facets ?? {}),
  };
  if (def.brand) facets.merk = [def.brand];
  return {
    id,
    slug: def.slug ?? slugify(def.title),
    title: def.title,
    ...(def.brand ? { brand: def.brand } : {}),
    ...(def.line ? { line: def.line } : {}),
    categoryIds: def.categories,
    primaryCategoryId: def.categories[0],
    pricing: def.pricing ?? "fixed",
    quantity: QTY[unit],
    images: def.images ?? [],
    options,
    variants,
    highlights: def.highlights ?? HIGHLIGHTS.slice(0, 3),
    description: LOREM.join("\n\n"),
    specs: [
      ...(kleuren.length === 1 ? [{ label: "Kleur", value: kleuren[0] }] : []),
      ...(def.brand ? [{ label: "Merk", value: def.brand }] : []),
      ...(def.line ? [{ label: "Collectie", value: def.line }] : []),
      { label: "Verkoopeenheid", value: UNIT_LABEL[unit] },
      ...(def.specs ?? []),
    ],
    dimensions: def.dimensions ?? [],
    facets,
    badges: [...(def.isNew ? ["nieuw"] : []), ...(hasOffer ? ["aanbieding"] : []), ...(def.pricing === "on-request" ? ["op-maat"] : [])],
    createdAt: def.isNew ? daysAgo(def.isNew) : daysAgo(120 + seq * 3),
    popularity: def.popularity ?? 50,
    demo: true,
  };
}

const kleurOptie = (values) => ({ name: "Kleur", values: values.map((value) => ({ value, swatch: SWATCH[value] })) });
const maatOptie = (values, name = "Maat") => ({ name, values: values.map((value) => ({ value })) });

const P = [];

/* ── Raamdecoratie ─────────────────────────────────────────────────── */
const rolMaten = ["60 × 180 cm", "80 × 180 cm", "100 × 180 cm", "120 × 180 cm", "140 × 180 cm"];
const rolPrijs = { "60 × 180 cm": 24.95, "80 × 180 cm": 29.95, "100 × 180 cm": 34.95, "120 × 180 cm": 39.95, "140 × 180 cm": 44.95 };
P.push(product({
  title: "Rolgordijn verduisterend", line: "Verduisterend", categories: ["c11"], sku: "554505019",
  axes: [kleurOptie(["Grijs", "Blauw", "Wit", "Antraciet"]), maatOptie(rolMaten)],
  images: [
    ...imgs("Rolgordijn Grijs Verduisterend", "Grijs"), ...imgs("Rolgordijn Blauw Verduisterend", "Blauw"),
    ...imgs("Rolgordijn Wit Verduisterend", "Wit"), ...imgs("Rolgordijn Antraciet Verduisterend", "Antraciet"),
  ],
  priceFor: (o) => price(rolPrijs[o.Maat], "stuk"),
  availabilityFor: (o) => (o.Kleur === "Blauw" && o.Maat === "140 × 180 cm" ? "uitverkocht" : o.Maat === "140 × 180 cm" ? "beperkt" : "op-voorraad"),
  facets: { lichtdoorlatendheid: ["Verduisterend"], type: ["Rolgordijn"] },
  dimensions: [{ label: "Breedte", value: "60 – 140 cm (5 standaardmaten)" }, { label: "Hoogte", value: "180 cm" }],
  popularity: 95,
}));
P.push(product({
  title: "Rolgordijn lichtdoorlatend", line: "Lichtdoorlatend", categories: ["c12"], sku: "554505023",
  axes: [kleurOptie(["Beige", "Ecru", "Wit"]), maatOptie(rolMaten)],
  images: [
    ...imgs("Rolgordijn Beige Lichtdoorlatend", "Beige"), ...imgs("Rolgordijn Ecru Lichtdoorlatend", "Ecru"),
    ...imgs("Rolgordijn Wit Lichtdoorlatend", "Wit"),
  ],
  priceFor: (o) => price(rolPrijs[o.Maat] - 2, "stuk", o.Kleur === "Ecru" ? rolPrijs[o.Maat] + 5 : undefined),
  facets: { lichtdoorlatendheid: ["Lichtdoorlatend"], type: ["Rolgordijn"] },
  dimensions: [{ label: "Breedte", value: "60 – 140 cm" }, { label: "Hoogte", value: "180 cm" }],
  popularity: 80, isNew: 12,
}));
P.push(product({
  title: "Rolgordijn Scandi linnen lichtdoorlatend", line: "Scandi", categories: ["c12"],
  axes: [kleurOptie(["Naturel", "Grijs"]), maatOptie(rolMaten)],
  images: [...imgs("Rolgordijn Scandi Linnen Lichtdoorlatend", "Naturel"), ...imgs("Rolgordijn Scandi Linnen Grijs Lichtdoorlatend", "Grijs")],
  priceFor: (o) => price(rolPrijs[o.Maat] + 5, "stuk"),
  facets: { lichtdoorlatendheid: ["Lichtdoorlatend"], type: ["Rolgordijn"] },
  popularity: 70,
}));
P.push(product({
  title: "Duo rolgordijn wit lichtdoorlatend", line: "Duo", categories: ["c13"],
  axes: [maatOptie(rolMaten)], kleur: ["Wit"],
  images: imgs("Duo Rolgordijn Wit Lichtdoorlatend"),
  priceFor: (o) => price(rolPrijs[o.Maat] + 15, "stuk"),
  availability: "op-bestelling",
  facets: { lichtdoorlatendheid: ["Lichtdoorlatend"], type: ["Duo rolgordijn"] },
  popularity: 60,
}));
P.push(product({
  title: "Shutters op maat", line: "Maatwerk", categories: ["c14"], pricing: "on-request", kleur: ["Wit"],
  images: [{ src: "/demo/sfeer/shutters-eetkamer.jpg", alt: "Witte shutters in een eetkamer" }],
  facets: { type: ["Shutters"] }, popularity: 75,
}));
P.push(product({
  title: "Houten jaloezieën op maat", line: "Maatwerk", categories: ["c14"], pricing: "on-request", kleur: ["Zwart"],
  images: [{ src: "/demo/sfeer/jaloezieen.jpg", alt: "Donkere houten jaloezieën" }],
  facets: { type: ["Jaloezie"] }, popularity: 65, isNew: 20,
}));
P.push(product({
  title: "Overgordijnen op maat", line: "Maatwerk", categories: ["c13"], pricing: "on-request", kleur: ["Roze"],
  images: [{ src: "/demo/sfeer/gordijnen-living.jpg", alt: "Roze overgordijnen in een woonkamer" }],
  facets: { type: ["Overgordijn"] }, popularity: 85,
}));
P.push(product({
  title: "Plissé op maat", line: "Maatwerk", categories: ["c13"], pricing: "on-request",
  images: [], facets: { type: ["Plissé"] }, popularity: 40,
}));

/* ── Behang ────────────────────────────────────────────────────────── */
for (const [naam, kleur, isNew] of [
  ["Vliesbehang Philipp Plein Z80001 Zwart", "Zwart", 5],
  ["Vliesbehang Philipp Plein Z80004 Brons/Grijs", "Brons", 0],
  ["Vliesbehang Philipp Plein Z80002 Wit", "Wit", 0],
  ["Vliesbehang Philipp Plein Z80023", null, 9],
]) {
  P.push(product({
    title: naam.replace("Brons/Grijs", "brons-grijs"), brand: "Philipp Plein", line: "Philipp Plein", categories: ["c21"],
    sku: byName(naam).sku, kleur: kleur ? [kleur] : [], images: imgs(naam),
    unit: "rol", priceFor: () => price(189.95, "rol"), facets: { type: ["Vliesbehang"] },
    dimensions: [{ label: "Rolbreedte", value: "Demo: 70 cm" }, { label: "Rollengte", value: "Demo: 10,05 m" }],
    popularity: 60, isNew: isNew || undefined,
  }));
}
[27544, 27596, 27595, 27594, 27593, 27592, 27591, 27590].forEach((code, i) => {
  const naam = `World of Imagination - DL${code}`;
  P.push(product({
    title: `Behang World of Imagination DL${code}`, brand: "Spits Wallcoverings", line: "World of Imagination",
    categories: i < 4 ? ["c22"] : ["c23"], images: imgs(naam), unit: "rol",
    priceFor: () => price(59.5, "rol", i === 2 || i === 5 ? 69.5 : undefined),
    facets: { type: ["Kinderbehang"] }, kleur: [],
    dimensions: [{ label: "Rolbreedte", value: "Demo: 53 cm" }, { label: "Rollengte", value: "Demo: 10,05 m" }],
    popularity: 45 + i, isNew: i < 3 ? 3 + i * 4 : undefined,
  }));
});
P.push(product({ title: "Behangspatel 28 cm", categories: ["c24"], sku: "313517554", images: imgs("Behangspatel 28cm"), priceFor: () => price(4.55, "stuk"), facets: { type: ["Gereedschap"] }, popularity: 30 }));
P.push(product({ title: "Behangspatel Perfax", brand: "Perfax", categories: ["c24"], sku: "313516350", images: imgs("Behangspatel Perfax"), priceFor: () => price(6.5, "stuk"), facets: { type: ["Gereedschap"] }, popularity: 28 }));

/* ── Tapijten ──────────────────────────────────────────────────────── */
P.push(product({
  title: "Tapijt Ocerton Lao458", line: "Ocerton", categories: ["c32"],
  axes: [kleurOptie(["Taupe", "Zilver"]), maatOptie(["120 × 170 cm", "160 × 230 cm", "200 × 290 cm"])],
  images: [...imgs("Tapijt Ocerton Lao458 Taupe 160x230", "Taupe"), ...imgs("Tapijt Ocerton Lao458 Silver 160x230", "Zilver")],
  priceFor: (o) => price({ "120 × 170 cm": 169, "160 × 230 cm": 249, "200 × 290 cm": 349 }[o.Maat], "stuk"),
  availabilityFor: (o) => (o.Maat === "200 × 290 cm" ? "op-bestelling" : "op-voorraad"),
  facets: { vorm: ["Rechthoek"], type: ["Modern tapijt"] },
  dimensions: [{ label: "Formaten", value: "120 × 170 · 160 × 230 · 200 × 290 cm" }, { label: "Poolhoogte", value: "Demo: 12 mm" }],
  popularity: 92, isNew: 8,
}));
for (const [naam, titel, kleur] of [
  ["Oregano Lol181 Bunny 120cm x 170cm", "Kindertapijt Oregano Bunny 120 × 170 cm", "Blauw"],
  ["Oregano Lol181 Bear 120cm x 170cm", "Kindertapijt Oregano Bear 120 × 170 cm", "Blauw"],
  ["Oregano Lol180 Kitten 120cm x 170cm", "Kindertapijt Oregano Kitten 120 × 170 cm", "Roze"],
]) {
  P.push(product({
    title: titel, line: "Oregano", categories: ["c33"], sku: byName(naam).sku, kleur: [kleur], images: imgs(naam),
    priceFor: () => price(59.96, "stuk"), facets: { vorm: ["Rechthoek"], type: ["Kindertapijt"] },
    dimensions: [{ label: "Afmetingen", value: "120 × 170 cm" }], popularity: 55,
  }));
}
P.push(product({
  title: "Kindertapijt Nijntje Tent 65 × 90 cm", line: "Nijntje", categories: ["c33"], sku: "406715032", kleur: ["Meerkleurig"],
  images: imgs("Kindertapijt Nijntje Tent 65cm x 90cm"), priceFor: () => price(19, "stuk", 64),
  availability: "beperkt", facets: { vorm: ["Rechthoek"], type: ["Kindertapijt"] },
  dimensions: [{ label: "Afmetingen", value: "65 × 90 cm" }], popularity: 70,
}));
P.push(product({
  title: "Kindertapijt Ferrari Mik147 85 × 45 cm", line: "Ferrari", categories: ["c34"], sku: "767715017", kleur: ["Rood"],
  images: imgs("Ferrari Mik147 Ca. 85cm x 45cm"), priceFor: () => price(9, "stuk"), facets: { vorm: ["Rechthoek"], type: ["Kindertapijt"] },
  dimensions: [{ label: "Afmetingen", value: "ca. 85 × 45 cm" }], popularity: 35,
}));
for (const [naam, titel, kleur, prijs, nieuw] of [
  ["Knoeimat 100cm Vierkant Bacopa Moonlight Madeliefjes", "Knoeimat Bacopa Madeliefjes 100 × 100 cm", "Meerkleurig", 34.9, 15],
  ["Knoeimat 100cm Vierkant Bacopa Moonlight Kasseien", "Knoeimat Bacopa Kasseien 100 × 100 cm", "Meerkleurig", 34.9, 0],
  ["Knoeimat 100cm Vierkant Trude Puzzel 5331141", "Knoeimat Trude Puzzel 100 × 100 cm", "Meerkleurig", 34.9, 0],
  ["Knoeimat 100cm Vierkant Bacopa Moonlight Street", "Knoeimat Bacopa Street 100 × 100 cm", "Meerkleurig", 34.9, 0],
  ["Knoeimat 100cm Vierkant Babadag Atlantic Disa 101S", "Knoeimat Babadag Disa 100 × 100 cm", "Beige", 24.99, 0],
  ["Knoeimat 100cm Vierkant Baker Sonipro Zinc 139S", "Knoeimat Baker Zinc 100 × 100 cm", "Ecru", 34.9, 0],
]) {
  P.push(product({
    title: titel, line: "Knoeimat", categories: ["c35"], sku: byName(naam).sku, kleur: [kleur], images: imgs(naam),
    priceFor: () => price(prijs, "stuk"), facets: { vorm: ["Vierkant"], type: ["Knoeimat"] },
    dimensions: [{ label: "Afmetingen", value: "100 × 100 cm" }], popularity: 40, isNew: nieuw || undefined,
  }));
}
P.push(product({
  title: "Logotapijt op maat", line: "Maatwerk", categories: ["c36", "c43"], pricing: "on-request",
  // Enkel de sfeerfoto: de andere staalbeelden tonen logo's van derden.
  images: imgs("Voetmat met logo / Logotapijt").slice(2), facets: { type: ["Logotapijt"] }, popularity: 50,
}));

/* ── Vloerbekleding ────────────────────────────────────────────────── */
const columbia = [["228", "Groen"], ["738", "Bruin"], ["628", "Beige"], ["008", "Ivoor"], ["448", "Oranje"], ["598", "Bordeaux"], ["578", "Rood"], ["168", "Blauw"]];
P.push(product({
  title: "Vasttapijt Columbia", line: "Columbia", categories: ["c41"], sku: "404425029",
  axes: [kleurOptie(columbia.map(([, k]) => k)), maatOptie(["4 m", "5 m"], "Rolbreedte")],
  images: columbia.flatMap(([code, k]) => {
    const naam = all.find((x) => x.name.startsWith(`Columbia ${code} `)).name.trim();
    return imgs(naam, k, 1);
  }),
  unit: "m2", priceFor: () => price(29.99, "m2"),
  facets: { type: ["Vasttapijt"] },
  specs: [{ label: "Certificaat", value: "Demo: brandveiligheid op aanvraag" }],
  dimensions: [{ label: "Rolbreedte", value: "4 m of 5 m" }],
  popularity: 88,
}));
P.push(product({
  title: "Forbo Monel vloeronderhoud", brand: "Forbo", line: "Monel", categories: ["c43"],
  axes: [maatOptie(["1 L", "10 L"], "Inhoud")], images: [...imgs("Monel 1L", "1 L"), ...imgs("Monel 10L", "10 L")],
  priceFor: (o) => (o.Inhoud === "1 L" ? price(11.1, "stuk", 13.59) : price(49.99, "stuk", 79.99)),
  facets: { type: ["Onderhoud"] }, popularity: 42,
}));
for (const [titel, cat, prijs, kleur, nieuw, type] of [
  ["PVC-vloer eik naturel", "c42", 34.95, "Naturel", 6, "PVC"],
  ["Click-vinyl tegellook grijs", "c42", 39.95, "Grijs", 11, "Click-vinyl"],
  ["Laminaat eik rustiek", "c41", 24.95, "Bruin", 0, "Laminaat"],
  ["Grastapijt Lawn", "c43", 12.95, "Groen", 0, "Grastapijt"],
]) {
  P.push(product({
    title: `${titel} (voorbeeldproduct)`, categories: [cat], images: [], kleur: [kleur], unit: "m2",
    priceFor: () => price(prijs, "m2"), facets: { type: [type] }, popularity: 30, isNew: nieuw || undefined,
  }));
}

/* ── Stoffen & fournituren ─────────────────────────────────────────── */
const stof = (naam, titel, cat, prijs, kleur, extra = {}) =>
  P.push(product({
    title: titel, categories: [cat], sku: byName(naam).sku, kleur: [kleur], images: imgs(naam), unit: "meter",
    priceFor: () => price(prijs, "meter", extra.compareAt), dimensions: [{ label: "Stofbreedte", value: "140 cm" }],
    facets: { type: [extra.type ?? "Stof"] }, popularity: extra.popularity ?? 50, isNew: extra.isNew,
  }));
stof("Stof Bedrukt Black Out 680310 C 1,40m", "Stof bedrukt black-out 680310 C", "c51", 19.99, "Meerkleurig", { type: "Black-out", isNew: 4, popularity: 75 });
stof("Stof Bedrukt Black Out 680310 Y 1,40m", "Stof bedrukt black-out 680310 Y", "c51", 19.99, "Meerkleurig", { type: "Black-out" });
stof("Stof Grijs Black Out Ibis 804 1,40m", "Stof black-out Ibis 804 grijs", "c51", 29.99, "Grijs", { type: "Black-out", compareAt: 34.99, popularity: 82 });
stof("Beertje Hartje 16494 *** 1,40m", "Kinderstof Beertje Hartje", "c52", 7.5, "Meerkleurig", { type: "Kinderstof" });
stof("Voering Polico 382096", "Voering Polico 382096", "c52", 6.99, "Ecru", { type: "Voering", popularity: 65 });
const lint = (naam, titel, cat, prijs, type) =>
  P.push(product({
    title: titel, categories: [cat], sku: byName(naam).sku, kleur: ["Wit"], images: imgs(naam), unit: "meter",
    priceFor: () => price(prijs, "meter"), facets: { type: [type] }, popularity: 38,
  }));
lint("Gordijnlint Wit 2,5cm GT7", "Gordijnlint wit 2,5 cm GT7", "c53", 1.4, "Gordijnlint");
lint("Dubbeling Lint Wit 2,5cm GT17", "Dubbelingslint wit 2,5 cm GT17", "c53", 1.5, "Gordijnlint");
lint("Fronslint wit 2,5cm GT3", "Fronslint wit 2,5 cm GT3", "c53", 1.4, "Fronslint");
lint("Dubbel Fronslint wit 5cm GT2", "Dubbel fronslint wit 5 cm GT2", "c53", 2.1, "Fronslint");
lint("Groot Fronslint Wit 7cm GT12", "Groot fronslint wit 7 cm GT12", "c53", 3.99, "Fronslint");
lint("Velcro Zacht Klevend 2cm", "Velcro zacht klevend 2 cm", "c54", 2.5, "Velcro");
lint("Velcro Hard Klevend 2cm", "Velcro hard klevend 2 cm", "c54", 1.79, "Velcro");
lint("Velcro Zacht Om Te Stikken 2cm", "Velcro zacht om te stikken 2 cm", "c54", 1.79, "Velcro");
lint("Velcro Hard Om Te Stikken 2cm", "Velcro hard om te stikken 2 cm", "c54", 1.3, "Velcro");

/* ── Slaapcomfort ──────────────────────────────────────────────────── */
for (const [naam, titel, prijs, van, nieuw] of [
  ["Hoofdkussen 50 x 60 cm - Oreiller Orthopédique met ristssluiting", "Hoofdkussen orthopedisch 50 × 60 cm", 19.99, 39.99, 0],
  ["Hoofdkussen 60 x 60 cm - Bengali met ristssluiting", "Hoofdkussen Bengali 60 × 60 cm", 19.9, 33, 0],
  ["Hoofdkussen 60 x 60 cm", "Hoofdkussen basis 60 × 60 cm", 8.99, 15.99, 0],
  ["Hoofdkussen 45 x 70 cm - Deep Sleep Traagschuim", "Hoofdkussen Deep Sleep traagschuim 45 × 70 cm", 34.95, 49.95, 7],
  ["Hoofdkussen 60 x 60 cm - Plumka Ultra Rest", "Hoofdkussen Plumka Ultra Rest 60 × 60 cm", 34.95, 41.5, 0],
]) {
  P.push(product({
    title: titel, categories: ["c60"], sku: byName(naam).sku, kleur: ["Wit"], images: imgs(naam),
    priceFor: () => price(prijs, "stuk", van), facets: { type: ["Hoofdkussen"] }, popularity: 58, isNew: nieuw || undefined,
  }));
}
P.push(product({
  title: "Panda vulling 1 kg", categories: ["c61"], sku: "201206001", images: imgs("Panda Vulling 1kg"),
  priceFor: () => price(12.5, "stuk"), facets: { type: ["Vulling"] }, popularity: 25,
}));
const overtrekMaten = ["140 × 200 cm", "240 × 220 cm"];
P.push(product({
  title: "Dekbedovertrek Aurore", line: "Aurore", categories: ["c62"], axes: [maatOptie(overtrekMaten)],
  images: [...imgs("Dekbedovertrek Aurore 140cm x 200cm", "140 × 200 cm"), ...imgs("Dekbedovertrek Aurore 240cm x 220cm", "240 × 220 cm")],
  priceFor: (o) => (o.Maat === "140 × 200 cm" ? price(55.96, "stuk", 69.95) : price(87.96, "stuk", 109.95)),
  facets: { type: ["Dekbedovertrek"] }, popularity: 66,
}));
P.push(product({
  title: "Dekbedovertrek Arabesk", line: "Arabesk", categories: ["c62"], axes: [maatOptie(overtrekMaten)],
  images: [...imgs("Dekbedovertrek Arabesk 140cm x 200cm", "140 × 200 cm"), ...imgs("Dekbedovertrek Arabesk 240cm x 220cm", "240 × 220 cm")],
  priceFor: (o) => price(o.Maat === "140 × 200 cm" ? 69.95 : 109.95, "stuk"),
  facets: { type: ["Dekbedovertrek"] }, popularity: 52, isNew: 2,
}));
P.push(product({
  title: "Dekbedovertrek Iris", line: "Iris", categories: ["c62"],
  axes: [{ name: "Kleur", values: [{ value: "Auburn", swatch: "#8a3b24" }, { value: "Indian", swatch: "#2f4f6b" }] }, maatOptie(overtrekMaten)],
  images: [...imgs("Dekbedovertrek Iris Auburn 240cm x 220cm", "Auburn"), ...imgs("Dekbedovertrek Iris Indian 240cm x 220cm", "Indian")],
  priceFor: (o) => price(o.Maat === "140 × 200 cm" ? 47.5 : 74.99, "stuk"),
  facets: { type: ["Dekbedovertrek"] }, popularity: 48,
}));

// Kleurfacet normaliseren (Auburn/Indian vallen onder een familie).
const FAMILIE = { Auburn: "Bruin", Indian: "Blauw" };
for (const p of P) p.facets.kleur = [...new Set(p.facets.kleur.map((k) => FAMILIE[k] ?? k))];

const header = `/**
 * GEGENEREERD — niet met de hand bewerken.
 * Bron: design/content-sample.json · script: apps/prototype/scripts/genereer-demoproducten.mjs
 *
 * Demodata voor het prototype: titels en foto's komen uit het publieke brunic.be-staal;
 * prijzen, varianten, voorraad, "nieuw", facetten en teksten zijn VOORBEELDWAARDEN.
 * Wordt vervangen door de Shopify-adapter (README §Shopify-adapter).
 */
import type { Product } from "@/lib/catalog/types";

export const PRODUCTS: Product[] = `;
fs.writeFileSync(out, header + JSON.stringify(P, null, 2) + ";\n");
console.log(`${P.length} producten → ${path.relative(root, out)}`);
