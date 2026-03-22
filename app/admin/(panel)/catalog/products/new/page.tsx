import Link from "next/link";
import { createProduct } from "@/lib/actions/products";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import { Brand } from "@/lib/models/brand";
import ImageUploadField from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await connectToDatabase();
  const categories = (await Category.find().sort({ name: 1 }).lean()) as unknown as Array<{
    _id: { toString(): string };
    name: string;
  }>;
  const brands = (await Brand.find().sort({ name: 1 }).lean()) as unknown as Array<{
    _id: { toString(): string };
    name: string;
  }>;

  return (
    <form action={createProduct} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">New Product</h1>
          <p className="text-sm text-slate-500">
            Add a new SKU to the catalog.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/catalog/products"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
            Save Product
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700">Basic</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="name" placeholder="Product name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="sku" placeholder="SKU" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="barcode" placeholder="Barcode" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="slug" placeholder="Slug (auto)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
            <input name="shortDescription" placeholder="Short Description" className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
            <select name="categoryId" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id.toString()} value={category._id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <select name="subcategoryId" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select Subcategory</option>
              {categories.map((category) => (
                <option key={`sub-${category._id.toString()}`} value={category._id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
            <select name="brandId" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand._id.toString()} value={brand._id.toString()}>
                  {brand.name}
                </option>
              ))}
            </select>
            <textarea name="description" placeholder="Description" className="min-h-[120px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Pricing</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="mrp" type="number" placeholder="MRP" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="sellingPrice" type="number" placeholder="Selling Price" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="costPrice" type="number" placeholder="Cost Price" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="discountPrice" type="number" placeholder="Discount Price" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="gstPercent" type="number" placeholder="GST %" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="hsnCode" placeholder="HSN Code" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <select name="discountType" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Discount Rule Type</option>
              <option value="Flat">Flat</option>
              <option value="Percentage">Percentage</option>
            </select>
            <input name="discountValue" type="number" placeholder="Discount Value" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="discountMinQty" type="number" placeholder="Min Qty for Discount" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Inventory</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="stockQuantity" type="number" placeholder="Stock Quantity" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="reorderLevel" type="number" placeholder="Reorder Level" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="unit" placeholder="Unit (pcs/pack)" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="minOrderQty" type="number" placeholder="Min Order Qty" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="maxOrderQty" type="number" placeholder="Max Order Qty" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Attributes</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input name="color" placeholder="Color" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="size" placeholder="Size" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="packSize" placeholder="Pack Size" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="paperType" placeholder="Paper Type" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="gsm" placeholder="GSM" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="brandName" placeholder="Brand" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Media</h2>
            <div className="mt-4 space-y-3">
              <ImageUploadField name="imageUrls" multiple />
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input type="checkbox" />
                Set as primary image
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">SEO</h2>
            <div className="mt-4 space-y-3">
              <input name="metaTitle" placeholder="Meta Title" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <textarea name="metaDescription" placeholder="Meta Description" className="min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Visibility</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input name="status" type="radio" value="Active" defaultChecked />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input name="status" type="radio" value="Draft" />
                Draft
              </label>
              <label className="flex items-center gap-2">
                <input name="featured" type="checkbox" />
                Featured product
              </label>
              <input name="tags" placeholder="Tags (comma separated)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Marg Mapping</h2>
            <div className="mt-4 space-y-3">
              <input name="margItemCode" placeholder="Marg Item Code" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <button type="button" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Pull from Marg
              </button>
              <p className="text-xs text-slate-500">Last synced at: —</p>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
