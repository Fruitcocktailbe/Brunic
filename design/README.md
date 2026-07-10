# design/ — statische design-comps (fase 1 van bouwstart §1)

Twee stijlrichtingen, elk als volwaardige HTML-comps met **echte catalogus-content** (geen lorem ipsum), lokaal te bekijken — open `index.html`.

| Map | Richting | Idee |
|---|---|---|
| `richting-a/` | **Brunic Voluit** | de echte merkkleuren (rood `#E21F1D` · geel `#FFD101`) voluit maar volwassen — trots, warm, nul discount-gevoel |
| `richting-b/` | **Brunic Zacht** | kalm interieur-palet (linnen/ecru/klei), merk enkel als precieze accenten — atelier/galerij-gevoel |

Elke richting: `home.html` · `plp.html` (Tapijten, met bucket-maatfilter) · `pdp-koopbaar.html` · `pdp-etalage.html` + `tokens.css` (alle design-tokens).

## Kleurbeslissing (09/07/2026 — Jeroen)
De design-brief §3 zei "rood/geel bewust loslaten"; Jeroen besliste 09/07: **wél vertrekken van de brunic.be-kleuren** — richting A voluit, richting B als hints. ⚠️ Nog te loggen in J.A.R.V.I.S `decisions/log.md` + design-brief bijwerken zodra de richting gekozen is.

- Kleuren geverifieerd op de live site (CSS): rood `#E21F1D`, geel `#FFD101`.
- ⚠️ `data/Brunic-logo-kleur.png` is een leeg bestand (0 bytes) — vector-logo komt nog van de klant (losse eindjes-lijst).

## Spelregels
- `content-sample.json` is een gecureerd staal uit de (gitignored) Woo-export: publiek zichtbare productnamen/foto-URL's van brunic.be. Foto's zijn **hotlinks** naar `brunic.be/wp-content` — comps hebben internet nodig; kaarten hebben een nette fallback zonder beeld.
- Comps blijven lokaal reviewen (browser of `/shot`); niet naar externe diensten publiceren.
- Volgende stap na richtingskeuze: winnaar porten naar `apps/web` (Next.js-scaffold, bouwstart §3).
