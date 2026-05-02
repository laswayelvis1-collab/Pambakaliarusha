import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ProductCard } from "@/components/ProductCard";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface Product {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
  original_price_cents: number | null;
  stock: number;
  category: string | null;
  image_urls: string[] | null;
}

async function getFeaturedProducts() {
  if (!supabaseUrl || !supabaseServiceKey) {
    const { products } = await import("@/lib/mockData");
    return products.slice(0, 4).map((p) => ({
      ...p,
      image_urls: p.image_urls,
    }));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: products } = await supabase
    .from("products")
    .select("id, title, slug, price_cents, original_price_cents, stock, category, image_urls")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (products || []) as Product[];
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Welcome to <span className="font-extrabold tracking-tight">Pamba</span>kaliarusha
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover our exquisite collections and premium products curated for
            the discerning shopper.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg premium-3d-button hover:bg-primary/90 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/collections"
              className="px-8 py-3 border border-border text-foreground font-medium rounded-lg premium-3d-elevated hover:bg-accent transition-colors"
            >
              View Collections
            </Link>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked favorites from our latest collection
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.title}
                  price={product.price_cents / 100}
                  originalPrice={
                    product.original_price_cents
                      ? product.original_price_cents / 100
                      : undefined
                  }
                  image={product.image_urls?.[0] || "/placeholder.jpg"}
                  category={product.category}
                  isNew={product.stock > 40}
                  isSale={!!product.original_price_cents}
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                View All Products
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}