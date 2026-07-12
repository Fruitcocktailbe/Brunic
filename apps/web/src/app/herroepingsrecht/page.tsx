import type { Metadata } from "next";
import { JuridischePlaatshouder } from "@/components/juridische-plaatshouder";

export const metadata: Metadata = {
  title: "Herroepingsrecht",
  robots: { index: false, follow: true },
};

export default function HerroepingsrechtPage() {
  return <JuridischePlaatshouder titel="Herroepingsrecht" />;
}
