import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";
import { CartClient } from "./CartClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface CartItemData {
  id: string;
  size: string;
  color: string;
  qty: number;
  unit_price_cents: number;
  product_id: string;
  products: {
    title: string;
    image_urls: string[];
    slug: string;
  }[] | null;
}

async function getCartData(userId: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return { items: [], error: "Database not configured" };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      size,
      color,
      qty,
      unit_price_cents,
      product_id,
      products(title, image_urls, slug)
    `)
    .eq("cart_user_id", userId) as { data: CartItemData[] | null; error: Error | null };

  if (error || !cartItems) {
    return { items: [], error: error?.message || "Failed to load cart" };
  }

  return {
    items: cartItems.map((item) => {
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      return {
        id: item.id,
        productId: item.product_id,
        title: product?.title || "Unknown Product",
        image: product?.image_urls?.[0] || "/placeholder.jpg",
        size: item.size,
        color: item.color,
        price: item.unit_price_cents / 100,
        quantity: item.qty,
        slug: product?.slug || "",
      };
    }),
    error: null,
  };
}

export default async function CartPage() {
  const user = await getAuthedUser();

  if (!user) {
    redirect("/login");
  }

  const { items, error } = await getCartData(user.user_id);

  return <CartClient initialItems={items} error={error} />;
}