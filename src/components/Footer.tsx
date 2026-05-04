"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Best Sellers", href: "/best-sellers" },
    { name: "Collections", href: "/collections" },
    { name: "Sale", href: "/sale" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Sustainability", href: "/sustainability" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "WhatsApp", href: "https://wa.me/255699122947" },
  { name: "Instagram", href: "https://instagram.com/ag_store_tz" },
  { name: "TikTok", href: "https://tiktok.com/@ag_store_arusha" },
];

function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "WhatsApp":
      return (
        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="#25D366">
          <path d="M16.003 2.667C8.587 2.667 2.665 8.6 2.665 16.017c0 2.584.745 5.018 2.049 7.17l-1.664 6.35c-.142.536.312 1.022.87.935l6.527-1.013c1.856.958 3.984 1.546 6.244 1.546 7.417 0 13.34-5.933 13.34-13.35S23.42 2.667 16.003 2.667z"/>
        </svg>
      );
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.225-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.204.013-3.583.069-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor" />
        </svg>
      );
    case "TikTok":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
        </svg>
      );
    default:
      return null;
  }
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Join Our Newsletter
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to receive updates, access to exclusive deals, and
                more.
              </p>
              {isSubscribed ? (
                <div className="p-4 bg-accent/50 rounded-lg premium-3d-card">
                  <p className="text-sm text-foreground">
                    Thank you for subscribing!
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="flex gap-2 premium-3d-elevated rounded-lg p-2 bg-background"
                >
                  <div className="flex-1 flex items-center px-3">
                    <Mail className="w-5 h-5 text-muted-foreground mr-2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg premium-3d-button hover:bg-primary/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            <div className="flex justify-end">
              <div className="flex gap-12">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4">
                    Shop
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.shop.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4">
                    Company
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4">
                    Support
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-accent transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <span 
                    className="block w-5 h-5 grayscale group-hover:grayscale-0 transition-all duration-300"
                    style={social.name === 'Instagram' ? {
                      background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    } : undefined}
                  >
                    <SocialIcon name={social.name} />
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} <span className="px-1.5 py-0.5 rounded-lg glass-liquid font-extrabold text-foreground">Pamba</span>kaliarusha. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}