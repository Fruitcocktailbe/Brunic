"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useWishlist } from "@/lib/store/stores";

/** Hartje: zet een product op de verlanglijst (lokaal bewaard). */
export function WishlistButton({
  productId,
  variantId,
  title,
  variant = "card",
}: {
  productId: string;
  variantId?: string;
  title: string;
  variant?: "card" | "inline";
}) {
  const wish = useWishlist();
  const [msg, setMsg] = useState("");
  const on = wish.hydrated && wish.has(productId);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = wish.toggle(productId, variantId);
    setMsg(res === null ? "Uw verlanglijst is vol." : res ? `${title} staat op uw verlanglijst.` : `${title} is van uw verlanglijst gehaald.`);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? `Van verlanglijst halen: ${title}` : `Op verlanglijst zetten: ${title}`}
        className={
          variant === "card"
            ? "relative z-10 flex size-11 items-center justify-center rounded-full text-white drop-shadow-[0_1px_2px_rgb(0_0_0/0.45)] transition hover:scale-105"
            : "flex size-12 shrink-0 items-center justify-center rounded-full text-ink hover:bg-mist"
        }
      >
        <Icon
          name="heart"
          size={variant === "card" ? 26 : 28}
          strokeWidth={variant === "card" ? 1.8 : 1.7}
          className={on ? "fill-brand text-brand" : variant === "card" ? "fill-black/10" : ""}
        />
      </button>
      <span className="sr-only" role="status">
        {msg}
      </span>
    </>
  );
}
