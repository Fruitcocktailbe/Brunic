import { admin } from "@/lib/shopify/admin";

/**
 * Foto's van de opmetingsaanvraag → Shopify Files (staged upload → Shopify CDN), zodat
 * ze bij de klant in de admin verschijnen. Géén externe opslag. Best effort: deze module
 * gooit nooit door naar de bezoeker — een mislukte upload mag de lead niet laten sneuvelen.
 */
const STAGED = /* GraphQL */ `
  mutation Staged($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { field message }
    }
  }
`;
const FILE_CREATE = /* GraphQL */ `
  mutation FileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) { files { id } userErrors { field message } }
  }
`;

const MAX_FOTOS = 5;
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per foto

/** Enkel echte afbeeldingen, niet te groot, max 5. */
export function geldigeFotos(raw: File[]): File[] {
  return raw
    .filter((f) => f && f.size > 0 && f.name && f.type.startsWith("image/") && f.size <= MAX_BYTES)
    .slice(0, MAX_FOTOS);
}

type StagedTarget = { url: string; resourceUrl: string; parameters: { name: string; value: string }[] };

export async function uploadOpmetingFotos(files: File[]): Promise<string[]> {
  const geldig = geldigeFotos(files);
  if (geldig.length === 0) return [];

  // 1) Staged upload-targets aanvragen (één per foto).
  const staged = await admin<{
    stagedUploadsCreate: { stagedTargets: StagedTarget[]; userErrors: { message: string }[] };
  }>(STAGED, {
    input: geldig.map((f) => ({
      filename: f.name,
      mimeType: f.type,
      resource: "FILE",
      httpMethod: "POST",
      fileSize: String(f.size),
    })),
  });
  const targets = staged.stagedUploadsCreate.stagedTargets ?? [];

  // 2) Bytes naar elke target POSTen (multipart; het 'file'-veld moet als laatste).
  const bronUrls: string[] = [];
  for (let i = 0; i < geldig.length; i++) {
    const target = targets[i];
    if (!target) continue;
    try {
      const form = new FormData();
      for (const p of target.parameters) form.append(p.name, p.value);
      form.append("file", geldig[i], geldig[i].name);
      const res = await fetch(target.url, { method: "POST", body: form });
      if (res.ok) bronUrls.push(target.resourceUrl);
    } catch {
      /* deze foto overslaan, de rest gaat door */
    }
  }
  if (bronUrls.length === 0) return [];

  // 3) fileCreate → definitieve file-GID's (referentie werkt al terwijl Shopify verwerkt).
  const created = await admin<{
    fileCreate: { files: { id: string }[]; userErrors: { message: string }[] };
  }>(FILE_CREATE, {
    files: bronUrls.map((originalSource) => ({ originalSource, contentType: "IMAGE" })),
  });
  return (created.fileCreate.files ?? []).map((f) => f.id);
}
