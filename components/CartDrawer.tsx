"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal
  } = useCart();

  const shipping = subtotal > 999 ? 0 : items.length > 0 ? 80 : 0;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-brand-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Your Cart</h3>
                <p className="text-xs text-slate-500">{items.length} items</p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="icon-btn rounded-full p-2 text-brand-600"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {items.length === 0 && (
                <div className="rounded-3xl border border-brand-100 bg-white p-6 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    Your cart is empty.
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Add a few essentials to keep creativity flowing.
                  </p>
                  <Link
                    href="/#trending"
                    onClick={closeCart}
                    className="btn-primary mt-4 inline-flex items-center px-5 py-2 text-xs font-semibold uppercase tracking-wide"
                  >
                    Browse trending
                  </Link>
                </div>
              )}
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white p-3 shadow-soft"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-brand-100 bg-white">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.product.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.product.brand ?? "Hety Studio"}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-brand-700">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-brand-200 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[28px] text-center text-sm font-medium text-slate-700">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-accent-pink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-100 px-6 py-5">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-brand-100 pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <Link
                href="/cart"
                onClick={closeCart}
                className="btn-primary mt-4 flex w-full items-center justify-center py-3 text-sm font-semibold uppercase tracking-wide"
              >
                View Cart
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
