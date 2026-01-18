"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProductCarousel({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollerRef.current) return;
    const offset = direction === "left" ? -320 : 320;
    scrollerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section id="trending" className="bg-white py-16">
      <div className="section-padding mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-accent-pink">
              Trending Products
            </p>
            <h2 className="mt-2 text-3xl font-display text-slate-900">
              Bestsellers this week
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-600 bg-white text-brand-600 transition-all duration-200 ease-out hover:scale-105 hover:bg-brand-600 hover:text-white"
              aria-label="Scroll left"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-600 bg-white text-brand-600 transition-all duration-200 ease-out hover:scale-105 hover:bg-brand-600 hover:text-white"
              aria-label="Scroll right"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex items-stretch gap-6 overflow-x-auto pb-4 scrollbar-hide"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[240px] max-w-[260px] flex-1 h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
