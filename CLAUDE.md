# Brunic — projectregels voor Claude

Dit is de **werkplaats** voor het Brunic-webshopproject (klant van HackersQuattro/Atelier Sjiek). Hier wordt gebouwd: design, code, catalogus-pipeline, chatbot.

## De brug met J.A.R.V.I.S (Jeroens cockpit)
- **Strategie, beslissingen, klantcommunicatie en het dossier** leven in `D:\GithubLocal\J.A.R.V.I.S\clients\brunic\` (genummerde werkdocs 01-17) — niet hier dupliceren. Duikt hier een strategische beslissing of klant-afspraak op → zeg dat het in J.A.R.V.I.S gelogd hoort (decisions/log.md + dossier).
- Belangrijkste dossier-docs: `15-meeting-2026-07-08.md` (het akkoord) · `16-trechter-v2-analyse.md` (catalogus-cijfers) · `17-losse-eindjes-en-vragenlijst.md` (open punten + wat nog van de klant moet komen) · `14-chatbot-architectuur.md` · `11-webcategorie-mapping.md` (familie → webcategorie).

## Harde regels
- **`data/` is gitignored en blijft dat** — ruwe klantdata (ERP-exports, WooCommerce-export, klantrecords) nooit committen of naar externe diensten sturen. Secrets in `.env*` (gitignored); klant-credentials leven in J.A.R.V.I.S `clients/brunic/.env.client`.
- **Eigendomsprincipe**: alle klant-accounts (Shopify, GA4, GSC, domein) komen op naam van Bruno/Brunic nv; wij zijn collaborator/staff. Nooit omgekeerd — dat is letterlijk het verkoopverhaal van dit project.
- **Niets gaat live vóór getekende offerte + voorschot** (afspraak 08/07). Bouwen in een Shopify Partner development store mag wél.
- Repo is privé, GitHub-org = **HackersQuattroOrg**; Vercel-team = fruitcocktailbe-projects. Jeroen pusht/deployt zelf of geeft expliciet go.

## Praktisch
- Taal: site en alle klant-zichtbare content in **nl-BE (Vlaams)**; "u"-vorm op de site.
- Stack en structuur: zie `docs/architectuur.md`. Design-input: `docs/design-brief.md`.
- De catalogus-CSV's in `data/` zijn de bron voor realistische design-content (echte productnamen, categorieën, foto-URL's) — gebruik ze in plaats van lorem ipsum.
