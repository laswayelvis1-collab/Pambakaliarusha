import { MetadataRoute } from 'next';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://agstorearusha.vercel.app';

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/new-arrivals`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [];

  if (supabaseUrl && supabaseServiceKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data: products } = await supabase
        .from("products")
        .select("slug, updated_at")
        .eq("is_active", true)
        .limit(100);

      if (products) {
        products.forEach((product) => {
          dynamicPages.push({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: new Date(product.updated_at || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          });
        });
      }
    } catch (e) {
      console.error('Sitemap error:', e);
    }
  }

  return [...staticPages, ...dynamicPages];
}