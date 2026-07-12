# select-seed.ps1 — kiest een representatief STAAL uit de WooCommerce-export en schrijft
# data/seed/seed-input.json (voor seed-storefront.mjs). PowerShell Import-Csv parseert de
# lastige Woo-CSV (embedded newlines, escaped comma's) betrouwbaar; vandaar PS i.p.v. Node.
#
#   powershell -File packages/catalog/select-seed.ps1 [-Per 8]
param([int]$Per = 8)

$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent  # repo-root
$csvPath = Join-Path $root "data/wc-product-export-2026-07-06.csv"
$outDir  = Join-Path $root "data/seed"
$outPath = Join-Path $outDir "seed-input.json"

$csv = Import-Csv $csvPath

# De kolomnaam "Categorieen" bevat een niet-ASCII teken; dit .ps1 kan als ANSI ingelezen
# worden (PS 5.1 zonder BOM) waardoor een letterlijke string niet matcht. Daarom de
# kolomnaam at-runtime uit de header halen i.p.v. hardcoden.
$catCol = @($csv[0].PSObject.Properties.Name | Where-Object { $_ -like "Categorie*" })[0]
if (-not $catCol) { throw "Categorie-kolom niet gevonden in de CSV-header." }

# Woo-categorie (oude taxonomie) -> web-collectie-handle. Eerste match wint (prioriteit).
function Map-Cat($cat) {
  if ($cat -like "*Behangpapier*")                                   { return "behang" }
  if ($cat -like "*Verf*")                                           { return "verf" }
  if ($cat -like "*Stoffen*")                                        { return "gordijnen-stoffen" }
  if ($cat -like "*Raamdecoratie*" -or $cat -like "*Rolgordijn*" -or $cat -like "*Douchegordijn*") { return "raamdecoratie" }
  if ($cat -like "*Tapijten*" -or $cat -like "*Badmatten*" -or $cat -like "*Knoeimatten*" -or $cat -like "*Schapenvacht*") { return "tapijten-karpetten" }
  if ($cat -like "*Vloerbekleding*" -or $cat -like "*Vinylvloer*" -or $cat -like "*Vasttapijt*") { return "vloeren" }
  if ($cat -like "*Slaapcomfort*" -or $cat -like "*Home & decoratie*" -or $cat -like "*Verlichting*" -or $cat -like "*Badkamer*") { return "slapen-wonen" }
  return $null
}

# variatie-rijen indexeren op hun parent (via _parent_sku of de Hoofd-kolom).
$variations = $csv | Where-Object { $_.Type -eq "variation" }

# In deze Woo-export linkt een variatie aan haar parent via de Hoofd-kolom = parent-SKU
# (exact). _parent_sku is bij 81% leeg → onbruikbaar. Parents ZONDER SKU (341 Woo-native
# variabele producten) zijn de gedocumenteerde wees-variaties: die slaan we in het staal over.
function Get-Variations($parentSku) {
  if ([string]::IsNullOrWhiteSpace($parentSku)) { return @() }
  $variations | Where-Object { $_.Hoofd -eq $parentSku }
}

function Clean-Price($p) {
  if ([string]::IsNullOrWhiteSpace($p)) { return $null }
  return ($p -replace "\s","" -replace "\\","" -replace ",",".")
}
function Split-Images($s) {
  if ([string]::IsNullOrWhiteSpace($s)) { return @() }
  return @($s -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ -like "http*" })
}

$parents = $csv | Where-Object { ($_.Type -eq "variable" -or $_.Type -eq "simple") -and $_.Afbeeldingen }
$byCat = @{}
foreach ($p in $parents) {
  $h = Map-Cat $p.$catCol
  if (-not $h) { continue }
  if (-not $byCat.ContainsKey($h)) { $byCat[$h] = New-Object System.Collections.ArrayList }
  [void]$byCat[$h].Add($p)
}

$out = New-Object System.Collections.ArrayList
foreach ($handle in @("behang","gordijnen-stoffen","vloeren","tapijten-karpetten","raamdecoratie","verf","slapen-wonen")) {
  if (-not $byCat.ContainsKey($handle)) { Write-Host "  $handle : 0 kandidaten"; continue }
  $kandidaten = $byCat[$handle]
  # tapijten: variabele producten eerst (om de maat-kiezer te tonen); elders simpele eerst.
  if ($handle -eq "tapijten-karpetten") {
    $kandidaten = @($kandidaten | Sort-Object { $_.Type -ne "variable" })
  } else {
    $kandidaten = @($kandidaten | Sort-Object { $_.Type -ne "simple" })
  }

  $gekozen = 0
  foreach ($p in $kandidaten) {
    if ($gekozen -ge $Per) { break }
    $images = Split-Images $p.Afbeeldingen
    if ($images.Count -eq 0) { continue }

    if ($p.Type -eq "simple") {
      $price = Clean-Price $p."Reguliere prijs"
      if (-not $price) { continue }
      [void]$out.Add([pscustomobject]@{
        category = $handle; type = "simple"; name = $p.Naam.Trim(); sku = $p.Artikelnummer.Trim()
        price = $price; images = $images; variations = @()
      })
      $gekozen++
    } else {
      $vs = Get-Variations $p.Artikelnummer.Trim()
      $vout = New-Object System.Collections.ArrayList
      foreach ($v in $vs) {
        $vp = Clean-Price $v."Reguliere prijs"
        if (-not $vp) { continue }
        [void]$vout.Add([pscustomobject]@{
          sku = $v.Artikelnummer.Trim(); sizeRaw = ($v."Waarde eigenschap 1" -replace "\\","").Trim(); price = $vp
        })
      }
      if ($vout.Count -eq 0) { continue }
      [void]$out.Add([pscustomobject]@{
        category = $handle; type = "variable"; name = $p.Naam.Trim(); sku = $p.Artikelnummer.Trim()
        price = $null; images = $images; variations = $vout
      })
      $gekozen++
    }
  }
  Write-Host "  $handle : $gekozen gekozen"
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$out | ConvertTo-Json -Depth 6 | Out-File -FilePath $outPath -Encoding utf8
Write-Host "`nGeschreven: $outPath  ($($out.Count) producten)"
