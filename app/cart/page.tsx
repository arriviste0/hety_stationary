"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const shipping = subtotal > 999 ? 0 : items.length > 0 ? 80 : 0;
  const total = subtotal + shipping;

  return (
    <section className="section-padding mx-auto py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-display text-slate-900">Your Cart</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your picks before checkout.
          </p>
        </div>
        <Link
          href="/#trending"
          className="link-underline text-sm font-semibold text-brand-600"
        >
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-brand-100 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">Your cart is empty.</p>
          <Link
            href="/"
            className="btn-primary mt-4 inline-flex items-center px-6 py-3 text-sm font-semibold"
          >
            Explore bestsellers
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col gap-4 rounded-3xl border border-brand-100 bg-white p-4 shadow-soft sm:flex-row"
              >
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={160}
                  height={140}
                  className="rounded-2xl border border-brand-100 bg-white"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.product.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.product.brand ?? "Hety Studio"}
                  </p>
                  <p className="mt-2 text-sm text-brand-600">₹{item.product.price}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-full border border-brand-200 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-[32px] text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-brand-700">
                      ₹{item.product.price * item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent-pink"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-3xl border border-brand-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-700">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              <div className="border-t border-brand-100 pt-3 text-base font-semibold">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-primary mt-6 w-full py-3 text-sm font-semibold"
            >
              Checkout
            </button>
            <p className="mt-3 text-xs text-slate-500">
              Free shipping on orders above ₹999.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
