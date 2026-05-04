import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pambakali Arusha | Premium Shopping Experience in Tanzania",
  description: "Discover exquisite collections, new arrivals, and premium products at Pambakali Arusha. Shop online for clothing, shoes, accessories and more in Arusha.",
  keywords: ["shopping", "e-commerce", "Arusha", "Tanzania", "clothing", "shoes", "accessories", "online store"],
  authors: [{ name: "Pambakali Arusha" }],
  openGraph: {
    title: "Pambakali Arusha | Premium Shopping Experience",
    description: "Discover exquisite collections and new arrivals at Pambakali Arusha",
    url: "https://agstorearusha.vercel.app",
    siteName: "Pambakali Arusha",
    locale: "en_TZ",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        
        {/* Global scripts - use Next.js Script component */}
        {/* Example: Add analytics or third-party scripts here */}
        {/* <Script src="..." strategy="afterInteractive" /> */}
      </body>
    </html>
  );
}