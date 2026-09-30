import { routes } from "@/lib/routes";

/**
 * Centrale bedrijfsgegevens — één plek voor adres, telefoon, openingsuren.
 * Bron: design-brief §1/§5 (NAP) en brunic.be. Te valideren door Brunic vóór livegang.
 */
export const SITE = {
  name: "Brunic",
  legalName: "Brunic nv",
  /** Publieke URL van de site (canonical, sitemap, Open Graph). Zet SITE_URL in de omgeving. */
  url: (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.brunic.be").replace(/\/$/, ""),
  /** Ondernemingsnummer (KBO/btw), zoals vermeld op brunic.be/contact (geverifieerd 30/09/2026). */
  companyNumber: process.env.SITE_COMPANY_NUMBER || "BE 0446.774.674",
  tagline: "Al 40 jaar uw partner voor interieurdecoratie",
  description:
    "Interieurzaak in Ninove: gordijnen op maat uit eigen atelier, behang, vasttapijt en tapijten. Advies in de winkel, gratis opmeting en plaatsing aan huis.",
  foundingDate: "1992",
  address: { street: "Ring-West 19", postalCode: "9400", city: "Ninove", region: "Oost-Vlaanderen", country: "België", countryCode: "BE" },
  phone: { display: "054 33 73 52", href: "tel:+3254337352", e164: "+3254337352" },
  email: "info@brunic.be",
  hours: [
    { days: "Maandag – zaterdag", time: "09:00 – 18:00" },
    { days: "Zon- en feestdagen", time: "Gesloten" },
  ],
  /** Zelfde uren, machineleesbaar (JSON-LD). */
  openingHours: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "18:00" }],
  hoursShort: "Ma–za 9–18u",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Brunic%20Ring-West%2019%209400%20Ninove",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/BrunicNV", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/brunicnv/", icon: "instagram" },
  ],
} as const;

/** Berichten in de zwarte servicebalk (roteren). Enkel feiten; acties komen hier met echte voorwaarden. */
export const SERVICE_BAR = [
  { text: "Bezoek onze winkel in Ninove", strong: "ma–za 9–18u", href: routes.store() },
  { text: "Gordijnen op maat uit eigen atelier —", strong: "gratis opmeting aan huis", href: routes.measurement() },
  { text: "Vragen? Bel ons op", strong: SITE.phone.display, href: SITE.phone.href },
];
