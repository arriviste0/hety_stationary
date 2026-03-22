"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/order";

export async function createOrder(formData: FormData) {
  await connectToDatabase();
  const orderId = String(formData.get("orderId") || "");
  const totalAmount = Number(formData.get("totalAmount") || 0);

  await Order.create({
    orderId,
    totalAmount,
    paymentStatus: String(formData.get("paymentStatus") || "Pending"),
    orderStatus: String(formData.get("orderStatus") || "New"),
    shippingStatus: String(formData.get("shippingStatus") || "Not Shipped"),
    source: String(formData.get("source") || "Web"),
    invoiceNumber: String(formData.get("invoiceNumber") || "")
  });

  revalidatePath("/admin/orders");
  redirect("/admin/orders?toast=Order%20created");
}

export async function updateOrder(id: string, formData: FormData) {
  await connectToDatabase();
  await Order.updateOne(
    { _id: id },
    {
      paymentStatus: String(formData.get("paymentStatus") || "Pending"),
      orderStatus: String(formData.get("orderStatus") || "New"),
      shippingStatus: String(formData.get("shippingStatus") || "Not Shipped"),
      invoiceNumber: String(formData.get("invoiceNumber") || "")
    }
  );

  revalidatePath("/admin/orders");
  redirect("/admin/orders?toast=Order%20updated");
}

export async function deleteOrder(id: string) {
  await connectToDatabase();
  await Order.deleteOne({ _id: id });
  revalidatePath("/admin/orders");
  redirect("/admin/orders?toast=Order%20deleted");
}
