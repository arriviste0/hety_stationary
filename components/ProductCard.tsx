"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductCard({
  product,
  showWishlistButton = false
}: {
  product: Product;
  showWishlistButton?: boolean;
}) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);
  const showBrand =
    product.brand &&
    product.brand.trim().toLowerCase() !== product.name.trim().toLowerCase();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="group flex h-full flex-col rounded-[1.6rem] border border-stone-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-200 ease-out hover:border-stone-300 hover:shadow-[0_16px_38px_rgba(15,23,42,0.1)]"
    >
      <div className="relative overflow-hidden rounded-[1.2rem] bg-stone-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={320}
          height={240}
          className="h-48 w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`icon-btn absolute right-3 top-3 rounded-full border border-stone-200 bg-white/95 p-2 shadow-sm backdrop-blur ${
            isWishlisted ? "text-accent-pink" : "text-brand-600"
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col rounded-[1.2rem] bg-stone-50 px-4 py-4">
        {showBrand ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            {product.brand}
          </p>
        ) : null}
        <Link
          href={`/product/${product.slug}`}
          className={`line-clamp-2 text-sm font-semibold leading-6 text-slate-900 transition-colors duration-200 group-hover:text-brand-700 ${
            showBrand ? "mt-2 min-h-[44px]" : "min-h-[52px]"
          }`}
        >
          {product.name}
        </Link>
        <div className="mt-auto border-t border-stone-200 pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
              Price
            </p>
            <p className="mt-1 text-base font-semibold text-brand-700">
              {product.priceLabel ?? `Rs. ${product.price}`}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            {showWishlistButton ? (
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-200 ease-out ${
                  isWishlisted
                    ? "border-accent-pink bg-pink-50 text-accent-pink"
                    : "border-stone-200 bg-white text-slate-600 hover:border-accent-pink hover:text-accent-pink"
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                <span>{isWishlisted ? "Wishlisted" : "Wishlist"}</span>
              </button>
            ) : <div />}
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 transition-all duration-200 ease-out hover:border-brand-600 hover:bg-brand-600 hover:text-white"
              aria-label="Add to cart"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
