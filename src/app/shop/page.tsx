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

async function getProducts() {
  if (!supabaseUrl || !supabaseServiceKey) {
    const { products, getActiveProducts } = await import("@/lib/mockData");
    return getActiveProducts().map((p) => ({
      ...p,
      image_urls: p.image_urls,
    }));
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, slug, price_cents, original_price_cents, stock, category, image_urls")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !products) {
    const { products: mockProducts, getActiveProducts } = await import("@/lib/mockData");
    return getActiveProducts();
  }

  return products as Product[];
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <section className="py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Shop All
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover our curated collection of premium essentials for the modern wardrobe.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
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
          )}
        </div>
      </section>
    </div>
  );
}