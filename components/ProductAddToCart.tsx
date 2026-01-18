"use client";

import { ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold"
    >
      <ShoppingBag size={18} />
      Add to cart
    </button>
  );
}
