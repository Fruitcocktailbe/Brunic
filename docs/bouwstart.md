# Bouwstart — eerste sessies in deze repo

> Runbook voor de start. Volgorde is bewust: design eerst (goedkoop itereren), dan pas scaffolden. Alles hieronder kan vandaag — niets wacht op de klant. **Live gaan mag pas na getekende offerte + voorschot** (afspraak 08/07); bouwen in de dev-store mag wél.

## 0 · Wat er al ligt
- `docs/design-brief.md` — volledige design-input (merk, IA, paginatypes, drie foto-staten)
- `docs/architectuur.md` — beslist: headless Shopify · varianten + bucket-maatfilter · foto's op Shopify CDN · catalog-DB als PIM-bron
- `data/` — de volledige catalogus-data (launch-set 12.765 + Woo-export met ±2.1k foto-producten)
- `packages/catalog/` — trechter.py (v1) + pipeline-plan + metafield-schema
- Dev-store **brunic-3.myshopify.com** (Partner-account van HackersQuattro) — de claude.ai Shopify-connector hangt eraan: Claude-sessies kunnen de store rechtstreeks beheren (producten, collections, metafield-definities, GraphQL) — wijzigingen altijd op expliciete go.

## 1 · Design-fase (nu — geen code nodig)
1. Moodboard/stijlrichting: 2-3 varianten op basis van design-brief §3 (kalm interieur-palet, weg van discount-look).
2. Wireframes homepage + PLP + PDP (koopbaar én etalage-variant) **met echte content** uit `data/wc-product-export-2026-07-06.csv` — geen lorem ipsum.
3. Review met Jeroen (`/shot` voor contact-sheets zodra er iets draait) → dan Bruno's go op de richting.

## 2 · Shopify-inrichting (klik-werk, eenmalig — ~30 min)
In de dev-store admin (brunic-3.myshopify.com):
1. **Settings → General**: timezone op **Europe/Brussels** (staat nu EDT!), valuta EUR ✓.
2. **Headless-app installeren** (Sales channels → Headless) → storefront aanmaken → **Storefront API-token** → `.env`.
3. **Custom app** aanmaken (Settings → Apps → Develop apps): `brunic-catalog-pipeline`, scopes `read_products, write_products, write_files` → **Admin API-token** → `.env`.
4. **Search & Discovery-app** installeren (gratis, Shopify) — nodig om metafield-filters te activeren zodra de definities bestaan.
5. Metafield-definities + collections: kan Claude via de Shopify-MCP aanmaken volgens `packages/catalog/README.md` §schema — vraag erom op het moment dat het schema definitief is.

## 3 · Scaffold (pnpm-workspace)
```
pnpm init  →  pnpm-workspace.yaml met apps/* en packages/*
apps/web:  create-next-app (TypeScript, App Router, Tailwind) — nl-BE, geen i18n-routing
lib:       @shopify/storefront-api-client (of graphql-request) + codegen op de Storefront-schema
next/image: custom loader op de Shopify CDN (architectuur.md §Foto's — géén Vercel-transformaties)
```
Eerste verticale snede: **PLP van één categorie (Behang) met bucket-maatfilter + PDP koopbaar/etalage** tegen de dev-store — daarmee zijn álle architectuurkeuzes end-to-end bewezen vóór de rest gebouwd wordt.

## 4 · Catalog-pipeline (parallel spoor)
`packages/catalog`: ingest van de bestaande CSV's → SQLite → eerste `productSet`-import van een **staal van ±100 producten** (met Woo-foto's) naar de dev-store, gekoppeld aan de metafield-definities. Daarna schaalt hetzelfde script naar 13.9k. Wacht níét op prijzen-export/leverancierslijst — het staal bewijst de keten.

## 5 · Volgorde-afhankelijkheden (wat wanneer)
| Kan nu | Wacht op |
|---|---|
| Design, scaffold, PLP/PDP-snede, pipeline-ingest, staal-import, chatbot-spec herijken | — |
| Volledige 13.9k-import | prijzen-export + koopbaar-matrix (Sandra) |
| Foto-scraping | leverancierslijst (Bruno) |
| Checkout/Bancontact echt testen | overdracht naar betaalde store (livegang; dev-store kan geen echte betalingen — test-mode wél) |
| Livegang brunic.be | getekende offerte + voorschot + BREEX-domeinoverdracht |

Vragenlijst klant + alle losse eindjes: J.A.R.V.I.S `clients/brunic/17-losse-eindjes-en-vragenlijst.md`.
