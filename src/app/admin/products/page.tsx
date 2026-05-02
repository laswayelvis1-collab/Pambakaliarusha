import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";
import { AdminProductsClient } from "./AdminProductsClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getProductsData() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { products: [], error: "Database not configured" };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title, slug, price_cents, original_price_cents, stock, is_active, category, image_urls, created_at")
    .order("created_at", { ascending: false });

  return {
    products:
      products?.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price_cents / 100,
        originalPrice: p.original_price_cents ? p.original_price_cents / 100 : null,
        stock: p.stock,
        isActive: p.is_active,
        category: p.category,
        imageUrl: p.image_urls?.[0] || null,
      })) || [],
    error: error?.message || null,
  };
}

export default async function AdminProductsPage() {
  const user = await getAuthedUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    notFound();
  }

  const { products, error } = await getProductsData();

  return <AdminProductsClient initialProducts={products} error={error} />;
}