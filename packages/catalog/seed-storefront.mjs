#!/usr/bin/env node
// seed-storefront.mjs — duwt het staal uit data/seed/seed-input.json (gemaakt door
// select-seed.ps1) naar de dev-store via Admin productSet: producten + varianten +
// media + metafields, gekoppeld aan de bestaande collecties, en gepubliceerd op
// Brunic Headless + Online Store. Idempotent: bestaande handles worden overgeslagen.
//
//   node packages/catalog/seed-storefront.mjs            # DRY-RUN: toont het plan
//   node packages/catalog/seed-storefront.mjs --go       # schrijft echt
//   node packages/catalog/seed-storefront.mjs --go --limit 5
//
// Domeinregels (packages/catalog/README.md): etalage-vlag ALTIJD expliciet zetten;
// publiceren op Brunic Headless is verplicht anders is het product onzichtbaar voor
// de Storefront API.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { admin, ROOT_DIR } from "./_shopify.mjs";
import { schoonTitel } from "./_util.mjs";

const args = process.argv.slice(2);
const GO = args.includes("--go");
const limitArg = args.indexOf("--limit");
const LIMIT = limitArg >= 0 ? Number(args[limitArg + 1]) : Infinity;

const PRODUCT_TYPE = {
  behang: "Behang",
  "gordijnen-stoffen": "Stof",
  vloeren: "Vloer",
  "tapijten-karpetten": "Tapijt",
  raamdecoratie: "Raamdecoratie",
  verf: "Verf",
  "slapen-wonen": "Wonen",
};

function slug(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 55);
}

/** "1,60m x 2,30m" / "60cm x 100cm" -> {breedte,lengte,label} in cm (breedte=min). */
function parseMaat(raw) {
  const m = raw.match(/(\d+(?:[.,]\d+)?)\s*(m|cm)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(m|cm)/i);
  if (!m) return null;
  const toCm = (v, u) => {
    const n = parseFloat(v.replace(",", "."));
    return Math.round(u.toLowerCase() === "m" ? n * 100 : n);
  };
  const a = toCm(m[1], m[2]);
  const b = toCm(m[3], m[4]);
  if (!a || !b) return null;
  const breedte = Math.min(a, b);
  const lengte = Math.max(a, b);
  return { breedte, lengte, label: `${breedte} × ${lengte} cm` };
}

function erpFamilie(sku) {
  return /^\d{9}$/.test(sku) ? sku.slice(3, 6) : null;
}

const PRODUCT_SET = /* GraphQL */ `
  mutation Seed($input: ProductSetInput!) {
    productSet(synchronous: true, input: $input) {
      product { id handle }
      userErrors { field message code }
    }
  }
`;
const PUBLISH = /* GraphQL */ `
  mutation Pub($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) { userErrors { field message } }
  }
`;

// PowerShell ConvertTo-Json ontrolt een array met één element tot een scalar; forceer terug.
const asArray = (x) => (Array.isArray(x) ? x : x == null ? [] : [x]);

function buildInput(p, collGid) {
  const productType = PRODUCT_TYPE[p.category] ?? "";
  const handle = `${slug(p.name)}-${p.sku || Math.random().toString(36).slice(2, 8)}`;
  const images = asArray(p.images);
  const variations = asArray(p.variations);
  const files = images.slice(0, 4).map((url) => ({ originalSource: url, contentType: "IMAGE" }));

  // ERP-getallen uit de klant-zichtbare titel; ze verhuizen naar het backend-metafield.
  const { titel, nummers } = schoonTitel(p.name);

  const metafields = [
    { namespace: "brunic", key: "etalage", type: "boolean", value: "false" },
  ];
  const fam = erpFamilie(p.sku);
  if (fam) metafields.push({ namespace: "brunic", key: "erp_familie", type: "single_line_text_field", value: fam });
  const artikelnr = [p.sku, ...nummers].filter(Boolean).join(" ").trim();
  if (artikelnr) metafields.push({ namespace: "brunic", key: "erp_artikelnummer", type: "single_line_text_field", value: artikelnr });

  const base = {
    handle,
    title: titel,
    descriptionHtml: `<p>${titel}</p>`,
    productType,
    vendor: "Brunic",
    status: "ACTIVE",
    files,
    metafields,
    collections: [collGid],
  };

  // Eén-variant-product met Shopify's impliciete default-optie (productSet eist optionValues).
  const single = (price, sku) => ({
    ...base,
    productOptions: [{ name: "Title", values: [{ name: "Default Title" }] }],
    variants: [
      {
        price,
        sku: sku || undefined,
        optionValues: [{ optionName: "Title", name: "Default Title" }],
        inventoryItem: { tracked: false },
      },
    ],
  });

  // ---- variabel: opties + varianten met maat-metafields ----
  if (p.type === "variable") {
    const seen = new Set();
    const variants = [];
    for (const v of variations) {
      const maat = parseMaat(v.sizeRaw);
      if (!maat || seen.has(maat.label)) continue;
      seen.add(maat.label);
      variants.push({
        price: v.price,
        sku: v.sku || undefined,
        optionValues: [{ optionName: "Maat", name: maat.label }],
        inventoryItem: { tracked: false },
        metafields: [
          { namespace: "brunic", key: "breedte_cm", type: "number_integer", value: String(maat.breedte) },
          { namespace: "brunic", key: "lengte_cm", type: "number_integer", value: String(maat.lengte) },
        ],
      });
    }
    if (variants.length > 0) {
      return {
        ...base,
        productOptions: [{ name: "Maat", values: variants.map((v) => ({ name: v.optionValues[0].name })) }],
        variants,
      };
    }
    // geen enkele maat parseerbaar -> val terug op één variant (goedkoopste prijs)
    const cheapest = variations.reduce((a, b) => (Number(b.price) < Number(a.price) ? b : a));
    return single(cheapest.price, cheapest.sku);
  }

  // ---- simpel: één variant ----
  return single(p.price, p.sku);
}

