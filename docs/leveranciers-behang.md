# Behang — leveranciers & collecties (uit de stalenboeken)

Bron: foto van het behangboeken-rek in de winkel (08/07/2026, `data/leveranciers/behangboeken-leveranciers-2026-07-08.jpg`, gitignored). Eén plank; **niet het volledige assortiment** — er staan meer boeken buiten beeld (o.a. links "…HUR" en rechts een stapel).

Dit is een eerste, onvolledige invulling van de **leverancierslijst** die op het kritieke pad staat (zie `data/README.md` → "Nog te ontvangen"). Bruno's officiële lijst met LLL-codes vervangt dit zodra ze binnen is.

## Merken op de plank

| Merk | Collecties (boekruggen) | Opmerking |
|---|---|---|
| **Cristiana Masi** (Made in Italy) | Thai · Ornamenta · Tradizioni | Meeste boeken van één merk op deze plank |
| **Noordwand** (Wall Decoration) | Thai · Holistique | NL-distributeur; Thai draagt zowel Masi- als Noordwand-branding → Noordwand distribueert Masi |
| **Erismann** | Fashion for Walls (by Guido Maria Kretschmer), editie **2026** | DE |
| **Dutch Wallcoverings** (DB) | — (oranje ordner) | NL |
| **Galerie** | Special FX (paste-the-wall) | |
| **Marburg** | Élégance | DE |
| **design id** | Renaissance ("elegance meets modern luxury") | |
| — (merk niet leesbaar) | Allure · Botanique · Zen | Zen = linnen band, merk niet zichtbaar op de rug |
| **Grandeco** | — (rechts, deels afgesneden) | |
| — | Ciara | Rechts in de stapel |

## Hypothese: de handgeschreven codes = LLL-leverancierscodes
Op verschillende ruggen kleeft een label met een 3-cijferig nummer: **828/822** (Élégance/Marburg), **922** (Holistique/Noordwand), **242** (Allure), **52** (Renaissance/design id).

Drie cijfers matcht exact het `LLL`-deel van de ERP-artikelnummerstructuur (`LLL FFF RRR` = leverancier · familie · volgnummer, zie J.A.R.V.I.S dossier-doc 10). Als dat klopt, geven de boekruggen ons de leverancier↔code-mapping **zonder** op Bruno's lijst te wachten.

**Verifieer:** filter `data/trechter/erp-geclassificeerd.csv` op artikelnummers die met 922 / 242 / 828 beginnen en kijk of de omschrijvingen behang van dat merk zijn. Klopt het → de rest van de boeken fotograferen en de mapping zo afmaken.

## Openstaand
- Rest van het rek fotograferen (deze plank is een fragment).
- Merk achterhalen bij Allure / Botanique / Zen / Ciara.
- Gebruiksrecht op leveranciersfoto's als dealer checken (staat al open bij de scraping-pipeline).
