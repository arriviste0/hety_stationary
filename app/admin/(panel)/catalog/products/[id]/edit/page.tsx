import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";
import { Category } from "@/lib/models/category";
import { Brand } from "@/lib/models/brand";
import { updateProduct } from "@/lib/actions/products";
import ImageUploadField from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: { id: string };
}) {
  await connectToDatabase();
  const product = (await Product.findById(params.id).lean()) as any;
  const categories = (await Category.find().sort({ name: 1 }).lean()) as unknown as Array<{
    _id: { toString(): string };
    name: string;
  }>;
  const brands = (await Brand.find().sort({ name: 1 }).lean()) as unknown as Array<{
    _id: { toString(): string };
    name: string;
  }>;

  if (!product) {
    notFound();
  }

  return (
    <form action={updateProduct.bind(null, params.id)} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit Product</h1>
          <p className="text-sm text-slate-500">{product.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/catalog/products"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
            Update Product
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700">Basic</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="name" defaultValue={product.name} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="sku" defaultValue={product.sku} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="barcode" defaultValue={product.barcode || ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="slug" defaultValue={product.slug} className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
            <input name="shortDescription" defaultValue={product.shortDescription || ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
            <select name="categoryId" defaultValue={product.category?.toString() || ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id.toString()} value={category._id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <select name="subcategoryId" defaultValue={product.subcategory?.toString() || ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select Subcategory</option>
              {categories.map((category) => (
                <option key={`sub-${category._id.toString()}`} value={category._id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <select name="brandId" defaultValue={product.brand?.toString() || ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id.toString()} value={brand._id.toString()}>
                  {brand.name}
                </option>
              ))}
            </select>
            <textarea name="description" defaultValue={product.description || ""} className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Pricing</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="mrp" type="number" defaultValue={product.pricing?.mrp || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="sellingPrice" type="number" defaultValue={product.pricing?.sellingPrice || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="costPrice" type="number" defaultValue={product.pricing?.costPrice || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="discountPrice" type="number" defaultValue={product.pricing?.discountPrice || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="gstPercent" type="number" defaultValue={product.pricing?.gstPercent || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="hsnCode" defaultValue={product.pricing?.hsnCode || ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <select name="discountType" defaultValue={product.pricing?.discountRules?.[0]?.ruleType || ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Discount Rule Type</option>
              <option value="Flat">Flat</option>
              <option value="Percentage">Percentage</option>
            </select>
            <input name="discountValue" type="number" defaultValue={product.pricing?.discountRules?.[0]?.value || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="discountMinQty" type="number" defaultValue={product.pricing?.discountRules?.[0]?.minQty || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Inventory</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="stockQuantity" type="number" defaultValue={product.inventory?.stockQuantity || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="reorderLevel" type="number" defaultValue={product.inventory?.reorderLevel || 10} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="unit" defaultValue={product.inventory?.unit || "pcs"} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="minOrderQty" type="number" defaultValue={product.inventory?.minOrderQty || 1} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="maxOrderQty" type="number" defaultValue={product.inventory?.maxOrderQty || 100} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Attributes</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="color" defaultValue={product.attributes?.color || ""} placeholder="Color" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="size" defaultValue={product.attributes?.size || ""} placeholder="Size" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="packSize" defaultValue={product.attributes?.packSize || ""} placeholder="Pack Size" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="paperType" defaultValue={product.attributes?.paperType || ""} placeholder="Paper Type" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="gsm" defaultValue={product.attributes?.gsm || ""} placeholder="GSM" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="brandName" defaultValue={product.attributes?.brandName || ""} placeholder="Brand" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">SEO</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="metaTitle" defaultValue={product.seo?.metaTitle || ""} placeholder="Meta Title" className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
            <textarea name="metaDescription" defaultValue={product.seo?.metaDescription || ""} placeholder="Meta Description" className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Media</h2>
            <div className="mt-4 space-y-3">
              <ImageUploadField
                name="imageUrls"
                defaultValue={product.imageUrls?.join(", ") || ""}
                multiple
              />
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" />
                Set as primary image
              </label>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Visibility</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input name="status" type="radio" value="Active" defaultChecked={product.visibility?.status === "Active"} />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input name="status" type="radio" value="Draft" defaultChecked={product.visibility?.status === "Draft"} />
                Draft
              </label>
              <label className="flex items-center gap-2">
                <input name="featured" type="checkbox" defaultChecked={product.visibility?.featured} />
                Featured product
              </label>
              <input
                name="tags"
                placeholder="Tags (comma separated)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Marg Mapping</h2>
            <div className="mt-4 space-y-3">
              <input name="margItemCode" defaultValue={product.margMapping?.margItemCode || ""} placeholder="Marg Item Code" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <button type="button" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Pull from Marg
              </button>
              <p className="text-xs text-slate-500">
                Last synced at: {product.margMapping?.lastSyncedAt ? new Date(product.margMapping.lastSyncedAt).toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
