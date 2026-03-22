import Link from "next/link";
import { createCategory } from "@/lib/actions/categories";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import ImageUploadField from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  await connectToDatabase();
  const categories = (await Category.find().sort({ name: 1 }).lean()) as unknown as Array<{
    _id: { toString(): string };
    name: string;
  }>;

  return (
    <form action={createCategory} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">New Category</h1>
          <p className="text-sm text-slate-500">
            Create a category and control visibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/catalog/categories"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
            Save Category
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="name" placeholder="Category name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="slug" placeholder="Slug" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea name="description" placeholder="Description" className="min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
          <div className="sm:col-span-2">
            <ImageUploadField name="image" />
          </div>
          <input name="sortOrder" type="number" placeholder="Sort Order" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select name="visibility" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Visible</option>
            <option>Hidden</option>
          </select>
          <select name="status" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select name="parent" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">No Parent Category</option>
            {categories.map((category) => (
              <option key={category._id.toString()} value={category._id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
