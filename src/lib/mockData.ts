export interface Product {
  id: string;
  title: string;
  slug: string;
  price_cents: number;
  original_price_cents?: number;
  stock: number;
  is_active: boolean;
  sizes: string[];
  colors: { value: string; label: string; hex: string }[];
  image_urls: string[];
  category?: string;
  description?: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Classic Oxford Shirt",
    slug: "classic-oxford-shirt",
    price_cents: 8999,
    original_price_cents: 11999,
    stock: 50,
    is_active: true,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { value: "white", label: "White", hex: "#ffffff" },
      { value: "blue", label: "Navy Blue", hex: "#1e3a5f" },
      { value: "pink", label: "Light Pink", hex: "#f4c2c2" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&h=1000&fit=crop",
    ],
    category: "Shirts",
    description: "A timeless oxford shirt crafted from premium cotton for everyday elegance.",
  },
  {
    id: "2",
    title: "Merino Wool Sweater",
    slug: "merino-wool-sweater",
    price_cents: 14999,
    stock: 30,
    is_active: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { value: "charcoal", label: "Charcoal", hex: "#36454f" },
      { value: "camel", label: "Camel", hex: "#c19a6b" },
      { value: "navy", label: "Navy", hex: "#1e3a5f" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop",
    ],
    category: "Knitwear",
    description: "Luxuriously soft merino wool sweater with a modern slim fit.",
  },
  {
    id: "3",
    title: "Slim Fit Chinos",
    slug: "slim-fit-chinos",
    price_cents: 7999,
    original_price_cents: 9999,
    stock: 45,
    is_active: true,
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { value: "khaki", label: "Khaki", hex: "#c3b091" },
      { value: "olive", label: "Olive", hex: "#556b2f" },
      { value: "navy", label: "Navy", hex: "#1e3a5f" },
      { value: "black", label: "Black", hex: "#1a1a1a" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop",
    ],
    category: "Pants",
    description: "Versatile slim fit chinos in premium cotton twill.",
  },
  {
    id: "4",
    title: "Linen Blend Blazer",
    slug: "linen-blend-blazer",
    price_cents: 24999,
    stock: 20,
    is_active: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { value: "beige", label: "Beige", hex: "#d4c4a8" },
      { value: "stone", label: "Stone", hex: "#928e85" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop",
    ],
    category: "Blazers",
    description: "Lightweight linen blend blazer perfect for summer occasions.",
  },
  {
    id: "5",
    title: "Premium Cotton T-Shirt",
    slug: "premium-cotton-tshirt",
    price_cents: 3999,
    stock: 100,
    is_active: true,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { value: "white", label: "White", hex: "#ffffff" },
      { value: "black", label: "Black", hex: "#1a1a1a" },
      { value: "gray", label: "Heather Gray", hex: "#9ca3af" },
      { value: "navy", label: "Navy", hex: "#1e3a5f" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
    ],
    category: "T-Shirts",
    description: "Essential crew neck t-shirt in premium ring-spun cotton.",
  },
  {
    id: "6",
    title: "Tailored Dress Pants",
    slug: "tailored-dress-pants",
    price_cents: 11999,
    stock: 35,
    is_active: true,
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { value: "charcoal", label: "Charcoal", hex: "#36454f" },
      { value: "navy", label: "Navy", hex: "#1e3a5f" },
      { value: "black", label: "Black", hex: "#1a1a1a" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop",
    ],
    category: "Pants",
    description: "Classic tailored dress pants with a modern slim silhouette.",
  },
  {
    id: "7",
    title: "Silk Tie Set",
    slug: "silk-tie-set",
    price_cents: 6999,
    original_price_cents: 8999,
    stock: 25,
    is_active: true,
    sizes: ["One Size"],
    colors: [
      { value: "burgundy", label: "Burgundy", hex: "#722f37" },
      { value: "navy", label: "Navy", hex: "#1e3a5f" },
      { value: "gray", label: "Silver", hex: "#9ca3af" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800&h=1000&fit=crop",
    ],
    category: "Accessories",
    description: "Handcrafted silk tie set with matching pocket square.",
  },
  {
    id: "8",
    title: "Leather Belt",
    slug: "leather-belt",
    price_cents: 5999,
    stock: 60,
    is_active: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { value: "brown", label: "Brown", hex: "#8b4513" },
      { value: "black", label: "Black", hex: "#1a1a1a" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop",
    ],
    category: "Accessories",
    description: "Full-grain leather belt with classic brushed buckle.",
  },
  {
    id: "9",
    title: "Casual Denim Jacket",
    slug: "casual-denim-jacket",
    price_cents: 12999,
    stock: 15,
    is_active: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { value: "indigo", label: "Indigo", hex: "#4b0082" },
      { value: "light", label: "Light Wash", hex: "#87ceeb" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=1000&fit=crop",
    ],
    category: "Jackets",
    description: "Classic denim jacket with vintage wash finish.",
  },
  {
    id: "10",
    title: "Cotton Polo Shirt",
    slug: "cotton-polo-shirt",
    price_cents: 5499,
    stock: 70,
    is_active: true,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { value: "white", label: "White", hex: "#ffffff" },
      { value: "black", label: "Black", hex: "#1a1a1a" },
      { value: "navy", label: "Navy", hex: "#1e3a5f" },
      { value: "forest", label: "Forest Green", hex: "#228b22" },
    ],
    image_urls: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&h=1000&fit=crop",
    ],
    category: "Polos",
    description: "Premium cotton polo with reinforced collar and mother-of-pearl buttons.",
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getActiveProducts = (): Product[] => {
  return products.filter((p) => p.is_active);
};