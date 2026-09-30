import Link from "next/link";
import { Suspense } from "react";
import { catalog } from "@/lib/catalog/repository";
import { routes } from "@/lib/routes";
import { SearchBox } from "@/components/layout/search-box";

/** Inhoud van de 404-pagina: uitleg, zoekveld, afdelingen, terug naar home. */
export async function NotFoundContent() {
  const tree = await catalog.getTree();
  return (
    <div className="shell-inset py-12 lg:py-20">
      <div className="mx-auto max-w-[720px] text-center">
        <p className="font-display text-[80px] leading-none text-brand lg:text-[120px]">404</p>
        <h1 className="mt-4 font-display text-[32px] leading-tight lg:text-[44px]">Deze pagina bestaat niet (meer)</h1>
        <p className="mt-3 text-base text-ink-80">Misschien werd ze verplaatst of hernoemd. Zoek hieronder verder of kies een afdeling — of ga terug naar de startpagina.</p>
        <div className="mx-auto mt-8 max-w-[560px] text-left">
          <Suspense>
            <SearchBox />
          </Suspense>
        </div>
        <ul role="list" className="mt-8 flex flex-wrap justify-center gap-2">
          {tree.roots.map((r) => (
            <li key={r.id}>
              <Link href={routes.category(r)} className="flex min-h-11 items-center rounded-full border border-line-strong/60 px-5 text-[14px] font-medium hover:border-ink">
                {r.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={routes.home()} className="btn btn-primary mt-10">
          Naar de startpagina
        </Link>
      </div>
    </div>
  );
}
