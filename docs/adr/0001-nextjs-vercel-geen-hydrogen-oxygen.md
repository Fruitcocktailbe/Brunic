# ADR 0001 — Next.js op Vercel, géén Hydrogen/Oxygen

- **Status:** beslist
- **Datum:** 2026-07-10
- **Beslist door:** Jeroen
- **Raakt:** `docs/architectuur.md` §Stack · `apps/web`

## Aanleiding

Shopify promoot in de admin actief Hydrogen ("headless commerce toolkit") en Oxygen ("serverless hosting platform"). De vraag kwam op of dat voor Brunic de betere route is dan de al gekozen Next.js-op-Vercel-stack.

Eerst de terminologie recht, want ze verwart:

- **Hydrogen** = een React-framework (bovenop React Router, vroeger Remix) met Shopify-commerce-primitieven ingebouwd: cart, Storefront-API-client, analytics, Customer Accounts.
- **Oxygen** = Shopify's hosting *specifiek voor Hydrogen-storefronts*. Cloudflare-Workers-achtige edge-runtime, gratis inbegrepen bij elk betalend Shopify-plan.

Het zijn dus een framework en een deploy-target — geen taal. Oxygen draait niets anders dan Hydrogen.

## Wat er wél voor pleit

Deze argumenten zijn echt en verdienen het om genoteerd te staan, niet weggewuifd:

1. **Hosting is gratis** bij elk betalend Shopify-plan. Dat bijt direct in de recurring-kost-bewaking (`architectuur.md` §Randvoorwaarden, maandvergoeding vanaf maand 4).
2. **Het image-optimization-probleem verdwijnt.** De custom Shopify-loader die we in `architectuur.md` §Foto's opzetten om Vercel-transformatiekosten op 14k producten te vermijden, is op Oxygen overbodig — Shopify CDN is er native.
3. **Eigendom.** Een Oxygen-storefront leeft binnen Bruno's store. Dat sluit netjes aan bij het eigendomsprincipe dat we verkopen.

## Waarom we het toch niet doen

**1. Het spreekt de beslissing van 06/07 tegen.** `architectuur.md` §Stack legt vast: *"de motor is inwisselbaar, de front is van ons."* Hydrogen-op-Oxygen is de meest Shopify-vergrendelde manier om een storefront te bouwen: de kernabstracties van het framework zijn Shopify-vormig, en de hosting draait enkel dat framework. We zouden precies de eigenschap inruilen die we aan Bruno verkocht hebben, tegen een hostingfactuur die al in de maandvergoeding zit. Moet de motor ooit wijken, dan wisselt een Next.js-front van datalaag; een Hydrogen-storefront wordt herschreven.

**2. Het schrapt geen hostingpartij — het voegt er een toe.** Dit repo is een mini-monorepo: storefront + `services/chatbot` + de Python catalog-pipeline. Oxygen host de Hydrogen-storefront en verder niets. De chatbot is een langlopende service die een Anthropic-key vasthoudt op een edge-runtime zonder Node-API's; die gaat daar niet draaien. Resultaat: Oxygen **en** iets anders, in plaats van één Vercel-project met route handlers naast de site.

**3. Het zet onze delivery-tooling buitenspel.** De agency-keten `publish-site` → `attach-domain` → `deliver-client` gaat uit van Vercel en het team `fruitcocktailbe-projects`. Met Oxygen wordt de eerste grote klantensite het enige project dat geen van die tooling raakt — een bespoke deploy-pad, onderhouden door één persoon.

**4. De store-overdracht wordt rommeliger.** We bouwen in een Partner development store en dragen bij livegang over naar Bruno's betaalde Basic-store (`architectuur.md` §Shopify-aanpak). Een Oxygen-storefront hangt vast aan een specifieke shop, dus die migratie wordt een storefront-herkoppeling + redeploy bovenop de datatransfer. Op Vercel merkt de front er niets van: domein omzetten en de Storefront-token in de env-vars vervangen.

## Beslissing

**Next.js (App Router) op Vercel blijft de front, zoals vastgelegd in `architectuur.md` §Stack.** Hydrogen als framework en Oxygen als hosting worden niet gebruikt.

**Wél overnemen: de bibliotheek, niet het framework.** `@shopify/hydrogen-react` is framework-agnostisch en draait prima binnen Next.js. Daaruit halen we de getypeerde Storefront-API-client, de cart-hooks, `<Money>`, en de uit ons schema gegenereerde Storefront-API-types. Zo krijgen we Shopify's commerce-primitieven zonder de lock-in. (`<Image>` uit hydrogen-react niet gebruiken — die botst met de `next/image`-loader uit §Foto's.)

## Gevolgen

- De custom Shopify-image-loader blijft nodig en blijft op het kritieke pad voor de hostingmarge. Bewaken.
- Cart-state en checkout-redirect bouwen we zelf op de Storefront API (`cart` → `checkoutUrl`). Hydrogen zou dat cadeau gegeven hebben; dit is de prijs van de keuze.
- Shopify's ingebouwde storefront-analytics krijgen we niet gratis. Sluit aan bij `architectuur.md` §Analytics, waar we e-commerce-events sowieso zelf implementeren.

## Wanneer herzien

Als de commerce-motor *definitief* Shopify blijkt (bv. na twee jaar productie, of wanneer Bruno naar een hoger plan gaat en Shopify-native features als Customer Accounts en checkout-extensies zwaarder gaan wegen dan inwisselbaarheid), én de chatbot een eigen hostingpad heeft, dan verliest argument 1 en 2 hun kracht. Dan is Hydrogen een legitieme herevaluatie — maar als rewrite-beslissing, niet als tweak.
