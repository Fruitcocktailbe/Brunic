# data/ — ruwe klantdata (gitignored, device-local)

Alles in deze map behalve deze README is **gitignored**: ruwe Brunic-data, nooit committen of naar externe diensten sturen. Bron-exports + volledige analyse: J.A.R.V.I.S-repo `clients/brunic/data/` en dossier-doc `16-trechter-v2-analyse.md`.

| Bestand | Wat | Gebruik |
|---|---|---|
| `trechter-v2-shortlist.csv` | **De launch-set: 12.765 ERP-actieve artikelen** (verkocht jul'25-jul'26 ∪ huidige voorraad, minus consignatie). Kolommen: artikel · bron (verkocht/voorraad/beide) · v1-classificatie · webcategorie · omschrijving | catalogus-import, PLP-dichtheden, filterwaarden |
| `woo-niet-in-erp.csv` | **1.145 WooCommerce-producten zonder ERP-koppeling** (942 zonder SKU + 203 niet-ERP-SKU) — moeten zeker mee naar Shopify | import vanuit Woo-data |
| `wc-product-export-2026-07-06.csv` | Volledige WooCommerce-export (±2.1k producten + 1.8k variaties, mét namen/beschrijvingen/foto-URL's op brunic.be/wp-content) | realistische design-content · foto-migratie · 301-map |

⚠️ De foto-URL's wijzen naar de oude site — **wp-content-backup maken vóór de domein-cutover** (zie `docs/architectuur.md`).
Nog niet binnen: prijzen-export · leverancierslijst · aankoophistoriek (zie dossier-doc 17).
