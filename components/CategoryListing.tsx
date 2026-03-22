"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

type Props = {
  category: Category;
  products: Product[];
};

const priceOptions = [
  { label: "Any price", value: "any" },
  { label: "Up to Rs. 100", value: "100" },
  { label: "Up to Rs. 500", value: "500" },
  { label: "Up to Rs. 1500", value: "1500" }
];

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" }
];

export default function CategoryListing({ category, products }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceCap, setPriceCap] = useState("any");
  const [brand, setBrand] = useState("all");
  const [jumpTo, setJumpTo] = useState("");

  const brandOptions = useMemo(() => {
    const brands = products
      .map((product) => product.brand)
      .filter(Boolean) as string[];
    return ["all", ...Array.from(new Set(brands))];
  }, [products]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const cap = priceCap === "any" ? null : Number(priceCap);
    let list = products.filter((product) => {
      const matchesQuery = term
        ? [product.name, product.description, product.tags?.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(term)
        : true;
      const matchesPrice = cap ? product.price <= cap : true;
      const matchesBrand = brand === "all" ? true : product.brand === brand;
      return matchesQuery && matchesPrice && matchesBrand;
    });

    switch (sortBy) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [products, query, priceCap, brand, sortBy]);

  return (
    <section className="section-padding mx-auto py-12">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">Category</p>
        <h1 className="mt-2 text-4xl font-display text-brand-800">{category.name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          HETY STATIONERY supplies {category.name.toLowerCase()} for retail,
          wholesale, and franchise-led business requirements.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="rounded-3xl border border-brand-100 bg-white p-5 shadow-soft">
          <h3 className="text-sm font-semibold text-brand-700">Filters</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-accent-pink">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="input-base mt-2 w-full rounded-2xl px-4 py-3 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-accent-pink">
                Price
              </label>
              <select
                value={priceCap}
                onChange={(event) => setPriceCap(event.target.value)}
                className="input-base mt-2 w-full rounded-2xl px-4 py-3 text-sm"
              >
                {priceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-accent-pink">
                Brand
              </label>
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="input-base mt-2 w-full rounded-2xl px-4 py-3 text-sm"
              >
                {brandOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All brands" : option}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSortBy("featured");
                setPriceCap("any");
                setBrand("all");
              }}
              className="btn-secondary w-full px-4 py-2 text-xs"
            >
              Reset filters
            </button>
          </div>
        </aside>

        <div>
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-[1.5fr,1fr] sm:items-end">
              <div>
                <label className="text-xs uppercase tracking-wide text-accent-pink">
                  Search
                </label>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products..."
                  className="input-base mt-2 w-full rounded-2xl px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-accent-pink">
                  Jump to product
                </label>
                <select
                  value={jumpTo}
                  onChange={(event) => {
                    const next = event.target.value;
                    setJumpTo(next);
                    if (next) {
                      router.push(`/product/${next}`);
                    }
                  }}
                  className="input-base mt-2 w-full rounded-2xl px-4 py-3 text-sm"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.slug}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-600">{filtered.length} products</div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 && (
              <p className="text-sm text-slate-500">No products found.</p>
            )}
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
