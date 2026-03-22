import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getCustomerSession } from "@/lib/customer-auth";
import { Customer } from "@/lib/models/customer";
import { Product } from "@/lib/models/product";
import { Order } from "@/lib/models/order";
import { OrderItem } from "@/lib/models/orderItem";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    items?: Array<{ productId: string; quantity: number }>;
  };

  const items = Array.isArray(body.items) ? body.items.filter((item) => item.productId && item.quantity > 0) : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
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
    paymentStatus: "Pending",
    orderStatus: "Pending",
    shippingStatus: "Not Shipped",
    source: "Web",
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

  return NextResponse.json({ ok: true, orderId });
}
