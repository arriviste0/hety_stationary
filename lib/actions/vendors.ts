"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/vendor";

export async function createVendor(formData: FormData) {
  await connectToDatabase();
  await Vendor.create({
    supplierName: String(formData.get("supplierName") || ""),
    contactPerson: String(formData.get("contactPerson") || ""),
    phone: String(formData.get("phone") || ""),
    email: String(formData.get("email") || ""),
    address: String(formData.get("address") || ""),
    gstNumber: String(formData.get("gstNumber") || ""),
    status: String(formData.get("status") || "Active")
  });

  revalidatePath("/admin/vendors");
  redirect("/admin/vendors?toast=Vendor%20created");
}

export async function deleteVendor(id: string) {
  await connectToDatabase();
  await Vendor.deleteOne({ _id: id });
  revalidatePath("/admin/vendors");
  redirect("/admin/vendors?toast=Vendor%20deleted");
}
