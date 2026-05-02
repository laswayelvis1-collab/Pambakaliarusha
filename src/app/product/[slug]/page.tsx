import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ProductClient } from "./ProductClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price_cents: number;
  original_price_cents: number | null;
  stock: number;
  sizes: string[] | null;
  colors: { value: string; label: string; hex: string }[] | null;
  image_urls: string[] | null;
  category: string | null;
  is_active: boolean;
}

interface RelatedProduct {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
  original_price_cents: number | null;
  image_urls: string[] | null;
  category: string | null;
}

async function getProduct(slug: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    const { getProductBySlug } = await import("@/lib/mockData");
    const p = getProductBySlug(slug);
    if (!p) return null;
    return {
      ...p,
      image_urls: p.image_urls,
      colors: p.colors as any,
      is_active: true,
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    return null;
  }

  return product as Product;
}

async function getRelatedProducts(category: string | null, excludeId: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    const { products: mockProducts } = await import("@/lib/mockData");
    return mockProducts.filter((p) => p.id !== excludeId && p.category === category).slice(0, 4) as any;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let query = supabase
    .from("products")
    .select("id, title, slug, price_cents, original_price_cents, image_urls, category")
    .eq("is_active", true)
    .neq("id", excludeId);

  if (category) {
    query = query.eq("category", category);
  }

  const { data: products } = await query.limit(4);

  return (products || []) as RelatedProduct[];
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category || null, product.id);

  return (
    <ProductClient
      product={product as any}
      relatedProducts={relatedProducts as any}
    />
  );
}