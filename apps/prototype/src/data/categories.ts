import type { Category } from "@/lib/catalog/types";
import { BEELD } from "./beelden";

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  DE HOOFDCATEGORIEËN — naam, URL, volgorde en banner.                ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Volgorde = omzetgewicht (design-brief §4): Gordijnen & stoffen eerst.
 * Subcategorieën komen uit Shopify (collecties met het voorvoegsel van de
 * hoofdcategorie, zie src/data/shopify-bron.ts); intro's uit categorie-teksten.ts.
 *
 * Een hoofdcategorie zonder producten in Shopify wordt automatisch nergens getoond
 * (menu, tegels, catalogus, sitemap) en haar URL geeft 404 — zodra er producten in de
 * collectie staan, verschijnt ze vanzelf.
 *
 * `id` is stabiel en betekenisloos: diensten, artikels en de homepage verwijzen ernaar.
 */
export const CATEGORIES: Category[] = [
  { id: "c05", parentId: null, name: "Gordijnen & stoffen", slug: "gordijnen-en-stoffen", order: 1, image: BEELD.catGordijnen },
  { id: "c02", parentId: null, name: "Behang", slug: "behang", order: 2, image: BEELD.catBehang },
  { id: "c04", parentId: null, name: "Vloerbekleding", slug: "vloerbekleding", order: 3, image: BEELD.catVloer },
  { id: "c03", parentId: null, name: "Tapijten", slug: "tapijten", order: 4, image: BEELD.catTapijten },
  { id: "c01", parentId: null, name: "Raamdecoratie", slug: "raamdecoratie", order: 5 },
  { id: "c07", parentId: null, name: "Verf", slug: "verf", order: 6 },
  { id: "c06", parentId: null, name: "Slapen & wonen", slug: "slapen-en-wonen", order: 7 },
];
