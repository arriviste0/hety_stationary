"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/lib/models/coupon";

export async function createCoupon(formData: FormData) {
  await connectToDatabase();
  await Coupon.create({
    code: String(formData.get("code") || "").toUpperCase(),
    type: String(formData.get("type") || "Flat"),
    discountValue: Number(formData.get("discountValue") || 0),
    minimumCartValue: Number(formData.get("minimumCartValue") || 0),
    maximumDiscount: Number(formData.get("maximumDiscount") || 0),
    validTo: formData.get("validTo") ? new Date(String(formData.get("validTo"))) : undefined,
    isActive: formData.get("isActive") === "on"
  });

  revalidatePath("/admin/promotions");
  redirect("/admin/promotions?toast=Coupon%20created");
}

export async function deleteCoupon(id: string) {
  await connectToDatabase();
  await Coupon.deleteOne({ _id: id });
  revalidatePath("/admin/promotions");
  redirect("/admin/promotions?toast=Coupon%20deleted");
}
