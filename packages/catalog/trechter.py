# Brunic trechter v1 — schift de ERP-artikellijst (PDF) en kruist met de WooCommerce-export.
# Regels: zie ../11-webcategorie-mapping.md en ../09-plan-woensdag-08-07.md (schiftingsstrategie).
# Output: data/trechter/erp-geclassificeerd.csv + woo-only.csv + samenvatting op stdout.
# v2 draait op de echte Integral-CSV (voorraad + verkoopdata) zodra Bruno die levert.

import csv, json, re, sys
from collections import Counter, defaultdict
from pathlib import Path

import pypdf

BASE = Path(__file__).resolve().parent.parent  # clients/brunic
PDF = BASE / "data" / "erp-signalement-artikelen-2026-07-06.pdf"
WOO = BASE / "data" / "wc-product-export-2026-07-06.csv"
OUT = BASE / "data" / "trechter"
OUT.mkdir(parents=True, exist_ok=True)

CONSIGNATIE = {676, 677, 745, 746, 785, 786}
VERHUUR = {598, 599}
COUPON = {190, 191, 490, 491, 492, 493, 695, 696, 697, 793, 890}
OP_BESTELLING_EXTRA = {592, 593, 594}
DE_JAGER_UITZONDERING = 895  # gewone behangserie ondanks x95

def webcategorie(fam):
    if fam is None:
        return "?"
    if fam == 505 or fam in (506, 507) or fam in (545, 546, 547) or fam == 588:
        return "Raamdecoratie"
    g = fam // 100
    if g == 1: return "Vloeren"
    if g == 2: return "Slapen & wonen"
    if g == 3: return "Verf"
    if g == 4: return "Vasttapijt"
    if g == 5: return "Toebehoren"
    if g == 6:
        if 670 <= fam <= 688: return "Atelier & maatwerk"
        return "Gordijnen & stoffen"
    if g == 7: return "Tapijten & karpetten"
    if g == 8: return "Behang"
    if g == 9: return "Slapen & wonen"
    return "?"

def classify(nummer, omschrijving, fam, woo_skus):
    if not omschrijving:
        return "dood-geen-omschrijving"
    if omschrijving.startswith("***"):
        return "dood-sterretjes"
    if fam is None:
        return "legacy-kort-nummer"
    if fam in CONSIGNATIE: return "uit-consignatie"
    if fam in VERHUUR: return "uit-verhuur"
    if fam in COUPON: return "uit-coupon-outlet"
    if (fam % 100 >= 95 and fam != DE_JAGER_UITZONDERING) or fam in OP_BESTELLING_EXTRA:
        return "uit-op-bestelling"
    if nummer in woo_skus:
        return "IN-match-woocommerce"
    return "grijs-erp-only"

HEADER_PAT = re.compile(r"^(SIGNALEMENT|BRUNIC \(|Vergunning|Gesorteerd|NUMMER\s|\++\s*$)")
ART_PAT = re.compile(r"^(\d{6,9})\s*(.*)$")

def parse_pdf():
    reader = pypdf.PdfReader(str(PDF))
    artikelen = []  # (nummer, [descr-regels])
    cur = None
    for page in reader.pages:
        text = page.extract_text() or ""
        for raw in text.splitlines():
            line = raw.rstrip()
            if not line.strip():
                continue
            if HEADER_PAT.match(line.strip()) and not ART_PAT.match(line):
                continue
            m = ART_PAT.match(line)
            if m:
                if cur:
                    artikelen.append(cur)
                cur = (m.group(1), [m.group(2).strip()] if m.group(2).strip() else [])
            elif cur and line.startswith(" "):
                cur[1].append(line.strip())
    if cur:
        artikelen.append(cur)
    return artikelen

def main():
    woo_skus = set()
    woo_rows = []
    with open(WOO, encoding="utf-8-sig", newline="") as f:
        csv.field_size_limit(10**8)
        for row in csv.DictReader(f):
            sku = (row.get("Artikelnummer") or "").strip()
            if sku:
                woo_rows.append((sku, row.get("Type", ""), row.get("Naam", "")))
                if sku.isdigit():
                    woo_skus.add(sku)

    artikelen = parse_pdf()
    counts = Counter()
    cat_counts = defaultdict(Counter)
    erp_nummers = set()
    with open(OUT / "erp-geclassificeerd.csv", "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["nummer", "leverancier", "familie", "omschrijving", "classificatie", "webcategorie"])
        for nummer, descr in artikelen:
            erp_nummers.add(nummer)
            oms = " / ".join(d for d in descr if d)
            fam = int(nummer[3:6]) if len(nummer) == 9 else None
            lev = nummer[:3] if len(nummer) == 9 else ""
            c = classify(nummer, oms, fam, woo_skus)
            cat = webcategorie(fam)
            counts[c] += 1
            if c in ("IN-match-woocommerce", "grijs-erp-only"):
                cat_counts[cat][c] += 1
            w.writerow([nummer, lev, fam if fam is not None else "", oms, c, cat])

    woo_only = [(s, t, n) for (s, t, n) in woo_rows if s.isdigit() and s not in erp_nummers]
    with open(OUT / "woo-only.csv", "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["artikelnummer", "type", "naam"])
        w.writerows(woo_only)

    print(json.dumps({
        "erp_totaal": len(artikelen),
        "classificatie": dict(counts.most_common()),
        "webcategorie_relevant": {k: dict(v) for k, v in sorted(cat_counts.items())},
        "woo_skus_numeriek": len(woo_skus),
        "woo_only_niet_in_erp": len(woo_only),
    }, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    sys.exit(main())
