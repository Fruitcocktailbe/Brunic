import Link from "next/link";
import { FOOTER_COLUMNS } from "@/lib/site/navigation";
import { SITE } from "@/lib/site/config";
import { Icon, type IconName } from "@/components/ui/icon";
import { NewsletterBand } from "./newsletter-band";
import { UspBand } from "./usp-band";
import { SeoText } from "./seo-text";

const TRUST: { icon: IconName; title: string; text: string }[] = [
  { icon: "store", title: "Winkel in Ninove", text: `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}` },
  { icon: "chat", title: "Persoonlijk advies", text: `In de winkel · ${SITE.hoursShort}` },
  { icon: "ruler", title: "Gratis opmeting", text: "Wij komen bij u thuis opmeten" },
  { icon: "scissors", title: "Eigen atelier", text: "Gordijnen op maat, door eigen stiksters" },
];

/** Footer met dezelfde opbouw als de referentie. */
export function SiteFooter({ showNewsletter = true }: { showNewsletter?: boolean }) {
  return (
    <footer className="mt-16 lg:mt-24">
      {showNewsletter && <NewsletterBand />}

      <div className="shell pt-12 lg:pt-16">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mascotte.png" alt="" width={64} height={64} className="size-16" />
          <p className="section-title mt-2">{SITE.tagline}</p>
        </div>

        <div className="mt-10">
          <UspBand />
        </div>

        {/* Mobiel: uitklapbare groepen (referentie). Desktop: open kolommen hieronder. */}
        <div className="mt-12 border-t border-line lg:hidden">
          {FOOTER_COLUMNS.map((col) => (
            <details key={col.title} className="group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-base font-medium [&::-webkit-details-marker]:hidden">
                {col.title}
                <Icon name="chevronDown" size={20} className="transition-transform group-open:rotate-180" />
              </summary>
              <nav aria-label={col.title}>
                <ul role="list" className="space-y-1 pb-4">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="flex min-h-10 items-center text-[14px] text-ink-80 hover:text-ink hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          ))}
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-[repeat(4,1fr)_auto]">
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="hidden lg:block">
              <h2 className="text-base font-medium">{col.title}</h2>
              <ul role="list" className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[14px] text-ink-80 hover:text-ink hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="text-base font-medium">Volg ons</h2>
            <ul role="list" className="mt-4 flex gap-2">
              {SITE.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-11 items-center justify-center rounded-full border border-line-strong/50 hover:border-ink"
                    aria-label={`${s.label} (opent in nieuw venster)`}
                  >
                    <Icon name={s.icon as IconName} size={20} />
                  </a>
                </li>
              ))}
            </ul>
            <address className="mt-6 space-y-1 text-[14px] not-italic text-ink-80">
              <p className="font-medium text-ink">{SITE.legalName}</p>
              <p>
                {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}
              </p>
              <p>
                <a href={SITE.phone.href} className="hover:underline">
                  {SITE.phone.display}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="hover:underline">
                  {SITE.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-10">
          <h2 className="text-base font-medium">Winkelen met vertrouwen</h2>
          <ul role="list" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((t) => (
              <li key={t.title} className="flex items-center gap-4 rounded-[var(--radius-tile)] border border-line p-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sand">
                  <Icon name={t.icon} size={24} />
                </span>
                <span className="text-[14px] leading-snug">
                  <span className="block font-medium">{t.title}</span>
                  <span className="text-ink-80">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <SeoText />
        </div>

        <div className="pb-10" />
      </div>

      <div className="bg-mist">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6 text-[12px] text-ink-80">
          <p>
            © {new Date().getFullYear()} {SITE.legalName} · {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}
            {SITE.companyNumber && ` · Ondernemingsnummer ${SITE.companyNumber}`}
          </p>
          <p className="flex items-center gap-2 rounded-[var(--radius-field)] border border-line-strong/50 bg-white px-3 py-2">
            <span aria-hidden="true">🇧🇪</span> België · Nederlands
          </p>
        </div>
      </div>
    </footer>
  );
}
