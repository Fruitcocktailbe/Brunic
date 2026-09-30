import Link from "next/link";
import { routes } from "@/lib/routes";
import { SITE } from "@/lib/site/config";
import type { Maatwerk } from "@/lib/site/maatwerk";
import { Icon, type IconName } from "@/components/ui/icon";

type Band = { title: string; text: string; cta: { label: string; href: string }; items: { icon: IconName; t: string; d: string }[] };

/**
 * Inhoud per afdeling (lib/site/maatwerk.ts): enkel waar Brunic echt maatwerk levert,
 * spreekt de band van opmeting en plaatsing; bij behang en gemengde lijsten nodigt ze
 * uit in de winkel.
 */
const BANDEN: Record<Maatwerk, Band> = {
  stoffen: {
    title: "Liever op maat?",
    text: "Wij meten gratis op bij u thuis, maken uw gordijnen in ons eigen atelier en plaatsen alles met onze eigen mensen.",
    cta: { label: "Gordijnen op maat", href: routes.service("gordijnen-op-maat") },
    items: [
      { icon: "chat", t: "Advies in de winkel", d: "Stalen voelen en vergelijken, met iemand die meedenkt." },
      { icon: "ruler", t: "Gratis opmeting", d: "Wij komen langs en meten nauwkeurig op." },
      { icon: "scissors", t: "Maatwerk & plaatsing", d: "Gemaakt in ons atelier, geplaatst door ons team." },
    ],
  },
  tapijten: {
    title: "Tapijt op maat?",
    text: "Past geen enkele standaardmaat bij uw zithoek of slaapkamer? Dan krijgt u uw tapijt in de afmeting die u kiest, met advies over maat, kwaliteit en afwerking.",
    cta: { label: "Tapijt op maat", href: routes.service("tapijt-op-maat") },
    items: [
      { icon: "chat", t: "Advies in de winkel", d: "Kwaliteiten voelen en kleuren vergelijken." },
      { icon: "ruler", t: "De juiste maat", d: "Samen bepalen we hoe groot het tapijt moet zijn." },
      { icon: "check", t: "Uw maat, uw keuze", d: "U kiest afmeting, kwaliteit en kleur." },
    ],
  },
  vloer: {
    title: "Vasttapijt op maat gelegd",
    text: "Vasttapijt, tapijttegels of een loper: wij meten gratis op bij u thuis en onze eigen mensen leggen het tapijt.",
    cta: { label: "Meer over plaatsing", href: routes.service("vasttapijt-en-vloeren") },
    items: [
      { icon: "chat", t: "Advies in de winkel", d: "Eerlijk advies over materiaal en gebruik." },
      { icon: "ruler", t: "Gratis opmeting", d: "Wij komen langs en meten nauwkeurig op." },
      { icon: "home", t: "Gelegd door ons team", d: "Door onze eigen mensen, bij u thuis." },
    ],
  },
  winkel: {
    title: "Kom eens langs in onze winkel",
    text: `Kleuren en materialen ziet u het best in het echt. In onze winkel in ${SITE.address.city} bladert u door de stalenboeken en krijgt u persoonlijk advies over kleur, patroon en combinaties.`,
    cta: { label: "Route & openingsuren", href: routes.store() },
    items: [
      { icon: "grid", t: "Stalenboeken", d: "Collecties en kleuren bekijken en voelen." },
      { icon: "chat", t: "Persoonlijk advies", d: "Wij denken mee over wat bij uw interieur past." },
      { icon: "pin", t: SITE.hoursShort, d: `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}` },
    ],
  },
};

/** Brede campagneband in het productraster (referentie: "Grand déstockage"-blok tussen de producten). */
export function PromoBanner({ soort = "winkel" }: { soort?: Maatwerk }) {
  const band = BANDEN[soort];
  return (
    <div className="my-2 grid gap-6 rounded-[var(--radius-pill)] bg-sand p-6 md:grid-cols-[1.2fr_2fr] md:items-center lg:p-10">
      <div>
        <p className="font-display text-[32px] leading-tight lg:text-[40px]">{band.title}</p>
        <p className="mt-2 text-[15px] text-ink-80">{band.text}</p>
        <Link href={band.cta.href} className="btn btn-primary mt-5">
          {band.cta.label}
        </Link>
      </div>
      <ul role="list" className="grid gap-3 sm:grid-cols-3">
        {band.items.map((x) => (
          <li key={x.t} className="rounded-[var(--radius-tile)] bg-white p-5">
            <Icon name={x.icon} size={28} strokeWidth={1.4} />
            <p className="mt-3 font-medium">{x.t}</p>
            <p className="mt-1 text-[13px] text-ink-80">{x.d}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
