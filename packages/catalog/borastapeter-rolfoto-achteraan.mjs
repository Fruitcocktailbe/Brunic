#!/usr/bin/env node
// borastapeter-rolfoto-achteraan.mjs — een Boråstapeter-product begint nooit met de rolfoto
// (de golvende rol op witte achtergrond). Per product:
//   1. alt-tekst van de rolfoto's: "… – productfoto – kleur X" → "… – rolfoto – kleur X"
//      (de webshop herkent ze daaraan, zie apps/prototype/src/lib/catalog/shopify-adapter.ts);
//   2. variantbeeld: is dat de rolfoto, dan het eerste andere beeld van die kleur (meestal het
//      dessin) — zo tonen ook de kleurstalen het dessin i.p.v. de rol;
//   3. mediavolgorde: alle andere beelden eerst (onderlinge volgorde blijft), de rolfoto's achteraan.
// Idempotent: opnieuw draaien na een (her)import zet alles weer goed.
//
//   node packages/catalog/borastapeter-rolfoto-achteraan.mjs                     # dry-run
//   node packages/catalog/borastapeter-rolfoto-achteraan.mjs --handle <handle>   # één product
//   node packages/catalog/borastapeter-rolfoto-achteraan.mjs --go                # schrijven
import { admin } from "./_shopify.mjs";

const args = process.argv.slice(2);
const GO = args.includes("--go");
const HANDLE = args.includes("--handle") ? args[args.indexOf("--handle") + 1] : null;
const VENDOR = "Boråstapeter";

const IS_PRODUCTFOTO = / – productfoto – /;
const IS_ROLFOTO = / – rolfoto – /;

/**
 * De import labelde zowel de rolfoto als sommige vlakke dessinbeelden "productfoto". Rolfoto's
 * zijn liggend (3:2, 4:3 …) of staand 459×600 / 1570×2048 (≈ 0,766); de vlakke dessinbeelden
 * met dat label zijn 4:5 of vierkant. Visueel nagekeken op alle 859 productfoto's (01/10/2026).
 */
function isRol(m) {
  if (IS_ROLFOTO.test(m.alt ?? "")) return true;
  const w = m.image?.width;
  const h = m.image?.height;
  if (!IS_PRODUCTFOTO.test(m.alt ?? "") || !w || !h) return false;
  const r = w / h;
  return r > 1.15 || Math.abs(r - 0.766) < 0.01;
}

async function metRetry(query, variables) {
  for (let poging = 1; ; poging++) {
    try {
      return await admin(query, variables);
    } catch (e) {
      if (poging < 8 && /THROTTLED|HTTP 5\d\d|fetch failed/i.test(String(e))) {
        await new Promise((r) => setTimeout(r, 1500 * poging));
        continue;
      }
      throw e;
    }
  }
}

const PRODUCTS = `query($c:String, $q:String!){ products(first:3, after:$c, query:$q){
  pageInfo{ hasNextPage endCursor }
  nodes{ id title handle
    media(first:100){ nodes{ id alt ... on MediaImage{ image{ width height } } } }
    variants(first:60){ nodes{ id selectedOptions{ name value } media(first:1){ nodes{ id } } } }
  } } }`;

const q = HANDLE ? `handle:${HANDLE}` : `vendor:'${VENDOR}'`;
const products = [];
let cursor = null;
do {
  const d = await metRetry(PRODUCTS, { c: cursor, q });
  products.push(...d.products.nodes);
  cursor = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
  process.stdout.write(`\rProducten gelezen: ${products.length}`);
} while (cursor);
process.stdout.write("\n");

