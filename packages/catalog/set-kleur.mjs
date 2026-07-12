#!/usr/bin/env node
// set-kleur.mjs — leidt een kleurfamilie af uit de producttitel en zet brunic.kleurfamilie
// op ALLE producten. Heuristisch (staal-kwaliteit): de echte pipeline vult kleur uit de
// leverancier-attributen. Daarna in Search & Discovery één filter op 'Kleurfamilie' toevoegen.
//
//   node packages/catalog/set-kleur.mjs [--go]
import { admin } from "./_shopify.mjs";

const GO = process.argv.includes("--go");

// Prioriteit-volgorde: eerste match in de titel wint. Elk gezin = lijst triggerwoorden.
const FAMILIES = [
  ["Antraciet", ["antraciet", "anthracite"]],
  ["Zwart", ["zwart", "black"]],
  ["Wit", ["wit", "white", "ivoor"]],
  ["Grijs", ["grijs", "grey", "gray", "platinum", "zilvergrijs"]],
  ["Beige", ["beige", "ecru", "creme", "crème", "zand", "sand", "naturel", "linnen", "taupe", "camel", "oester"]],
  ["Bruin", ["bruin", "brown", "chocolade", "mokka", "cognac"]],
  ["Groen", ["groen", "green", "mint", "olijf", "salie", "opaalgroen"]],
  ["Blauw", ["blauw", "blue", "jeans", "denim", "marine", "navy", "aqua", "petrol"]],
  ["Rood", ["rood", "red", "robijn", "bordeaux", "kersen"]],
  ["Roze", ["roze", "roos", "pink", "lichtroos", "oudroze"]],
  ["Geel", ["geel", "yellow", "oker", "mosterd"]],
  ["Oranje", ["oranje", "orange", "terra", "terracotta"]],
  ["Paars", ["paars", "purple", "lila", "mauve", "aubergine"]],
  ["Goud/metallic", ["goud", "gold", "koper", "metallic", "zilver", "silver"]],
];

function kleurUit(titel) {
  // "black-out" is een stofsoort, geen kleur — strip het zodat de échte kleur in de naam wint.
  const t = titel.toLowerCase().replace(/black[-\s]?out/g, "");
  for (const [familie, woorden] of FAMILIES) {
    if (woorden.some((w) => t.includes(w))) return familie;
  }
  return null;
}

// type van de definitie (single vs list) bepaalt de value-vorm
const defQ = await admin(
  `{ metafieldDefinitions(first:1, ownerType: PRODUCT, namespace:"brunic", key:"kleurfamilie"){ nodes{ type{ name } } } }`,
);
const defType = defQ.metafieldDefinitions.nodes[0]?.type?.name ?? "single_line_text_field";
const isList = defType.startsWith("list.");
console.log(`kleurfamilie-type: ${defType} (${isList ? "lijst" : "enkel"})`);

// alle producten ophalen
const items = [];
let cursor = null;
do {
  const d = await admin(
    `query($c:String){ products(first:100, after:$c){ nodes{ id title } pageInfo{ hasNextPage endCursor } } }`,
    { c: cursor },
  );
  for (const n of d.products.nodes) items.push(n);
  cursor = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
} while (cursor);

const verdeling = {};
const teZetten = [];
for (const p of items) {
  const k = kleurUit(p.title);
  verdeling[k ?? "(geen)"] = (verdeling[k ?? "(geen)"] ?? 0) + 1;
  if (k) teZetten.push({ id: p.id, kleur: k });
}

console.log(`\n${items.length} producten · verdeling:`);
for (const [k, n] of Object.entries(verdeling).sort((a, b) => b[1] - a[1])) console.log(`  ${String(k).padEnd(16)} ${n}`);

if (!GO) {
  console.log("\nDRY-RUN — draai met --go om te schrijven.");
  process.exit(0);
}

const SET = `mutation($mfs:[MetafieldsSetInput!]!){ metafieldsSet(metafields:$mfs){ userErrors{ field message } } }`;
for (let i = 0; i < teZetten.length; i += 25) {
  const batch = teZetten.slice(i, i + 25);
  const mfs = batch.map((p) => ({
    ownerId: p.id,
    namespace: "brunic",
    key: "kleurfamilie",
    type: defType,
    value: isList ? JSON.stringify([p.kleur]) : p.kleur,
  }));
  const r = await admin(SET, { mfs });
  const errs = r.metafieldsSet.userErrors;
  if (errs.length) console.log("! ", errs.map((e) => e.message).join("; "));
}
console.log(`\nGezet op ${teZetten.length} producten. Voeg nu in Search & Discovery een filter 'Kleurfamilie' toe.`);
