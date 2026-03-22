import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/order";
import { getCustomerSession } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = (await Order.findOne({
    _id: params.id,
    customer: session.id
  }).lean()) as Record<string, any> | null;

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const content = [
    `Invoice: ${order.invoiceNumber || order.orderId}`,
    `Order ID: ${order.orderId}`,
    `Date: ${order.date ? new Date(order.date).toLocaleDateString() : "-"}`,
    `Amount: Rs. ${Number(order.totalAmount || 0).toFixed(2)}`,
    `Status: ${order.orderStatus}`,
    `Payment: ${order.paymentStatus}`
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${order.orderId}-invoice.txt"`
    }
  });
}
