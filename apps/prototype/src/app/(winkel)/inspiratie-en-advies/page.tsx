import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, ARTICLE_TOPICS } from "@/data/content";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CategoryHeader } from "@/components/catalog/category-header";
import { ArticleCard } from "@/components/content/article-card";

export const metadata: Metadata = {
  title: "Inspiratie & advies",
  description: "Tips en inspiratie van Brunic over gordijnen, behang, vasttapijt en tapijten: kiezen, combineren en onderhouden.",
  alternates: { canonical: "/inspiratie-en-advies" },
};

type Props = { searchParams: Promise<{ thema?: string }> };

export default async function InspirationPage({ searchParams }: Props) {
  const thema = (await searchParams).thema;
  const active = ARTICLE_TOPICS.find((t) => t === thema);
  const list = active ? ARTICLES.filter((a) => a.topic === active) : ARTICLES;
  const [featured, ...rest] = list;

  return (
    <div className="shell-inset">
      <Breadcrumbs items={active ? [{ label: "Inspiratie & advies", href: routes.inspiration() }, { label: active }] : [{ label: "Inspiratie & advies" }]} />
      <CategoryHeader
        title={active ? `Inspiratie: ${active}` : "Inspiratie & advies"}
        intro="Ideeën, stijladvies en praktische tips van ons team: van de juiste gordijnstof en tapijtmaat tot kleuren combineren en onderhoud. Liever persoonlijk advies? Kom langs in onze winkel of vraag een gratis opmeting aan huis aan."
      />

      <nav aria-label="Thema's" className="mt-4">
        <ul role="list" className="flex flex-wrap gap-2">
          <li>
            <Link
              href={routes.inspiration()}
              aria-current={!active ? "page" : undefined}
              className={`flex min-h-11 items-center rounded-full border px-5 text-[14px] font-medium ${!active ? "border-ink bg-ink text-white" : "border-line-strong/60 hover:border-ink"}`}
            >
              Alles
            </Link>
          </li>
          {ARTICLE_TOPICS.map((t) => (
            <li key={t}>
              <Link
                href={routes.inspiration(t)}
                aria-current={active === t ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-full border px-5 text-[14px] font-medium ${active === t ? "border-ink bg-ink text-white" : "border-line-strong/60 hover:border-ink"}`}
              >
                {t}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {featured ? (
        <>
          <div className="mt-8">
            <ArticleCard article={featured} large />
          </div>
          <ul role="list" className="mt-12 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <li key={a.slug}>
                <ArticleCard article={a} tone={i + 1} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-10 rounded-[var(--radius-tile)] bg-cloud p-10 text-center">Nog geen artikels in dit thema.</p>
      )}
    </div>
  );
}
