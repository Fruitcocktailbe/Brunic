type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

/**
 * next/image loader die de Shopify CDN-transformaties gebruikt.
 * Shopify genereert zelf responsive formaten via ?width= ; we betalen dus geen
 * Vercel Image Optimization. `quality` kent de Shopify CDN niet — bewust genegeerd.
 */
export default function shopifyImageLoader({ src, width }: LoaderProps): string {
  if (!src.startsWith("http")) return src;

  const url = new URL(src);
  url.searchParams.set("width", String(width));
  return url.toString();
}
