"use client";

import { useState } from "react";
import { Icon } from "./icon";

/** Tekst die ingekort start (2 regels) met "Meer lezen" (referentie: "Voir plus"). */
export function ReadMore({ text, className = "" }: { text: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <p className={`text-[15px] leading-relaxed text-ink-80 lg:text-base ${open ? "" : "line-clamp-2"}`}>{text}</p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-1 inline-flex items-center gap-2 border-b-2 border-ink py-2 text-[14px] font-medium"
      >
        {open ? "Minder lezen" : "Meer lezen"}
        <Icon name="chevronDown" size={18} className={open ? "rotate-180" : ""} />
      </button>
    </div>
  );
}
