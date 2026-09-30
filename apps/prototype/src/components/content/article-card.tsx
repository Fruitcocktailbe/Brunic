import Link from "next/link";
import type { Article } from "@/data/content";
import { routes } from "@/lib/routes";
import { ImageSlot } from "@/components/ui/image-slot";

const dateFmt = new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "long", year: "numeric" });

export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso));
}

export function ArticleCard({ article, tone = 0, large = false }: { article: Article; tone?: number; large?: boolean }) {
  return (
    <Link href={routes.article(article.slug)} className="group flex h-full flex-col">
      <ImageSlot
        src={article.image.src}
        alt=""
        tone={tone}
        sizes={large ? "100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        className={`w-full rounded-[var(--radius-tile)] ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}
        imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <span className="mt-4 flex items-center gap-2 text-[13px] text-ink-60">
        <span className="rounded-full bg-sand px-2.5 py-0.5 font-medium text-ink">{article.topic}</span>
        {formatDate(article.date)} · {article.readingMinutes} min lezen
      </span>
      <span className={`mt-2 font-display leading-tight group-hover:underline ${large ? "text-[30px] lg:text-[36px]" : "text-[22px]"}`}>{article.title}</span>
      <span className="mt-2 text-[15px] text-ink-80">{article.excerpt}</span>
    </Link>
  );
}
