# Brunic — handover overview (22/08/2026)

> Written for the next developer taking over. It summarises **what this repo is, what is built, and what is left** — it does not replace the detailed docs it links to. Everything here was verified against the repo, the dev store and the J.A.R.V.I.S dossier on 22/08/2026.

---

## 1. What this is

**Client:** Brunic nv, interior shop in Ninove (curtains from own atelier, window decoration, floors, rugs, wallpaper, paint, sleep). Agency: HackersQuattro / Atelier Sjiek (Jeroen).
**Deliverable:** headless Shopify webshop (≈13.9k products) + AI chatbot + "opmeting aan huis" (in-home measurement) lead form + favourites. Verbal deal agreed (amounts: see the quote in the J.A.R.V.I.S dossier), monthly fee from month 4. **Nothing goes live before a signed quote + deposit** — building in the Partner dev store is allowed.
**Language:** site and all customer-facing copy in **nl-BE**, formal "u".
**Ownership principle (sales story of the project):** all client accounts (Shopify, GA4, GSC, domain) belong to Bruno/Brunic nv; we are collaborator/staff. Never the other way round.

### Where things live

| Place | What |
|---|---|
| `d:\GithubLocal\Brunic` (this repo) | the build: storefront, catalog pipeline, docs, design comps |
| `D:\GithubLocal\J.A.R.V.I.S\clients\brunic\` (docs 01–22) | strategy, decisions, client communication, open questions. **Not duplicated here.** Key docs: `17` (open items master list, incl. Lane C), `20` (remaining questions after 14/07), `14` (chatbot architecture), `11` (ERP family → web category mapping), `18` (domain/mail runbook), `22` (meeting 14/07) |
| `data/` (gitignored, device-local) | all raw client data: ERP exports, WooCommerce export, trechter outputs, seed JSON, BREEX backup, 85k **PII** customer records. See `data/README.md`. Never commit, never send to external services |
| `.env` (gitignored) | Shopify dev-store tokens (Storefront + Admin + API secret). Template: `.env.example`. Client credentials: J.A.R.V.I.S `clients/brunic/.env.client` |
| Shopify dev store | `brunic-3.myshopify.com` (HackersQuattro Partner account). Also reachable through the claude.ai Shopify MCP connector |
| Deploy | Vercel project `Brunic` → https://brunic.vercel.app (team fruitcocktailbe-projects). GitHub: `Fruitcocktailbe/Brunic` (private) — ⚠️ CLAUDE.md says the intended org is **HackersQuattroOrg**; the repo was published under the personal account by `publish-site` on 14/07 (`.agents/publish-site.json`). Decide/move before handing the repo to the client |

### Read these first
1. `CLAUDE.md` (hard rules) → 2. `docs/architectuur.md` (all decisions, with the "why") → 3. `packages/catalog/README.md` (pipeline plan + metafield schema + **domain rules**) → 4. `data/README.md` → 5. J.A.R.V.I.S docs 17 + 20.

---

## 2. Architecture (decided, verified — don't relitigate)

- **Next.js 16 App Router + Tailwind v4 on Vercel**, headless **Shopify Storefront API** (GraphQL, version pinned `2025-10`). No Hydrogen/Oxygen (ADR 0001). Checkout is Shopify-hosted.
- **One product per design/colour, sizes as variants** (2048-variant limit verified). Size filter = variant metafields `brunic.breedte_cm` / `lengte_cm` → **bucket UI** (`tot-120 · 120-170 · 170-240 · 240-plus`) because Storefront metafield filters are exact-match only. Own route `/[collection]/maat/[bucket]`; generic facets in the query string (`?kleur=…&materiaal=…`), noindex + canonical to the bare path.
- **Flat product URLs** `/product/<slug>`; collections `/[collection]`; subcategories nested `/[collection]/[subcollection]` (one parent each). Hierarchy lives only in `apps/web/src/lib/shopify/taxonomie.ts` (Shopify has no collection hierarchy). `maat` is a reserved slug.
- **Catalog pipeline in this repo is the PIM / source of truth** (SQLite planned); Shopify is a publication channel fed via `productSet` (bulk JSONL); the chatbot reads the same source. Field ownership: pipeline-owned (attributes, metafields, images, titles) vs admin-owned (price tweaks, status, stock).
- **All product images on the Shopify CDN**, `next/image` with a custom loader (`image-loader.ts`) so Vercel image-optimisation cost ≈ 0.
- **Etalage ("display only") products**: `brunic.etalage = true` + price 0. Shopify does NOT protect this — the only guard is `apps/web/src/lib/cart/cart.ts → bewaakVariant` (checks etalage flag, price > 0, availableForSale). **Any import that forgets to set the flag makes a €0 product purchasable.** Raamdecoratie = the only etalage category (decided 14/07).

---

## 3. Current state per workstream

### 3.1 Shopify dev store (`brunic-3.myshopify.com`) — verified 22/08
- Timezone Europe/Brussels ✅, EUR ✅. Publications: Online Store, Shop, POS, **Brunic Headless** (everything for the Storefront API must be published on Brunic Headless — otherwise `collection(handle:)` silently returns `null`).
- **70 products** (the seed sample from the Woo export, 7 categories × ≈8, with photos), **38 collections** (7 main + 29 subcollections with handle convention `<hoofdprefix>-<sub>`, e.g. `stoffen-effen`, `tapijten-modern`; shared `logotapijt`), plus `in-de-kijker`.
- **Metafield definitions** (namespace `brunic`): product: `etalage, materiaal, kleurfamilie, erp_familie, erp_artikelnummer, poolklasse, brandvertragend_norm, patroon, stijl_design, vorm, look, toepassing, rolbreedte_cm, verkoop_eenheid`; variant: `breedte_cm, lengte_cm`. Still missing from the schema list: `type, transparantie, finish, poolhoogte_mm`.
- **Search & Discovery filters**: only Kleur, Materiaal, Poolklasse, and the breedte_cm variant filter are switched on. ⚠️ Turning a metafield filter on is **manual in the S&D app** (not possible via API) — each new facet needs that click.
- **Webhooks: none registered** (`register-webhooks.mjs` exists but has not been run against the Vercel URL). Until then, admin edits only show after the 1-hour ISR window.
- Shopify Flow for the opmeting lead (Customer updated → tag `opmeting-nieuw` → internal email → remove tag): described in `.env.example`; verify it actually exists in the store.
- Not done: Shopify Payments/Bancontact KYC (Bruno said "not yet"), shipping rates, markets/tax, store transfer to Bruno's paid Basic plan, legal/checkout branding.

### 3.2 Storefront `apps/web` — working, ~4.4k LOC, no tests
Runs against the dev store: home, PLP per collection/subcollection/size-bucket with facets, PDP (koopbaar + etalage state, size picker, breadcrumb from real collections), cart (cookie-based, server actions, no-JS forms, Shopify checkout link), favourites (localStorage, max 20, printable list with ERP numbers), opmeting lead form (writes a Shopify **customer** with consent metafields, photo upload via staged uploads, Flow tag), webhook revalidation route (HMAC verified), `/api/cart`, `/api/favorieten`. Design: softened Brunic red/yellow (richting A softened; Bruno approved "looks good" 14/07). Code is heavily commented in Dutch with the "why".

**Known gaps in the storefront** (all confirmed in code):
- **No pagination** — PLPs hard-cap at 24 products (`pageInfo` fetched, never used). Must be fixed before the real catalogue lands.
- **No SEO plumbing**: no `sitemap.ts`, `robots.ts`, JSON-LD (Product/Offer, BreadcrumbList, LocalBusiness — architecture doc explicitly defers this until subcollection paths exist, which they now do), no OG images, no favicon, homepage has no page-level metadata/canonical.
- **No analytics**: no GA4 / Consent Mode v2 / e-commerce events / cookie banner (architecture says "measure from day 1").
- **No site search**, no account/login (deliberate), **no chatbot**, no `not-found.tsx` / `error.tsx` / `loading.tsx` — a Shopify outage = unstyled Next error.
- **Legal pages** (privacy, AV, herroepingsrecht, retourbeleid) are a shared placeholder, `noindex`. We draft, Bruno validates.
- **Homepage content placeholders**: three fabricated review quotes + hardcoded "5,0 op Google" (with a visible disclaimer), atelier photo placeholder (client photoshoot pending, agreed within 8 weeks from 14/07), hero + category tile images **hotlinked from the legacy `brunic.be/wp-content`** — they break when BREEX hosting stops.
- Misc: CTAs hardcode `/tapijten`; `hoofdnav.tsx` has 7 hardcoded categories (`raamdecoratie`, `verf`, `slapen-wonen` 404 if the collection doesn't exist); phone/address/hours duplicated inline (no central site config); bucket counts per size bucket not shown ("v2"); `vorm` filter requested by Bruno not yet a facet; per-meter sales UX (stoffen/wasdoek, 0,1 m increments, minimum cut) not designed; multilingual out of scope (NL only at launch).
- **Uncommitted work**: the 02/08 subcollection work (`[subcollection]` route, `taxonomie.ts`, `subcategorie-nav.tsx`, nav/collection-view changes, doc updates) is in the working tree but **not committed** (last commit 12/07). First action: review + commit.

Local run: `pnpm install` at root → `cd apps/web && pnpm dev` (needs `.env` at repo root: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_TOKEN`, `SHOPIFY_ADMIN_API_TOKEN`, `SHOPIFY_API_SECRET`, `SHOPIFY_API_VERSION`, `SITE_URL`). `pnpm typecheck` is the only check; no lint/test scripts.

