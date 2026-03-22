"use client";

import Link from "next/link";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default function CategoriesTable({
  categories,
  deleteCategory
}: {
  categories: any[];
  deleteCategory: (id: string) => Promise<void>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
          <p className="text-sm text-slate-500">
            Manage parent/child hierarchies and visibility.
          </p>
        </div>
        <Link
          href="/admin/catalog/categories/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
        >
          Add Category
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Sort Order</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-700">
                  {category.name}
                </td>
                <td className="px-4 py-3">{category.slug}</td>
                <td className="px-4 py-3">{category.sortOrder ?? 0}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {category.visibility || "Visible"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/catalog/categories/${category._id}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/catalog/categories/${category._id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                    <form action={deleteCategory.bind(null, category._id)}>
                      <ConfirmButton
                        type="submit"
                        message="Delete this category?"
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={6}>
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
