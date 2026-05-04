"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import classNames from "classnames";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "New Arrivals", href: "/new-arrivals" },
  { name: "Collections", href: "/collections" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 premium-3d-light bg-background/80 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            href="/"
            className="text-xl lg:text-2xl font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity relative group"
          >
            <span className="relative z-10 px-2 py-1 rounded-xl glass-liquid font-extrabold">
              Pamba
            </span>
            <span className="relative z-10 font-extrabold">kaliarusha</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="w-40 lg:w-64 px-3 py-2 rounded-l-lg bg-background border-2 border-r-0 border-transparent focus:border-primary outline-none text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-r-lg bg-primary text-primary-foreground"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2.5 ml-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className={classNames(
                  "p-2.5 rounded-lg premium-3d-button transition-all duration-200",
                  "hover:bg-accent hover:scale-105 active:scale-95",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20"
                )}
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-foreground" />
              </button>
            )}

            <Link
              href="/account"
              className={classNames(
                "p-2.5 rounded-lg premium-3d-button transition-all duration-200",
                "hover:bg-accent hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
              aria-label="Account"
            >
              <User className="w-5 h-5 text-foreground" />
            </Link>

            <Link
              href="/cart"
              className={classNames(
                "p-2.5 rounded-lg premium-3d-button transition-all duration-200",
                "hover:bg-accent hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 relative"
              )}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <ThemeToggle />

            <button
              className="lg:hidden p-2.5 rounded-lg premium-3d-button hover:bg-accent transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={classNames(
          "lg:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <nav className="px-4 py-4 space-y-2 bg-background border-t border-border/50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block py-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}