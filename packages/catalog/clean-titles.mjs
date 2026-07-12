#!/usr/bin/env node
// clean-titles.mjs — haalt losstaande ERP-/EAN-getallen uit de PRODUCTTITEL (klant-zichtbaar)
// en bewaart ze in het backend-metafield brunic.erp_artikelnummer. Ontwerp-codes (Opa912,
// 997M) blijven staan: enkel vrijstaande getaltokens van 3+ cijfers gaan eruit.
//
//   node packages/catalog/clean-titles.mjs          # DRY-RUN
//   node packages/catalog/clean-titles.mjs --go      # schrijft echt
import { admin } from "./_shopify.mjs";
import { schoonTitel } from "./_util.mjs";

const GO = process.argv.includes("--go");

// metafield-definitie garanderen (idempotent)
await admin(
  `mutation($d: MetafieldDefinitionInput!){ metafieldDefinitionCreate(definition:$d){ userErrors{ code } } }`,
  {
    d: {
      namespace: "brunic",
      key: "erp_artikelnummer",
      name: "ERP-artikelnummer",
      description: "Intern ERP-/leveranciersnummer. Backend-gebruik (o.a. winkellijst-afdruk); niet in de titel tonen.",
      type: "single_line_text_field",
      ownerType: "PRODUCT",
    },
  },
);

const items = [];
let cursor = null;
do {
  const d = await admin(
    `query($c:String){ products(first:250, after:$c){ nodes{ id title } pageInfo{ hasNextPage endCursor } } }`,
    { c: cursor },
  );
  items.push(...d.products.nodes);
  cursor = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null;
} while (cursor);

const UPDATE = `mutation($input: ProductInput!){ productUpdate(input:$input){ product{ id } userErrors{ field message } } }`;

let n = 0;
for (const p of items) {
  const { titel, nummers } = schoonTitel(p.title);
  if (nummers.length === 0 || titel === p.title) continue;
  n++;
  console.log(`${GO ? "✓" : "·"} "${p.title}"  →  "${titel}"   [${nummers.join(" ")}]`);
  if (!GO) continue;

  const r = await admin(UPDATE, {
    input: {
      id: p.id,
      title: titel,
      metafields: [
        { namespace: "brunic", key: "erp_artikelnummer", type: "single_line_text_field", value: nummers.join(" ") },
      ],
    },
  });
  const e = r.productUpdate.userErrors;
  if (e.length) console.log("  ! ", e.map((x) => x.message).join("; "));
}
console.log(`\n${GO ? "Bijgewerkt" : "Zou bijwerken"}: ${n} titels.${GO ? "" : "  Draai met --go."}`);
