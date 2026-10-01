import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES, WERKWIJZE } from "@/data/content";
import { routes } from "@/lib/routes";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CategoryHeader } from "@/components/catalog/category-header";
import { OverlayCard } from "@/components/home/overlay-card";
import { ImageSlot } from "@/components/ui/image-slot";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Op maat & plaatsing",
  description: "Gordijnen op maat uit eigen atelier, raamdecoratie, vasttapijt en behang: Brunic adviseert, meet gratis op en plaatst met eigen mensen.",
  alternates: { canonical: "/op-maat-en-plaatsing" },
};

export default function ServicesPage() {
  const [first, second, ...rest] = SERVICES;
  return (
    <div className="shell-inset">
      <Breadcrumbs items={[{ label: "Op maat & plaatsing" }]} />
      <CategoryHeader
        title="Op maat & plaatsing"
        intro="Van advies in de winkel tot opmeting, maakwerk en plaatsing bij u thuis. Gordijnen maken we in ons eigen atelier, door onze eigen stiksters; opmeten en plaatsen doen onze eigen mensen. Zo heeft u één aanspreekpunt, van eerste idee tot het laatste detail."
      />

      <div className="mt-6 grid gap-2 md:grid-cols-2">
        {[first, second].map((s, i) => (
          <OverlayCard key={s.slug} href={routes.service(s.slug)} title={s.title} cta="Meer weten" image={s.image} tone={i} className="aspect-[4/5] md:aspect-[4/3]" />
        ))}
      </div>

      <ul role="list" className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((s, i) => (
          <li key={s.slug}>
            <Link href={routes.service(s.slug)} className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-tile)] border border-line bg-white transition-colors hover:border-line-strong">
              <ImageSlot src={s.image.src} alt="" tone={i + 1} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full" imgClassName="transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="flex flex-1 flex-col p-5">
                <span className="text-lg font-medium">{s.title}</span>
                <span className="mt-1 flex-1 text-[14px] text-ink-80">{s.summary}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium">
                  Meer weten <Icon name="arrowRight" size={18} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="werkwijze" className="mt-16 rounded-[var(--radius-pill)] bg-sand p-6 md:p-10">
        <h2 id="werkwijze" className="section-title">
          Zo werken we
        </h2>
        <p className="mt-3 text-center text-base text-ink-80">Voor gordijnen, raamdecoratie en vasttapijt — van eerste advies tot plaatsing.</p>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {WERKWIJZE.map((st, i) => (
            <li key={st.title} className="rounded-[var(--radius-tile)] bg-white p-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{i + 1}</span>
              <p className="mt-4 text-lg font-medium">{st.title}</p>
              <p className="mt-1 text-[14px] text-ink-80">{st.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={routes.measurement()} className="btn btn-primary">
            Opmeting aanvragen
          </Link>
          <Link href={routes.store()} className="btn btn-outline">
            Kom langs in de winkel
          </Link>
        </div>
      </section>
    </div>
  );
}
