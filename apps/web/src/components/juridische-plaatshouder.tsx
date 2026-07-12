/**
 * Plaatshouder voor de juridische pagina's. Bewust GÉÉN juridische tekst — die wordt
 * met Brunic opgesteld en bevestigd vóór ze hier komt. Tot dan: "in opmaak" + noindex.
 */
export function JuridischePlaatshouder({ titel }: { titel: string }) {
  return (
    <div className="mx-auto max-w-(--container-brunic) px-6 py-16">
      <h1 className="text-4xl">{titel}</h1>
      <div className="mt-6 max-w-[62ch] rounded-m border border-dashed border-line bg-ivory-2 p-8">
        <p className="font-display text-xl text-ink">Deze pagina is in opmaak.</p>
        <p className="mt-2 text-ink-soft">
          De definitieve tekst wordt hier binnenkort toegevoegd, in overleg met en na
          bevestiging door Brunic. <em>(Wordt vervolgd.)</em>
        </p>
        <p className="mt-4 text-ink-soft">
          Een vraag in tussentijd? Bel{" "}
          <a href="tel:+3254337352" className="font-bold text-brand-text hover:underline">
            054 33 73 52
          </a>{" "}
          of mail{" "}
          <a href="mailto:info@brunic.be" className="font-bold text-brand-text hover:underline">
            info@brunic.be
          </a>
          .
        </p>
      </div>
    </div>
  );
}
