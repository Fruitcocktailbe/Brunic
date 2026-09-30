import Link from "next/link";
import { catalog } from "@/lib/catalog/repository";
import { toCard } from "@/lib/catalog/view";
import { getBrands } from "@/lib/catalog/brands";
import { sfeerfoto } from "@/lib/catalog/imagery";
import { routes } from "@/lib/routes";
import { resolveDoel } from "@/lib/site/doel";
import { SITE } from "@/lib/site/config";
import { localBusinessJsonLd } from "@/lib/site/seo";
import { CAMPAIGNS, HERO, INSPIRATION_TILES, SMALL_TILES, TRENDS } from "@/data/home";
import { Hero } from "@/components/home/hero";
import { DepartmentTiles } from "@/components/home/department-tiles";
import { Section } from "@/components/home/section";
import { OverlayCard } from "@/components/home/overlay-card";
import { CategoryTile } from "@/components/catalog/category-tile";
import { BrandTile } from "@/components/catalog/brand-tile";
import { ProductCard } from "@/components/catalog/product-card";
import { Carousel } from "@/components/ui/carousel";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";

/** Tegels waarvan het doel (categorie, product, artikel) bestaat, met hun URL. */
async function metHref<T extends { doel: Parameters<typeof resolveDoel>[0] }>(items: T[]) {
  const out: (T & { href: string })[] = [];
  for (const it of items) {
    const href = await resolveDoel(it.doel);
    if (href) out.push({ ...it, href });
  }
  return out;
}

