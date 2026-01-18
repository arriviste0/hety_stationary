"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { products } from "@/data/products";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return [];
    return products.filter((product) =>
      [product.name, product.description, product.tags?.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 px-4 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-600">
                <Search size={18} />
                <span className="text-sm font-semibold">Search products</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="icon-btn rounded-full p-2 text-brand-600"
              >
                <X size={18} />
              </button>
            </div>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try gel pens, notebooks, clips..."
              className="input-base mt-4 w-full rounded-2xl px-4 py-3 text-sm"
            />

            <div className="mt-5 space-y-3">
              {query && results.length === 0 && (
                <p className="text-sm text-slate-500">No matches found.</p>
              )}
                  {results.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="block rounded-2xl border border-slate-100 p-4 text-sm transition-all duration-200 ease-out hover:border-accent-pink hover:bg-accent-pink/10"
                    >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">
                      {product.name}
                    </span>
                    <span className="text-brand-600">?{product.price}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {product.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