### 3.3 Catalog pipeline `packages/catalog` — the biggest open chunk
What exists is **sample-grade tooling**, not the pipeline:
- `trechter.py` (v1, Python/pypdf): parses the 2,154-page ERP PDF, decodes `LLL FFF RRR` (supplier · family · sequence), classifies 65,314 articles → `data/trechter/erp-geclassificeerd.csv`. v2 (run 08/07, produced the 12,765-article launch shortlist) lives as outputs only.
- `select-seed.ps1` → `data/seed/seed-input.json` (sample from the Woo CSV) → `seed-storefront.mjs` (Admin `productSet` + `publishablePublish`, idempotent by handle, `--go`/`--limit`). This is the only working "import" and it's Woo-based, not ERP-based.
- Helpers: `_shopify.mjs` (env + Admin GraphQL), `_util.mjs`/`clean-titles.mjs` (strip ERP numbers from titles into `erp_artikelnummer`), `set-kleur.mjs` (heuristic colour family from title), `set-etalage.mjs` (flag a whole collection), `register-webhooks.mjs`.

**None of the 7 planned stages (ingest → trechter → verrijk → media → review → publish → ai-export) exists as an idempotent CLI yet** (see README). Blocking design problem documented in the README: the ERP has **one article per size**, the model needs **one product per design/colour with sizes as variants**; naive grouping on the truncated `omschrijving` gives 1,848 groups of which only 103 have >1 size, and 81% of Woo variations have no `_parent_sku`. Stage 3 needs an explicit grouping key (family code + design/colour code), not free text.

