import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Pambakali Arusha",
  description: "Learn about Pambakali Arusha - your premier shopping destination",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">About Pambakali Arusha</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground text-lg mb-6">
            Welcome to Pambakali Arusha, your premier destination for quality products in Arusha, Tanzania.
            We take pride in offering a curated selection of items that combine style, quality, and value.
          </p>

          <div className="space-y-8 mt-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Our Story</h2>
              <p className="text-muted-foreground">
                Founded with a vision to bring the best shopping experience to Arusha, Pambakali Arusha
                has grown to become a trusted name in the community. We believe in providing exceptional
                products that meet the diverse needs of our customers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                Our mission is simple: to provide high-quality products at competitive prices while
                delivering outstanding customer service. We continuously strive to expand our selection
                and improve our services to better serve our community.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Why Choose Us</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Quality products from trusted brands</li>
                <li>Competitive pricing</li>
                <li>Wide selection of items</li>
                <li>Secure online shopping</li>
                <li>Fast and reliable delivery</li>
                <li>Excellent customer support</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                Have questions? We'd love to hear from you. Visit our contact page or reach out
                through our social media channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}