import { ReadMore } from "@/components/ui/read-more";

/** Titel + intro met "Meer lezen" (referentie: "Canapé" + "Voir plus"). */
export function CategoryHeader({ title, intro, eyebrow }: { title: string; intro?: string; eyebrow?: string }) {
  return (
    <div className="py-3">
      {eyebrow && <p className="mb-1 text-[13px] font-medium uppercase tracking-wide text-ink-60">{eyebrow}</p>}
      <h1 className="font-display text-[34px] leading-tight lg:text-[44px]">{title}</h1>
      {intro && <ReadMore text={intro} className="mt-3 max-w-[1296px]" />}
    </div>
  );
}
