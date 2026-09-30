"use client";

import { useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { SITE } from "@/lib/site/config";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "postcode";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  autoComplete?: string;
  half?: boolean;
};

/**
 * Formulier met echte validatie en foutmeldingen, maar zonder verzending: in deze fase
 * gaat er niets naar een server (contact, opmeting, offerte). De bevestiging zegt dat
 * ook letterlijk — geen gesimuleerd "verzonden".
 */
export function DemoForm({
  title,
  intro,
  fields,
  submitLabel = "Versturen",
  allowAttachment = false,
  purpose,
}: {
  title: string;
  intro?: string;
  fields: FormField[];
  submitLabel?: string;
  allowAttachment?: boolean;
  purpose: string;
}) {
  const id = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const validate = (data: FormData) => {
    const e: Record<string, string> = {};
    for (const f of fields) {
      const v = String(data.get(f.name) ?? "").trim();
      if (f.required && !v) e[f.name] = `${f.label} is verplicht.`;
      else if (v && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) e[f.name] = "Vul een geldig e-mailadres in.";
      else if (v && f.type === "tel" && !/^[+0-9 ()/.-]{8,}$/.test(v)) e[f.name] = "Vul een geldig telefoonnummer in.";
      else if (v && f.type === "postcode" && !/^\d{4}$/.test(v)) e[f.name] = "Een Belgische postcode heeft 4 cijfers.";
    }
    return e;
  };

  return (
    <section aria-labelledby={`${id}-titel`} className="rounded-[var(--radius-tile)] border border-line p-5 md:p-8">
      <h2 id={`${id}-titel`} className="font-display text-[28px] leading-tight">
        {title}
      </h2>
      {intro && <p className="mt-2 text-[15px] text-ink-80">{intro}</p>}

      {done ? (
        <div ref={statusRef} tabIndex={-1} role="status" className="mt-6 rounded-[var(--radius-tile)] bg-mist p-6 outline-none">
          <p className="flex items-center gap-2 font-medium">
            <Icon name="info" /> Demo — er werd niets verstuurd
          </p>
          <p className="mt-2 text-[15px] text-ink-80">
            Uw invoer is geldig, maar in dit prototype is {purpose} nog niet gekoppeld. Er werden geen gegevens bewaard of doorgestuurd. Voor een echte vraag: bel{" "}
            <a href={SITE.phone.href} className="font-medium underline">
              {SITE.phone.display}
            </a>
            .
          </p>
          <button type="button" onClick={() => setDone(false)} className="btn btn-outline btn-sm mt-4">
            Formulier opnieuw tonen
          </button>
        </div>
      ) : (
        <form
          noValidate
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const errs = validate(new FormData(e.currentTarget));
            setErrors(errs);
            if (Object.keys(errs).length === 0) {
              setDone(true);
              window.setTimeout(() => statusRef.current?.focus(), 50);
            } else {
              const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
              first?.focus();
            }
          }}
        >
          <div className="grid gap-x-4 gap-y-5 md:grid-cols-2">
            {fields.map((f) => {
              const fid = `${id}-${f.name}`;
              const err = errors[f.name];
              const common = {
                id: fid,
                name: f.name,
                "aria-invalid": Boolean(err),
                "aria-describedby": err ? `${fid}-fout` : undefined,
                required: f.required,
                autoComplete: f.autoComplete,
                placeholder: f.placeholder,
              };
              return (
                <div key={f.name} className={f.half ? "" : "md:col-span-2"}>
                  <label htmlFor={fid} className="mb-1.5 block text-[14px] font-medium">
                    {f.label}
                    {f.required && <span aria-hidden="true">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea {...common} rows={5} className="field min-h-32" />
                  ) : f.type === "select" ? (
                    <div className="relative">
                      <select {...common} defaultValue="" className="field appearance-none pr-10">
                        <option value="" disabled>
                          Maak een keuze
                        </option>
                        {f.options?.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                      <Icon name="chevronDown" size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  ) : (
                    <input {...common} type={f.type === "postcode" ? "text" : (f.type ?? "text")} inputMode={f.type === "postcode" ? "numeric" : undefined} className="field" />
                  )}
                  {err && (
                    <p id={`${fid}-fout`} className="mt-1 text-[13px] text-brand-dark">
                      {err}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[12px] text-ink-60">* Verplichte velden</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {allowAttachment ? (
              <div>
                <input
                  ref={fileInput}
                  id={`${id}-bijlage`}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="peer sr-only"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
                />
                <label htmlFor={`${id}-bijlage`} className="btn btn-outline btn-sm cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                  Bijlage toevoegen <Icon name="paperclip" size={18} />
                </label>
                {files.length > 0 && <p className="mt-2 text-[13px] text-ink-80">Gekozen (niet opgeladen — demo): {files.join(", ")}</p>}
              </div>
            ) : (
              <span />
            )}
            <button type="submit" className="btn btn-primary">
              {submitLabel}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
