import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { Order } from "@/lib/models/order";
import { OrderItem } from "@/lib/models/orderItem";
import { getPhonePeOrderStatus, isPhonePeConfigured } from "@/lib/phonepe";
import { sendOrderPlacedNotifications } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const merchantOrderId = String(searchParams.get("merchantOrderId") || "").trim();

  if (!merchantOrderId) {
    return NextResponse.json({ error: "merchantOrderId is required." }, { status: 400 });
  }

  if (!isPhonePeConfigured()) {
    return NextResponse.json({ error: "PhonePe is not configured." }, { status: 400 });
  }

  await connectToDatabase();

  const order = (await Order.findOne({ orderId: merchantOrderId }).lean()) as Record<string, any> | null;

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  try {
    const status = await getPhonePeOrderStatus(merchantOrderId, false);
    const latestPayment = Array.isArray(status.paymentDetails) ? status.paymentDetails[0] : undefined;

    if (status.state === "COMPLETED") {
      const updateResult = await Order.updateOne(
        { _id: order._id, metricsRecorded: false },
        {
          $set: {
            paymentStatus: "Paid",
            orderStatus: order.orderStatus === "Pending" ? "Confirmed" : order.orderStatus,
            paymentMode: "PhonePe",
            paymentGateway: "PhonePe",
            paymentGatewayOrderId: status.orderId || order.paymentGatewayOrderId,
            paymentGatewayTransactionId:
              latestPayment?.transactionId || order.paymentGatewayTransactionId,
            metricsRecorded: true
          },
          $push: {
            paymentTimeline: {
              status: "Paid",
              date: new Date(),
              note: `PhonePe payment completed${latestPayment?.paymentMode ? ` via ${latestPayment.paymentMode}` : ""}`
            }
          }
        }
      );

      if (updateResult.modifiedCount > 0) {
        const [customer, orderItems] = await Promise.all([
          Customer.findById(order.customer).lean() as Promise<Record<string, any> | null>,
          OrderItem.find({ order: order._id }).lean() as Promise<Array<Record<string, any>>>
        ]);

        if (customer) {
          await Customer.updateOne(
            { _id: customer._id },
            {
              $inc: {
                totalOrders: 1,
                totalSpend: Number(order.totalAmount || 0)
              },
              $set: {
                lastOrderDate: new Date()
              }
            }
          );

          try {
            await sendOrderPlacedNotifications({
              orderId: order.orderId,
              totalAmount: Number(order.totalAmount || 0),
              customerName: customer.name || "Customer",
              customerEmail: customer.email || undefined,
              customerPhone: customer.phone || undefined,
              notifyCustomer: Boolean(customer.preferences?.email && customer.preferences?.orders),
              shippingAddress: order.shippingAddress,
              items: orderItems.map((item) => ({
                name: String(item.name || "Product"),
                quantity: Number(item.quantity || 0),
                price: Number(item.price || 0)
              }))
            });
          } catch (error) {
            console.error("Failed to send PhonePe order notifications", error);
          }
        }
      }
    } else if (status.state === "FAILED") {
      await Order.updateOne(
        { _id: order._id, paymentStatus: { $ne: "Failed" } },
        {
          $set: {
            paymentStatus: "Failed",
            paymentMode: "PhonePe",
            paymentGateway: "PhonePe",
            paymentGatewayOrderId: status.orderId || order.paymentGatewayOrderId,
            paymentGatewayTransactionId:
              latestPayment?.transactionId || order.paymentGatewayTransactionId
          },
          $push: {
            paymentTimeline: {
              status: "Failed",
              date: new Date(),
              note: `PhonePe payment failed${status.errorCode ? ` (${status.errorCode})` : ""}`
            }
          }
        }
      );
    }

    return NextResponse.json({
      ok: true,
      merchantOrderId,
      orderId: status.orderId || order.paymentGatewayOrderId || order.orderId,
      state: status.state,
      amount: Number(status.amount || 0) / 100,
      paymentStatus:
        status.state === "COMPLETED" ? "Paid" : status.state === "FAILED" ? "Failed" : "Pending",
      paymentMode: latestPayment?.paymentMode || "PhonePe",
      transactionId: latestPayment?.transactionId || null
    });
  } catch (error) {
    console.error("Failed to verify PhonePe payment", error);
    return NextResponse.json({ error: "Could not verify payment status." }, { status: 500 });
  }
}
