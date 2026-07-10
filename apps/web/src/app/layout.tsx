import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { CartBadge } from "@/components/cart-badge";
import { FavorietenBadge } from "@/components/favorieten-badge";
import "./globals.css";

// next/font host de fonts self-hosted mee in de build: géén runtime-request naar
// Google (IP-doorgifte vóór consent — GBA / consent mode v2, zie design-brief §8).
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
});

export const metadata: Metadata = {
  // Nodig om de relatieve canonicals uit de pagina's absoluut te maken.
  metadataBase: new URL(process.env.SITE_URL ?? "https://brunic.be"),
  title: {
    default: "Brunic — Gordijnen op maat, interieur & advies · Ninove",
    template: "%s · Brunic",
  },
  description:
    "Al 40 jaar dé interieurzaak van Ninove: gordijnen op maat uit eigen atelier, behang, vloeren, tapijten en raamdecoratie. Gratis opmeting aan huis.",
};

const NAV = [
  { href: "/gordijnen-stoffen", label: "Gordijnen & stoffen" },
  { href: "/behang", label: "Behang" },
  { href: "/vloeren", label: "Vloeren" },
  { href: "/tapijten-karpetten", label: "Tapijten & karpetten" },
  { href: "/raamdecoratie", label: "Raamdecoratie" },
  { href: "/verf", label: "Verf" },
  { href: "/slapen-wonen", label: "Slapen & wonen" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-BE" className={`${fraunces.variable} ${karla.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only-focusable absolute left-4 top-4 z-50 rounded-s bg-ink px-4 py-2 font-bold text-ivory"
        >
          Meteen naar de inhoud
        </a>

        <header className="border-b border-line">
          <div className="on-red bg-brand-deep stripes-light text-white">
            <div className="mx-auto flex max-w-(--container-brunic) flex-wrap items-center justify-between gap-2 px-6 py-2 text-sm">
              <p>Gratis opmeting &amp; advies aan huis — wij bellen u binnen 1–2 werkdagen</p>
              <div className="flex items-center gap-4">
                <a href="tel:+3254337352" className="font-bold underline-offset-2 hover:underline">
                  054 33 73 52
                </a>
                <span className="hidden sm:inline">Ma–Za 9–18u · zondag gesloten</span>
              </div>
            </div>
          </div>

          <div className="mx-auto flex max-w-(--container-brunic) items-center justify-between gap-6 px-6 py-4">
            <Link href="/" aria-label="Brunic — naar de startpagina">
              <Image
                src="/logo-kleur.png"
                alt="Brunic"
                width={600}
                height={376}
                priority
                unoptimized
                className="h-[54px] w-auto rounded-[6px] md:h-[68px]"
              />
            </Link>
            <p className="hidden max-w-sm text-sm text-ink-soft lg:block">
              Vakmanschap uit eigen atelier — advies, opmeting en plaatsing aan huis.
            </p>

            <div className="flex items-center gap-2">
              <FavorietenBadge />
              <CartBadge />
            </div>
          </div>

          <nav aria-label="Hoofdnavigatie" className="border-t border-line">
            <ul className="mx-auto flex max-w-(--container-brunic) flex-wrap gap-x-6 gap-y-1 px-6 py-2 text-[0.95rem]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block border-b-2 border-transparent py-1 hover:border-brand hover:text-brand-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main id="main">{children}</main>

        <footer className="on-ink mt-24 bg-ink text-ivory">
          <div className="mx-auto grid max-w-(--container-brunic) gap-8 px-6 py-12 sm:grid-cols-2">
            <div>
              <p className="font-display text-2xl font-bold">
                BRUNIC<span className="text-brand">.</span>
              </p>
              <p className="mt-2 max-w-sm text-sm text-ivory/70">
                Vakmanschap uit eigen atelier — advies, opmeting en plaatsing aan huis. Al 40 jaar
                in Ninove.
              </p>
            </div>
            <address className="grid gap-1 text-sm not-italic text-ivory/70">
              <span className="font-bold text-ivory">Brunic nv</span>
              <span>Ring-West 19, 9400 Ninove</span>
              <a href="tel:+3254337352" className="hover:underline">
                054 33 73 52
              </a>
              <a href="mailto:info@brunic.be" className="hover:underline">
                info@brunic.be
              </a>
              <span>Ma–Za 9–18u · zondag gesloten</span>
            </address>
          </div>
          <div className="border-t border-white/10">
            <p className="mx-auto max-w-(--container-brunic) px-6 py-4 text-xs text-ivory/60">
              © 2026 Brunic nv, Ninove — alle rechten voorbehouden.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
