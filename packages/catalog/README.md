# packages/catalog — de catalogus-pipeline (PIM-light)

**Bron van waarheid voor alle productdata.** Shopify is het publicatiekanaal, de AI-chatbot een tweede afnemer — beiden lezen uit wat hier gebouwd wordt (beslissing 08/07, zie `docs/architectuur.md`).

## Pipeline-stadia (te bouwen)
```
1. ingest     ERP-exports + Woo-export inlezen (data/) → genormaliseerde catalog-DB (SQLite)
2. trechter   selectie launch-set (v2 gedraaid 08/07 → data/trechter/trechter-v2-shortlist.csv)
3. verrijk    attributen per categorie: scraping leveranciers (poolhoogte, kleur, design,
              materiaal, patroon…) + ERP-joins + nette titels + eenheden-normalisatie
4. media      foto-mapping: Woo-URL's + gescrapete beelden → staging data/media/
              (artikelnummer-genaamd, bron+licentie gelogd) → herschalen ~2048px
5. review     CSV-export per categorie → Sandra/Aga vinken af → terug inlezen
              (de sheet is een interface, nooit de bron)
6. publish    Shopify bulk-sync via GraphQL productSet (JSONL): producten + varianten
              + metafields + beelden + collections. Veld-eigenaarschap: pipeline-owned
              (attributen/metafields/beelden/titels) vs admin-owned (prijs, status, voorraad)
7. ai-export  kennisbank voor de chatbot: attributen als filter-tools + teksten voor retrieval
```
Elke stap idempotent en her-runbaar (trechter-principe: correctieronde = her-run, geen handwerk).

## `trechter.py`
De v1-trechter (06/07): parseert de ERP-PDF, decodeert `LLL FFF RRR` via het familie-codeboek, klasseert 65.314 artikelen → `data/trechter/erp-geclassificeerd.csv`. Mapping-regels: J.A.R.V.I.S dossier-doc 11 (webcategorie-mapping). Wordt de basis van stap 1-2.

## Metafield-schema (stap 3/6 — vast te klikken vóór de bulk-import)
Alle definities filterable via Search & Discovery; namespace-voorstel `brunic`.
| Veld | Type | Niveau | Categorieën |
|---|---|---|---|
| `breedte_cm` / `lengte_cm` | number_integer | **variant** | tapijten, vasttapijt, jaloezieën (maatfilter = bucket-UI, zie architectuur.md) |
| `poolhoogte_mm` + `poolklasse` (hoog/laag) | number_integer + text | product | tapijten, vasttapijt |
| `materiaal` | text (lijst) | product | alle |
| `kleurfamilie` | text (lijst) | product | alle |
| `stijl_design` | text (lijst) | product | tapijten, behang, stoffen |
| `patroon` | text | product | behang, stoffen |
| `brandvertragend_norm` | text | product | projectstoffen, tapijten (B2B-filter) |
| `rolbreedte_cm` | number_integer | product | behang, wasdoek, vasttapijt |
| `etalage` | boolean | product | alle (true = tonen-niet-verkopen; front-end verbergt prijs/koopknop, chatbot noemt geen prijs) |
| `erp_familie` | text | product | alle (herkomst-koppeling `LLL FFF`) |
| `verkoop_per_meter` | boolean | product | wasdoek, stoffen, vasttapijt (UX-keuze nog open) |

## Open beslissingen (zie ook docs/architectuur.md §Datamodel)
Per-meter-verkoopmodel (0,1m-increment vs lengte-invoer) · eenheden-defaults per familie (Sandra) · ERP-sync-cadans na livegang · scraping-bronnen (wacht op leverancierslijst) + gebruiksrecht beelden als dealer checken.
