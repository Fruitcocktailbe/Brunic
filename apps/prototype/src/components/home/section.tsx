import Link from "next/link";
import type { ReactNode } from "react";

/** Homepagesectie: gecentreerde serif-titel (+ subtitel), inhoud, optionele zwarte pilknop. */
export function Section({
  id,
  title,
  subtitle,
  children,
  cta,
  className = "",
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  cta?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`shell mt-16 lg:mt-24 ${className}`}>
      <div className="mb-8 lg:mb-10">
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {subtitle && <p className="mt-3 text-center text-base text-ink-80">{subtitle}</p>}
      </div>
      {children}
      {cta && (
        <div className="mt-8 flex justify-center">
          <Link href={cta.href} className="btn btn-primary">
            {cta.label}
          </Link>
        </div>
      )}
    </section>
  );
}