### 3.4 Data available (in `data/`, see its README)
ERP price list 14/07 (65,569 rows, prices **incl. VAT**, 98.7% coverage of the launch set, `PER ROL` column for wallpaper), supplier list (crediteur = `440`+LLL, 98.1% matched; gap: LLL 126), sales stats, stock valorisation (presence list only), Woo export (±2.1k products/1.8k variations with photo URLs on brunic.be), trechter v2 shortlist (12,765) + 1,145 Woo-only products, BREEX webroot/SQL backup (16–17/07), category code-book photos.

### 3.5 Chatbot — not started
Spec: J.A.R.V.I.S doc 14 (tool-calling over the catalog DB, lead capture, no prices for etalage categories, Sonnet-class model with spend cap, logs to DB). Needs re-baselining from 984 → 13.9k products. Nothing in code; `ANTHROPIC_API_KEY` placeholder only. Bruno saw a "Chat with Bruni" mannequin demo on 14/07 and expects conversations to be logged as product-question research.

### 3.6 Design
`design/` holds two static HTML directions (A "Brunic Voluit", B "Brunic Zacht") with real catalogue content; the storefront follows a softened A. Vector logo still to come from the client (`data/Brunic-logo-kleur.png` is 0 bytes).

---

## 4. Remaining work — prioritised

### A. Catalog pipeline (critical path to "13.9k products online") — several weeks
1. **Stage 1 ingest → SQLite** as an idempotent CLI with `--dry-run` (ERP price list 14/07 as primary article source, Woo export, supplier list, stats/stock). Smoke checks on row counts.
2. **Trechter v3**: re-run the launch-set selection; filter `***` (phased out), consignation, coupon/rental families; 169 price-less articles → ask (doc 20 q9); raamdecoratie → etalage.
3. **Grouping key** (product = design/colour, variants = sizes) — design + validate on the rug families; apply `breedte = min, lengte = max`, reject roll sizes (`…X25M`), mats (< 80 cm) into their own category.
4. **Enrichment ("verrijk")**: per-category attributes (materiaal, kleur, patroon, stijl, vorm, poolklasse, look, toepassing, verkoop_eenheid, rolbreedte…) from ERP joins + **supplier feeds/portals (scraping)** — start order per doc 20: Spits (1,664 art.) · Home Interiors (459) · Rasch (444) · Lalee (429) · Zambaiti (308). Needs dealer-portal logins from Bruno. Clean keyword slugs and titles (no ERP codes).
5. **Lane C — wallpaper/sample-book ingest** (doc 17 §8): third source with `bron` discriminator, whitelist from the physical sample-book inventory (still "being compiled" by the client), pricing rule (catalogue price × margin per roll or "prijs op aanvraag"), image-sourcing ladder (dealer DAM > feed > scrape with dealer rights > client photos > placeholder+noindex). Safe default when info is missing: `etalage = true` + noindex.
6. **Media stage**: take the **full wp-content backup** (login received; photos of ~1.9k products hang on brunic.be), stage images in `data/media/` named by article number with source + licence logged, resize ~2048px, upload via staged uploads.
7. **Review stage**: CSV export per category → Sandra/Aga tick → read back.
8. **Publish stage**: `productSet` bulk (JSONL), variants + variant metafields + images + **main AND subcollection** membership + `publishablePublish` on Brunic Headless; field-ownership rules; **etalage flag always explicit**; prices incl. VAT as delivered; `PER ROL` for wallpaper. Scale test from 100 → 13.9k (rate limits, bulk operations).
9. **AI export** for the chatbot (attributes as filter tools + texts for retrieval).
10. Decide ERP-sync cadence after go-live (one-off vs periodic export; stock display yes/no/"op aanvraag" per category) and the order → ERP process with Sandra/Aga.

