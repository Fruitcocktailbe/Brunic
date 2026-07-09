# Brunic — webshop + AI-chatbot

Klantproject van HackersQuattro (Atelier Sjiek) voor **Brunic nv** — interieurzaak in Ninove (gordijnen op maat uit eigen atelier, raamdecoratie, vloeren, tapijten, behang, verf, slaapcomfort).

**Deal:** webshop + AI-chatbot, met een maandvergoeding vanaf maand 4 · upsells (ads/mail/marketing) nadien apart · bedragen: zie de offerte in het J.A.R.V.I.S-dossier. Akkoord 08/07/2026; **bouw gaat pas live na getekende offerte + voorschot.** Live-target: begin september 2026 op brunic.be.

## Start hier
| Doc | Wat |
|---|---|
| [`docs/bouwstart.md`](docs/bouwstart.md) | **Het runbook: wat nu kan, in welke volgorde** — design → Shopify-inrichting → scaffold → pipeline-staal |
| [`docs/design-brief.md`](docs/design-brief.md) | Alles om het design te starten — merk, doelgroep, conversie-hiërarchie, IA, paginatypes, content-realiteit |
| [`docs/architectuur.md`](docs/architectuur.md) | Beslist: headless Shopify · varianten + bucket-maatfilter · foto's op Shopify CDN · catalog-DB als PIM-bron |
| [`packages/catalog/README.md`](packages/catalog/README.md) | De catalogus-pipeline (7 stadia) + het metafield-schema |
| [`data/README.md`](data/README.md) | De catalogus-datasets (gitignored) en wat erin zit |

## Status (08/07/2026)
- ✅ Akkoord + launch-catalogus bepaald: **±13.9k producten** (12.765 ERP-actief + 1.145 WooCommerce-native)
- ✅ Architectuur beslist (geverifieerd op shopify.dev) + **dev-store live: brunic-3.myshopify.com**
- 🔜 Design-fase — zie bouwstart §1
- ⏳ Wacht op klant: prijzen-export Integral · leverancierslijst · vector-logo · Duitse referentiesite · domeinoverdracht BREEX

## Bronnen
Het volledige klantdossier (offerte, meetingverslagen, trechter-analyses, vragenlijsten) leeft in de J.A.R.V.I.S-repo onder `clients/brunic/` en gespiegeld in Notion (HackersQuattro HQ › Client Briefs › Brunic › 📁 Dossier). Repo = bron.
