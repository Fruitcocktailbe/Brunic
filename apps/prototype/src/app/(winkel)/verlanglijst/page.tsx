import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { WishlistView } from "@/components/commerce/wishlist-view";

export const metadata: Metadata = { title: "Mijn verlanglijst", robots: { index: false, follow: true } };

export default function WishlistPage() {
  return (
    <div className="shell-inset">
      <Breadcrumbs items={[{ label: "Mijn verlanglijst" }]} />
      <h1 className="py-3 font-display text-[34px] leading-tight lg:text-[44px]">Mijn verlanglijst</h1>
      <div className="mt-4">
        <WishlistView />
      </div>
    </div>
  );
}
