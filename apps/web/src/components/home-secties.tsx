import Image from "next/image";
import Link from "next/link";

/** Kicker met het rode streepje — herbruikt over de homepage-secties. */
export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-brand-text">
      <span className="h-[3px] w-[26px] rounded-[2px] bg-brand" />
      {children}
    </p>
  );
}

const USPS = [
  {
    titel: "Opmeting aan huis",
    sub: "Gratis bij aankoop, in de hele Denderstreek",
    path: "M3 17 17 3l4 4L7 21H3v-4Z",
  },
  {
    titel: "Eigen atelier & stiksters",
    sub: "Maatwerk dat hier gemaakt wordt",
    path: "M12 3v4M12 7c-4 0-7 2.5-7 7 0 4 3 7 7 7s7-3 7-7c0-4.5-3-7-7-7Z",
  },
  {
    titel: "Eigen plaatsing & levering",
    sub: "Door onze mensen, niet uitbesteed",
    path: "M1 8h13v9H1zM14 11h4l4 3v3h-8",
  },
  {
    titel: "Al 40 jaar in Ninove",
    sub: "Een familiezaak, een begrip in de streek",
    path: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 12 8.5 8.5M12 12l2.5 5",
  },
];

export function UspBand() {
  return (
    <section aria-label="Waarom Brunic" className="border-y border-line bg-ivory-2">
      <ul className="mx-auto grid max-w-(--container-brunic) gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {USPS.map((u) => (
          <li key={u.titel} className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 flex-none text-brand" aria-hidden="true">
              <path d={u.path} />
            </svg>
            <div>
              <strong className="block">{u.titel}</strong>
              <span className="text-sm text-ink-soft">{u.sub}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const TEGELS = [
  { titel: "Behang", sub: "2.691 dessins, vlies vooraan", href: "/behang", img: "https://brunic.be/wp-content/uploads/2023/05/Z80001.jpg" },
  { titel: "Vloerbekleding", sub: "Vinyl, laminaat & vasttapijt", href: "/vloerbekleding", img: "https://brunic.be/wp-content/uploads/2021/10/1917433332.jpg" },
  { titel: "Tapijten", sub: "Zoek meteen op uw maat", href: "/tapijten", img: "https://brunic.be/wp-content/uploads/2022/05/2001916416.jpg" },
];

export function Categorietegels() {
  return (
    <section className="mx-auto max-w-(--container-brunic) px-6 py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>Verder in huis</Kicker>
          <h2 className="text-3xl">Van muur tot vloer, alles onder één dak</h2>
        </div>
        <Link href="/tapijten" className="font-bold text-brand-text underline-offset-4 hover:underline">
          Bekijk alle categorieën →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {TEGELS.map((t) => (
          <Link key={t.titel} href={t.href} className="group relative block aspect-[4/4.6] overflow-hidden rounded-m border border-line bg-ink">
            <Image
              src={t.img}
              alt={t.titel}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-14 text-white">
              <h3 className="text-2xl text-white">{t.titel}</h3>
              <p className="flex items-center gap-2 text-sm text-white/85">
                {t.sub}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Atelier() {
  return (
    <section id="atelier" className="border-y border-line bg-ivory-2">
      <div className="mx-auto grid max-w-(--container-brunic) items-center gap-10 px-6 py-16 lg:grid-cols-2">
        {/* Fotoreportage van het atelier is nog niet gemaakt (shoot volgt) — de ontworpen
            plaatshouder i.p.v. een stockfoto (design-brief §3: nooit stock). */}
        <div
          role="img"
          aria-label="Plaatshouder: hier komt de fotoreportage van ons atelier en onze stiksters"
          className="stripes-red flex aspect-[4/3.4] flex-col justify-end rounded-m border border-line bg-white p-8"
        >
          <p className="font-display text-4xl font-semibold italic leading-tight text-brand">
            Het atelier,<br />ons hart.
          </p>
          <p className="mt-3 border-t-2 border-brand pt-2 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft">
            Fotoreportage in de maak — bezoek het atelier intussen gewoon in de winkel
          </p>
        </div>

        <div>
          <Kicker>Atelier &amp; maatwerk</Kicker>
          <h2 className="text-3xl">Achter de winkel ratelen de naaimachines</h2>
          <p className="mt-3 text-ink-soft">
            Bij Brunic koopt u geen gordijnen uit een doos. Onze stiksters meten, snijden en naaien
            elke opdracht zelf — al veertig jaar, voor huiskamers én voor horeca en zorg (met
            brandvertragende projectstoffen).
          </p>
          <ul className="mt-5 grid gap-2">
            {["Advies in de winkel of bij u thuis", "Confectie in ons eigen atelier in Ninove", "Plaatsing en levering door eigen mensen"].map((c) => (
              <li key={c} className="flex items-baseline gap-3">
                <span className="font-extrabold text-brand" aria-hidden="true">—</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const STER = "m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.7 5.8 21.2l1.4-7L2 9.4l7-.8L12 2z";

const REVIEWS = [
  { quote: "Gordijnen op maat gemaakt én geplaatst — het resultaat is prachtig. Sandra kwam zelf opmeten, alles klopte tot op de centimeter.", naam: "Martine V.", plaats: "Ninove", lead: true },
  { quote: "Al jaren klant voor behang en tapijten. Eerlijk advies, correcte prijzen en levering aan huis. Zo hoort een familiezaak te werken.", naam: "Dirk & Els D.", plaats: "Denderleeuw" },
  { quote: "Ons vasttapijt werd feilloos geplaatst door hun eigen mensen. Geen onderaannemers, geen verrassingen.", naam: "Karin D.", plaats: "Geraardsbergen" },
];

export function Reviews() {
  return (
    <section aria-label="Klantbeoordelingen" className="mx-auto max-w-(--container-brunic) px-6 py-16">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex gap-0.5 text-geel" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d={STER} />
            </svg>
          ))}
        </span>
        <span className="font-display text-xl font-bold">5,0 op Google</span>
        <span className="text-ink-soft">— beoordeeld door klanten uit de Denderstreek</span>
      </div>

      {/* Eerlijk: dit zijn illustratieve quotes tot Bruno de echte Google-reviews aanlevert. */}
      <p className="mt-2 text-sm italic text-ink-soft">
        Voorbeeldquotes ter illustratie — worden vervangen door echte Google-reviews.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {REVIEWS.map((r) => (
          <figure
            key={r.naam}
            className={`rounded-m border border-line bg-white p-6 ${r.lead ? "lg:row-span-2 lg:flex lg:flex-col lg:justify-center" : ""}`}
          >
            <blockquote className={r.lead ? "font-display text-2xl italic leading-snug" : "text-ink-soft"}>
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-sm">
              <strong>{r.naam}</strong> · {r.plaats}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function OpmetingPaneel() {
  return (
    <section className="mx-auto max-w-(--container-brunic) px-6 py-8">
      {/* #A81412 (--c-red-deep): getinte teksten halen hier AA — zie PDP/opmeting. */}
      <div className="on-red stripes-light grid gap-8 rounded-l bg-brand-deep p-8 text-white shadow-l md:grid-cols-[1.2fr_1fr] md:items-center md:p-12">
        <div>
          <h2 className="text-3xl text-white">Plan een opmeting aan huis</h2>
          <p className="mt-2 max-w-[48ch]" style={{ color: "#FFE3E0" }}>
            Twijfelt u over maten, stof of afwerking? Sandra komt bij u langs, meet op en
            adviseert — gratis bij aankoop, u zit nergens aan vast.
          </p>
          <Link
            href="/opmeting"
            className="mt-6 inline-block rounded-s bg-white px-7 py-4 text-lg font-bold text-brand transition hover:bg-geel hover:text-ink"
          >
            Vraag uw opmeting aan
          </Link>
        </div>
        <ol className="grid gap-4">
          {[
            ["Beschrijf uw project", "Vertel kort wat u wilt en voeg gerust foto's toe."],
            ["Wij bellen u op", "Binnen 1–2 werkdagen, om een moment af te spreken."],
            ["Opmeting & voorstel", "Bij u thuis, met stalen en een duidelijke prijs."],
          ].map(([t, s], i) => (
            <li key={t} className="flex gap-4">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-geel font-body font-extrabold text-ink">
                {i + 1}
              </span>
              <div>
                <strong className="block text-white">{t}</strong>
                <span className="text-sm" style={{ color: "#FFD9D6" }}>
                  {s}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
