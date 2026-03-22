import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params
}: {
  params: { id: string };
}) {
  await connectToDatabase();
  const product = (await Product.findById(params.id)
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .lean()) as Record<string, any> | null;

  if (!product) {
    notFound();
  }

  const imageUrls = Array.isArray(product.imageUrls)
    ? product.imageUrls.filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Product</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{product.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            SKU: {product.sku} | Slug: {product.slug}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/catalog/products"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>
          <Link
            href={`/admin/catalog/products/${params.id}/edit`}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
          >
            Edit Product
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700">Overview</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Category</p>
              <p className="mt-1 text-sm text-slate-700">
                {(product.category as Record<string, any> | undefined)?.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Subcategory</p>
              <p className="mt-1 text-sm text-slate-700">
                {(product.subcategory as Record<string, any> | undefined)?.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Brand</p>
              <p className="mt-1 text-sm text-slate-700">
                {(product.brand as Record<string, any> | undefined)?.name || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Barcode</p>
              <p className="mt-1 text-sm text-slate-700">{product.barcode || "-"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">Short Description</p>
              <p className="mt-1 text-sm text-slate-700">{product.shortDescription || "-"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">Description</p>
              <p className="mt-1 text-sm leading-7 text-slate-700">{product.description || "-"}</p>
            </div>
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Pricing and Inventory</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">MRP</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Rs. {product.pricing?.mrp || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Selling Price</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Rs. {product.pricing?.sellingPrice || 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Cost Price</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Rs. {product.pricing?.costPrice || 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Discount Price</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Rs. {product.pricing?.discountPrice || 0}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">GST</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{product.pricing?.gstPercent || 0}%</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Stock</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {product.inventory?.stockQuantity || 0} {product.inventory?.unit || "pcs"}
              </p>
            </div>
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Attributes and SEO</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Color", product.attributes?.color],
              ["Size", product.attributes?.size],
              ["Pack Size", product.attributes?.packSize],
              ["Paper Type", product.attributes?.paperType],
              ["GSM", product.attributes?.gsm],
              ["HSN Code", product.pricing?.hsnCode],
              ["Meta Title", product.seo?.metaTitle],
              ["Meta Description", product.seo?.metaDescription]
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 text-sm text-slate-700">{String(value || "-")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Status</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Status: {product.visibility?.status || "Active"}</p>
              <p>Featured: {product.visibility?.featured ? "Yes" : "No"}</p>
              <p>Reorder Level: {product.inventory?.reorderLevel || 0}</p>
              <p>Min / Max Order: {product.inventory?.minOrderQty || 1} / {product.inventory?.maxOrderQty || 100}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Images</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {imageUrls.length > 0 ? (
                imageUrls.map((url: string) => (
                  <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    <Image src={url} alt={product.name} fill className="object-cover" />
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-sm text-slate-500">No images uploaded.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