async function main() {
  const raw = readFileSync(join(ROOT_DIR, "data/seed/seed-input.json"), "utf8").replace(/^﻿/, "");
  const seed = JSON.parse(raw).slice(0, LIMIT);

  // collectie-handles -> GID
  const cols = await admin(`{ collections(first: 50) { nodes { id handle } } }`);
  const collByHandle = Object.fromEntries(cols.collections.nodes.map((c) => [c.handle, c.id]));

  // bestaande product-handles (idempotentie)
  const existing = new Set();
  let cursor = null;
  do {
    const d = await admin(
      `query($c:String){ products(first:250, after:$c){ nodes{ handle } pageInfo{ hasNextPage endCursor } } }`,
      { c: cursor },
    );
    for (const n of d.products.nodes) existing.add(n.handle);
    cursor = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
  } while (cursor);

  // publicaties
  const pubs = await admin(`{ publications(first: 20) { nodes { id name } } }`);
  const pubIds = pubs.publications.nodes
    .filter((p) => p.name === "Brunic Headless" || p.name === "Online Store")
    .map((p) => ({ publicationId: p.id }));

  console.log(GO ? "MODUS: --go (schrijft echt)\n" : "MODUS: DRY-RUN (geen wijzigingen)\n");

  let created = 0;
  let skipped = 0;
  let failed = 0;
  for (const p of seed) {
    const collGid = collByHandle[p.category];
    if (!collGid) {
      console.log(`! ${p.name} — collectie ${p.category} bestaat niet, overslaan`);
      failed++;
      continue;
    }
    const input = buildInput(p, collGid);
    if (existing.has(input.handle)) {
      console.log(`= ${input.handle} — bestaat al, overslaan`);
      skipped++;
      continue;
    }

    const nVar = input.variants.length;
    if (!GO) {
      console.log(`+ [${p.category}] ${input.handle}  (${nVar} variant${nVar > 1 ? "en" : ""}, ${input.files.length} foto's)`);
      created++;
      continue;
    }

    try {
      const r = await admin(PRODUCT_SET, { input });
      const errs = r.productSet.userErrors;
      if (errs.length) {
        console.log(`! ${input.handle} — ${errs.map((e) => `${e.field}: ${e.message}`).join("; ")}`);
        failed++;
        continue;
      }
      const id = r.productSet.product.id;
      const pr = await admin(PUBLISH, { id, input: pubIds });
      const pe = pr.publishablePublish.userErrors;
      if (pe.length) console.log(`  ~ ${input.handle} gepubliceerd met waarschuwing: ${pe.map((e) => e.message).join("; ")}`);
      console.log(`+ ${input.handle}  (${nVar} variant${nVar > 1 ? "en" : ""})`);
      created++;
    } catch (e) {
      console.log(`! ${input.handle} — ${e.message}`);
      failed++;
    }
  }

  console.log(`\n${GO ? "Aangemaakt" : "Zou aanmaken"}: ${created} · overgeslagen: ${skipped} · mislukt: ${failed}`);
  if (!GO) console.log("Draai opnieuw met --go om echt te schrijven.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
