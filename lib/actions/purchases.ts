"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { PurchaseOrder } from "@/lib/models/purchaseOrder";

export async function createPurchaseOrder(formData: FormData) {
  await connectToDatabase();

  await PurchaseOrder.create({
    poNumber: String(formData.get("poNumber") || ""),
    vendor: String(formData.get("vendor") || ""),
    status: String(formData.get("status") || "Draft"),
    expectedDate: formData.get("expectedDate")
      ? new Date(String(formData.get("expectedDate")))
      : undefined,
    notes: String(formData.get("notes") || ""),
    totalAmount: Number(formData.get("totalAmount") || 0)
  });

  revalidatePath("/admin/purchases");
  redirect("/admin/purchases?toast=Purchase%20order%20created");
}

export async function deletePurchaseOrder(id: string) {
  await connectToDatabase();
  await PurchaseOrder.deleteOne({ _id: id });
  revalidatePath("/admin/purchases");
  redirect("/admin/purchases?toast=Purchase%20order%20deleted");
}
