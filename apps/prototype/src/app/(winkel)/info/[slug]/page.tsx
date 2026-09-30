import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INFO_PAGES } from "@/data/content";
import { routes } from "@/lib/routes";
import { SITE } from "@/lib/site/config";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { formatDate } from "@/components/content/article-card";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return INFO_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = INFO_PAGES.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.intro.slice(0, 160), alternates: { canonical: routes.info(p.slug) } } : { title: "Pagina niet gevonden" };
}

/** Tekstpagina voor footerlinks (klantendienst, juridisch, over ons). */
export default async function InfoPage({ params }: Props) {
  const { slug } = await params;
  const page = INFO_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <div className="shell-inset">
      <Breadcrumbs items={[{ label: page.title }]} />
      <div className="mx-auto grid max-w-[1100px] gap-10 py-4 lg:grid-cols-[1fr_280px]">
        <article>
          <h1 className="font-display text-[34px] leading-tight lg:text-[44px]">{page.title}</h1>
          <p className="mt-4 text-lg text-ink-80">{page.intro}</p>
          {page.updated && <p className="mt-2 text-[13px] text-ink-60">Laatst bijgewerkt op {formatDate(page.updated)}</p>}
          <div className="prose-brunic mt-8">
            {page.sections.map((s, i) => (
              <section key={s.heading ?? i}>
                {s.heading && <h2>{s.heading}</h2>}
                {s.paragraphs.map((p, j) =>
                  p.startsWith("• ") ? (
                    <p key={j} className="!mb-1 pl-4 -indent-4">
                      {p}
                    </p>
                  ) : (
                    <p key={j}>{p}</p>
                  ),
                )}
              </section>
            ))}
          </div>
          <p className="mt-10 border-t border-line pt-6 text-[13px] text-ink-60">
            {SITE.legalName} · {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city} · {SITE.phone.display} · {SITE.email}
            {SITE.companyNumber && ` · Ondernemingsnummer ${SITE.companyNumber}`}
          </p>
        </article>
        <aside aria-label="Meer informatie" className="self-start rounded-[var(--radius-tile)] border border-line p-5">
          <p className="font-medium">Klantendienst</p>
          <ul role="list" className="mt-3 space-y-2 text-[14px]">
            {INFO_PAGES.filter((p) => p.slug !== slug).map((p) => (
              <li key={p.slug}>
                <Link href={routes.info(p.slug)} className="text-ink-80 hover:text-ink hover:underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={routes.store()} className="btn btn-primary btn-sm mt-5 w-full">
            Contact opnemen
          </Link>
        </aside>
      </div>
    </div>
  );
}
