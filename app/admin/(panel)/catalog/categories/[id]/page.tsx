import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import { Product } from "@/lib/models/product";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({
  params
}: {
  params: { id: string };
}) {
  await connectToDatabase();
  const category = (await Category.findById(params.id).populate("parent").lean()) as
    | Record<string, any>
    | null;

  if (!category) {
    notFound();
  }

  const [subcategories, products] = await Promise.all([
    Category.find({ parent: params.id }).sort({ name: 1 }).lean() as Promise<Array<Record<string, any>>>,
    Product.find({
      $or: [{ category: params.id }, { subcategory: params.id }]
    })
      .sort({ name: 1 })
      .limit(12)
      .lean() as Promise<Array<Record<string, any>>>
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Category</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{category.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Slug: {category.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/catalog/categories"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>
          <Link
            href={`/admin/catalog/categories/${params.id}/edit`}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
          >
            Edit Category
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700">Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
              <p className="mt-1 text-sm text-slate-700">{category.status || "Active"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Visibility</p>
              <p className="mt-1 text-sm text-slate-700">{category.visibility || "Visible"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Sort Order</p>
              <p className="mt-1 text-sm text-slate-700">{category.sortOrder || 0}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Parent Category</p>
              <p className="mt-1 text-sm text-slate-700">
                {(category.parent as Record<string, any> | undefined)?.name || "-"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-400">Description</p>
              <p className="mt-1 text-sm leading-7 text-slate-700">{category.description || "-"}</p>
            </div>
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Subcategories</h2>
          <div className="mt-4 space-y-3">
            {subcategories.length > 0 ? (
              subcategories.map((item) => (
                <div key={String(item._id)} className="rounded-xl border border-slate-100 p-4">
                  <p className="font-medium text-slate-700">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.slug}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No subcategories found.</p>
            )}
          </div>

          <h2 className="mt-8 text-sm font-semibold text-slate-700">Products in Category</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={String(product._id)} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-700">{product.sku}</td>
                    <td className="px-3 py-2">{product.name}</td>
                    <td className="px-3 py-2">Rs. {product.pricing?.sellingPrice || 0}</td>
                    <td className="px-3 py-2">{product.inventory?.stockQuantity || 0}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-sm text-slate-500" colSpan={4}>
                      No products assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Image</h2>
            <div className="mt-4">
              {category.image ? (
                <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                  <Image src={category.image} alt={category.name} fill className="object-cover" />
                </div>
              ) : (
                <p className="text-sm text-slate-500">No image uploaded.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>Subcategories: {subcategories.length}</p>
              <p>Products linked: {products.length}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
