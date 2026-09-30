import type { ReactNode } from "react";
import { catalog } from "@/lib/catalog/repository";
import { toMenu } from "@/lib/catalog/menu";
import { MAIN_NAV } from "@/lib/site/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/** Header + inhoud + footer. Het menu wordt server-side uit de categorieboom gebouwd. */
export async function ShopChrome({ children }: { children: ReactNode }) {
  const menu = toMenu(await catalog.getTree());
  const heeftAanbiedingen = (await catalog.getOffers(1)).length > 0;
  const nav = MAIN_NAV.filter((n) => !n.alleenMetAanbiedingen || heeftAanbiedingen);
  return (
    <>
      <SiteHeader menu={menu} nav={nav} />
      <main id="inhoud" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
