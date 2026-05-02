"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Send, MessageCircle, Video } from "lucide-react";

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
  { name: "Instagram", icon: Send, href: "https://instagram.com" },
  { name: "Twitter", icon: MessageCircle, href: "https://twitter.com" },
  { name: "Youtube", icon: Video, href: "https://youtube.com" },
];

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
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground" />
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
              © {new Date().getFullYear()} <span className="font-extrabold tracking-tight">Pamba</span>kaliarusha. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}