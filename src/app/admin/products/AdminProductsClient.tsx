"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import classNames from "classnames";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  isActive: boolean;
  category: string | null;
  imageUrl: string | null;
}

interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  price_cents: string;
  stock: string;
  is_active: boolean;
  sizes: string;
  colors: string;
  image_urls: string;
  category: string;
}

interface AdminProductsClientProps {
  initialProducts: Product[];
  error: string | null;
}

const initialFormData: ProductFormData = {
  title: "",
  slug: "",
  description: "",
  price_cents: "",
  stock: "0",
  is_active: true,
  sizes: "",
  colors: "",
  image_urls: "",
  category: "",
};

export function AdminProductsClient({ initialProducts, error }: AdminProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(initialProducts.length);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const itemsPerPage = 10;

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchQuery && { search: searchQuery }),
      });
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price_cents / 100,
          originalPrice: p.original_price_cents ? p.original_price_cents / 100 : null,
          stock: p.stock,
          isActive: p.is_active,
          category: p.category,
          imageUrl: p.image_urls?.[0] || null,
        })));
        setTotalCount(data.total);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          price_cents: Math.round(parseFloat(formData.price_cents) * 100),
          stock: parseInt(formData.stock) || 0,
          is_active: formData.is_active,
          sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
          colors: formData.colors ? JSON.parse(formData.colors) : [],
          image_urls: formData.image_urls.split(",").map((u) => u.trim()).filter(Boolean),
          category: formData.category || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to create product");
        return;
      }

      setShowAddModal(false);
      setFormData(initialFormData);
      fetchProducts();
    } catch (err) {
      setFormError("Failed to create product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setFormError(null);
    setFormLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          price_cents: Math.round(parseFloat(formData.price_cents) * 100),
          stock: parseInt(formData.stock) || 0,
          is_active: formData.is_active,
          sizes: formData.sizes.split(",").map((s) => s.trim()).filter(Boolean),
          colors: formData.colors ? JSON.parse(formData.colors) : [],
          image_urls: formData.image_urls.split(",").map((u) => u.trim()).filter(Boolean),
          category: formData.category || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to update product");
        return;
      }

      setShowEditModal(false);
      setEditingProduct(null);
      setFormData(initialFormData);
      fetchProducts();
    } catch (err) {
      setFormError("Failed to update product");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/admin/products/${product.id}/toggle-active`, { method: "PATCH" });
      fetchProducts();
    } catch (err) {
      console.error("Failed to toggle active:", err);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      description: "",
      price_cents: product.price.toString(),
      stock: product.stock.toString(),
      is_active: product.isActive,
      sizes: "",
      colors: "[]",
      image_urls: product.imageUrl || "",
      category: product.category || "",
    });
    setShowEditModal(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 lg:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link href="/admin" className="hover:text-foreground">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-foreground">Products</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Products
            </h1>
          </div>
          <Button variant="primary" onClick={() => { setFormData(initialFormData); setShowAddModal(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="p-6 rounded-xl bg-card premium-3d-elevated">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search products..."
                className={classNames(
                  "w-full pl-10 pr-4 py-3 rounded-lg",
                  "bg-background border-2 border-transparent",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:border-primary",
                  "premium-3d-elevated"
                )}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Stock
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border/30 hover:bg-accent/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {product.imageUrl ? (
                              <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 premium-3d-light">
                                <Image
                                  src={product.imageUrl}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-16 rounded-lg bg-accent flex-shrink-0" />
                            )}
                            <div>
                              <p className="font-medium text-foreground line-clamp-1">
                                {product.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">
                            {product.category || "Uncategorized"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={classNames(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                              product.stock > 30
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : product.stock > 0
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                            )}
                          >
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className={classNames(
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer",
                              product.isActive
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                            )}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/product/${product.slug}`}
                              className={classNames(
                                "p-2 rounded-lg text-muted-foreground",
                                "hover:text-foreground hover:bg-accent",
                                "transition-colors"
                              )}
                              aria-label="View product"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => openEditModal(product)}
                              className={classNames(
                                "p-2 rounded-lg text-muted-foreground",
                                "hover:text-foreground hover:bg-accent",
                                "transition-colors"
                              )}
                              aria-label="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className={classNames(
                                "p-2 rounded-lg text-muted-foreground",
                                "hover:text-destructive hover:bg-destructive/10",
                                "transition-colors"
                              )}
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount} products
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductModal
          title="Add Product"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddProduct}
          onClose={() => setShowAddModal(false)}
          error={formError}
          loading={formLoading}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <ProductModal
          title="Edit Product"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditProduct}
          onClose={() => { setShowEditModal(false); setEditingProduct(null); }}
          error={formError}
          loading={formLoading}
        />
      )}
    </div>
  );
}

function ProductModal({
  title,
  formData,
  setFormData,
  onSubmit,
  onClose,
  error,
  loading,
}: {
  title: string;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error: string | null;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-xl premium-3d-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: formData.slug || e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground focus:border-primary focus:outline-none premium-3d-elevated"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground focus:border-primary focus:outline-none premium-3d-elevated"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground focus:border-primary focus:outline-none premium-3d-elevated resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price_cents}
                onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground focus:border-primary focus:outline-none premium-3d-elevated"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground focus:border-primary focus:outline-none premium-3d-elevated"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground focus:border-primary focus:outline-none premium-3d-elevated"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Sizes (comma separated)</label>
            <input
              type="text"
              placeholder="S, M, L, XL"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground focus:border-primary focus:outline-none premium-3d-elevated"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Image URLs (comma separated)</label>
            <input
              type="text"
              placeholder="https://..., https://..."
              value={formData.image_urls}
              onChange={(e) => setFormData({ ...formData, image_urls: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border-2 border-transparent text-foreground focus:border-primary focus:outline-none premium-3d-elevated"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">Active</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}