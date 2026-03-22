import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import { updateCategory } from "@/lib/actions/categories";
import ImageUploadField from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params
}: {
  params: { id: string };
}) {
  await connectToDatabase();
  const category = (await Category.findById(params.id).lean()) as
    | {
        name: string;
        slug: string;
        description?: string;
        image?: string;
        sortOrder?: number;
        visibility?: string;
        status?: string;
        parent?: { toString(): string };
      }
    | null;
  const categories = (await Category.find({ _id: { $ne: params.id } })
    .sort({ name: 1 })
    .lean()) as unknown as Array<{ _id: { toString(): string }; name: string }>;

  if (!category) {
    notFound();
  }

  return (
    <form action={updateCategory.bind(null, params.id)} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Edit Category</h1>
          <p className="text-sm text-slate-500">{category.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/catalog/categories"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
            Update Category
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="name" defaultValue={category.name} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="slug" defaultValue={category.slug} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea name="description" defaultValue={category.description || ""} className="min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
          <div className="sm:col-span-2">
            <ImageUploadField name="image" defaultValue={category.image || ""} />
          </div>
          <input name="sortOrder" type="number" defaultValue={category.sortOrder || 0} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select name="visibility" defaultValue={category.visibility || "Visible"} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Visible</option>
            <option>Hidden</option>
          </select>
          <select name="status" defaultValue={category.status || "Active"} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select name="parent" defaultValue={category.parent?.toString() || ""} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">No Parent Category</option>
            {categories.map((item) => (
              <option key={item._id.toString()} value={item._id.toString()}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
