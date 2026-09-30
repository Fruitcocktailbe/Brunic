import type { ReactNode } from "react";
import { Icon } from "./icon";

/** Uitklapbaar blok op basis van <details> — werkt zonder JS en met toetsenbord. */
export function Accordion({
  title,
  children,
  defaultOpen = false,
  variant = "card",
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: "card" | "line";
}) {
  const shell =
    variant === "card" ? "rounded-[var(--radius-tile)] border border-line-strong/60 bg-white" : "border-b border-line";
  return (
    <details className={`group ${shell}`} open={defaultOpen}>
      <summary
        className={`flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden ${
          variant === "card" ? "px-6 py-5 text-base" : "px-1 py-4 text-[15px]"
        }`}
      >
        <span>{title}</span>
        <Icon name="chevronDown" size={20} className="shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className={variant === "card" ? "px-6 pb-6 text-ink-80" : "px-1 pb-5 text-ink-80"}>{children}</div>
    </details>
  );
}
