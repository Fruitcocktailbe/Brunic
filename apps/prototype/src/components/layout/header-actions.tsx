"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { useCart, useWishlist } from "@/lib/store/stores";
import { routes } from "@/lib/routes";

function Action({
  href,
  icon,
  label,
  count,
  showLabel,
  alwaysShowCount = false,
}: {
  href: string;
  icon: IconName;
  label: string;
  count?: number;
  showLabel: boolean;
  alwaysShowCount?: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-2 text-[14px] font-medium text-ink-80 hover:bg-mist xl:px-3"
      aria-label={count !== undefined ? `${label} (${count})` : label}
    >
      {showLabel && <span className="hidden xl:inline">{label}</span>}
      <span className="relative">
        <Icon name={icon} size={26} />
        {count !== undefined && (count > 0 || alwaysShowCount) && (
          <span className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
    </Link>
  );
}

/** Winkeliconen rechts in de header: hulp, verlanglijst, winkelmand (geen klantaccounts: niet nodig voor offertes). */
export function HeaderActions({ compact = false }: { compact?: boolean }) {
  const cart = useCart();
  const wish = useWishlist();
  return (
    <div className="flex items-center gap-0.5 xl:gap-1">
      {!compact && <Action href={routes.store("hulp")} icon="help" label="Hulp & contact" showLabel />}
      <Action href={routes.wishlist()} icon="heart" label="Verlanglijst" count={wish.hydrated ? wish.count : undefined} showLabel={!compact} />
      <Action href={routes.cart()} icon="bag" label="Winkelmand" count={cart.hydrated ? cart.count : 0} showLabel={!compact} alwaysShowCount />
    </div>
  );
}
