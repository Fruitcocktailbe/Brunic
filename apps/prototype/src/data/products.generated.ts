/**
 * GEGENEREERD — niet met de hand bewerken.
 * Bron: design/content-sample.json · script: apps/prototype/scripts/genereer-demoproducten.mjs
 *
 * Demodata voor het prototype: titels en foto's komen uit het publieke brunic.be-staal;
 * prijzen, varianten, voorraad, "nieuw", facetten en teksten zijn VOORBEELDWAARDEN.
 * Wordt vervangen door de Shopify-adapter (README §Shopify-adapter).
 */
import type { Product } from "@/lib/catalog/types";

export const PRODUCTS: Product[] = [
  {
    "id": "p001",
    "slug": "rolgordijn-verduisterend",
    "title": "Rolgordijn verduisterend",
    "line": "Verduisterend",
    "categoryIds": [
      "c11"
    ],
    "primaryCategoryId": "c11",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2189479143-1.jpg",
        "alt": "Rolgordijn Grijs Verduisterend",
        "optionValue": "Grijs"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2189482092-1.jpg",
        "alt": "Rolgordijn Grijs Verduisterend — beeld 2",
        "optionValue": "Grijs"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2190201003-1.jpg",
        "alt": "Rolgordijn Blauw Verduisterend",
        "optionValue": "Blauw"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2190146711-1.jpg",
        "alt": "Rolgordijn Blauw Verduisterend — beeld 2",
        "optionValue": "Blauw"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2185916199-1.jpg",
        "alt": "Rolgordijn Wit Verduisterend",
        "optionValue": "Wit"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2185896426-1.jpg",
        "alt": "Rolgordijn Wit Verduisterend — beeld 2",
        "optionValue": "Wit"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2190108998-1.jpg",
        "alt": "Rolgordijn Antraciet Verduisterend",
        "optionValue": "Antraciet"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2190135015-1.jpg",
        "alt": "Rolgordijn Antraciet Verduisterend — beeld 2",
        "optionValue": "Antraciet"
      }
    ],
    "options": [
      {
        "name": "Kleur",
        "values": [
          {
            "value": "Grijs",
            "swatch": "#9b9a97"
          },
          {
            "value": "Blauw",
            "swatch": "#3f5b7d"
          },
          {
            "value": "Wit",
            "swatch": "#f6f4ef"
          },
          {
            "value": "Antraciet",
            "swatch": "#3b3c3f"
          }
        ]
      },
      {
        "name": "Maat",
        "values": [
          {
            "value": "60 × 180 cm"
          },
          {
            "value": "80 × 180 cm"
          },
          {
            "value": "100 × 180 cm"
          },
          {
            "value": "120 × 180 cm"
          },
          {
            "value": "140 × 180 cm"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p001-v1",
        "sku": "554505019-1",
        "options": {
          "Kleur": "Grijs",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 24.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v2",
        "sku": "554505019-2",
        "options": {
          "Kleur": "Grijs",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 29.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v3",
        "sku": "554505019-3",
        "options": {
          "Kleur": "Grijs",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v4",
        "sku": "554505019-4",
        "options": {
          "Kleur": "Grijs",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 39.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v5",
        "sku": "554505019-5",
        "options": {
          "Kleur": "Grijs",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 44.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "beperkt"
      },
      {
        "id": "p001-v6",
        "sku": "554505019-6",
        "options": {
          "Kleur": "Blauw",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 24.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v7",
        "sku": "554505019-7",
        "options": {
          "Kleur": "Blauw",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 29.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v8",
        "sku": "554505019-8",
        "options": {
          "Kleur": "Blauw",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v9",
        "sku": "554505019-9",
        "options": {
          "Kleur": "Blauw",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 39.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v10",
        "sku": "554505019-10",
        "options": {
          "Kleur": "Blauw",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 44.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "uitverkocht"
      },
      {
        "id": "p001-v11",
        "sku": "554505019-11",
        "options": {
          "Kleur": "Wit",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 24.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v12",
        "sku": "554505019-12",
        "options": {
          "Kleur": "Wit",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 29.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v13",
        "sku": "554505019-13",
        "options": {
          "Kleur": "Wit",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v14",
        "sku": "554505019-14",
        "options": {
          "Kleur": "Wit",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 39.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v15",
        "sku": "554505019-15",
        "options": {
          "Kleur": "Wit",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 44.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "beperkt"
      },
      {
        "id": "p001-v16",
        "sku": "554505019-16",
        "options": {
          "Kleur": "Antraciet",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 24.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v17",
        "sku": "554505019-17",
        "options": {
          "Kleur": "Antraciet",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 29.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v18",
        "sku": "554505019-18",
        "options": {
          "Kleur": "Antraciet",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v19",
        "sku": "554505019-19",
        "options": {
          "Kleur": "Antraciet",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 39.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p001-v20",
        "sku": "554505019-20",
        "options": {
          "Kleur": "Antraciet",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 44.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "beperkt"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Verduisterend"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Breedte",
        "value": "60 – 140 cm (5 standaardmaten)"
      },
      {
        "label": "Hoogte",
        "value": "180 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Grijs",
        "Blauw",
        "Wit",
        "Antraciet"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "lichtdoorlatendheid": [
        "Verduisterend"
      ],
      "type": [
        "Rolgordijn"
      ]
    },
    "badges": [],
    "createdAt": "2026-05-26",
    "popularity": 95,
    "demo": true
  },
  {
    "id": "p002",
    "slug": "rolgordijn-lichtdoorlatend",
    "title": "Rolgordijn lichtdoorlatend",
    "line": "Lichtdoorlatend",
    "categoryIds": [
      "c12"
    ],
    "primaryCategoryId": "c12",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2185892307-1.jpg",
        "alt": "Rolgordijn Beige Lichtdoorlatend",
        "optionValue": "Beige"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2185883076-1.jpg",
        "alt": "Rolgordijn Ecru Lichtdoorlatend",
        "optionValue": "Ecru"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2185796209-1.jpg",
        "alt": "Rolgordijn Wit Lichtdoorlatend",
        "optionValue": "Wit"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2185805022-1.jpg",
        "alt": "Rolgordijn Wit Lichtdoorlatend — beeld 2",
        "optionValue": "Wit"
      }
    ],
    "options": [
      {
        "name": "Kleur",
        "values": [
          {
            "value": "Beige",
            "swatch": "#d8c6a6"
          },
          {
            "value": "Ecru",
            "swatch": "#ece3cf"
          },
          {
            "value": "Wit",
            "swatch": "#f6f4ef"
          }
        ]
      },
      {
        "name": "Maat",
        "values": [
          {
            "value": "60 × 180 cm"
          },
          {
            "value": "80 × 180 cm"
          },
          {
            "value": "100 × 180 cm"
          },
          {
            "value": "120 × 180 cm"
          },
          {
            "value": "140 × 180 cm"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p002-v1",
        "sku": "554505023-1",
        "options": {
          "Kleur": "Beige",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 22.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v2",
        "sku": "554505023-2",
        "options": {
          "Kleur": "Beige",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 27.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v3",
        "sku": "554505023-3",
        "options": {
          "Kleur": "Beige",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 32.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v4",
        "sku": "554505023-4",
        "options": {
          "Kleur": "Beige",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 37.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v5",
        "sku": "554505023-5",
        "options": {
          "Kleur": "Beige",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 42.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v6",
        "sku": "554505023-6",
        "options": {
          "Kleur": "Ecru",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 22.95,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 29.95,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v7",
        "sku": "554505023-7",
        "options": {
          "Kleur": "Ecru",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 27.95,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 34.95,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v8",
        "sku": "554505023-8",
        "options": {
          "Kleur": "Ecru",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 32.95,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 39.95,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v9",
        "sku": "554505023-9",
        "options": {
          "Kleur": "Ecru",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 37.95,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 44.95,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v10",
        "sku": "554505023-10",
        "options": {
          "Kleur": "Ecru",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 42.95,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 49.95,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v11",
        "sku": "554505023-11",
        "options": {
          "Kleur": "Wit",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 22.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v12",
        "sku": "554505023-12",
        "options": {
          "Kleur": "Wit",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 27.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v13",
        "sku": "554505023-13",
        "options": {
          "Kleur": "Wit",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 32.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v14",
        "sku": "554505023-14",
        "options": {
          "Kleur": "Wit",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 37.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p002-v15",
        "sku": "554505023-15",
        "options": {
          "Kleur": "Wit",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 42.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Lichtdoorlatend"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Breedte",
        "value": "60 – 140 cm"
      },
      {
        "label": "Hoogte",
        "value": "180 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Beige",
        "Ecru",
        "Wit"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "lichtdoorlatendheid": [
        "Lichtdoorlatend"
      ],
      "type": [
        "Rolgordijn"
      ]
    },
    "badges": [
      "nieuw",
      "aanbieding"
    ],
    "createdAt": "2026-09-14",
    "popularity": 80,
    "demo": true
  },
  {
    "id": "p003",
    "slug": "rolgordijn-scandi-linnen-lichtdoorlatend",
    "title": "Rolgordijn Scandi linnen lichtdoorlatend",
    "line": "Scandi",
    "categoryIds": [
      "c12"
    ],
    "primaryCategoryId": "c12",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2196711575-1.jpg",
        "alt": "Rolgordijn Scandi Linnen Lichtdoorlatend",
        "optionValue": "Naturel"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2196734915-1.jpg",
        "alt": "Rolgordijn Scandi Linnen Grijs Lichtdoorlatend",
        "optionValue": "Grijs"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2196734920-1.jpg",
        "alt": "Rolgordijn Scandi Linnen Grijs Lichtdoorlatend — beeld 2",
        "optionValue": "Grijs"
      }
    ],
    "options": [
      {
        "name": "Kleur",
        "values": [
          {
            "value": "Naturel",
            "swatch": "#cbb796"
          },
          {
            "value": "Grijs",
            "swatch": "#9b9a97"
          }
        ]
      },
      {
        "name": "Maat",
        "values": [
          {
            "value": "60 × 180 cm"
          },
          {
            "value": "80 × 180 cm"
          },
          {
            "value": "100 × 180 cm"
          },
          {
            "value": "120 × 180 cm"
          },
          {
            "value": "140 × 180 cm"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p003-v1",
        "sku": "DEMO-P003-1",
        "options": {
          "Kleur": "Naturel",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 29.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v2",
        "sku": "DEMO-P003-2",
        "options": {
          "Kleur": "Naturel",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v3",
        "sku": "DEMO-P003-3",
        "options": {
          "Kleur": "Naturel",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 39.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v4",
        "sku": "DEMO-P003-4",
        "options": {
          "Kleur": "Naturel",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 44.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v5",
        "sku": "DEMO-P003-5",
        "options": {
          "Kleur": "Naturel",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 49.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v6",
        "sku": "DEMO-P003-6",
        "options": {
          "Kleur": "Grijs",
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 29.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v7",
        "sku": "DEMO-P003-7",
        "options": {
          "Kleur": "Grijs",
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v8",
        "sku": "DEMO-P003-8",
        "options": {
          "Kleur": "Grijs",
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 39.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v9",
        "sku": "DEMO-P003-9",
        "options": {
          "Kleur": "Grijs",
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 44.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p003-v10",
        "sku": "DEMO-P003-10",
        "options": {
          "Kleur": "Grijs",
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 49.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Scandi"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Naturel",
        "Grijs"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "lichtdoorlatendheid": [
        "Lichtdoorlatend"
      ],
      "type": [
        "Rolgordijn"
      ]
    },
    "badges": [],
    "createdAt": "2026-05-20",
    "popularity": 70,
    "demo": true
  },
  {
    "id": "p004",
    "slug": "duo-rolgordijn-wit-lichtdoorlatend",
    "title": "Duo rolgordijn wit lichtdoorlatend",
    "line": "Duo",
    "categoryIds": [
      "c13"
    ],
    "primaryCategoryId": "c13",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2193875448-1.jpg",
        "alt": "Duo Rolgordijn Wit Lichtdoorlatend"
      }
    ],
    "options": [
      {
        "name": "Maat",
        "values": [
          {
            "value": "60 × 180 cm"
          },
          {
            "value": "80 × 180 cm"
          },
          {
            "value": "100 × 180 cm"
          },
          {
            "value": "120 × 180 cm"
          },
          {
            "value": "140 × 180 cm"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p004-v1",
        "sku": "DEMO-P004-1",
        "options": {
          "Maat": "60 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 39.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-bestelling"
      },
      {
        "id": "p004-v2",
        "sku": "DEMO-P004-2",
        "options": {
          "Maat": "80 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 44.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-bestelling"
      },
      {
        "id": "p004-v3",
        "sku": "DEMO-P004-3",
        "options": {
          "Maat": "100 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 49.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-bestelling"
      },
      {
        "id": "p004-v4",
        "sku": "DEMO-P004-4",
        "options": {
          "Maat": "120 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 54.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-bestelling"
      },
      {
        "id": "p004-v5",
        "sku": "DEMO-P004-5",
        "options": {
          "Maat": "140 × 180 cm"
        },
        "price": {
          "amount": {
            "amount": 59.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-bestelling"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Collectie",
        "value": "Duo"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "lichtdoorlatendheid": [
        "Lichtdoorlatend"
      ],
      "type": [
        "Duo rolgordijn"
      ]
    },
    "badges": [],
    "createdAt": "2026-05-17",
    "popularity": 60,
    "demo": true
  },
  {
    "id": "p005",
    "slug": "shutters-op-maat",
    "title": "Shutters op maat",
    "line": "Maatwerk",
    "categoryIds": [
      "c14"
    ],
    "primaryCategoryId": "c14",
    "pricing": "on-request",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "/demo/sfeer/shutters-eetkamer.jpg",
        "alt": "Witte shutters in een eetkamer"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p005-v1",
        "sku": "DEMO-P005-1",
        "options": {},
        "price": null,
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Collectie",
        "value": "Maatwerk"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Shutters"
      ]
    },
    "badges": [
      "op-maat"
    ],
    "createdAt": "2026-05-14",
    "popularity": 75,
    "demo": true
  },
  {
    "id": "p006",
    "slug": "houten-jaloezieen-op-maat",
    "title": "Houten jaloezieën op maat",
    "line": "Maatwerk",
    "categoryIds": [
      "c14"
    ],
    "primaryCategoryId": "c14",
    "pricing": "on-request",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "/demo/sfeer/jaloezieen.jpg",
        "alt": "Donkere houten jaloezieën"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p006-v1",
        "sku": "DEMO-P006-1",
        "options": {},
        "price": null,
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Zwart"
      },
      {
        "label": "Collectie",
        "value": "Maatwerk"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Zwart"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Jaloezie"
      ]
    },
    "badges": [
      "nieuw",
      "op-maat"
    ],
    "createdAt": "2026-09-06",
    "popularity": 65,
    "demo": true
  },
  {
    "id": "p007",
    "slug": "overgordijnen-op-maat",
    "title": "Overgordijnen op maat",
    "line": "Maatwerk",
    "categoryIds": [
      "c13"
    ],
    "primaryCategoryId": "c13",
    "pricing": "on-request",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "/demo/sfeer/gordijnen-living.jpg",
        "alt": "Roze overgordijnen in een woonkamer"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p007-v1",
        "sku": "DEMO-P007-1",
        "options": {},
        "price": null,
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Roze"
      },
      {
        "label": "Collectie",
        "value": "Maatwerk"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Roze"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Overgordijn"
      ]
    },
    "badges": [
      "op-maat"
    ],
    "createdAt": "2026-05-08",
    "popularity": 85,
    "demo": true
  },
  {
    "id": "p008",
    "slug": "plisse-op-maat",
    "title": "Plissé op maat",
    "line": "Maatwerk",
    "categoryIds": [
      "c13"
    ],
    "primaryCategoryId": "c13",
    "pricing": "on-request",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [],
    "options": [],
    "variants": [
      {
        "id": "p008-v1",
        "sku": "DEMO-P008-1",
        "options": {},
        "price": null,
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Maatwerk"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Plissé"
      ]
    },
    "badges": [
      "op-maat"
    ],
    "createdAt": "2026-05-05",
    "popularity": 40,
    "demo": true
  },
  {
    "id": "p009",
    "slug": "vliesbehang-philipp-plein-z80001-zwart",
    "title": "Vliesbehang Philipp Plein Z80001 Zwart",
    "brand": "Philipp Plein",
    "line": "Philipp Plein",
    "categoryIds": [
      "c21"
    ],
    "primaryCategoryId": "c21",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/Z80001.jpg",
        "alt": "Vliesbehang Philipp Plein Z80001 Zwart"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/COVER2.jpg",
        "alt": "Vliesbehang Philipp Plein Z80001 Zwart — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/z80001-1.jpeg",
        "alt": "Vliesbehang Philipp Plein Z80001 Zwart — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p009-v1",
        "sku": "846898011",
        "options": {},
        "price": {
          "amount": {
            "amount": 189.95,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Zwart"
      },
      {
        "label": "Merk",
        "value": "Philipp Plein"
      },
      {
        "label": "Collectie",
        "value": "Philipp Plein"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 70 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [
        "Zwart"
      ],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Vliesbehang"
      ],
      "merk": [
        "Philipp Plein"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-21",
    "popularity": 60,
    "demo": true
  },
  {
    "id": "p010",
    "slug": "vliesbehang-philipp-plein-z80004-brons-grijs",
    "title": "Vliesbehang Philipp Plein Z80004 brons-grijs",
    "brand": "Philipp Plein",
    "line": "Philipp Plein",
    "categoryIds": [
      "c21"
    ],
    "primaryCategoryId": "c21",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/Z80004.jpg",
        "alt": "Vliesbehang Philipp Plein Z80004 Brons/Grijs"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/COVER2.jpg",
        "alt": "Vliesbehang Philipp Plein Z80004 Brons/Grijs — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/Z80004-2.jpg",
        "alt": "Vliesbehang Philipp Plein Z80004 Brons/Grijs — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p010-v1",
        "sku": "846898011-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 189.95,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Brons"
      },
      {
        "label": "Merk",
        "value": "Philipp Plein"
      },
      {
        "label": "Collectie",
        "value": "Philipp Plein"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 70 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [
        "Brons"
      ],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Vliesbehang"
      ],
      "merk": [
        "Philipp Plein"
      ]
    },
    "badges": [],
    "createdAt": "2026-04-29",
    "popularity": 60,
    "demo": true
  },
  {
    "id": "p011",
    "slug": "vliesbehang-philipp-plein-z80002-wit",
    "title": "Vliesbehang Philipp Plein Z80002 Wit",
    "brand": "Philipp Plein",
    "line": "Philipp Plein",
    "categoryIds": [
      "c21"
    ],
    "primaryCategoryId": "c21",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/Z80002.jpg",
        "alt": "Vliesbehang Philipp Plein Z80002 Wit"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/COVER2.jpg",
        "alt": "Vliesbehang Philipp Plein Z80002 Wit — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/Z80002-1.jpg",
        "alt": "Vliesbehang Philipp Plein Z80002 Wit — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p011-v1",
        "sku": "846898011-1-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 189.95,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Merk",
        "value": "Philipp Plein"
      },
      {
        "label": "Collectie",
        "value": "Philipp Plein"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 70 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Vliesbehang"
      ],
      "merk": [
        "Philipp Plein"
      ]
    },
    "badges": [],
    "createdAt": "2026-04-26",
    "popularity": 60,
    "demo": true
  },
  {
    "id": "p012",
    "slug": "vliesbehang-philipp-plein-z80023",
    "title": "Vliesbehang Philipp Plein Z80023",
    "brand": "Philipp Plein",
    "line": "Philipp Plein",
    "categoryIds": [
      "c21"
    ],
    "primaryCategoryId": "c21",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2023/09/Z80023.jpg",
        "alt": "Vliesbehang Philipp Plein Z80023"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2023/05/COVER2.jpg",
        "alt": "Vliesbehang Philipp Plein Z80023 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2023/09/Z80023.jpg",
        "alt": "Vliesbehang Philipp Plein Z80023 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p012-v1",
        "sku": "846898011-1-1-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 189.95,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Philipp Plein"
      },
      {
        "label": "Collectie",
        "value": "Philipp Plein"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 70 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Vliesbehang"
      ],
      "merk": [
        "Philipp Plein"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-17",
    "popularity": 60,
    "demo": true
  },
  {
    "id": "p013",
    "slug": "behang-world-of-imagination-dl27544",
    "title": "Behang World of Imagination DL27544",
    "brand": "Spits Wallcoverings",
    "line": "World of Imagination",
    "categoryIds": [
      "c22"
    ],
    "primaryCategoryId": "c22",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27544_NGX5509_Prehistoric-Dino_Natural_Swatch_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27544"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27544_NGX5509_Prehistoric-Dino_Natural_Lifestyle-2_3000px.jpg",
        "alt": "World of Imagination - DL27544 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27544_NGX5509_Prehistoric-Dino_Natural_Lifestyle-1_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27544 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p013-v1",
        "sku": "DEMO-P013-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.5,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Spits Wallcoverings"
      },
      {
        "label": "Collectie",
        "value": "World of Imagination"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 53 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Kinderbehang"
      ],
      "merk": [
        "Spits Wallcoverings"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-23",
    "popularity": 45,
    "demo": true
  },
  {
    "id": "p014",
    "slug": "behang-world-of-imagination-dl27596",
    "title": "Behang World of Imagination DL27596",
    "brand": "Spits Wallcoverings",
    "line": "World of Imagination",
    "categoryIds": [
      "c22"
    ],
    "primaryCategoryId": "c22",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27596_NGX6675_Space-Adventure_Natural_Swatch_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27596"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27596_NGX6675_Space-Adventure_Natural_Lifestyle-1_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27596 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27596_NGX6675_Space-Adventure_Natural_Lifestyle-2_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27596 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p014-v1",
        "sku": "DEMO-P014-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.5,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Spits Wallcoverings"
      },
      {
        "label": "Collectie",
        "value": "World of Imagination"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 53 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Kinderbehang"
      ],
      "merk": [
        "Spits Wallcoverings"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-19",
    "popularity": 46,
    "demo": true
  },
  {
    "id": "p015",
    "slug": "behang-world-of-imagination-dl27595",
    "title": "Behang World of Imagination DL27595",
    "brand": "Spits Wallcoverings",
    "line": "World of Imagination",
    "categoryIds": [
      "c22"
    ],
    "primaryCategoryId": "c22",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27595_NGX6370_Solar-System_Blue_Swatch_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27595"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27595_NGX6370_Solar-System_Blue_Lifestyle-1_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27595 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27595_NGX6370_Solar-System_Blue_Lifestyle-2_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27595 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p015-v1",
        "sku": "DEMO-P015-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.5,
            "currency": "EUR"
          },
          "unit": "rol",
          "compareAt": {
            "amount": 69.5,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Spits Wallcoverings"
      },
      {
        "label": "Collectie",
        "value": "World of Imagination"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 53 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Kinderbehang"
      ],
      "merk": [
        "Spits Wallcoverings"
      ]
    },
    "badges": [
      "nieuw",
      "aanbieding"
    ],
    "createdAt": "2026-09-15",
    "popularity": 47,
    "demo": true
  },
  {
    "id": "p016",
    "slug": "behang-world-of-imagination-dl27594",
    "title": "Behang World of Imagination DL27594",
    "brand": "Spits Wallcoverings",
    "line": "World of Imagination",
    "categoryIds": [
      "c22"
    ],
    "primaryCategoryId": "c22",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27594_NGX6353_Road-Traffic_Blue_Swatch_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27594"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27594_NGX6353_Road-Traffic_Blue_Lifestyle-2_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27594 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27594_NGX6353_Road-Traffic_Blue_Lifestyle-1_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27594 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p016-v1",
        "sku": "DEMO-P016-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.5,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Spits Wallcoverings"
      },
      {
        "label": "Collectie",
        "value": "World of Imagination"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 53 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Kinderbehang"
      ],
      "merk": [
        "Spits Wallcoverings"
      ]
    },
    "badges": [],
    "createdAt": "2026-04-11",
    "popularity": 48,
    "demo": true
  },
  {
    "id": "p017",
    "slug": "behang-world-of-imagination-dl27593",
    "title": "Behang World of Imagination DL27593",
    "brand": "Spits Wallcoverings",
    "line": "World of Imagination",
    "categoryIds": [
      "c23"
    ],
    "primaryCategoryId": "c23",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27593_NGX6353_Road-Traffic_Red_Swatch_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27593"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27593_NGX6353_Road-Traffic_Red_Lifestyle-2_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27593 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27593_NGX6353_Road-Traffic_Red_Lifestyle-1_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27593 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p017-v1",
        "sku": "DEMO-P017-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.5,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Spits Wallcoverings"
      },
      {
        "label": "Collectie",
        "value": "World of Imagination"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 53 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Kinderbehang"
      ],
      "merk": [
        "Spits Wallcoverings"
      ]
    },
    "badges": [],
    "createdAt": "2026-04-08",
    "popularity": 49,
    "demo": true
  },
  {
    "id": "p018",
    "slug": "behang-world-of-imagination-dl27592",
    "title": "Behang World of Imagination DL27592",
    "brand": "Spits Wallcoverings",
    "line": "World of Imagination",
    "categoryIds": [
      "c23"
    ],
    "primaryCategoryId": "c23",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27592_NGX5304_Graffiti-Wall_Grey-Multi_Swatch_3000px.jpg",
        "alt": "World of Imagination - DL27592"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27592_NGX5304_Graffiti-Wall_Grey-Multi_Lifestyle-1_3000px.jpg",
        "alt": "World of Imagination - DL27592 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27592_NGX5304_Graffiti-Wall_Grey-Multi_Lifestyle-2_3000px.jpg",
        "alt": "World of Imagination - DL27592 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p018-v1",
        "sku": "DEMO-P018-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.5,
            "currency": "EUR"
          },
          "unit": "rol",
          "compareAt": {
            "amount": 69.5,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Spits Wallcoverings"
      },
      {
        "label": "Collectie",
        "value": "World of Imagination"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 53 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Kinderbehang"
      ],
      "merk": [
        "Spits Wallcoverings"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2026-04-05",
    "popularity": 50,
    "demo": true
  },
  {
    "id": "p019",
    "slug": "behang-world-of-imagination-dl27591",
    "title": "Behang World of Imagination DL27591",
    "brand": "Spits Wallcoverings",
    "line": "World of Imagination",
    "categoryIds": [
      "c23"
    ],
    "primaryCategoryId": "c23",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27591_NGX5395_Football-Fan_Green-Multi_Swatch_3000px.jpg",
        "alt": "World of Imagination - DL27591"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27591_NGX5395_Football-Fan_Green-Multi_Lifestyle-2_3000px.jpg",
        "alt": "World of Imagination - DL27591 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27591_NGX5395_Football-Fan_Green-Multi_Lifestyle-1_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27591 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p019-v1",
        "sku": "DEMO-P019-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.5,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Spits Wallcoverings"
      },
      {
        "label": "Collectie",
        "value": "World of Imagination"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 53 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Kinderbehang"
      ],
      "merk": [
        "Spits Wallcoverings"
      ]
    },
    "badges": [],
    "createdAt": "2026-04-02",
    "popularity": 51,
    "demo": true
  },
  {
    "id": "p020",
    "slug": "behang-world-of-imagination-dl27590",
    "title": "Behang World of Imagination DL27590",
    "brand": "Spits Wallcoverings",
    "line": "World of Imagination",
    "categoryIds": [
      "c23"
    ],
    "primaryCategoryId": "c23",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 40
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27590_NGX6839_Footballs_Grey_Swatch-scaled.jpg",
        "alt": "World of Imagination - DL27590"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27590_NGX6839_Footballs_Grey_Lifestyle-1_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27590 — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2026/05/DL27590_NGX6839_Footballs_Grey_Lifestyle-2_3000px-scaled.jpg",
        "alt": "World of Imagination - DL27590 — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p020-v1",
        "sku": "DEMO-P020-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.5,
            "currency": "EUR"
          },
          "unit": "rol"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Spits Wallcoverings"
      },
      {
        "label": "Collectie",
        "value": "World of Imagination"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per rol"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "Demo: 53 cm"
      },
      {
        "label": "Rollengte",
        "value": "Demo: 10,05 m"
      }
    ],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per rol"
      ],
      "type": [
        "Kinderbehang"
      ],
      "merk": [
        "Spits Wallcoverings"
      ]
    },
    "badges": [],
    "createdAt": "2026-03-30",
    "popularity": 52,
    "demo": true
  },
  {
    "id": "p021",
    "slug": "behangspatel-28-cm",
    "title": "Behangspatel 28 cm",
    "categoryIds": [
      "c24"
    ],
    "primaryCategoryId": "c24",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2022/07/Aandrukspatel.jpg",
        "alt": "Behangspatel 28cm"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p021-v1",
        "sku": "313517554",
        "options": {},
        "price": {
          "amount": {
            "amount": 4.55,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Gereedschap"
      ]
    },
    "badges": [],
    "createdAt": "2026-03-27",
    "popularity": 30,
    "demo": true
  },
  {
    "id": "p022",
    "slug": "behangspatel-perfax",
    "title": "Behangspatel Perfax",
    "brand": "Perfax",
    "categoryIds": [
      "c24"
    ],
    "primaryCategoryId": "c24",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1367558276-1.jpg",
        "alt": "Behangspatel Perfax"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p022-v1",
        "sku": "313516350",
        "options": {},
        "price": {
          "amount": {
            "amount": 6.5,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Perfax"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Gereedschap"
      ],
      "merk": [
        "Perfax"
      ]
    },
    "badges": [],
    "createdAt": "2026-03-24",
    "popularity": 28,
    "demo": true
  },
  {
    "id": "p023",
    "slug": "tapijt-ocerton-lao458",
    "title": "Tapijt Ocerton Lao458",
    "line": "Ocerton",
    "categoryIds": [
      "c32"
    ],
    "primaryCategoryId": "c32",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/2001930052.jpg",
        "alt": "Tapijt Ocerton Lao458 Taupe 160x230",
        "optionValue": "Taupe"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/2001916416.jpg",
        "alt": "Tapijt Ocerton Lao458 Taupe 160x230 — beeld 2",
        "optionValue": "Taupe"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/2001930094.jpg",
        "alt": "Tapijt Ocerton Lao458 Taupe 160x230 — beeld 3",
        "optionValue": "Taupe"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/2001908028.jpg",
        "alt": "Tapijt Ocerton Lao458 Silver 160x230",
        "optionValue": "Zilver"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/2001901541.jpg",
        "alt": "Tapijt Ocerton Lao458 Silver 160x230 — beeld 2",
        "optionValue": "Zilver"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/2001908038.jpg",
        "alt": "Tapijt Ocerton Lao458 Silver 160x230 — beeld 3",
        "optionValue": "Zilver"
      }
    ],
    "options": [
      {
        "name": "Kleur",
        "values": [
          {
            "value": "Taupe",
            "swatch": "#8b7d6b"
          },
          {
            "value": "Zilver",
            "swatch": "#c3c3c1"
          }
        ]
      },
      {
        "name": "Maat",
        "values": [
          {
            "value": "120 × 170 cm"
          },
          {
            "value": "160 × 230 cm"
          },
          {
            "value": "200 × 290 cm"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p023-v1",
        "sku": "DEMO-P023-1",
        "options": {
          "Kleur": "Taupe",
          "Maat": "120 × 170 cm"
        },
        "price": {
          "amount": {
            "amount": 169,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p023-v2",
        "sku": "DEMO-P023-2",
        "options": {
          "Kleur": "Taupe",
          "Maat": "160 × 230 cm"
        },
        "price": {
          "amount": {
            "amount": 249,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p023-v3",
        "sku": "DEMO-P023-3",
        "options": {
          "Kleur": "Taupe",
          "Maat": "200 × 290 cm"
        },
        "price": {
          "amount": {
            "amount": 349,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-bestelling"
      },
      {
        "id": "p023-v4",
        "sku": "DEMO-P023-4",
        "options": {
          "Kleur": "Zilver",
          "Maat": "120 × 170 cm"
        },
        "price": {
          "amount": {
            "amount": 169,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p023-v5",
        "sku": "DEMO-P023-5",
        "options": {
          "Kleur": "Zilver",
          "Maat": "160 × 230 cm"
        },
        "price": {
          "amount": {
            "amount": 249,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p023-v6",
        "sku": "DEMO-P023-6",
        "options": {
          "Kleur": "Zilver",
          "Maat": "200 × 290 cm"
        },
        "price": {
          "amount": {
            "amount": 349,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-bestelling"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Ocerton"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Formaten",
        "value": "120 × 170 · 160 × 230 · 200 × 290 cm"
      },
      {
        "label": "Poolhoogte",
        "value": "Demo: 12 mm"
      }
    ],
    "facets": {
      "kleur": [
        "Taupe",
        "Zilver"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Rechthoek"
      ],
      "type": [
        "Modern tapijt"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-18",
    "popularity": 92,
    "demo": true
  },
  {
    "id": "p024",
    "slug": "kindertapijt-oregano-bunny-120-170-cm",
    "title": "Kindertapijt Oregano Bunny 120 × 170 cm",
    "line": "Oregano",
    "categoryIds": [
      "c33"
    ],
    "primaryCategoryId": "c33",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733632331-1.jpg",
        "alt": "Oregano Lol181 Bunny 120cm x 170cm"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733638634-1.jpg",
        "alt": "Oregano Lol181 Bunny 120cm x 170cm — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733635193-1.jpg",
        "alt": "Oregano Lol181 Bunny 120cm x 170cm — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p024-v1",
        "sku": "767715023",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.96,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Blauw"
      },
      {
        "label": "Collectie",
        "value": "Oregano"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "120 × 170 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Blauw"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Rechthoek"
      ],
      "type": [
        "Kindertapijt"
      ]
    },
    "badges": [],
    "createdAt": "2026-03-18",
    "popularity": 55,
    "demo": true
  },
  {
    "id": "p025",
    "slug": "kindertapijt-oregano-bear-120-170-cm",
    "title": "Kindertapijt Oregano Bear 120 × 170 cm",
    "line": "Oregano",
    "categoryIds": [
      "c33"
    ],
    "primaryCategoryId": "c33",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733632809-1.jpg",
        "alt": "Oregano Lol181 Bear 120cm x 170cm"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733643324-1.jpg",
        "alt": "Oregano Lol181 Bear 120cm x 170cm — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733643329-1.jpg",
        "alt": "Oregano Lol181 Bear 120cm x 170cm — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p025-v1",
        "sku": "767715022",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.96,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Blauw"
      },
      {
        "label": "Collectie",
        "value": "Oregano"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "120 × 170 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Blauw"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Rechthoek"
      ],
      "type": [
        "Kindertapijt"
      ]
    },
    "badges": [],
    "createdAt": "2026-03-15",
    "popularity": 55,
    "demo": true
  },
  {
    "id": "p026",
    "slug": "kindertapijt-oregano-kitten-120-170-cm",
    "title": "Kindertapijt Oregano Kitten 120 × 170 cm",
    "line": "Oregano",
    "categoryIds": [
      "c33"
    ],
    "primaryCategoryId": "c33",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733606072-1.jpg",
        "alt": "Oregano Lol180 Kitten 120cm x 170cm"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733600303-1.jpg",
        "alt": "Oregano Lol180 Kitten 120cm x 170cm — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1733606077-1.jpg",
        "alt": "Oregano Lol180 Kitten 120cm x 170cm — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p026-v1",
        "sku": "767715020",
        "options": {},
        "price": {
          "amount": {
            "amount": 59.96,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Roze"
      },
      {
        "label": "Collectie",
        "value": "Oregano"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "120 × 170 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Roze"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Rechthoek"
      ],
      "type": [
        "Kindertapijt"
      ]
    },
    "badges": [],
    "createdAt": "2026-03-12",
    "popularity": 55,
    "demo": true
  },
  {
    "id": "p027",
    "slug": "kindertapijt-nijntje-tent-65-90-cm",
    "title": "Kindertapijt Nijntje Tent 65 × 90 cm",
    "line": "Nijntje",
    "categoryIds": [
      "c33"
    ],
    "primaryCategoryId": "c33",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1755261151-1.jpg",
        "alt": "Kindertapijt Nijntje Tent 65cm x 90cm"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p027-v1",
        "sku": "406715032",
        "options": {},
        "price": {
          "amount": {
            "amount": 19,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 64,
            "currency": "EUR"
          }
        },
        "availability": "beperkt"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Meerkleurig"
      },
      {
        "label": "Collectie",
        "value": "Nijntje"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "65 × 90 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Meerkleurig"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Rechthoek"
      ],
      "type": [
        "Kindertapijt"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2026-03-09",
    "popularity": 70,
    "demo": true
  },
  {
    "id": "p028",
    "slug": "kindertapijt-ferrari-mik147-85-45-cm",
    "title": "Kindertapijt Ferrari Mik147 85 × 45 cm",
    "line": "Ferrari",
    "categoryIds": [
      "c34"
    ],
    "primaryCategoryId": "c34",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2002255985-1.jpg",
        "alt": "Ferrari Mik147 Ca. 85cm x 45cm"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2002265561-1.jpg",
        "alt": "Ferrari Mik147 Ca. 85cm x 45cm — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2002255990-1.jpg",
        "alt": "Ferrari Mik147 Ca. 85cm x 45cm — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p028-v1",
        "sku": "767715017",
        "options": {},
        "price": {
          "amount": {
            "amount": 9,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Rood"
      },
      {
        "label": "Collectie",
        "value": "Ferrari"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "ca. 85 × 45 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Rood"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Rechthoek"
      ],
      "type": [
        "Kindertapijt"
      ]
    },
    "badges": [],
    "createdAt": "2026-03-06",
    "popularity": 35,
    "demo": true
  },
  {
    "id": "p029",
    "slug": "knoeimat-bacopa-madeliefjes-100-100-cm",
    "title": "Knoeimat Bacopa Madeliefjes 100 × 100 cm",
    "line": "Knoeimat",
    "categoryIds": [
      "c35"
    ],
    "primaryCategoryId": "c35",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2036617722-1.jpg",
        "alt": "Knoeimat 100cm Vierkant Bacopa Moonlight Madeliefjes"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p029-v1",
        "sku": "00050",
        "options": {},
        "price": {
          "amount": {
            "amount": 34.9,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Meerkleurig"
      },
      {
        "label": "Collectie",
        "value": "Knoeimat"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "100 × 100 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Meerkleurig"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Vierkant"
      ],
      "type": [
        "Knoeimat"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-11",
    "popularity": 40,
    "demo": true
  },
  {
    "id": "p030",
    "slug": "knoeimat-bacopa-kasseien-100-100-cm",
    "title": "Knoeimat Bacopa Kasseien 100 × 100 cm",
    "line": "Knoeimat",
    "categoryIds": [
      "c35"
    ],
    "primaryCategoryId": "c35",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2036645862-1.jpg",
        "alt": "Knoeimat 100cm Vierkant Bacopa Moonlight Kasseien"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p030-v1",
        "sku": "00057",
        "options": {},
        "price": {
          "amount": {
            "amount": 34.9,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Meerkleurig"
      },
      {
        "label": "Collectie",
        "value": "Knoeimat"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "100 × 100 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Meerkleurig"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Vierkant"
      ],
      "type": [
        "Knoeimat"
      ]
    },
    "badges": [],
    "createdAt": "2026-02-28",
    "popularity": 40,
    "demo": true
  },
  {
    "id": "p031",
    "slug": "knoeimat-trude-puzzel-100-100-cm",
    "title": "Knoeimat Trude Puzzel 100 × 100 cm",
    "line": "Knoeimat",
    "categoryIds": [
      "c35"
    ],
    "primaryCategoryId": "c35",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2036778337-1.jpg",
        "alt": "Knoeimat 100cm Vierkant Trude Puzzel 5331141"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p031-v1",
        "sku": "00062",
        "options": {},
        "price": {
          "amount": {
            "amount": 34.9,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Meerkleurig"
      },
      {
        "label": "Collectie",
        "value": "Knoeimat"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "100 × 100 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Meerkleurig"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Vierkant"
      ],
      "type": [
        "Knoeimat"
      ]
    },
    "badges": [],
    "createdAt": "2026-02-25",
    "popularity": 40,
    "demo": true
  },
  {
    "id": "p032",
    "slug": "knoeimat-bacopa-street-100-100-cm",
    "title": "Knoeimat Bacopa Street 100 × 100 cm",
    "line": "Knoeimat",
    "categoryIds": [
      "c35"
    ],
    "primaryCategoryId": "c35",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2036613849-1.jpg",
        "alt": "Knoeimat 100cm Vierkant Bacopa Moonlight Street"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p032-v1",
        "sku": "00059",
        "options": {},
        "price": {
          "amount": {
            "amount": 34.9,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Meerkleurig"
      },
      {
        "label": "Collectie",
        "value": "Knoeimat"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "100 × 100 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Meerkleurig"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Vierkant"
      ],
      "type": [
        "Knoeimat"
      ]
    },
    "badges": [],
    "createdAt": "2026-02-22",
    "popularity": 40,
    "demo": true
  },
  {
    "id": "p033",
    "slug": "knoeimat-babadag-disa-100-100-cm",
    "title": "Knoeimat Babadag Disa 100 × 100 cm",
    "line": "Knoeimat",
    "categoryIds": [
      "c35"
    ],
    "primaryCategoryId": "c35",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2036599059-1.jpg",
        "alt": "Knoeimat 100cm Vierkant Babadag Atlantic Disa 101S"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p033-v1",
        "sku": "00052",
        "options": {},
        "price": {
          "amount": {
            "amount": 24.99,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Beige"
      },
      {
        "label": "Collectie",
        "value": "Knoeimat"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "100 × 100 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Beige"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Vierkant"
      ],
      "type": [
        "Knoeimat"
      ]
    },
    "badges": [],
    "createdAt": "2026-02-19",
    "popularity": 40,
    "demo": true
  },
  {
    "id": "p034",
    "slug": "knoeimat-baker-zinc-100-100-cm",
    "title": "Knoeimat Baker Zinc 100 × 100 cm",
    "line": "Knoeimat",
    "categoryIds": [
      "c35"
    ],
    "primaryCategoryId": "c35",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2036570802-1.jpg",
        "alt": "Knoeimat 100cm Vierkant Baker Sonipro Zinc 139S"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p034-v1",
        "sku": "00053",
        "options": {},
        "price": {
          "amount": {
            "amount": 34.9,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Ecru"
      },
      {
        "label": "Collectie",
        "value": "Knoeimat"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [
      {
        "label": "Afmetingen",
        "value": "100 × 100 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Ecru"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "vorm": [
        "Vierkant"
      ],
      "type": [
        "Knoeimat"
      ]
    },
    "badges": [],
    "createdAt": "2026-02-16",
    "popularity": 40,
    "demo": true
  },
  {
    "id": "p035",
    "slug": "logotapijt-op-maat",
    "title": "Logotapijt op maat",
    "line": "Maatwerk",
    "categoryIds": [
      "c36",
      "c43"
    ],
    "primaryCategoryId": "c36",
    "pricing": "on-request",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2005432806-1.jpg",
        "alt": "Voetmat met logo / Logotapijt — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p035-v1",
        "sku": "DEMO-P035-1",
        "options": {},
        "price": null,
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Maatwerk"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Logotapijt"
      ]
    },
    "badges": [
      "op-maat"
    ],
    "createdAt": "2026-02-13",
    "popularity": 50,
    "demo": true
  },
  {
    "id": "p036",
    "slug": "vasttapijt-columbia",
    "title": "Vasttapijt Columbia",
    "line": "Columbia",
    "categoryIds": [
      "c41"
    ],
    "primaryCategoryId": "c41",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 0.5,
      "max": 200
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/10/1917364543.jpg",
        "alt": "Columbia 228 Groen 4M/5M",
        "optionValue": "Groen"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/10/1917410300.jpg",
        "alt": "Columbia 738 Bruin 4M/5M",
        "optionValue": "Bruin"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/10/1917580665.jpg",
        "alt": "Columbia 628 Beige 4M",
        "optionValue": "Beige"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/10/1917433332.jpg",
        "alt": "Columbia 008 Ivoor 4M/5M",
        "optionValue": "Ivoor"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/10/1917407026.jpg",
        "alt": "Columbia 448 Oranje 4M/5M",
        "optionValue": "Oranje"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/10/1917387390.jpg",
        "alt": "Columbia 598 Bourgogne 4M",
        "optionValue": "Bordeaux"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/10/1917428514.jpg",
        "alt": "Columbia 578 Rood 4M/5M",
        "optionValue": "Rood"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/10/1917577896.jpg",
        "alt": "Columbia 168 Blauw 4M/5M",
        "optionValue": "Blauw"
      }
    ],
    "options": [
      {
        "name": "Kleur",
        "values": [
          {
            "value": "Groen",
            "swatch": "#55703d"
          },
          {
            "value": "Bruin",
            "swatch": "#6c4a2f"
          },
          {
            "value": "Beige",
            "swatch": "#d8c6a6"
          },
          {
            "value": "Ivoor",
            "swatch": "#f2ead4"
          },
          {
            "value": "Oranje",
            "swatch": "#d8782c"
          },
          {
            "value": "Bordeaux",
            "swatch": "#6c1f2d"
          },
          {
            "value": "Rood",
            "swatch": "#b3232b"
          },
          {
            "value": "Blauw",
            "swatch": "#3f5b7d"
          }
        ]
      },
      {
        "name": "Rolbreedte",
        "values": [
          {
            "value": "4 m"
          },
          {
            "value": "5 m"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p036-v1",
        "sku": "404425029-1",
        "options": {
          "Kleur": "Groen",
          "Rolbreedte": "4 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v2",
        "sku": "404425029-2",
        "options": {
          "Kleur": "Groen",
          "Rolbreedte": "5 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v3",
        "sku": "404425029-3",
        "options": {
          "Kleur": "Bruin",
          "Rolbreedte": "4 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v4",
        "sku": "404425029-4",
        "options": {
          "Kleur": "Bruin",
          "Rolbreedte": "5 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v5",
        "sku": "404425029-5",
        "options": {
          "Kleur": "Beige",
          "Rolbreedte": "4 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v6",
        "sku": "404425029-6",
        "options": {
          "Kleur": "Beige",
          "Rolbreedte": "5 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v7",
        "sku": "404425029-7",
        "options": {
          "Kleur": "Ivoor",
          "Rolbreedte": "4 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v8",
        "sku": "404425029-8",
        "options": {
          "Kleur": "Ivoor",
          "Rolbreedte": "5 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v9",
        "sku": "404425029-9",
        "options": {
          "Kleur": "Oranje",
          "Rolbreedte": "4 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v10",
        "sku": "404425029-10",
        "options": {
          "Kleur": "Oranje",
          "Rolbreedte": "5 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v11",
        "sku": "404425029-11",
        "options": {
          "Kleur": "Bordeaux",
          "Rolbreedte": "4 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v12",
        "sku": "404425029-12",
        "options": {
          "Kleur": "Bordeaux",
          "Rolbreedte": "5 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v13",
        "sku": "404425029-13",
        "options": {
          "Kleur": "Rood",
          "Rolbreedte": "4 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v14",
        "sku": "404425029-14",
        "options": {
          "Kleur": "Rood",
          "Rolbreedte": "5 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v15",
        "sku": "404425029-15",
        "options": {
          "Kleur": "Blauw",
          "Rolbreedte": "4 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p036-v16",
        "sku": "404425029-16",
        "options": {
          "Kleur": "Blauw",
          "Rolbreedte": "5 m"
        },
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Columbia"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per m²"
      },
      {
        "label": "Certificaat",
        "value": "Demo: brandveiligheid op aanvraag"
      }
    ],
    "dimensions": [
      {
        "label": "Rolbreedte",
        "value": "4 m of 5 m"
      }
    ],
    "facets": {
      "kleur": [
        "Groen",
        "Bruin",
        "Beige",
        "Ivoor",
        "Oranje",
        "Bordeaux",
        "Rood",
        "Blauw"
      ],
      "eenheid": [
        "Per m²"
      ],
      "type": [
        "Vasttapijt"
      ]
    },
    "badges": [],
    "createdAt": "2026-02-10",
    "popularity": 88,
    "demo": true
  },
  {
    "id": "p037",
    "slug": "forbo-monel-vloeronderhoud",
    "title": "Forbo Monel vloeronderhoud",
    "brand": "Forbo",
    "line": "Monel",
    "categoryIds": [
      "c43"
    ],
    "primaryCategoryId": "c43",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1379955635-1.jpg",
        "alt": "Monel 1L",
        "optionValue": "1 L"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1379961910-1.jpg",
        "alt": "Monel 10L",
        "optionValue": "10 L"
      }
    ],
    "options": [
      {
        "name": "Inhoud",
        "values": [
          {
            "value": "1 L"
          },
          {
            "value": "10 L"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p037-v1",
        "sku": "DEMO-P037-1",
        "options": {
          "Inhoud": "1 L"
        },
        "price": {
          "amount": {
            "amount": 11.1,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 13.59,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p037-v2",
        "sku": "DEMO-P037-2",
        "options": {
          "Inhoud": "10 L"
        },
        "price": {
          "amount": {
            "amount": 49.99,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 79.99,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Merk",
        "value": "Forbo"
      },
      {
        "label": "Collectie",
        "value": "Monel"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Onderhoud"
      ],
      "merk": [
        "Forbo"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2026-02-07",
    "popularity": 42,
    "demo": true
  },
  {
    "id": "p038",
    "slug": "pvc-vloer-eik-naturel-voorbeeldproduct",
    "title": "PVC-vloer eik naturel (voorbeeldproduct)",
    "categoryIds": [
      "c42"
    ],
    "primaryCategoryId": "c42",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 0.5,
      "max": 200
    },
    "images": [],
    "options": [],
    "variants": [
      {
        "id": "p038-v1",
        "sku": "DEMO-P038-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Naturel"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per m²"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Naturel"
      ],
      "eenheid": [
        "Per m²"
      ],
      "type": [
        "PVC"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-20",
    "popularity": 30,
    "demo": true
  },
  {
    "id": "p039",
    "slug": "click-vinyl-tegellook-grijs-voorbeeldproduct",
    "title": "Click-vinyl tegellook grijs (voorbeeldproduct)",
    "categoryIds": [
      "c42"
    ],
    "primaryCategoryId": "c42",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 0.5,
      "max": 200
    },
    "images": [],
    "options": [],
    "variants": [
      {
        "id": "p039-v1",
        "sku": "DEMO-P039-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 39.95,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Grijs"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per m²"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Grijs"
      ],
      "eenheid": [
        "Per m²"
      ],
      "type": [
        "Click-vinyl"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-15",
    "popularity": 30,
    "demo": true
  },
  {
    "id": "p040",
    "slug": "laminaat-eik-rustiek-voorbeeldproduct",
    "title": "Laminaat eik rustiek (voorbeeldproduct)",
    "categoryIds": [
      "c41"
    ],
    "primaryCategoryId": "c41",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 0.5,
      "max": 200
    },
    "images": [],
    "options": [],
    "variants": [
      {
        "id": "p040-v1",
        "sku": "DEMO-P040-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 24.95,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Bruin"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per m²"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Bruin"
      ],
      "eenheid": [
        "Per m²"
      ],
      "type": [
        "Laminaat"
      ]
    },
    "badges": [],
    "createdAt": "2026-01-29",
    "popularity": 30,
    "demo": true
  },
  {
    "id": "p041",
    "slug": "grastapijt-lawn-voorbeeldproduct",
    "title": "Grastapijt Lawn (voorbeeldproduct)",
    "categoryIds": [
      "c43"
    ],
    "primaryCategoryId": "c43",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 0.5,
      "max": 200
    },
    "images": [],
    "options": [],
    "variants": [
      {
        "id": "p041-v1",
        "sku": "DEMO-P041-1",
        "options": {},
        "price": {
          "amount": {
            "amount": 12.95,
            "currency": "EUR"
          },
          "unit": "m2"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Groen"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per m²"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Groen"
      ],
      "eenheid": [
        "Per m²"
      ],
      "type": [
        "Grastapijt"
      ]
    },
    "badges": [],
    "createdAt": "2026-01-26",
    "popularity": 30,
    "demo": true
  },
  {
    "id": "p042",
    "slug": "stof-bedrukt-black-out-680310-c",
    "title": "Stof bedrukt black-out 680310 C",
    "categoryIds": [
      "c51"
    ],
    "primaryCategoryId": "c51",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2337922934-1.jpg",
        "alt": "Stof Bedrukt Black Out 680310 C 1,40m"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2337924514-1.jpg",
        "alt": "Stof Bedrukt Black Out 680310 C 1,40m — beeld 2"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p042-v1",
        "sku": "621658131",
        "options": {},
        "price": {
          "amount": {
            "amount": 19.99,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Meerkleurig"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [
      {
        "label": "Stofbreedte",
        "value": "140 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Meerkleurig"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Black-out"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-22",
    "popularity": 75,
    "demo": true
  },
  {
    "id": "p043",
    "slug": "stof-bedrukt-black-out-680310-y",
    "title": "Stof bedrukt black-out 680310 Y",
    "categoryIds": [
      "c51"
    ],
    "primaryCategoryId": "c51",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2337936614-1.jpg",
        "alt": "Stof Bedrukt Black Out 680310 Y 1,40m"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2337911996-1.jpg",
        "alt": "Stof Bedrukt Black Out 680310 Y 1,40m — beeld 2"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p043-v1",
        "sku": "621658132",
        "options": {},
        "price": {
          "amount": {
            "amount": 19.99,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Meerkleurig"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [
      {
        "label": "Stofbreedte",
        "value": "140 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Meerkleurig"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Black-out"
      ]
    },
    "badges": [],
    "createdAt": "2026-01-20",
    "popularity": 50,
    "demo": true
  },
  {
    "id": "p044",
    "slug": "stof-black-out-ibis-804-grijs",
    "title": "Stof black-out Ibis 804 grijs",
    "categoryIds": [
      "c51"
    ],
    "primaryCategoryId": "c51",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2363571218-1.jpg",
        "alt": "Stof Grijs Black Out Ibis 804 1,40m"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2363574663-1.jpg",
        "alt": "Stof Grijs Black Out Ibis 804 1,40m — beeld 2"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p044-v1",
        "sku": "841666005",
        "options": {},
        "price": {
          "amount": {
            "amount": 29.99,
            "currency": "EUR"
          },
          "unit": "meter",
          "compareAt": {
            "amount": 34.99,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Grijs"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [
      {
        "label": "Stofbreedte",
        "value": "140 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Grijs"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Black-out"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2026-01-17",
    "popularity": 82,
    "demo": true
  },
  {
    "id": "p045",
    "slug": "kinderstof-beertje-hartje",
    "title": "Kinderstof Beertje Hartje",
    "categoryIds": [
      "c52"
    ],
    "primaryCategoryId": "c52",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1408630695-1.jpg",
        "alt": "Beertje Hartje 16494 *** 1,40m"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p045-v1",
        "sku": "637646006",
        "options": {},
        "price": {
          "amount": {
            "amount": 7.5,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Meerkleurig"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [
      {
        "label": "Stofbreedte",
        "value": "140 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Meerkleurig"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Kinderstof"
      ]
    },
    "badges": [],
    "createdAt": "2026-01-14",
    "popularity": 50,
    "demo": true
  },
  {
    "id": "p046",
    "slug": "voering-polico-382096",
    "title": "Voering Polico 382096",
    "categoryIds": [
      "c52"
    ],
    "primaryCategoryId": "c52",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1407168999-1.jpg",
        "alt": "Voering Polico 382096"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p046-v1",
        "sku": "621611001",
        "options": {},
        "price": {
          "amount": {
            "amount": 6.99,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Ecru"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [
      {
        "label": "Stofbreedte",
        "value": "140 cm"
      }
    ],
    "facets": {
      "kleur": [
        "Ecru"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Voering"
      ]
    },
    "badges": [],
    "createdAt": "2026-01-11",
    "popularity": 65,
    "demo": true
  },
  {
    "id": "p047",
    "slug": "gordijnlint-wit-2-5-cm-gt7",
    "title": "Gordijnlint wit 2,5 cm GT7",
    "categoryIds": [
      "c53"
    ],
    "primaryCategoryId": "c53",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2326783710-1.jpg",
        "alt": "Gordijnlint Wit 2,5cm GT7"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p047-v1",
        "sku": "626616001",
        "options": {},
        "price": {
          "amount": {
            "amount": 1.4,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Gordijnlint"
      ]
    },
    "badges": [],
    "createdAt": "2026-01-08",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p048",
    "slug": "dubbelingslint-wit-2-5-cm-gt17",
    "title": "Dubbelingslint wit 2,5 cm GT17",
    "categoryIds": [
      "c53"
    ],
    "primaryCategoryId": "c53",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2335744561-1.jpg",
        "alt": "Dubbeling Lint Wit 2,5cm GT17"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2335743596-1.jpg",
        "alt": "Dubbeling Lint Wit 2,5cm GT17 — beeld 2"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p048-v1",
        "sku": "601615002",
        "options": {},
        "price": {
          "amount": {
            "amount": 1.5,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Gordijnlint"
      ]
    },
    "badges": [],
    "createdAt": "2026-01-05",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p049",
    "slug": "fronslint-wit-2-5-cm-gt3",
    "title": "Fronslint wit 2,5 cm GT3",
    "categoryIds": [
      "c53"
    ],
    "primaryCategoryId": "c53",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2326905039-1.jpg",
        "alt": "Fronslint wit 2,5cm GT3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p049-v1",
        "sku": "626615005",
        "options": {},
        "price": {
          "amount": {
            "amount": 1.4,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Fronslint"
      ]
    },
    "badges": [],
    "createdAt": "2026-01-02",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p050",
    "slug": "dubbel-fronslint-wit-5-cm-gt2",
    "title": "Dubbel fronslint wit 5 cm GT2",
    "categoryIds": [
      "c53"
    ],
    "primaryCategoryId": "c53",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2327248821-1.jpg",
        "alt": "Dubbel Fronslint wit 5cm GT2"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p050-v1",
        "sku": "601615004",
        "options": {},
        "price": {
          "amount": {
            "amount": 2.1,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Fronslint"
      ]
    },
    "badges": [],
    "createdAt": "2025-12-30",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p051",
    "slug": "groot-fronslint-wit-7-cm-gt12",
    "title": "Groot fronslint wit 7 cm GT12",
    "categoryIds": [
      "c53"
    ],
    "primaryCategoryId": "c53",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2335684559-1.jpg",
        "alt": "Groot Fronslint Wit 7cm GT12"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p051-v1",
        "sku": "601615001",
        "options": {},
        "price": {
          "amount": {
            "amount": 3.99,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Fronslint"
      ]
    },
    "badges": [],
    "createdAt": "2025-12-27",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p052",
    "slug": "velcro-zacht-klevend-2-cm",
    "title": "Velcro zacht klevend 2 cm",
    "categoryIds": [
      "c54"
    ],
    "primaryCategoryId": "c54",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2336116210-1.jpg",
        "alt": "Velcro Zacht Klevend 2cm"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p052-v1",
        "sku": "625601001",
        "options": {},
        "price": {
          "amount": {
            "amount": 2.5,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Velcro"
      ]
    },
    "badges": [],
    "createdAt": "2025-12-24",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p053",
    "slug": "velcro-hard-klevend-2-cm",
    "title": "Velcro hard klevend 2 cm",
    "categoryIds": [
      "c54"
    ],
    "primaryCategoryId": "c54",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2335791735-1.jpg",
        "alt": "Velcro Hard Klevend 2cm"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p053-v1",
        "sku": "621601002",
        "options": {},
        "price": {
          "amount": {
            "amount": 1.79,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Velcro"
      ]
    },
    "badges": [],
    "createdAt": "2025-12-21",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p054",
    "slug": "velcro-zacht-om-te-stikken-2-cm",
    "title": "Velcro zacht om te stikken 2 cm",
    "categoryIds": [
      "c54"
    ],
    "primaryCategoryId": "c54",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2335940886-1.jpg",
        "alt": "Velcro Zacht Om Te Stikken 2cm"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p054-v1",
        "sku": "621601001",
        "options": {},
        "price": {
          "amount": {
            "amount": 1.79,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Velcro"
      ]
    },
    "badges": [],
    "createdAt": "2025-12-18",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p055",
    "slug": "velcro-hard-om-te-stikken-2-cm",
    "title": "Velcro hard om te stikken 2 cm",
    "categoryIds": [
      "c54"
    ],
    "primaryCategoryId": "c54",
    "pricing": "fixed",
    "quantity": {
      "min": 0.5,
      "step": 0.5,
      "max": 50
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2335880793-1.jpg",
        "alt": "Velcro Hard Om Te Stikken 2cm"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p055-v1",
        "sku": "621601005",
        "options": {},
        "price": {
          "amount": {
            "amount": 1.3,
            "currency": "EUR"
          },
          "unit": "meter"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per lopende meter"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per lopende meter"
      ],
      "type": [
        "Velcro"
      ]
    },
    "badges": [],
    "createdAt": "2025-12-15",
    "popularity": 38,
    "demo": true
  },
  {
    "id": "p056",
    "slug": "hoofdkussen-orthopedisch-50-60-cm",
    "title": "Hoofdkussen orthopedisch 50 × 60 cm",
    "categoryIds": [
      "c60"
    ],
    "primaryCategoryId": "c60",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1335960726-1.jpg",
        "alt": "Hoofdkussen 50 x 60 cm - Oreiller Orthopédique met ristssluiting"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1336066207-1.jpg",
        "alt": "Hoofdkussen 50 x 60 cm - Oreiller Orthopédique met ristssluiting — beeld 2"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p056-v1",
        "sku": "242205002",
        "options": {},
        "price": {
          "amount": {
            "amount": 19.99,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 39.99,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Hoofdkussen"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2025-12-12",
    "popularity": 58,
    "demo": true
  },
  {
    "id": "p057",
    "slug": "hoofdkussen-bengali-60-60-cm",
    "title": "Hoofdkussen Bengali 60 × 60 cm",
    "categoryIds": [
      "c60"
    ],
    "primaryCategoryId": "c60",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1336176360-1.jpg",
        "alt": "Hoofdkussen 60 x 60 cm - Bengali met ristssluiting"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1336175470-1.jpg",
        "alt": "Hoofdkussen 60 x 60 cm - Bengali met ristssluiting — beeld 2"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p057-v1",
        "sku": "737205002",
        "options": {},
        "price": {
          "amount": {
            "amount": 19.9,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 33,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Hoofdkussen"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2025-12-09",
    "popularity": 58,
    "demo": true
  },
  {
    "id": "p058",
    "slug": "hoofdkussen-basis-60-60-cm",
    "title": "Hoofdkussen basis 60 × 60 cm",
    "categoryIds": [
      "c60"
    ],
    "primaryCategoryId": "c60",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1336224666-1.jpg",
        "alt": "Hoofdkussen 60 x 60 cm"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p058-v1",
        "sku": "206205001",
        "options": {},
        "price": {
          "amount": {
            "amount": 8.99,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 15.99,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Hoofdkussen"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2025-12-06",
    "popularity": 58,
    "demo": true
  },
  {
    "id": "p059",
    "slug": "hoofdkussen-deep-sleep-traagschuim-45-70-cm",
    "title": "Hoofdkussen Deep Sleep traagschuim 45 × 70 cm",
    "categoryIds": [
      "c60"
    ],
    "primaryCategoryId": "c60",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/Sleep-Deep-1.jpg",
        "alt": "Hoofdkussen 45 x 70 cm - Deep Sleep Traagschuim"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/Sleep-Deep-2.jpg",
        "alt": "Hoofdkussen 45 x 70 cm - Deep Sleep Traagschuim — beeld 2"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/05/Sleep-Deep-3.jpg",
        "alt": "Hoofdkussen 45 x 70 cm - Deep Sleep Traagschuim — beeld 3"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p059-v1",
        "sku": "242205004",
        "options": {},
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 49.95,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Hoofdkussen"
      ]
    },
    "badges": [
      "nieuw",
      "aanbieding"
    ],
    "createdAt": "2026-09-19",
    "popularity": 58,
    "demo": true
  },
  {
    "id": "p060",
    "slug": "hoofdkussen-plumka-ultra-rest-60-60-cm",
    "title": "Hoofdkussen Plumka Ultra Rest 60 × 60 cm",
    "categoryIds": [
      "c60"
    ],
    "primaryCategoryId": "c60",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1331331517-1.jpg",
        "alt": "Hoofdkussen 60 x 60 cm - Plumka Ultra Rest"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p060-v1",
        "sku": "205205001",
        "options": {},
        "price": {
          "amount": {
            "amount": 34.95,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 41.5,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Kleur",
        "value": "Wit"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Wit"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Hoofdkussen"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2025-11-30",
    "popularity": 58,
    "demo": true
  },
  {
    "id": "p061",
    "slug": "panda-vulling-1-kg",
    "title": "Panda vulling 1 kg",
    "categoryIds": [
      "c61"
    ],
    "primaryCategoryId": "c61",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/1374074788-1.jpg",
        "alt": "Panda Vulling 1kg"
      }
    ],
    "options": [],
    "variants": [
      {
        "id": "p061-v1",
        "sku": "201206001",
        "options": {},
        "price": {
          "amount": {
            "amount": 12.5,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Vulling"
      ]
    },
    "badges": [],
    "createdAt": "2025-11-27",
    "popularity": 25,
    "demo": true
  },
  {
    "id": "p062",
    "slug": "dekbedovertrek-aurore",
    "title": "Dekbedovertrek Aurore",
    "line": "Aurore",
    "categoryIds": [
      "c62"
    ],
    "primaryCategoryId": "c62",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2160079868-1.jpg",
        "alt": "Dekbedovertrek Aurore 140cm x 200cm",
        "optionValue": "140 × 200 cm"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2160366063-1.jpg",
        "alt": "Dekbedovertrek Aurore 240cm x 220cm",
        "optionValue": "240 × 220 cm"
      }
    ],
    "options": [
      {
        "name": "Maat",
        "values": [
          {
            "value": "140 × 200 cm"
          },
          {
            "value": "240 × 220 cm"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p062-v1",
        "sku": "DEMO-P062-1",
        "options": {
          "Maat": "140 × 200 cm"
        },
        "price": {
          "amount": {
            "amount": 55.96,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 69.95,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p062-v2",
        "sku": "DEMO-P062-2",
        "options": {
          "Maat": "240 × 220 cm"
        },
        "price": {
          "amount": {
            "amount": 87.96,
            "currency": "EUR"
          },
          "unit": "stuk",
          "compareAt": {
            "amount": 109.95,
            "currency": "EUR"
          }
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Aurore"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Dekbedovertrek"
      ]
    },
    "badges": [
      "aanbieding"
    ],
    "createdAt": "2025-11-24",
    "popularity": 66,
    "demo": true
  },
  {
    "id": "p063",
    "slug": "dekbedovertrek-arabesk",
    "title": "Dekbedovertrek Arabesk",
    "line": "Arabesk",
    "categoryIds": [
      "c62"
    ],
    "primaryCategoryId": "c62",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2160081599-1.jpg",
        "alt": "Dekbedovertrek Arabesk 140cm x 200cm",
        "optionValue": "140 × 200 cm"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2021/09/2160081599-1.jpg",
        "alt": "Dekbedovertrek Arabesk 240cm x 220cm",
        "optionValue": "240 × 220 cm"
      }
    ],
    "options": [
      {
        "name": "Maat",
        "values": [
          {
            "value": "140 × 200 cm"
          },
          {
            "value": "240 × 220 cm"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p063-v1",
        "sku": "DEMO-P063-1",
        "options": {
          "Maat": "140 × 200 cm"
        },
        "price": {
          "amount": {
            "amount": 69.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p063-v2",
        "sku": "DEMO-P063-2",
        "options": {
          "Maat": "240 × 220 cm"
        },
        "price": {
          "amount": {
            "amount": 109.95,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Arabesk"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Dekbedovertrek"
      ]
    },
    "badges": [
      "nieuw"
    ],
    "createdAt": "2026-09-24",
    "popularity": 52,
    "demo": true
  },
  {
    "id": "p064",
    "slug": "dekbedovertrek-iris",
    "title": "Dekbedovertrek Iris",
    "line": "Iris",
    "categoryIds": [
      "c62"
    ],
    "primaryCategoryId": "c62",
    "pricing": "fixed",
    "quantity": {
      "min": 1,
      "step": 1,
      "max": 20
    },
    "images": [
      {
        "src": "https://brunic.be/wp-content/uploads/2022/04/IRIS_240_AUBURN_2.png",
        "alt": "Dekbedovertrek Iris Auburn 240cm x 220cm",
        "optionValue": "Auburn"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/04/IRIS_UNI_INDIANTAN_3437_3438_9515_IVORY-scaled.jpg",
        "alt": "Dekbedovertrek Iris Indian 240cm x 220cm",
        "optionValue": "Indian"
      },
      {
        "src": "https://brunic.be/wp-content/uploads/2022/04/IRIS_240_INDIANTAN_2.png",
        "alt": "Dekbedovertrek Iris Indian 240cm x 220cm — beeld 2",
        "optionValue": "Indian"
      }
    ],
    "options": [
      {
        "name": "Kleur",
        "values": [
          {
            "value": "Auburn",
            "swatch": "#8a3b24"
          },
          {
            "value": "Indian",
            "swatch": "#2f4f6b"
          }
        ]
      },
      {
        "name": "Maat",
        "values": [
          {
            "value": "140 × 200 cm"
          },
          {
            "value": "240 × 220 cm"
          }
        ]
      }
    ],
    "variants": [
      {
        "id": "p064-v1",
        "sku": "DEMO-P064-1",
        "options": {
          "Kleur": "Auburn",
          "Maat": "140 × 200 cm"
        },
        "price": {
          "amount": {
            "amount": 47.5,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p064-v2",
        "sku": "DEMO-P064-2",
        "options": {
          "Kleur": "Auburn",
          "Maat": "240 × 220 cm"
        },
        "price": {
          "amount": {
            "amount": 74.99,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p064-v3",
        "sku": "DEMO-P064-3",
        "options": {
          "Kleur": "Indian",
          "Maat": "140 × 200 cm"
        },
        "price": {
          "amount": {
            "amount": 47.5,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      },
      {
        "id": "p064-v4",
        "sku": "DEMO-P064-4",
        "options": {
          "Kleur": "Indian",
          "Maat": "240 × 220 cm"
        },
        "price": {
          "amount": {
            "amount": 74.99,
            "currency": "EUR"
          },
          "unit": "stuk"
        },
        "availability": "op-voorraad"
      }
    ],
    "highlights": [
      "Lorem ipsum dolor sit amet",
      "Consectetur adipiscing elit",
      "Sed do eiusmod tempor"
    ],
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "specs": [
      {
        "label": "Collectie",
        "value": "Iris"
      },
      {
        "label": "Verkoopeenheid",
        "value": "Per stuk"
      }
    ],
    "dimensions": [],
    "facets": {
      "kleur": [
        "Bruin",
        "Blauw"
      ],
      "eenheid": [
        "Per stuk"
      ],
      "type": [
        "Dekbedovertrek"
      ]
    },
    "badges": [],
    "createdAt": "2025-11-18",
    "popularity": 48,
    "demo": true
  }
];
