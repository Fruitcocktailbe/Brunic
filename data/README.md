# data/ — ruwe klantdata (gitignored, device-local)

Alles hier behalve deze README is **gitignored**: ruwe Brunic-data, nooit committen of naar externe diensten sturen. Sinds 08/07 is dít de canonieke plek (verhuisd uit J.A.R.V.I.S — data hoort naast de pipeline in `packages/catalog`). De klanten-exports (85k records, PII) blijven bewust in het J.A.R.V.I.S-dossier tot de DPA getekend is.

## Bron-exports
| Bestand | Wat |
|---|---|
| `erp-verkoopstatistieken-2026-07-08.xlsx` | Verkoop per artikel, **12 mnd (jul 2025–jul 2026)** — 2.924 rijen: ARTIKEL · HOEVEELH. · BEDRAG NET · WINST NET (⚠️ winst-kolom onbetrouwbaar, kostprijzen ontbreken) |
| `erp-valorisatie-voorraad-2026-07-08.xlsx` | Huidige voorraad — 11.674 artikelen (⚠️ PRIJS/WAARDE 99,9% nul: bruikbaar als áánwezigheidslijst, niet als prijsbron; EENHEID 78% leeg) |
| `erp-signalement-artikelen-2026-07-06.pdf` | Volledige ERP-artikelafdruk (2.154 blz., 65.314 artikelnummers) — de bron van `trechter/erp-geclassificeerd.csv` |
| `wc-product-export-2026-07-06.csv` | WooCommerce-export: ±2.1k producten + 1.8k variaties mét namen/beschrijvingen/foto-URL's (⚠️ foto's hangen aan brunic.be/wp-content → backup vóór domein-cutover) |

## trechter/ — pipeline-outputs (v1 06/07 + v2 08/07)
| Bestand | Wat |
|---|---|
| `trechter-v2-shortlist.csv` | **⭐ De launch-set: 12.765 artikelen** (verkocht ∪ voorraad, minus consignatie). Kolommen: artikel · bron · classificatie · webcategorie · omschrijving |
| `woo-niet-in-erp.csv` | **1.145 Woo-producten zonder ERP-koppeling** (942 zonder SKU + 203 niet-ERP-SKU) — importeren vanuit de Woo-export |
| `trechter-v2-unie.csv` | Tussenstap: de volledige unie (12.777, vóór consignatie-filter) |
| `erp-geclassificeerd.csv` | Alle 65.314 ERP-artikelen met leverancier/familie/webcategorie (v1; ⚠️ 455 duplicaatrijen — dedup bij gebruik) |
| `woo-only.csv` | v1-lijstje: 79 numerieke Woo-SKU's niet in ERP (subset van woo-niet-in-erp) |

## Nog te ontvangen (kritiek pad — zie J.A.R.V.I.S dossier-doc 17)
Prijzen-export per artikel · leverancierslijst met LLL-codes (→ scraping-bronnen + merkpagina's) · aankoophistoriek · koopbaar-vs-etalage-matrix (Sandra).

Artikelnummer-structuur: 9 cijfers = `LLL FFF RRR` (leverancier · familie · volgnummer); codeboek-interpretatie in J.A.R.V.I.S dossier-docs 10 & 11.
