"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SERVICE_BAR } from "@/lib/site/config";

/** Zwarte servicebalk bovenaan (roterende boodschap; stopt bij hover/focus en bij reduced motion). */
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
      <div className="shell flex min-h-[30px] items-center justify-center py-1 text-center text-[13px] leading-tight sm:text-[14px]">
        <Link href={m.href} className="hover:underline">
          {m.text} <strong className="font-semibold">{m.strong}</strong>
        </Link>
      </div>
    </div>
  );
}
