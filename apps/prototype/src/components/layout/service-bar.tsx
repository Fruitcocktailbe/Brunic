"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SERVICE_BAR } from "@/lib/site/config";

/**
 * Zwarte servicebalk bovenaan (roterende boodschap; stopt bij hover/focus en bij reduced motion).
 * Vaste hoogte van één regel (B10): een langere boodschap krijgt een beletselteken in plaats
 * van een tweede regel, zodat de header niet om de 6 s van hoogte wisselt.
 */
export function ServiceBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % SERVICE_BAR.length), 6000);
    return () => window.clearInterval(t);
  }, [paused]);

  const m = SERVICE_BAR[i];
  return (
    <div
      className="on-dark bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="shell flex h-[30px] items-center justify-center text-center text-[13px] sm:text-[14px]">
        <Link href={m.href} className="block w-full min-w-0 truncate leading-[30px] hover:underline" title={`${m.text} ${m.strong}`}>
          {m.text} <strong className="font-semibold">{m.strong}</strong>
        </Link>
      </div>
    </div>
  );
}
