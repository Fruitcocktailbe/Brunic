import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "@/data/content";
import { catalog } from "@/lib/catalog/repository";
import { toCard } from "@/lib/catalog/view";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ImageSlot } from "@/components/ui/image-slot";
import { Carousel } from "@/components/ui/carousel";
import { ProductCard } from "@/components/catalog/product-card";
import { ArticleCard, formatDate } from "@/components/content/article-card";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/site/seo";
import { SITE } from "@/lib/site/config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTICLES.find((x) => x.slug === slug);
  return a
    ? {
        title: a.title,
        description: a.excerpt,
        alternates: { canonical: routes.article(a.slug) },
        openGraph: { type: "article", publishedTime: a.date, images: [{ url: a.image.src, alt: a.image.alt }] },
      }
    : { title: "Artikel niet gevonden" };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const tree = await catalog.getTree();
  const cat = tree.byId.get(article.relatedCategoryId);
  const products = cat ? (await catalog.getProductsInCategory(cat.id)).sort((a, b) => b.popularity - a.popularity).slice(0, 8).map(toCard) : [];
  const more = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="shell-inset">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: [article.image.src],
          datePublished: article.date,
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo-kleur.png") } },
          mainEntityOfPage: absoluteUrl(routes.article(article.slug)),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Inspiratie & advies", path: routes.inspiration() },
          { name: article.title, path: routes.article(article.slug) },
        ])}
      />
      <Breadcrumbs
        items={[
          { label: "Inspiratie & advies", href: routes.inspiration() },
          { label: article.topic, href: routes.inspiration(article.topic) },
          { label: article.title },
        ]}
      />
      <article>
        <header className="mx-auto max-w-[820px] py-4 text-center">
          <p className="text-[13px] text-ink-60">
            <Link href={routes.inspiration(article.topic)} className="rounded-full bg-sand px-2.5 py-0.5 font-medium text-ink hover:underline">
              {article.topic}
            </Link>{" "}
            · {formatDate(article.date)} · {article.readingMinutes} min lezen
          </p>
          <h1 className="mt-4 font-display text-[34px] leading-tight lg:text-[52px]">{article.title}</h1>
          <p className="mt-4 text-lg text-ink-80">{article.excerpt}</p>
        </header>
        <ImageSlot src={article.image.src} alt={article.image.alt} priority sizes="100vw" className="mt-6 aspect-[16/9] w-full rounded-[var(--radius-tile)] lg:aspect-[21/9]" />
        <div className="prose-brunic mx-auto mt-10 max-w-[720px]">
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ))}
          <div className="mt-10 rounded-[var(--radius-tile)] bg-sand p-6">
            <p className="!mb-2 font-medium !text-ink">Advies nodig voor uw interieur?</p>
            <p className="!mb-4">Kom langs in onze winkel of vraag een opmeting aan huis aan.</p>
            <Link href={routes.measurement()} className="btn btn-primary btn-sm">
              Opmeting aanvragen
            </Link>
          </div>
        </div>
      </article>

      {products.length > 0 && cat && (
        <section aria-labelledby="producten-artikel" className="mt-16">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="producten-artikel" className="text-xl font-medium lg:text-2xl">
              Uit onze collectie {cat.name.toLowerCase()}
            </h2>
            <Link href={routes.category(cat)} className="btn btn-outline btn-sm">
              Alles bekijken
            </Link>
          </div>
          <Carousel label={`Producten ${cat.name}`}>
            {products.map((c, i) => (
              <ProductCard key={c.id} product={c} tone={i} />
            ))}
          </Carousel>
        </section>
      )}

      <section aria-labelledby="meer-lezen" className="mt-16">
        <h2 id="meer-lezen" className="section-title mb-8">
          Meer inspiratie
        </h2>
        <ul role="list" className="grid gap-x-4 gap-y-10 md:grid-cols-3">
          {more.map((a, i) => (
            <li key={a.slug}>
              <ArticleCard article={a} tone={i} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