const kleurRe = (waarde) => new RegExp(` – kleur ${waarde.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const plan = [];
const stats = { producten: products.length, alt: 0, varianten: 0, volgorde: 0, enkelRol: [], kleurZonderAlternatief: 0 };
for (const p of products) {
  const media = p.media.nodes;
  const rol = media.filter(isRol);
  if (!rol.length) continue;
  const rest = media.filter((m) => !isRol(m));
  if (!rest.length) stats.enkelRol.push(p.title);

  const altWijzigingen = rol.filter((m) => IS_PRODUCTFOTO.test(m.alt ?? "")).map((m) => ({ id: m.id, alt: m.alt.replace(" – productfoto – ", " – rolfoto – ") }));

  const rolIds = new Set(rol.map((m) => m.id));
  const varianten = [];
  for (const v of p.variants.nodes) {
    const huidig = v.media.nodes[0]?.id;
    if (!huidig || !rolIds.has(huidig)) continue;
    const kleur = v.selectedOptions.find((o) => /kleur/i.test(o.name))?.value;
    const nieuw = kleur ? rest.find((m) => kleurRe(kleur).test(m.alt ?? "")) : undefined;
    if (nieuw) varianten.push({ variantId: v.id, oud: huidig, nieuw: nieuw.id });
    else stats.kleurZonderAlternatief++;
  }

  const gewenst = [...rest, ...rol];
  const volgordeAnders = gewenst.some((m, i) => m.id !== media[i].id);

  if (!altWijzigingen.length && !varianten.length && !volgordeAnders) continue;
  stats.alt += altWijzigingen.length;
  stats.varianten += varianten.length;
  if (volgordeAnders) stats.volgorde++;
  plan.push({ p, altWijzigingen, varianten, gewenst: volgordeAnders ? gewenst : null });
}

console.log(`${stats.producten} producten van ${HANDLE ?? VENDOR} · ${plan.length} aan te passen:`);
console.log(`  mediavolgorde: ${stats.volgorde} producten · alt-teksten → rolfoto: ${stats.alt} · variantbeelden: ${stats.varianten}`);
if (stats.kleurZonderAlternatief) console.log(`  ${stats.kleurZonderAlternatief} varianten houden de rolfoto (geen ander beeld van die kleur)`);
if (stats.enkelRol.length) console.log(`  enkel een rolfoto, niets om mee te beginnen: ${stats.enkelRol.join(", ")}`);
for (const { p, gewenst } of plan.slice(0, 3)) {
  if (gewenst) console.log(`  vb. ${p.title}: ${gewenst.slice(0, 4).map((m) => (m.alt ?? "").split(" – ").slice(1).join(" ")).join(" · ")} …`);
}

if (!GO) {
  console.log("\nDRY-RUN — draai met --go om te schrijven.");
  process.exit(0);
}

const ALT = `mutation($files:[FileUpdateInput!]!){ fileUpdate(files:$files){ userErrors{ field message } } }`;
const DETACH = `mutation($productId:ID!, $vm:[ProductVariantDetachMediaInput!]!){ productVariantDetachMedia(productId:$productId, variantMedia:$vm){ userErrors{ field message } } }`;
const APPEND = `mutation($productId:ID!, $vm:[ProductVariantAppendMediaInput!]!){ productVariantAppendMedia(productId:$productId, variantMedia:$vm){ userErrors{ field message } } }`;
const REORDER = `mutation($id:ID!, $moves:[MoveInput!]!){ productReorderMedia(id:$id, moves:$moves){ mediaUserErrors{ field message } } }`;

let fouten = 0;
const meld = (p, stap, errs) => {
  if (!errs?.length) return;
  fouten++;
  console.log(`! ${p.title} (${stap}): ${errs.map((e) => e.message).join("; ")}`);
};

for (const [n, { p, altWijzigingen, varianten, gewenst }] of plan.entries()) {
  if (altWijzigingen.length) meld(p, "alt", (await metRetry(ALT, { files: altWijzigingen })).fileUpdate.userErrors);
  if (varianten.length) {
    const los = await metRetry(DETACH, { productId: p.id, vm: varianten.map((v) => ({ variantId: v.variantId, mediaIds: [v.oud] })) });
    meld(p, "variant los", los.productVariantDetachMedia.userErrors);
    const aan = await metRetry(APPEND, { productId: p.id, vm: varianten.map((v) => ({ variantId: v.variantId, mediaIds: [v.nieuw] })) });
    meld(p, "variantbeeld", aan.productVariantAppendMedia.userErrors);
  }
  if (gewenst) {
    const r = await metRetry(REORDER, { id: p.id, moves: gewenst.map((m, i) => ({ id: m.id, newPosition: String(i) })) });
    meld(p, "volgorde", r.productReorderMedia.mediaUserErrors);
  }
  process.stdout.write(`\rGeschreven: ${n + 1}/${plan.length}`);
}
process.stdout.write("\n");
console.log(fouten ? `Klaar met ${fouten} fouten (zie hierboven).` : "Klaar. Daarna: pnpm prototype:sync (nieuwe momentopname voor de webshop).");
