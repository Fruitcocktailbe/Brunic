# Design-brief — Brunic webshop (v1, 08/07/2026)

> Alles wat nodig is om het ontwerp te starten. Samengesteld uit het klantdossier (kickoff 06/07 + store-walkthrough 08/07 + catalogus-analyse). Waar iets nog van de klant moet komen staat het als ⏳ — **niets daarvan blokkeert de designstart.**

## 1 · De zaak in één alinea
Brunic (nv sinds 1992, zaak ±40 jaar, familiebedrijf) is dé interieurzaak van Ninove: **gordijnen op maat uit het eigen atelier** (eigen stiksters — hét differentiatiepunt), raamdecoratie, vloeren, tapijten, behang, verf en slaapcomfort. Advies, **gratis opmeting aan huis** (Sandra), plaatsing en thuislevering door eigen mensen. Winkel = ankerpunt (Ring-West 19, Ma-Za 9-18u); de huidige WooCommerce-site oogt als een goedkope discount-shop en doet het merk onrecht. Klantprofiel: **30+**, regio Ninove/Denderstreek; B2B-hoek voor projectwerk (horeca/zorg — brandvertragende stoffen).

## 2 · Wat we bouwen (de deal)
Webshop (±13.9k producten bij launch) + AI-chatbot, op **brunic.be**. Het is **géén pure verkoopmachine**: de site is een etalage/adviseur die drie dingen moet doen, in deze volgorde:
1. **Opmetingen aan huis genereren** — primaire conversie. Geen booking-agenda maar een **terugbelformulier** (project beschrijven + foto's uploaden → "wij bellen u binnen 1-2 dagen"). CTA overal: "Plan een gratis opmeting".
2. **Winkelbezoek uitlokken** — de **favorieten-feature**: bezoeker bewaart max 5 producten en krijgt een meeneemdocument (print/PDF **mét ERP-artikelnummer** zodat Sandra het in de winkel direct terugvindt). Click & collect als afhaalroute.
3. **Direct verkopen** — enkel voor de koopbare subset (zie §5).

De **AI-chatbot** (in de kern-deal) is productgids + FAQ + after-hours lead-capture; escaleert naar het terugbelformulier. Design-impact: een chat-widget die past bij het kalme merk, niet een schreeuwerige bubbel.

## 3 · Merk & toon
- **Vibe (beslist):** kalm, tactiel, vertrouwenwekkend, advies-gedreven — het niveau van het maatwerk uitstralen. **Wég van de discount-webshop-look.**
- **Kleur:** kalm interieur-palet; het huidige rood/geel wordt **bewust losgelaten** (Bruno: "kies voor mij" tenzij hij alsnog een voorkeur geeft). Denk: warme neutralen, textiel-texturen, veel rust en witruimte.
- **Typografie:** open — voorstel doen (richting: warm-klassieke kop + neutrale sans voor UI; moet "atelier & vakmanschap" ademen, niet "tech").
- **Fotografie draagt het merk:** groot, sfeer, echt. **Nooit stock** (vernietigt vertrouwen bij service-zaken). Het atelier/de stiksters zijn het verhaal — daar komt een shoot (klant-zijde, wij regisseren).
- Toon copy: nl-BE, "u"-vorm, warm-vakkundig, kort. Taglines uit het dossier: *"Vakmanschap uit eigen atelier — advies, opmeting en plaatsing aan huis."* · Al 40 jaar in Ninove.
- ⏳ Vector-logo + Duitse referentiesite (clean design die Bruno mooi vindt) komen nog. **Concurrent-benchmark:** Heytens (heytens.be) — moderner, mét online booking en chat; wij moeten er warmer en ambachtelijker uitzien, niet corporate-er.

## 4 · Informatie-architectuur (beslist voorstel, omzet-gewogen)
**De regel: omzet bepaalt volgorde, homepage-vastgoed en diepte** — niet alfabet, niet aantal SKU's. Stoffen zijn veruit de grootste omzetpijler; daarna behang, vloeren en tapijten; de rest is klein (cijfers: J.A.R.V.I.S-dossier). (De huidige site doet dit omgekeerd: stoffen op positie 6 van 10.)

Hoofdnav (7 categorieën + diensten):
| # | Categorie | Omzet | SKU's in launch-set | Rol in design |
|---|---|---|---|---|
| 1 | **Gordijnen & stoffen** | grootste | 1.652 | dé held: homepage-hero, atelier-verhaal verweven, diepste subboom (Gordijnstoffen · Voiles · Livingstoffen · Black-out · Projectstoffen B2B) |
| 2 | **Behang** | groot | 2.691 | eigen categorie, vlies vooraan |
| 3 | **Vloeren** (incl. Vasttapijt als sub) | groot | 427 + 177 | vinyl/parket/laminaat/click + vasttapijt |
| 4 | **Tapijten & karpetten** | groot | 2.257 | maat-zoeker centraal (zie §5); handgeknoopt/herkomst als verhaal-sub |
| 5 | **Raamdecoratie** | deel van het stoffenverhaal | 323 | klein maar brug naar het maatwerkverhaal (rolgordijnen, zonnewering, rails) |
| 6 | **Verf** | rest | 1.152 | klein maar identiteit: **Brunic-huismerk als eigen lijn** |
| 7 | **Slapen & wonen** | rest | 2.021 | nette rest-bak (slaapcomfort · linnen · verlichting) |
| — | **Atelier & maatwerk** | — | geen SKU's | dienst-showcase (de stiksters!) + offerte-CTA — het hart van het stoffenverhaal |
| — | **Opmeting & plaatsing** | — | — | dienstenpagina + de primaire CTA doorheen álles |
| + | Toebehoren | — | 2.014 | laag in de nav of enkel als accessoire-suggesties bij producten |

Homepage-vastgoed: hero = stoffen/atelier · drie tegels = behang/vloeren/tapijten · rest = footer-nav. **Niet online** (beslist): gifts/seizoen/Disney/knuffels, consignatie-goederen, verhuur (wordt dienstenpagina).

## 5 · Paginatypes om te ontwerpen
1. **Home** — merk + conversie-hiërarchie van §2; gratis-opmeting-USP prominent; reviews (er zijn 5-sterren Google-reviews).
2. **Categorie (PLP)** — met filters: **maat (breedte × lengte) is hét zoekcriterium bij tapijten**; breedtes zijn overal filters, nooit categorieën; brandvertragend-filter (B2B); kleur/materiaal. Moet **fotoloos-gracieus** zijn (zie §7): nette tekst-tegels/categoriebeeld-fallback.
3. **Productdetail — koopbaar**: prijs + winkelmand + click & collect; per-meter-producten (wasdoek/stof: lengte-kiezer — dagelijkse volumeverkoper!).
4. **Productdetail — etalage**: geen prijs (of "vanaf"), CTA = opmeting/winkel/favoriet. Welke categorie welk gedrag krijgt beslist Sandra nog (⏳ koopbaar-matrix) — **ontwerp beide varianten als één component-familie.**
5. **Atelier & maatwerk** — verhaalpagina (stiksters, proces: advies → opmeting → maakwerk → plaatsing) + offerte-CTA.
6. **Opmeting & plaatsing / terugbelformulier** — het conversie-hart: project beschrijven, foto's uploaden, verwachting "binnen 1-2 werkdagen gebeld".
7. **Favorieten** — lijst (max 5) + meeneemdocument (print/PDF met artikelnummer, foto, categorie).
8. **Over ons** — 40 jaar, familie, team, de winkel (verhuis naar nieuw pand komt eraan — heropening kan het launch-moment worden).
9. **Contact** — NAP: Ring-West 19, 9400 Ninove · 054 33 73 52 · info@brunic.be · Ma-Za 09-18u, zo gesloten · kaart.
10. **FAQ** (8-15 vragen; voedt ook de chatbot en AI-vindbaarheid) + juridische pagina's.
11. **Chatbot-widget** — overal aanwezig, merkconform, bescheiden.

## 6 · De catalogus in cijfers (voor realistisch ontwerpen)
- Launch-set **±13.9k**: 12.765 ERP-actieve artikelen + 1.145 WooCommerce-native producten. Verdeling per categorie: zie tabel §4.
- `data/wc-product-export-2026-07-06.csv` bevat ±2.1k producten **mét naam, beschrijving en foto-URL** — gebruik déze voor mocks (echte content, geen lorem ipsum).
- `data/trechter-v2-shortlist.csv` = de volledige launch-set (artikel · bron · webcategorie · omschrijving) — goed om PLP-dichtheden en filterwaarden realistisch te maken.
- 22% van de verkooprijen is per-meter (decimale hoeveelheden) — per-meter-UX is geen randgeval.

## 7 · Content-realiteit (bepaalt het design!)
- **Foto's**: ±2.1k producten hebben er (WooCommerce). Voor de rest: **veel is al gefotografeerd of online vindbaar bij leveranciers** (bv. behangcollecties) → wordt gescrapet/verzameld via de leverancierslijst (⏳); stalenboeken (~200) worden in-house met green-screen gefotografeerd, geprioriteerd op omzet (stoffen eerst). **Design-opdracht:** de PLP en PDP moeten er goed uitzien in álle drie de staten — echte foto / leveranciersbeeld / (tijdelijk) geen beeld.
- **Prijzen**: ⏳ prijzen-export uit het ERP komt nog; etalage-producten tonen bewust geen prijs. Prijsweergave dus als optioneel element ontwerpen.
- Omschrijvingen zijn ERP-jargon ("SCOTT RHINE ALLE KLEUR 143 / 100% PES") — er komt een verrijkingsslag; ontwerp op nette titels maar toon de realistische lengtes.

## 8 · Constraints
- **nl-BE only** (geen taalswitcher).
- **Checkout = Shopify-hosted** (Basic-plan): ontwerp tot en met de cart; de checkout krijgt enkel logo/kleuren.
- Next.js + Tailwind op Vercel; 14k producten → performance-bewust ontwerpen (geen zware hero-video's per PLP).
- Toegankelijkheid: 30+/oudere doelgroep → ruime tekstgroottes, contrast, geen mystery-meat-navigatie.
- SEO/AI-vindbaarheid: structured data, FAQ, llms.txt zijn onderdeel van het bouwwerk; design houdt ruimte voor tekstuele categorie-intro's (indexeerbare content op PLP's).
- GDPR: cookiebanner (consent mode v2) — de huidige site heeft een kapotte banner; de nieuwe moet netjes in het design zitten.

## 9 · Wat nog binnenkomt (blokkeert design níét)
⏳ Vector-logo · Duitse referentiesite · koopbaar-vs-etalage-matrix (Sandra) · prijzen-export · leverancierslijst (→ merkpagina's Sunlux/Zonolux) · shoot-foto's (atelier/showroom) · soldendatum + verlofdata · verhuis-timing (bepaalt "heropening"-verhaal).

**Eerste designstap (voorstel):** moodboard/stijlrichting (2-3 varianten op basis van §3) + homepage- en PLP-wireframe met echte Woo-content → review met Jeroen → dan Bruno's go op de richting.
