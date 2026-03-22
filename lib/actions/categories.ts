"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import { slugify } from "@/lib/utils/slug";

export async function createCategory(formData: FormData) {
  await connectToDatabase();
  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || slugify(name));

  await Category.create({
    name,
    slug,
    description: String(formData.get("description") || ""),
    image: String(formData.get("image") || ""),
    sortOrder: Number(formData.get("sortOrder") || 0),
    visibility: String(formData.get("visibility") || "Visible"),
    status: String(formData.get("status") || "Active"),
    parent: formData.get("parent") || undefined
  });

  revalidatePath("/admin/catalog/categories");
  redirect("/admin/catalog/categories?toast=Category%20created");
}

export async function updateCategory(id: string, formData: FormData) {
  await connectToDatabase();
  const name = String(formData.get("name") || "");
  const slug = String(formData.get("slug") || slugify(name));

  await Category.updateOne(
    { _id: id },
    {
      name,
      slug,
      description: String(formData.get("description") || ""),
      image: String(formData.get("image") || ""),
      sortOrder: Number(formData.get("sortOrder") || 0),
      visibility: String(formData.get("visibility") || "Visible"),
      status: String(formData.get("status") || "Active"),
      parent: formData.get("parent") || undefined
    }
  );

  revalidatePath("/admin/catalog/categories");
  redirect("/admin/catalog/categories?toast=Category%20updated");
}

export async function deleteCategory(id: string) {
  await connectToDatabase();
  await Category.deleteOne({ _id: id });
  revalidatePath("/admin/catalog/categories");
  redirect("/admin/catalog/categories?toast=Category%20deleted");
}
