import type { Metadata } from "next";
import { OpmetingForm } from "@/components/opmeting-form";

export const metadata: Metadata = {
  title: "Gratis opmeting aanvragen",
  description:
    "Vraag een gratis opmeting aan huis aan. Beschrijf uw project — wij bellen u binnen 1–2 werkdagen. Vrijblijvend, door onze eigen mensen.",
  alternates: { canonical: "/opmeting" },
};

const TROEVEN = [
  "Volledig gratis en vrijblijvend",
  "Door onze eigen mensen — geen onderaanneming",
  "Gordijnen uit ons eigen atelier in Ninove",
  "Al 40 jaar advies, opmeting én plaatsing aan huis",
];

export default function OpmetingPage() {
  return (
    <>
      <section className="on-red stripes-light bg-brand-deep text-white">
        <div className="mx-auto max-w-(--container-brunic) px-6 py-12">
          <p className="mb-3 flex items-center gap-3 text-[0.82rem] font-bold uppercase tracking-[0.14em]">
            <span className="h-[3px] w-[26px] rounded-[2px] bg-geel" />
            Gratis &amp; vrijblijvend
          </p>
          <h1 className="max-w-[20ch] text-4xl text-white sm:text-5xl">
            Plan een gratis opmeting aan huis
          </h1>
          {/* #FFE3E0 op #A81412 = 6,2:1 — AA */}
          <p className="mt-3 max-w-[54ch] text-lg" style={{ color: "#FFE3E0" }}>
            Beschrijf kort uw project. Onze eigen mensen komen bij u langs, meten op en adviseren —
            u zit nergens aan vast. Wij bellen u binnen 1–2 werkdagen.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-(--container-brunic) gap-10 px-6 py-12 lg:grid-cols-[1.5fr_.9fr] lg:items-start">
        <OpmetingForm />

        <aside className="grid gap-5 lg:sticky lg:top-6">
          <div className="rounded-m border border-line bg-ivory-2 p-6">
            <h2 className="font-display text-xl">Waarom een opmeting bij Brunic?</h2>
            <ul className="mt-4 grid gap-3">
              {TROEVEN.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-1 flex-none text-brand"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-m border border-line bg-ivory-2 p-6">
            <h2 className="font-display text-xl">Liever bellen?</h2>
            <a
              href="tel:+3254337352"
              className="mt-2 block font-display text-2xl font-extrabold text-brand-text hover:underline"
            >
              054 33 73 52
            </a>
            <p className="mt-1 text-sm text-ink-soft">Ma–Za 9–18u · zondag gesloten</p>
            <p className="text-sm text-ink-soft">Ring-West 19, 9400 Ninove</p>
          </div>
        </aside>
      </div>
    </>
  );
}
