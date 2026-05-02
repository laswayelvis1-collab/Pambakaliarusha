import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getAuthedUser } from "@/lib/auth/getAuthedUser";
import { OrderClient } from "./OrderClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface OrderItem {
  id: string;
  title: string;
  image_url: string | null;
  size: string;
  color: string;
  qty: number;
  unit_price_cents: number;
}

interface Order {
  id: string;
  status: string;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_address: any;
  created_at: string;
  items: OrderItem[];
}

async function getOrder(orderId: string, userId: string) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .single();

  if (error || !order) {
    return null;
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  return {
    ...order,
    items: items || [],
  } as Order;
}

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const user = await getAuthedUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const order = await getOrder(id, user.user_id);

  if (!order) {
    notFound();
  }

  return <OrderClient order={order as any} />;
}