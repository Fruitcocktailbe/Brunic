# data/ — ruwe klantdata (gitignored, device-local)

Alles hier behalve deze README is **gitignored**: ruwe Brunic-data, nooit committen of naar externe diensten sturen. Sinds 08/07 is dít de canonieke plek (verhuisd uit J.A.R.V.I.S — data hoort naast de pipeline in `packages/catalog`). Op 14/07 kwamen de laatste achterblijvers over: `categorie-fotos/` (10 codeboek-foto's; interpretatie in J.A.R.V.I.S dossier-docs 10 & 11) en de klanten-exports hieronder.

⚠️ `erp-signalement-klanten-1/2-2026-07-08.xlsx` — 85.407 klantrecords (**PII**; e-mailkolom corrupt). Gitignored = device-local, maar de DPA-voorwaarde blijft: geen CRM/mail-verwerking vóór getekende DPA + nieuwe correcte export (J.A.R.V.I.S dossier-doc 16).

## Bron-exports
| Bestand | Wat |
|---|---|
| `erp-signalement-artikelen-2026-07-14.xlsx` | **⭐ NIEUW 14/07 — de prijzenlijst**: 65.569 rijen met NUMMER · OMSCHRIJVING · BEELD · CATEG. VERKOOP · VT (btw-code, 4 = 21%) · **VERKOOPPRIJS (incl. BTW, per Bruno's mail 14/07)** · PER ROL · AANKOOPPRIJS. ✅ Geverifieerd 14/07: **dekking launch-set 98,7%** (12.596/12.765; 169 zonder prijs, waarvan 87 behang); VT=4 op 12.762 launch-artikelen; PER ROL gevuld op 487 behang-artikelen |
| `leveranciers/erp-signalement-leveranciers-2026-07-14.xlsx` | **⭐ NIEUW 14/07 — leverancierslijst**: 1.610 crediteuren (NUMMER `440xxx…` · NAAM · BTW-nr · adres). ✅ LLL-hypothese **bevestigd 14/07: crediteurnummer = `440` + LLL** (6-cijferig; 7+-cijferige nummers = niet-productcrediteuren). 243/248 launch-LLL-codes gematcht = 98,1% van de artikelen; **gaatje: LLL 126** (±230 vloer-artikelen) heeft geen crediteur → vraag Sandra (J.A.R.V.I.S doc 20 punt 9) |
| `erp-verkoopstatistieken-2026-07-14.xlsx` | NIEUW 14/07 — verkoop **geaggregeerd per FAMILIE2** (39 rijen): HOEVEELH. · BEDRAG NET · WINST NET · % — aanvulling op de artikel-versie van 08/07 |
| `erp-artikelfiche-btw-codes-2026-07-14.png` | NIEUW 14/07 — Integral-screenshot artikelfiche (750732020) met de VT-btw-codetabel opengeklapt: 1=0% · 2=6% · 3=12% · **4=21%** · 9/10/11/12 = dienst/medecontr./intra/export |
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
~~Prijzen-export per artikel~~ ✅ 14/07 · ~~leverancierslijst~~ ✅ 14/07 (440+LLL bevestigd) · ~~beeldrechten~~ ✅ 14/07 (in orde; dealersportaal-toegang nog delen) · ~~koopbaar-vs-etalage~~ ✅ 14/07 (alles koopbaar behalve raamdecoratie) · aankoophistoriek · stalenboeken-inventaris (worden opgesteld) · levertijden per productgroep · minimale afname + snij-stap meterware. Volledige restlijst: **J.A.R.V.I.S doc 20**. Let op: `***` in omschrijvingen = **uitgefaseerd** (14/07) → bij trechter v3 uitfilteren.

Artikelnummer-structuur: 9 cijfers = `LLL FFF RRR` (leverancier · familie · volgnummer); codeboek-interpretatie in J.A.R.V.I.S dossier-docs 10 & 11.
