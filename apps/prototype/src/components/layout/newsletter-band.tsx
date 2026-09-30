"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { schrijfIn } from "@/lib/leads/actions";
import { NIEUWSBRIEF_TEKST } from "@/lib/leads/consent";
import type { FormState } from "@/lib/leads/types";
import { routes } from "@/lib/routes";
import { Icon } from "@/components/ui/icon";

/**
 * Nieuwsbriefband boven de footer. Inschrijven = klant in Shopify met e-mailtoestemming
 * (single opt-in, met tijdstip) — Shopify Email of een gekoppelde mailtool leest die lijst.
 */
export function NewsletterBand() {
  const [state, action, pending] = useActionState<FormState, FormData>(schrijfIn, { status: "leeg" });
  const [start] = useState(() => Date.now());
  const fout = state.velden?.email ?? (state.status === "fout" ? state.message : undefined);

  return (
    <section aria-labelledby="nieuwsbrief-titel" className="border-y border-line bg-mist">
      <div className="shell grid items-center gap-4 py-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <h2 id="nieuwsbrief-titel" className="font-display text-2xl">
            <strong className="font-semibold">Inspiratie</strong> in uw mailbox
          </h2>
          <p className="mt-1 text-[13px] text-ink-80">{NIEUWSBRIEF_TEKST}</p>
        </div>
        <div>
          {state.status === "ok" ? (
            <p role="status" className="flex items-center gap-2 text-[15px] font-medium">
              <Icon name="check" size={20} /> Bedankt, u bent ingeschreven.
            </p>
          ) : (
            <form action={action} className="flex gap-2">
              <input type="hidden" name="_t" value={start} />
              <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <label htmlFor="nieuwsbrief-email" className="sr-only">
                Uw e-mailadres
              </label>
              <input
                id="nieuwsbrief-email"
                name="email"
                type="email"
                required
                placeholder="Uw e-mailadres"
                autoComplete="email"
                aria-invalid={Boolean(fout)}
                aria-describedby="nieuwsbrief-status"
                className="field flex-1"
              />
              <button type="submit" className="btn btn-primary px-5" disabled={pending}>
                {pending ? "…" : "Inschrijven"}
              </button>
            </form>
          )}
          <p id="nieuwsbrief-status" role={fout ? "alert" : undefined} className="mt-2 min-h-5 text-[13px]">
            {fout ? (
              <span className="text-brand-dark">{fout}</span>
            ) : (
              state.status !== "ok" && (
                <span className="text-ink-60">
                  Lees onze{" "}
                  <Link href={routes.info("privacy")} className="underline underline-offset-2">
                    privacyverklaring
                  </Link>
                  .
                </span>
              )
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
