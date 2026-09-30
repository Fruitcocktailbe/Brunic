"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MenuNode } from "@/lib/catalog/menu";
import type { NavItem } from "@/lib/site/navigation";
import { SITE } from "@/lib/site/config";
import { routes } from "@/lib/routes";
import { Drawer } from "@/components/ui/drawer";
import { Icon } from "@/components/ui/icon";

/**
 * Mobiel menu: paneel van links met doorklikbare niveaus (zoals de referentie).
 * Elk niveau heeft een "Terug"-knop en een link "Alles in …".
 */
export function MobileMenu({ open, onClose, menu, nav }: { open: boolean; onClose: () => void; menu: MenuNode[]; nav: NavItem[] }) {
  const [stack, setStack] = useState<MenuNode[]>([]);
  const current = stack[stack.length - 1];
  const body = useRef<HTMLDivElement>(null);
  const cameFrom = useRef<string | null>(null);
  const depth = useRef(0);
  const close = () => {
    setStack([]);
    onClose();
  };

  // Focus volgt het niveau: dieper → "Terug", terug → de rij die geopend was.
  useEffect(() => {
    const deeper = stack.length > depth.current;
    const wentBack = stack.length < depth.current;
    depth.current = stack.length;
    if (!body.current || (!deeper && !wentBack)) return;
    if (deeper) body.current.querySelector<HTMLElement>("[data-terug]")?.focus();
    else body.current.querySelector<HTMLElement>(`[data-menu-id="${cameFrom.current}"]`)?.focus();
  }, [stack]);

  const openNode = (n: MenuNode) => setStack((s) => [...s, n]);
  const back = () => {
    cameFrom.current = current?.id ?? null;
    setStack((s) => s.slice(0, -1));
  };

  return (
    <Drawer open={open} onClose={close} side="left" title="Menu" width="w-[min(100vw,420px)]">
      <div ref={body}>
      {current ? (
        <div>
          <button
            type="button"
            data-terug
            onClick={back}
            className="flex min-h-12 w-full items-center gap-2 border-b border-line px-4 text-sm text-ink-80"
          >
            <Icon name="chevronLeft" size={18} /> Terug
          </button>
          <p className="px-4 pb-2 pt-4 text-lg font-semibold">{current.name}</p>
          <ul role="list">
            <li>
              <Link href={current.href} onClick={close} className="flex min-h-12 items-center border-b border-line px-4 text-[15px] font-medium underline-offset-2 hover:underline">
                Alles in {current.name}
              </Link>
            </li>
            {current.children.map((c) => (
              <MenuRow key={c.id} node={c} onOpen={() => openNode(c)} onNavigate={close} />
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <ul role="list">
            {menu.map((m) => (
              <MenuRow key={m.id} node={m} onOpen={() => openNode(m)} onNavigate={close} />
            ))}
            <li>
              <Link href={routes.catalog()} onClick={close} className="flex min-h-12 items-center border-b border-line px-4 text-[15px]">
                Volledige catalogus
              </Link>
            </li>
            {nav.filter((n) => n.key !== "catalogus").map((n) => (
              <li key={n.key}>
                <Link
                  href={n.href}
                  onClick={close}
                  className={`flex min-h-12 items-center border-b border-line px-4 text-[15px] ${n.accent === "offer" ? "font-medium text-brand" : ""}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-1 bg-cloud px-4 py-5 text-sm">
            <Link href={routes.wishlist()} onClick={close} className="flex min-h-11 items-center gap-3">
              <Icon name="heart" size={20} /> Verlanglijst
            </Link>
            <a href={SITE.phone.href} className="flex min-h-11 items-center gap-3">
              <Icon name="phone" size={20} /> {SITE.phone.display}
            </a>
            <p className="flex min-h-11 items-center gap-3 text-ink-60">
              <Icon name="clock" size={20} /> Winkel {SITE.hoursShort}
            </p>
          </div>
        </div>
      )}
      </div>
    </Drawer>
  );
}

function MenuRow({ node, onOpen, onNavigate }: { node: MenuNode; onOpen: () => void; onNavigate: () => void }) {
  if (node.children.length === 0) {
    return (
      <li>
        <Link href={node.href} onClick={onNavigate} className="flex min-h-12 items-center border-b border-line px-4 text-[15px]">
          {node.name}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <button type="button" data-menu-id={node.id} onClick={onOpen} aria-label={`${node.name} — onderverdeling tonen`} className="flex min-h-12 w-full items-center justify-between border-b border-line px-4 text-left text-[15px]">
        {node.name}
        <Icon name="chevronRight" size={18} className="text-ink-60" />
      </button>
    </li>
  );
}
