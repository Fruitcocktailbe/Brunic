"use server";

import { revalidatePath } from "next/cache";
import { bewaakVariant, isGuardFout, verwijderRegel, voegToe, wijzigAantal } from "./cart";

export type ActieResultaat = { ok: boolean; message?: string };

/**
 * Elke server action valideert opnieuw. De client is nooit de bron van waarheid:
 * de knop staat er niet op etalage-PDP's, maar het variant-ID is publiek.
 */
export async function voegToeAanMand(
  variantId: string,
  quantity = 1,
): Promise<ActieResultaat> {
  const veilig = Number.isInteger(quantity) && quantity > 0 && quantity <= 20;
  if (!veilig) return { ok: false, message: "Ongeldig aantal." };

  const variant = await bewaakVariant(variantId);
  if (isGuardFout(variant)) return { ok: false, message: variant.message };

  try {
    await voegToe(variant.id, quantity);
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Toevoegen mislukt." };
  }

  revalidatePath("/winkelmand");
  return { ok: true };
}

export async function wijzigRegel(formData: FormData): Promise<void> {
  const lineId = String(formData.get("lineId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  if (!lineId || !Number.isFinite(quantity)) return;

  await wijzigAantal(lineId, Math.min(Math.max(quantity, 0), 20));
  revalidatePath("/winkelmand");
}

export async function verwijderUitMand(formData: FormData): Promise<void> {
  const lineId = String(formData.get("lineId") ?? "");
  if (!lineId) return;

  await verwijderRegel(lineId);
  revalidatePath("/winkelmand");
}
