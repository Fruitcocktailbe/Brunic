# Architectuur — Brunic webshop

> Beslist op 06-08/07/2026 (dossier: J.A.R.V.I.S `clients/brunic/`, decisions/log.md). Dit doc = de bouwkant; open punten staan onderaan.

## Stack (beslist)
- **Front:** Next.js (App Router) + Tailwind, deploy op Vercel (team fruitcocktailbe-projects). nl-BE only.
- **Commerce-motor:** **headless Shopify** via de Storefront API ("optie B", beslist 06/07) — de motor is inwisselbaar, de front is van ons. Checkout blijft Shopify-hosted (Basic-plan: enkel logo/kleur-branding).
- **Chatbot:** eigen service (spec: dossier-doc 14 — herijken op 13.9k catalogus); productgids + FAQ + lead-capture → terugbelformulier. Anthropic-key met spend-cap (constructie: zie dossier 17).
- **Catalogus-pipeline:** de trechter (Python) uit het dossier wordt hier een echte pipeline: ERP-exports + WooCommerce-export → verrijking (prijzen, foto's, nette titels, metafields) → Shopify bulk-import (JSONL). Herhaalbaar — correctierondes zijn her-runs, geen handwerk.

## Voorgestelde repo-structuur (mini-monorepo)
```
apps/web          # Next.js storefront
services/chatbot  # chatbot-service (later; spec eerst)
packages/catalog  # trechter → verrijking → Shopify-import (Python/Node)
docs/             # design-brief, architectuur, ADR's
data/             # ruwe exports — GITIGNORED, device-local
```

## Shopify-aanpak
- Bouwen in een **gratis Partner development store**; overdracht naar Bruno's betaalde Basic-store bij livegang (Bruno = store owner, wij = collaborator — eigendomsprincipe).
- Vóór de offerte-details vastklikken: verifiëren dat **Basic** volstaat — Storefront API-limieten, Search & Discovery-filters op metafields, checkout-branding. Geen Plus-features beloven.
- Shopify Payments + Bancontact (KYC door Bruno — vroeg starten).

## Datamodel — beslist 08/07 (geverifieerd op shopify.dev)
1. **✅ Variantenmodel: varianten per product, GEEN aparte producten per maat** (Jeroen, 08/07). Eén product per design/kleur; maten = varianten. Technisch gedekt: de variant-limiet is sinds 15/10/2025 **2048 voor alle merchants** via de GraphQL product-API's ([changelog](https://shopify.dev/changelog/the-product-variant-limit-is-now-2048-for-all-merchants)) — tapijten hebben er typisch 5-15, ruim binnen limiet. Let op: enkel de GraphQL-API's ondersteunen >100 (REST-apps niet — geen probleem, wij bouwen GraphQL-only).
2. **✅ Maatfilter-ontwerp (dé belangrijkste filter):** per variant een option "Maat" ("160 × 230 cm") + **numerieke variant-metafields `breedte_cm` / `lengte_cm`**. Geverifieerd: Storefront API `productFilters` ondersteunt `productMetafield`/`variantMetafield` op numeric_integer/decimal/tekst/boolean, maar **enkel exacte waarden — geen numerieke ranges** (alleen prijs heeft een range-filter; [docs](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/filter-products)). Daarom: **bucket-filters** in de UI ("tot 120" · "120–170" · "170–240" · "240+ cm") die elk vertalen naar een OR-lijst van discrete metafield-waarden (OR binnen een filter, AND tussen filters = native S&D-gedrag). Werkt perfect omdat tapijten in vaste handelsmaten komen. Upgrade-pad als ooit een échte slider gewenst is: eigen zoekindex (Meilisearch/Typesense) — geen startvereiste. Webcategorieën worden Shopify-**collections** (filters werken binnen collections).
3. **Metafields dag 1** (filterable gedefinieerd via Search & Discovery): breedte/lengte · poolhoogte + hoog/laagpolig · materiaal · kleurfamilie · stijl/design · brandvertragend-certificaat · **etalage-vlag** · ERP-familiecode. Schema per categorie in `packages/catalog/schema` (tapijten ≠ behang ≠ stoffen).
4. **Per-meter-verkoop** (open): 0,1m-increment vs. lengte-invoer (line-item properties). Minimale afname + snij-increment bij Sandra ophalen.
5. **Eenheden-normalisatie** (open): default per familie, vast te leggen met Sandra.
6. **ERP-sync-model** (open): eenmalige import vs. periodieke handmatige export. Voorraad tonen: ja/nee/"op aanvraag" per categorie.

## Productdata: bron van waarheid (beslist 08/07 — de PIM-vraag)
**Drie lagen, één bron — géén losse Excel als master, géén Shopify-admin als master:**
1. **Bron = de catalog-pipeline in dit repo** (`packages/catalog`): gestructureerde dataset (SQLite; schema git-versioned, data gitignored). Álle verrijking landt hier programmatisch: ERP-joins, leveranciers-scraping (poolhoogte, kleur, design, materiaal, patroon…), foto-mapping, nette titels. Herhaalbare her-runs (trechter-principe) — dat kan niet als de admin of een Excel de master is.
2. **Shopify = publicatiekanaal**: de pipeline pusht via **`productSet` (bulk/JSONL)** — de door Shopify gedocumenteerde route voor sync vanuit een externe bron. Veld-eigenaarschap vastleggen: pipeline-owned (attributen, metafields, beelden, titels — overschreven bij sync) vs. admin-owned (prijs-tweaks, status, voorraad — nooit overschreven). Zo blijft de admin bruikbaar voor Aga zonder drift.
3. **AI leest uit dezelfde bron**: de chatbot krijgt de catalog-DB als kennisbank (filter-tools op attributen: "laagpolig wollen tapijt in beige tot 170 breed" = query, geen hallucinatie) + productteksten voor retrieval. Niet terug-scrapen via de Shopify-API — zelfde data, drie afnemers (site-filters, Shopify, AI), nul drift.
**Review-laag voor het team:** CSV-export per categorie → Sandra/Aga vinken af in een sheet → pipeline leest terug in. De sheet is een *interface*, nooit de bron.

## Foto's & CDN (beslist 08/07)
**Alle productfoto's op Shopify (product-media/Files → Shopify CDN), niet op Vercel.**
- Shopify CDN + opslag zit in het abonnement; limiet 20 MB / 20 MP per beeld (aanbevolen ~2048px — batch-herschalen bij upload); Shopify genereert automatisch responsive formaten; on-the-fly transformaties via `image.url(transform: {maxWidth, preferredContentType: WEBP})`.
- **next/image met een custom Shopify-loader** die die CDN-transformaties gebruikt → Vercel Image-Optimization-kost ≈ €0 (anders betaalt Vercel-transformatiepricing op 14k producten × formaten de marge op de maandvergoeding op). Vercel serveert enkel UI-assets.
- Eigendom: beelden zitten in Bruno's store (verkoopverhaal) en elk later kanaal (Google Shopping-feed) leest ze gratis mee; koppeling beeld↔product/variant is ook in de admin zichtbaar voor Aga.
- Upload-route: gescrapete beelden → staging `data/media/` (artikelnummer-genaamd, bron+licentie gelogd) → staged uploads + koppeling via `productSet`.

## Migratie & SEO
- Volledige **301-map**: alle WooCommerce-URL's + brunic.shop-legacy → nieuwe structuur. GSC onder Bruno's account.
- **Indexatiestrategie:** producten zonder foto/degelijke omschrijving = noindex tot verrijkt; gefaseerde sitemap; Product-schema mét Offer enkel op koopbare items. (12k thin-content-pagina's in één keer indexeren schaadt de bestaande posities — Google levert vandaag ~400 clicks + 24-35 calls/mnd.)
- **wp-content-backup vóór elke domein-actie** — de Woo-foto's hangen aan brunic.be.
- E-mailcontinuïteit (MX/SPF/DKIM) is deel van het domein-draaiboek (dossier 17 §3).

## Analytics
GA4 onder Bruno's account (wij beheerder) + consent mode v2; e-commerce-events zelf implementeren op de headless front + Shopify customer events voor checkout-stappen. Meting vanaf dag 1 — de latere performance-upsell hangt eraan.

## Randvoorwaarden
- Niets live vóór getekende offerte + voorschot (afspraak 08/07). Dev-store bouwen mag.
- Recurring: maandvergoeding vanaf maand 4 (afgesproken 08/07) — hostingkost bewaken (image-optimization op 14k producten; ISR/caching-strategie kiezen).
- `data/` en `.env*` nooit committen; klant-credentials in J.A.R.V.I.S `clients/brunic/.env.client`.
