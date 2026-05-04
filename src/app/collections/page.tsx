import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collections - Pambakali Arusha",
  description: "Explore our curated collections",
};

export default function CollectionsPage() {
  const collections = [
    { name: "Summer Collection", description: "Light and breezy styles for warm days", slug: "summer" },
    { name: "Evening Wear", description: "Elegant pieces for special occasions", slug: "evening" },
    { name: "Casual Essentials", description: "Comfortable everyday wear", slug: "casual" },
    { name: "Accessories", description: "Complete your look with our accessories", slug: "accessories" },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Collections</h1>
        <p className="text-muted-foreground mb-8">
          Explore our curated collections designed for every occasion.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/shop?collection=${collection.slug}`}
              className="p-8 bg-card rounded-xl hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold text-xl mb-2">{collection.name}</h3>
              <p className="text-muted-foreground">{collection.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}