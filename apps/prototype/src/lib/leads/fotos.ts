import { admin } from "@/lib/shopify/admin";

/**
 * Foto's bij een aanvraag → Shopify Files (staged upload → Shopify-CDN), zodat ze bij de
 * klant in de admin verschijnen. Géén externe opslag. Best effort: een mislukte upload
 * mag de aanvraag nooit laten sneuvelen. De browser verkleint foto's vóór verzending
 * (components/content/lead-form.tsx), dus hier komen enkel lichte JPEG's binnen.
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

export const MAX_FOTOS = 5;
const MAX_BYTES = 4 * 1024 * 1024;

export function geldigeFotos(raw: File[]): File[] {
  return raw.filter((f) => f && f.size > 0 && f.name && f.type.startsWith("image/") && f.size <= MAX_BYTES).slice(0, MAX_FOTOS);
}

type StagedTarget = { url: string; resourceUrl: string; parameters: { name: string; value: string }[] };

/** @returns de File-GID's in Shopify. */
export async function uploadFotos(files: File[]): Promise<string[]> {
  const geldig = geldigeFotos(files);
  if (geldig.length === 0) return [];

  const staged = await admin<{ stagedUploadsCreate: { stagedTargets: StagedTarget[] } }>(STAGED, {
    input: geldig.map((f) => ({ filename: f.name, mimeType: f.type, resource: "FILE", httpMethod: "POST", fileSize: String(f.size) })),
  });
  const targets = staged.stagedUploadsCreate.stagedTargets ?? [];

  const bronUrls: string[] = [];
  for (let i = 0; i < geldig.length; i++) {
    const target = targets[i];
    if (!target) continue;
    try {
      const form = new FormData();
      for (const p of target.parameters) form.append(p.name, p.value);
      form.append("file", geldig[i], geldig[i].name); // 'file' moet als laatste
      const res = await fetch(target.url, { method: "POST", body: form });
      if (res.ok) bronUrls.push(target.resourceUrl);
    } catch {
      /* deze foto overslaan, de rest gaat door */
    }
  }
  if (bronUrls.length === 0) return [];

  const created = await admin<{ fileCreate: { files: { id: string }[] } }>(FILE_CREATE, {
    files: bronUrls.map((originalSource) => ({ originalSource, contentType: "IMAGE" })),
  });
  return (created.fileCreate.files ?? []).map((f) => f.id);
}
