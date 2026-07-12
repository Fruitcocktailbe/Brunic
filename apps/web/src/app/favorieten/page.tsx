import type { Metadata } from "next";
import { Winkellijst } from "@/components/winkellijst";

export const metadata: Metadata = {
  title: "Favorieten & winkellijst",
  description:
    "Uw bewaarde favorieten als meeneemdocument met artikelnummer: toon het in de winkel of plan een opmeting.",
  // Persoonlijke lijst: nooit indexeren.
  robots: { index: false, follow: false },
};

export default function FavorietenPage() {
  return (
    <div className="mx-auto max-w-(--container-brunic) px-6 py-10">
      <header className="fav-kop mb-8">
        <p className="mb-3 flex items-center gap-3 text-[0.82rem] font-bold uppercase tracking-[0.14em] text-brand-text">
          <span className="h-[3px] w-[26px] rounded-[2px] bg-brand" />
          Uw winkellijst
        </p>
        <h1 className="text-4xl">Favorieten &amp; meeneemdocument</h1>
        <p className="mt-3 max-w-[58ch] text-ink-soft">
          Bewaar uw favorieten en neem uw lijst mee naar de winkel — mét artikelnummer, zodat
          Sandra elk stuk meteen terugvindt aan de toonbank.
        </p>
      </header>

      <Winkellijst />
    </div>
  );
}
