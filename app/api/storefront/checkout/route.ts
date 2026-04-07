import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getCustomerSession } from "@/lib/customer-auth";
import { Customer } from "@/lib/models/customer";
import { Product } from "@/lib/models/product";
import { Order } from "@/lib/models/order";
import { OrderItem } from "@/lib/models/orderItem";
import { sendOrderPlacedNotifications } from "@/lib/notifications";
import { createPhonePePayment, isPhonePeConfigured } from "@/lib/phonepe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    items?: Array<{ productId: string; quantity: number }>;
    paymentMode?: "COD" | "PhonePe";
  };
  const paymentMode = body.paymentMode === "PhonePe" ? "PhonePe" : "COD";

  const items = Array.isArray(body.items) ? body.items.filter((item) => item.productId && item.quantity > 0) : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  if (paymentMode === "PhonePe" && !isPhonePeConfigured()) {
    return NextResponse.json(
      {
        error:
          "PhonePe is not configured with valid merchant credentials. Replace the demo placeholders in .env with real PhonePe sandbox keys."
      },
      { status: 400 }
    );
  }

  const productIds = items.map((item) => item.productId);
  const products = (await Product.find({ _id: { $in: productIds } }).lean()) as Array<Record<string, any>>;
  const customer = (await Customer.findById(session.id).lean()) as Record<string, any> | null;

  if (!customer) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  const productMap = new Map(products.map((product) => [String(product._id), product]));
  const validItems = items
    .map((item) => ({
      product: productMap.get(item.productId),
      quantity: Number(item.quantity || 0)
    }))
    .filter((item) => item.product && item.quantity > 0);

  if (validItems.length === 0) {
    return NextResponse.json({ error: "No valid products found." }, { status: 400 });
  }

  const totalAmount = validItems.reduce(
    (sum, item) => sum + Number(item.product?.pricing?.sellingPrice || 0) * item.quantity,
    0
  );

  const orderId = `WEB-${Date.now()}`;
  const defaultAddress =
    Array.isArray(customer.addresses) &&
    customer.addresses.find((address: Record<string, any>) => address.isDefault);

  const order = await Order.create({
    orderId,
    customer: session.id,
    paymentMode,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    shippingStatus: "Not Shipped",
    source: "Web",
    metricsRecorded: paymentMode === "COD",
    totalAmount,
    shippingAddress: defaultAddress
      ? {
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          line1: defaultAddress.line1,
          line2: defaultAddress.line2,
          city: defaultAddress.city,
          state: defaultAddress.state,
          postalCode: defaultAddress.postalCode,
          country: defaultAddress.country
        }
      : {
          name: customer.name,
          phone: customer.phone || "",
          country: "India"
        }
  });

  const orderItems = await OrderItem.insertMany(
    validItems.map((item) => ({
      order: order._id,
      product: item.product?._id,
      sku: item.product?.sku || "",
      name: item.product?.name || "",
      quantity: item.quantity,
      price: Number(item.product?.pricing?.sellingPrice || 0),
      discount: 0,
      tax:
        (Number(item.product?.pricing?.sellingPrice || 0) *
          Number(item.product?.pricing?.gstPercent || 0)) /
        100
    }))
  );

  await Order.updateOne(
    { _id: order._id },
    {
      items: orderItems.map((item) => item._id),
      invoiceNumber: `INV-${orderId}`
    }
  );

  if (paymentMode === "COD") {
    await Customer.updateOne(
      { _id: session.id },
      {
        $inc: {
          totalOrders: 1,
          totalSpend: totalAmount
        },
        $set: {
          lastOrderDate: new Date()
        }
      }
    );
  }

  if (paymentMode === "PhonePe") {
    try {
      const payment = await createPhonePePayment({
        merchantOrderId: orderId,
        amountPaisa: Math.round(totalAmount * 100),
        request
      });

      await Order.updateOne(
        { _id: order._id },
        {
          paymentGateway: "PhonePe",
          paymentGatewayOrderId: payment.orderId,
          paymentGatewayRedirectUrl: payment.redirectUrl,
          $push: {
            paymentTimeline: {
              status: "Pending",
              date: new Date(),
              note: "PhonePe payment initiated"
            }
          }
        }
      );

      return NextResponse.json({
        ok: true,
        orderId,
        paymentMode,
        paymentState: payment.state,
        redirectUrl: payment.redirectUrl
      });
    } catch (error) {
      await Promise.all([
        OrderItem.deleteMany({ order: order._id }),
        Order.deleteOne({ _id: order._id })
      ]);
      console.error("Failed to initiate PhonePe payment", error);
      return NextResponse.json(
        { error: "Could not initiate PhonePe payment." },
        { status: 500 }
      );
    }
  }

  try {
    await sendOrderPlacedNotifications({
      orderId,
      totalAmount,
      customerName: customer.name || "Customer",
      customerEmail: customer.email || undefined,
      customerPhone: customer.phone || undefined,
      notifyCustomer: Boolean(customer.preferences?.email && customer.preferences?.orders),
      shippingAddress: order.shippingAddress,
      items: validItems.map((item) => ({
        name: String(item.product?.name || "Product"),
        quantity: item.quantity,
        price: Number(item.product?.pricing?.sellingPrice || 0)
      }))
    });
  } catch (error) {
    console.error("Failed to send order notifications", error);
  }

  return NextResponse.json({ ok: true, orderId, paymentMode });
}
