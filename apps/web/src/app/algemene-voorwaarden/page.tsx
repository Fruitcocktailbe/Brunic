import type { Metadata } from "next";
import { JuridischePlaatshouder } from "@/components/juridische-plaatshouder";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  robots: { index: false, follow: true },
};

export default function VoorwaardenPage() {
  return <JuridischePlaatshouder titel="Algemene voorwaarden" />;
}
