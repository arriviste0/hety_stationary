"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ConfirmButton from "@/components/admin/ConfirmButton";
import ProductCsvTools from "@/components/admin/ProductCsvTools";

type ProductsTableProps = {
  products: any[];
  categories: string[];
  brands: string[];
  deleteProduct: (id: string) => Promise<void>;
};

export default function ProductsTable({
  products,
  categories,
  brands,
  deleteProduct
}: ProductsTableProps) {
  const [filters, setFilters] = useState({
    query: "",
    category: "All",
    status: "All",
    stock: "All",
    brand: "All",
    minPrice: "",
    maxPrice: ""
  });

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        !filters.query ||
        product.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.query.toLowerCase());
      const matchesCategory =
        filters.category === "All" || product.category === filters.category;
      const matchesStatus =
        filters.status === "All" ||
        product.visibility?.status === filters.status;
      const matchesBrand =
        filters.brand === "All" || product.brand === filters.brand;
      const sellingPrice = product.pricing?.sellingPrice ?? 0;
      const matchesMin =
        !filters.minPrice || sellingPrice >= Number(filters.minPrice);
      const matchesMax =
        !filters.maxPrice || sellingPrice <= Number(filters.maxPrice);
      const stockQty = product.inventory?.stockQuantity ?? 0;
      const matchesStock =
        filters.stock === "All" ||
        (filters.stock === "Low" && stockQty < 10 && stockQty > 0) ||
        (filters.stock === "Out" && stockQty === 0);
      return (
        matchesQuery &&
        matchesCategory &&
        matchesStatus &&
        matchesStock &&
        matchesBrand &&
        matchesMin &&
        matchesMax
      );
    });
  }, [filters, products]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500">
            Manage SKUs, pricing, and visibility.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/catalog/products/new"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
          >
            Add Product
          </Link>
          <ProductCsvTools />
        </div>
      </div>
      <div className="grid gap-3 border-b border-slate-200 p-5 md:grid-cols-6">
        <input
          placeholder="Search by name or SKU"
          value={filters.query}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, query: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <select
          value={filters.category}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, category: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option>All</option>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <select
          value={filters.brand}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, brand: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option>All</option>
          {brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, status: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Active</option>
          <option>Draft</option>
        </select>
        <select
          value={filters.stock}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, stock: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option>All</option>
          <option>Low</option>
          <option>Out</option>
        </select>
        <input
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, minPrice: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Sale Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-700">
                  {product.sku}
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category || "—"}</td>
                <td className="px-4 py-3">{product.brand || "—"}</td>
                <td className="px-4 py-3">
                  ₹{product.pricing?.mrp ?? 0}
                </td>
                <td className="px-4 py-3">
                  ₹{product.pricing?.sellingPrice ?? 0}
                </td>
                <td className="px-4 py-3">
                  {product.inventory?.stockQuantity ?? 0}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {product.visibility?.status || "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {product.visibility?.featured ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  {product.updatedAt
                    ? new Date(product.updatedAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/catalog/products/${product._id}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/catalog/products/${product._id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                    <form action={deleteProduct.bind(null, product._id)}>
                      <ConfirmButton
                        type="submit"
                        message="Delete this product?"
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={11}>
                  No products match the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 p-4 text-xs text-slate-500">
        <p>Bulk actions: Activate / Deactivate / Assign Category</p>
        <p>{filtered.length} products</p>
      </div>
    </div>
  );
}
