import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New Arrivals - Pambakali Arusha",
  description: "Discover our latest collections and new arrivals",
};

export default function NewArrivalsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">New Arrivals</h1>
        <p className="text-muted-foreground mb-8">
          Discover our latest collections and new arrivals at Pambakali Arusha.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Latest Styles</h3>
            <p className="text-muted-foreground text-sm">Fresh arrivals updated weekly</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Trending Now</h3>
            <p className="text-muted-foreground text-sm">Most popular items this season</p>
          </div>
          <div className="p-6 bg-card rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Exclusive Drops</h3>
            <p className="text-muted-foreground text-sm">Limited edition releases</p>
          </div>
        </div>
        <div className="mt-8">
          <Link href="/shop" className="text-primary hover:underline">
            Browse all products →
          </Link>
        </div>
      </div>
    </div>
  );
}