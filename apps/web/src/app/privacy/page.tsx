import type { Metadata } from "next";
import { JuridischePlaatshouder } from "@/components/juridische-plaatshouder";

export const metadata: Metadata = {
  title: "Privacybeleid",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <JuridischePlaatshouder titel="Privacybeleid" />;
}
