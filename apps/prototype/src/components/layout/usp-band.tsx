import { Icon, type IconName } from "@/components/ui/icon";

/** Diensten/sterktes van Brunic (design-brief §1–2). */
export const USPS: { icon: IconName; text: string }[] = [
  { icon: "chat", text: "Persoonlijk advies in onze winkel" },
  { icon: "ruler", text: "Gratis opmeting aan huis" },
  { icon: "scissors", text: "Maatwerk uit eigen atelier" },
  { icon: "home", text: "Plaatsing door onze eigen mensen" },
  { icon: "store", text: "Afhalen in Ninove of levering aan huis" },
  { icon: "heart", text: "Familiebedrijf, al 40 jaar in Ninove" },
];

export function UspBand({ variant = "plain", count = 6 }: { variant?: "plain" | "card"; count?: number }) {
  const items = USPS.slice(0, count);
  return (
    <ul
      role="list"
      className={`grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 ${count >= 6 ? "xl:grid-cols-6" : "xl:grid-cols-5"} ${
        variant === "card" ? "rounded-[var(--radius-tile)] bg-white p-6 shadow-[0_4px_24px_-8px_rgb(19_12_12/0.12)] ring-1 ring-line md:p-8" : ""
      }`}
    >
      {items.map((u) => (
        <li key={u.text} className="flex flex-col gap-3 text-[15px] leading-snug text-ink-80">
          <Icon name={u.icon} size={30} strokeWidth={1.4} className="text-ink" />
          {u.text}
        </li>
      ))}
    </ul>
  );
}
