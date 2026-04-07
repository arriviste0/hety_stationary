"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function ProductCarousel({
  products,
  content
}: {
  products: Product[];
  content?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
  };
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollerRef.current) return;
    const offset = direction === "left" ? -320 : 320;
    scrollerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section id="trending" className="bg-white py-16">
      <div className="section-padding mx-auto">
        <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_48%,#fff7ed_100%)] shadow-soft">
          <div className="grid gap-6 border-b border-brand-100/80 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_auto] lg:items-end">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_45px_rgba(37,99,235,0.08)] backdrop-blur">
              <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.22),transparent_70%)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-accent-pink">
                {content?.eyebrow || "Product Range"}
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-display leading-tight text-slate-900 sm:text-[2.2rem]">
                {content?.heading || "Everyday stationery for school, office, and creative work"}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[0.95rem]">
                {content?.description ||
                  "Explore a practical mix of HETY-branded products, school supplies, office essentials, and art materials selected for daily use."}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-brand-100 bg-white/85 px-4 py-3 backdrop-blur lg:justify-end">
              <div className="pr-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                  Browse
                </p>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  Swipe through featured items
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-600 bg-white text-brand-600 transition-all duration-200 ease-out hover:scale-105 hover:bg-brand-600 hover:text-white"
                  aria-label="Scroll left"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-600 bg-white text-brand-600 transition-all duration-200 ease-out hover:scale-105 hover:bg-brand-600 hover:text-white"
                  aria-label="Scroll right"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="flex items-stretch gap-6 overflow-x-auto p-6 pb-8 scrollbar-hide sm:px-8"
          >
            {products.map((product) => (
              <div key={product.id} className="h-full min-w-[240px] max-w-[260px] flex-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
