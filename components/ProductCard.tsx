"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="group flex h-full flex-col rounded-2xl border border-transparent bg-white p-4 shadow-soft transition-all duration-200 ease-out hover:border-accent-pink hover:shadow-card"
    >
      <div className="relative overflow-hidden rounded-xl border border-brand-100 bg-white">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={320}
          height={240}
          className="h-48 w-full object-cover transition duration-300 ease-out group-hover:scale-[1.04]"
        />
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`icon-btn absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm ${
            isWishlisted ? "text-accent-pink" : "text-brand-600"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <Link
            href={`/product/${product.slug}`}
            className="link-underline line-clamp-2 min-h-[40px] text-sm font-semibold text-brand-700"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-brand-700">₹{product.price}</p>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className="btn-primary flex h-10 w-10 items-center justify-center opacity-100 translate-y-0 shadow-soft transition-all duration-200 ease-out sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0"
          aria-label="Add to cart"
        >
          <ShoppingBag size={18} />
        </button>
      </div>
      <div className="mt-auto" />
    </motion.div>
  );
}
