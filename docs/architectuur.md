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

## Datamodel-kernkeuzes (open — beslissen vóór de bulk-import)
1. **Variantenmodel** maatcategorieën (tapijt/jaloezie: b × l × kleur): varianten-per-product (100-variantlimiet klassiek / 2048 via GraphQL-productmodel) vs. product-per-maat + maat-metafields. Bepaalt de b×l-filter; niet omkeerbaar zonder her-import.
2. **Per-meter-verkoop** (wasdoek/stof — 22% van de verkoop is decimaal): 0,1m-increment vs. lengte-invoer (line-item properties). Minimale afname + snij-increment bij Sandra ophalen.
3. **Metafields dag 1:** breedte/lengte (filterbaar) · brandvertragend-certificaat · materiaal/kleur/patroon/use-case (AI-vindbaarheid) · **etalage-vlag** (Shopify verplicht een prijs; etalage-gedrag = front-end-beslissing op deze vlag) · ERP-familiecode.
4. **Eenheden-normalisatie** (ROL/ST/LM/M² — 78% leeg in de export): default per familie, vast te leggen met Sandra.
5. **ERP-sync-model:** eenmalige import vs. periodieke handmatige export (Integral heeft vermoedelijk geen API). Voorraad tonen: ja/nee/"op aanvraag" per categorie.

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
