"use client";

import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => addToCart(product)}
        className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold"
      >
        <ShoppingBag size={18} />
        Add to cart
      </button>
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out ${
          isWishlisted
            ? "border-accent-pink bg-pink-50 text-accent-pink"
            : "border-brand-200 bg-white text-brand-700 hover:border-accent-pink hover:text-accent-pink"
        }`}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        {isWishlisted ? "Move from wishlist" : "Move to wishlist"}
      </button>
    </div>
  );
}
