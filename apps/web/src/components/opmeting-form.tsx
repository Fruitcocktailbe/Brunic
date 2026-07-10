"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  BELMOMENTEN,
  DIENSTEN,
  MARKETING_CONSENT_TEKST,
  SERVICE_CONSENT_TEKST,
  TERMIJNEN,
} from "@/lib/opmeting/consent";
import { verstuurOpmeting } from "@/lib/opmeting/actions";
import type { OpmetingState } from "@/lib/opmeting/types";

const START: OpmetingState = { status: "leeg" };

function Verstuurknop() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-s bg-brand px-7 py-4 text-lg font-bold text-white transition hover:bg-brand-deep disabled:opacity-60"
    >
      {pending ? "Bezig met versturen…" : "Vraag mijn gratis opmeting aan"}
    </button>
  );
}

function Fout({ tekst }: { tekst?: string }) {
  if (!tekst) return null;
  return <p className="text-sm font-bold text-brand-text">{tekst}</p>;
}

const veld = "rounded-s border-[1.5px] border-line-strong bg-ivory px-3 py-3";

export function OpmetingForm() {
  const [state, formAction] = useActionState(verstuurOpmeting, START);

  if (state.status === "ok") {
    return (
      <div
        className="rounded-m border border-line border-l-4 border-l-groen bg-white p-8"
        role="status"
        aria-live="polite"
      >
        <h2 className="font-display text-2xl">Bedankt, uw aanvraag is verstuurd</h2>
        <p className="mt-2 max-w-[52ch] text-ink-soft">
          Wij nemen binnen 1–2 werkdagen contact met u op om een moment voor de opmeting af te
          spreken.
        </p>
        <p className="mt-2 text-ink-soft">
          Liever meteen iemand aan de lijn? Bel{" "}
          <a href="tel:+3254337352" className="font-bold text-brand-text hover:underline">
            054 33 73 52
          </a>{" "}
          (Ma–Za 9–18u).
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-s border-2 border-ink px-6 py-3 font-bold transition hover:bg-ink hover:text-ivory"
        >
          Terug naar de startpagina
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-m border border-line bg-white p-6 sm:p-8" noValidate>
      {/* honeypot — visueel en voor screenreaders verborgen, bots vullen hem wel in */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="website">Laat dit veld leeg</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "fout" && state.message ? (
        <p
          role="alert"
          className="mb-6 rounded-s border border-brand bg-brand-tint px-4 py-3 font-bold text-brand-text"
        >
          {state.message}
        </p>
      ) : null}

      <fieldset className="mb-8 border-0 p-0">
        <legend className="mb-1 font-display text-xl">1 · Uw gegevens</legend>
        <p className="mb-4 text-sm text-ink-soft">Zodat wij u kunnen terugbellen voor een afspraak.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="naam" className="font-bold">
              Naam <span className="text-brand-text">*</span>
            </label>
            <input id="naam" name="naam" type="text" autoComplete="name" required className={veld} />
            <Fout tekst={state.velden?.naam} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="telefoon" className="font-bold">
              Telefoon <span className="text-brand-text">*</span>
            </label>
            <input
              id="telefoon"
              name="telefoon"
              type="tel"
              autoComplete="tel"
              required
              placeholder="Bv. 0470 12 34 56"
              className={veld}
            />
            <Fout tekst={state.velden?.telefoon} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-bold">
              E-mail
            </label>
            <input id="email" name="email" type="email" autoComplete="email" className={veld} />
            <Fout tekst={state.velden?.email} />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="plaats" className="font-bold">
              Postcode &amp; gemeente
            </label>
            <input
              id="plaats"
              name="plaats"
              type="text"
              autoComplete="postal-code"
              placeholder="Bv. 9400 Ninove"
              className={veld}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mb-8 border-0 p-0">
        <legend className="mb-1 font-display text-xl">2 · Waarvoor mogen we langskomen?</legend>
        <p className="mb-4 text-sm text-ink-soft">Kruis aan wat van toepassing is — meerdere mag.</p>

        <ul className="grid gap-2 sm:grid-cols-2">
          {DIENSTEN.map((d) => (
            <li key={d.value}>
              <label className="flex cursor-pointer items-center gap-3 rounded-s border-[1.5px] border-line-strong px-3 py-3 transition hover:border-brand">
                <input type="checkbox" name="dienst" value={d.value} className="h-5 w-5 accent-brand" />
                <span>{d.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="mb-8 border-0 p-0">
        <legend className="mb-4 font-display text-xl">3 · Uw project</legend>

        <div className="grid gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="project" className="font-bold">
              Beschrijf kort wat u wenst
            </label>
            <textarea
              id="project"
              name="project"
              rows={5}
              placeholder="Bv. nieuwe gordijnen voor de living (3 ramen), graag verduisterend, en advies over de kleur."
              className={`${veld} resize-y`}
            />
            <small className="text-ink-soft">
              Foto&apos;s toevoegen kan binnenkort — bezorg ze gerust telefonisch of per e-mail.
            </small>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="termijn" className="font-bold">
                Gewenste termijn
              </label>
              <select id="termijn" name="termijn" className={veld} defaultValue="">
                <option value="">Maakt niet uit</option>
                {TERMIJNEN.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="belmoment" className="font-bold">
                Voorkeur belmoment
              </label>
              <select id="belmoment" name="belmoment" className={veld} defaultValue="">
                <option value="">Geen voorkeur</option>
                {BELMOMENTEN.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Twee gescheiden rechtsgronden. Marketing staat bewust standaard uit. */}
      <div className="grid gap-4 border-t border-line pt-6">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="consent" required className="mt-1 h-5 w-5 accent-brand" />
          <span>
            {SERVICE_CONSENT_TEKST} <span className="text-brand-text">*</span>{" "}
            <Link href="#" className="underline">
              Privacybeleid
            </Link>
            .
          </span>
        </label>
        <Fout tekst={state.velden?.consent} />

        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" name="marketing" className="mt-1 h-5 w-5 accent-brand" />
          <span>{MARKETING_CONSENT_TEKST}</span>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Verstuurknop />
        <span className="flex items-center gap-2 text-sm text-ink-soft">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-groen" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Wij bellen u binnen 1–2 werkdagen
        </span>
      </div>
    </form>
  );
}
