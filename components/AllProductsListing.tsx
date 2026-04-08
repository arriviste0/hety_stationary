"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function AllProductsListing({
  products
}: {
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const brands = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(products.map((product) => product.brand).filter(Boolean) as string[])
      )
    ],
    [products]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = products.filter((product) => {
      const matchesQuery = term
        ? [product.name, product.description, product.tags?.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(term)
        : true;
      const matchesBrand = brand === "all" ? true : product.brand === brand;
      return matchesQuery && matchesBrand;
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
  }, [brand, products, query, sortBy]);

  return (
    <section className="section-padding mx-auto py-12">
      <div className="rounded-3xl border border-brand-100 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-accent-pink">All Products</p>
        <h1 className="mt-2 text-4xl font-display text-brand-800">
          Browse the full stationery collection
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          Explore all active stationery, copier, art, and craft products available
          on the HETY STATIONERY storefront.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="rounded-3xl border border-brand-100 bg-white p-5 shadow-soft">
          <h3 className="text-sm font-semibold text-brand-700">Filters</h3>
          <div className="mt-4 space-y-4">
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
                Brand
              </label>
              <select
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
                className="input-base mt-2 w-full rounded-2xl px-4 py-3 text-sm"
              >
                {brands.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All brands" : item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-accent-pink">
                Sort
              </label>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="input-base mt-2 w-full rounded-2xl px-4 py-3 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </aside>

        <div>
          <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-soft">
            <p className="text-sm text-slate-600">{filtered.length} products</p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 && (
              <p className="text-sm text-slate-500">No products found.</p>
            )}
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} showWishlistButton />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
