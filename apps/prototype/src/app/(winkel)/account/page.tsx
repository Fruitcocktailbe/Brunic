import type { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Inloggen" };

/**
 * Accountpagina: vorm is uitgewerkt, de functie niet. Klantaccounts komen later
 * (bv. Shopify Customer Accounts) — tot dan zijn de velden uitgeschakeld.
 */
export default function AccountPage() {
  return (
    <div className="shell-inset">
      <Breadcrumbs items={[{ label: "Inloggen" }]} />
      <div className="mx-auto grid max-w-[1040px] gap-6 py-4 md:grid-cols-2">
        <section aria-labelledby="login-titel" className="rounded-[var(--radius-tile)] border border-line p-6 md:p-8">
          <h1 id="login-titel" className="font-display text-[32px] leading-tight">
            Inloggen
          </h1>
          <p role="note" className="mt-3 flex gap-2 rounded-[var(--radius-field)] bg-mist p-3 text-[14px] text-ink-80">
            <Icon name="info" size={20} className="shrink-0" />
            Klantaccounts zijn nog niet beschikbaar in dit prototype. Uw verlanglijst en winkelmand worden intussen in deze browser bewaard.
          </p>
          <form className="mt-6 space-y-4" aria-describedby="login-titel">
            <fieldset disabled className="space-y-4 opacity-70">
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-[14px] font-medium">
                  E-mail
                </label>
                <input id="login-email" type="email" autoComplete="email" className="field" placeholder="Uw e-mailadres" />
              </div>
              <div>
                <label htmlFor="login-ww" className="mb-1.5 block text-[14px] font-medium">
                  Wachtwoord
                </label>
                <input id="login-ww" type="password" autoComplete="current-password" className="field" />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Inloggen (nog niet beschikbaar)
              </button>
            </fieldset>
          </form>
        </section>

        <section aria-labelledby="voordelen-titel" className="rounded-[var(--radius-tile)] bg-sand p-6 md:p-8">
          <h2 id="voordelen-titel" className="font-display text-[28px] leading-tight">
            Straks met een account
          </h2>
          <ul className="mt-5 space-y-3 text-[15px]">
            {["Uw bestellingen en afspraken opvolgen", "Uw verlanglijst op al uw toestellen", "Sneller afrekenen met opgeslagen gegevens", "Offertes voor maatwerk terugvinden"].map((t) => (
              <li key={t} className="flex gap-3">
                <Icon name="check" size={20} className="shrink-0" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={routes.wishlist()} className="btn btn-primary">
              Naar mijn verlanglijst
            </Link>
            <Link href={routes.cart()} className="btn btn-outline">
              Naar mijn winkelmand
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
