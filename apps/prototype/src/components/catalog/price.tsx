import type { Price as PriceT, SalesUnit } from "@/lib/catalog/types";
import type { CardProduct } from "@/lib/catalog/view";
import { discountPercent, formatMoney, UNIT_SUFFIX } from "@/lib/catalog/product";

/**
 * Prijsweergave zoals de referentie: vetgedrukte prijs, doorstreepte
 * vergelijkingsprijs, kortingschip. Eenheid (per m, m², rol) na de prijs.
 * Producten op aanvraag tonen geen prijs.
 */
export function Price({
  card,
  price,
  pricing,
  fromPrice,
  size = "md",
  className = "",
}: {
  card?: Pick<CardProduct, "price" | "pricing" | "fromPrice">;
  price?: PriceT | null;
  pricing?: "fixed" | "on-request";
  fromPrice?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const p = card?.price ?? price ?? null;
  const mode = card?.pricing ?? pricing ?? "fixed";
  const from = card?.fromPrice ?? fromPrice ?? false;

  if (mode === "on-request" || !p) {
    return <p className={`${size === "lg" ? "text-lg" : "text-sm"} font-medium text-ink-80 ${className}`}>Prijs op aanvraag</p>;
  }
  const pct = discountPercent(p);
  const main = size === "lg" ? "text-[22px]" : size === "sm" ? "text-sm" : "text-[17px]";
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      <span className={`${main} font-semibold tracking-tight`}>
        {from && <span className="mr-1 text-[0.8em] font-normal text-ink-60">vanaf</span>}
        {formatMoney(p.amount.amount)}
        <UnitSuffix unit={p.unit} />
      </span>
      {p.compareAt && (
        <s className={`${size === "sm" ? "text-xs" : "text-[13px]"} text-ink-60`} aria-label={`Oorspronkelijke prijs ${formatMoney(p.compareAt.amount)}`}>
          {formatMoney(p.compareAt.amount)}
        </s>
      )}
      {pct !== null && (
        <span className="inline-flex min-h-6 items-center rounded-[14px] bg-attention-bg px-2 text-xs text-attention">-{pct}%</span>
      )}
    </p>
  );
}

function UnitSuffix({ unit }: { unit: SalesUnit }) {
  const s = UNIT_SUFFIX[unit];
  if (!s) return null;
  return <span className="ml-1 text-[0.72em] font-normal text-ink-60">{s}</span>;
}
