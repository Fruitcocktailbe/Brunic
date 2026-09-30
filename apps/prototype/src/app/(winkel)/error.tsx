"use client";

import Link from "next/link";
import { useEffect } from "react";
import { routes } from "@/lib/routes";
import { SITE } from "@/lib/site/config";

/** Foutscherm binnen de gewone header/footer (bv. als een externe dienst even niet antwoordt). */
export default function Fout({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="shell-inset py-16 text-center lg:py-24">
      <h1 className="font-display text-[32px] leading-tight lg:text-[44px]">Er liep even iets mis</h1>
      <p className="mx-auto mt-3 max-w-xl text-base text-ink-80">
        Probeer het opnieuw. Lukt het nog steeds niet, bel ons dan op{" "}
        <a href={SITE.phone.href} className="font-medium underline">
          {SITE.phone.display}
        </a>{" "}
        — we helpen u graag verder.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          Opnieuw proberen
        </button>
        <Link href={routes.home()} className="btn btn-outline">
          Naar de startpagina
        </Link>
      </div>
    </div>
  );
}