export default async function HomePage() {
  const tree = await catalog.getTree();
  // Nieuw binnen: afwisselend uit elke afdeling, producten met een sfeerfoto eerst — anders
  // toont de homepage tien stalen van dezelfde tapijttegel-collectie.
  const perAfdeling = new Map<string, Awaited<ReturnType<typeof catalog.getNewArrivals>>>();
  for (const p of await catalog.getNewArrivals()) {
    const root = (await catalog.getCategoryTrail(p.primaryCategoryId))[0]?.id ?? "";
    perAfdeling.set(root, [...(perAfdeling.get(root) ?? []), p]);
  }
  const rijen = [...perAfdeling.values()];
  const gemengd = Array.from({ length: Math.max(0, ...rijen.map((r) => r.length)) }, (_, i) => rijen.map((r) => r[i])).flat().filter((p) => p !== undefined);
  const newArrivals = [...gemengd.filter((p) => sfeerfoto(p)), ...gemengd.filter((p) => !sfeerfoto(p))].slice(0, 10).map(toCard);
  const campaigns = await metHref(CAMPAIGNS);
  const trends = await metHref(TRENDS);
  const small = await metHref(SMALL_TILES);
  const heroHref = (await resolveDoel(HERO.cta.doel)) ?? routes.catalog();

  // Beelden die al op de homepage staan, niet nog eens als merkbeeld tonen.
  const gebruikt = new Set([HERO.image, ...campaigns.map((c) => c.image), ...trends.map((t) => t.image), ...small.map((s) => s.image), ...INSPIRATION_TILES.map((t) => t.image)].map((i) => i.src.split("?")[0]));
  const brands = (await getBrands()).map((b) => {
    const eigen = b.products.flatMap((p) => p.images.filter((i) => / – sfeerfoto/.test(i.alt))).find((i) => !gebruikt.has(i.src.split("?")[0]));
    return { ...b, image: eigen ?? b.image };
  });

  const heroLinks = [...tree.roots.map((c) => ({ label: c.name, href: routes.category(c) })), { label: "Alle merken", href: routes.brands() }];

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Hero ticket={HERO.ticket} title={HERO.title} subtitle={HERO.subtitle} cta={{ label: HERO.cta.label, href: heroHref }} secondary={HERO.secondary} image={HERO.image} links={heroLinks} />

      <Section id="afdelingen" title="Welkom in onze afdelingen" subtitle="Stoffen, behang, vloeren en tapijten — met het advies van onze winkel in Ninove.">
        <DepartmentTiles />
      </Section>

      <Section id="selecties" title="Onze selecties">
        <div className="grid gap-2 md:grid-cols-2">
          {campaigns.map((c, i) => (
            <OverlayCard key={c.title} href={c.href} title={c.title} subtitle={c.subtitle} cta={c.cta} image={c.image} tone={i} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] md:aspect-[668/680]" />
          ))}
        </div>
      </Section>

      {newArrivals.length > 0 && (
        <Section id="nieuw" title="Nieuw binnen" cta={{ label: "Alle nieuwigheden", href: routes.newArrivals() }}>
          <Carousel label="Nieuw binnen">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} tone={i} />
            ))}
          </Carousel>
        </Section>
      )}

      <Section id="trends" title="De trends van het moment">
        <div className="grid gap-2 md:grid-cols-3">
          {trends.map((t, i) => (
            <OverlayCard key={t.title} href={t.href} title={t.title} cta={t.cta} image={t.image} tone={i} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5] md:aspect-[443/553]" />
          ))}
        </div>
      </Section>

      {/* Winkelbezoek uitlokken (design-brief §2): de winkel is het ankerpunt. */}
      <section aria-labelledby="winkel" className="shell mt-16 lg:mt-24">
        <div className="grid gap-8 rounded-[var(--radius-pill)] bg-sand p-6 md:grid-cols-[1.3fr_1fr] md:items-center md:p-10 lg:p-14">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-wide text-ink-60">Familiebedrijf sinds 1992</p>
            <h2 id="winkel" className="mt-2 font-display text-[32px] leading-tight lg:text-[44px]">
              Kom langs in onze winkel in {SITE.address.city}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-80">
              Voel de stoffen, bekijk de stalenboeken en krijg persoonlijk advies. Bewaar vooraf uw favorieten op uw verlanglijst en neem ze mee — zo vinden we
              samen snel wat bij uw interieur past.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Icon name="pin" size={20} /> Route plannen
              </a>
              <Link href={routes.store()} className="btn btn-outline">
                Openingsuren & contact
              </Link>
            </div>
          </div>
          <dl className="grid gap-4 rounded-[var(--radius-tile)] bg-white p-6 text-[15px]">
            <div>
              <dt className="font-medium">Adres</dt>
              <dd className="text-ink-80">
                {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Openingsuren</dt>
              {SITE.hours.map((h) => (
                <dd key={h.days} className="flex justify-between gap-4 text-ink-80">
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </dd>
              ))}
            </div>
            <div>
              <dt className="font-medium">Telefoon</dt>
              <dd>
                <a href={SITE.phone.href} className="text-ink-80 underline underline-offset-2 hover:text-ink">
                  {SITE.phone.display}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Section id="inspiratie" title="Op zoek naar inspiratie?" cta={{ label: "Alle tips & inspiratie", href: routes.inspiration() }}>
        <div className="grid grid-cols-2 gap-1 lg:grid-cols-4">
          {INSPIRATION_TILES.map((t, i) => (
            <CategoryTile key={t.title} href={t.href} title={t.title} image={t.image} tone={i} size="lg" className="aspect-[4/5]" />
          ))}
        </div>
      </Section>

      {brands.length > 0 && (
        <Section id="merken" title="Onze merken" cta={{ label: "Alle merken", href: routes.brands() }}>
          <Carousel label="Onze merken" itemClassName="w-[70%] xs:w-[44%] md:w-[30%] lg:w-[23.4%]">
            {brands.map((b, i) => (
              <BrandTile key={b.slug} href={routes.brand(b.slug)} name={b.name} image={b.image} logo={b.logo} tone={i} className="aspect-[4/5] w-full" />
            ))}
          </Carousel>
        </Section>
      )}
    </>
  );
}