### B. Storefront completion — ~1–2 weeks of focused work
Pagination · sitemap/robots/JSON-LD (Product+Offer only on sellable non-etalage items, BreadcrumbList with subcollection depth, LocalBusiness/Organization) · phased indexing (photo-less/thin products noindex) · GA4 under Bruno's account + Consent Mode v2 + e-commerce events + Shopify customer events for checkout · error/loading/not-found pages · site search · remaining facets (`vorm`, `type`, `transparantie`, `finish` + S&D clicks) · bucket counts · per-meter sales UX · legal pages (draft with maatwerk/cut-goods exception to herroepingsrecht) · replace hotlinked hero/tile images and placeholder reviews/atelier photos · central site config (phone, address, hours, VAT number in footer) · vector logo + favicon/OG · a test baseline (at least Playwright smoke on PLP/PDP/cart guard) · commit the 02/08 work.

### C. Shopify configuration & go-live runbook
Run `register-webhooks.mjs` after each deploy · verify Shopify Flow for opmeting leads · shipping rates / click & collect · markets = BE, prices incl. 21% · Shopify Payments + Bancontact KYC (push Bruno) · store transfer to Bruno's Basic plan (owner = Bruno, we = collaborator) — front only needs new Storefront token + domain · 301 map (all Woo URLs + brunic.shop legacy) · GSC under Bruno · domain: DNS control away from BREEX per doc 18 (MX is Microsoft 365 — question 17: who bills M365? must be answered before cancelling BREEX) · wp-content backup before any domain action · Aga training (daily admin).

### D. Chatbot — ~4–6 days after the catalog DB exists
Widget in the site, API route on Vercel, Claude with tools (`zoek_producten`, `bewaar_lead`), cached system prompt with company info (delivery times still "coming" from Bruno), guardrails (no prices for etalage, no promises), logging + monthly counts, spend cap on the key.

### E. Waiting on the client (not ours to unblock)
Signed quote v3 + deposit (blocks go-live) · sample-book inventory (blocks Lane C) · dealer-portal access per supplier · delivery times per product group · shipping tariffs/carrier · minimum purchase + cut increment for meter goods + room-height fabric model · LLL 126 identity · 169 price-less articles · vector logo · atelier photos · BREEX/M365 answers · KYC data · formal sign-off of the category tree.

---

## 5. Domain rules & gotchas (learned the hard way — keep them)
- Publish on **Brunic Headless** or the Storefront API sees nothing (no error, just `null`).
- `productSet` does **not** publish; always follow with `publishablePublish`.
- Metafield definition `PUBLIC_READ` ≠ filterable; the S&D app click is mandatory and manual.
- Set `brunic.etalage` explicitly on every product (also `false`); price 0 is a sentinel, not a price; only `bewaakVariant` protects checkout.
- Put every product in its **main collection and its subcollection** — the breadcrumb is derived from collections, and a product only in a sub disappears from the category page.
- `breedte = min(a,b)`, `lengte = max(a,b)`; `M` suffix = roll, not a rug; mats (< 80 cm) are a separate category.
- Subcategory slugs may never be `maat`; `/[collection]` 404s bare sub handles (`/behang-effen`) on purpose; `logotapijt` canonical parent = tapijten.
- Opmeting form uses `customerByIdentifier` (not `customers(query:)`, which lags) and sets the Flow tag in a separate `tagsAdd` call so "Customer updated" fires.
- Prices from the ERP are **incl. VAT**; VT code 4 = 21%.
- Strategic decisions → log with `node "D:\GithubLocal\J.A.R.V.I.S\decisions\log-decision.mjs" "<titel>" "<beslissing>" "<waarom>"` and update the dossier, not this repo.
