"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useCart();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadWishlist() {
      try {
        const response = await fetch("/api/account/wishlist", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (!isMounted) return;
        if (!response.ok) {
          setItems([]);
          return;
        }

        setItems(Array.isArray(data.products) ? data.products : []);
      } catch {
        if (isMounted) {
          setItems([]);
        }
      }
    }

    if (wishlist.length > 0) {
      void loadWishlist();
    } else {
      setItems([]);
    }

    return () => {
      isMounted = false;
    };
  }, [wishlist]);

  return (
    <section className="section-padding mx-auto py-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-100 bg-white text-accent-pink">
          <Heart size={20} />
        </div>
        <div>
          <h1 className="text-3xl font-display text-slate-900">Wishlist</h1>
          <p className="mt-1 text-sm text-slate-600">
            Save your favorite stationery and revisit them anytime.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-brand-100 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">
            Your wishlist is empty. Tap the heart icon or wishlist button to save products.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
