import type { Metadata } from "next";
import { JuridischePlaatshouder } from "@/components/juridische-plaatshouder";

export const metadata: Metadata = {
  title: "Retourbeleid",
  robots: { index: false, follow: true },
};

export default function RetourbeleidPage() {
  return <JuridischePlaatshouder titel="Retourbeleid" />;
}
