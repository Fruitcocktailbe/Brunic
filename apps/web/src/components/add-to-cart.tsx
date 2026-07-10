"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CART_UPDATED } from "@/components/cart-badge";
import { voegToeAanMand } from "@/lib/cart/actions";

export function AddToCart({
  variantId,
  beschikbaar,
}: {
  variantId: string;
  beschikbaar: boolean;
}) {
  const router = useRouter();
  const [bezig, startTransition] = useTransition();
  const [fout, setFout] = useState<string | null>(null);
  const [gelukt, setGelukt] = useState(false);

  function klik() {
    setFout(null);
    setGelukt(false);

    startTransition(async () => {
      const res = await voegToeAanMand(variantId, 1);
      if (!res.ok) {
        setFout(res.message ?? "Toevoegen mislukt.");
        return;
      }
      setGelukt(true);
      window.dispatchEvent(new Event(CART_UPDATED));
      router.refresh();
    });
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={klik}
        disabled={bezig || !beschikbaar}
        className="w-full rounded-s bg-brand px-6 py-4 text-lg font-bold text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {bezig ? "Bezig…" : beschikbaar ? "In de winkelmand" : "Niet beschikbaar"}
      </button>

      <p aria-live="polite" className="mt-2 text-sm">
        {fout ? <span className="font-bold text-brand-text">{fout}</span> : null}
        {gelukt ? (
          <span className="text-groen">
            Toegevoegd —{" "}
            <a href="/winkelmand" className="font-bold underline">
              naar de winkelmand
            </a>
          </span>
        ) : null}
      </p>
    </div>
  );
}
