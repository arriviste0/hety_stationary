import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import CategoriesTable from "@/components/admin/CategoriesTable";
import { deleteCategory } from "@/lib/actions/categories";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await connectToDatabase();
  const categories = (await Category.find().sort({ sortOrder: 1 }).lean()) as unknown as Array<{
    _id: { toString(): string };
    name: string;
    slug: string;
    sortOrder?: number;
    visibility?: string;
    updatedAt?: Date;
  }>;
  const rows = categories.map((category) => ({
    ...category,
    _id: category._id.toString(),
    updatedAt: category.updatedAt ? category.updatedAt.toISOString() : undefined
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
        <p className="mt-2 text-sm text-slate-500">
          Maintain a clean hierarchy for product discovery.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Hierarchy</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {rows.slice(0, 4).map((category) => (
            <li key={category._id} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-600" />
              {category.name}
            </li>
          ))}
          {rows.length === 0 && <li>No categories yet.</li>}
        </ul>
      </div>
      <CategoriesTable categories={rows} deleteCategory={deleteCategory} />
    </div>
  );
}
