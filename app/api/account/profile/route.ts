import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { Order } from "@/lib/models/order";
import { OrderItem } from "@/lib/models/orderItem";
import { Product } from "@/lib/models/product";
import { getCustomerSession } from "@/lib/customer-auth";
import { mapProductToStorefrontProduct } from "@/lib/storefront";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [customer, orders] = await Promise.all([
    Customer.findById(session.id).lean() as Promise<Record<string, any> | null>,
    Order.find({ customer: session.id })
      .sort({ date: -1 })
      .lean() as Promise<Array<Record<string, any>>>
  ]);

  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const orderIds = orders.map((order) => order._id);
  const orderItems = orderIds.length
    ? ((await OrderItem.find({ order: { $in: orderIds } })
        .populate("product")
        .lean()) as Array<Record<string, any>>)
    : [];
  const orderItemsByOrder = new Map<string, Array<Record<string, any>>>();
  const wishlistIds = Array.isArray(customer.wishlist)
    ? customer.wishlist.map((item: unknown) => String(item || "")).filter(Boolean)
    : [];
  const wishlistProducts = wishlistIds.length
    ? ((await Product.find({
        _id: { $in: wishlistIds },
        "visibility.status": "Active"
      })
        .populate("category")
        .populate("brand")
        .lean()) as Array<Record<string, any>>)
    : [];

  orderItems.forEach((item) => {
    const key = String(item.order);
    const group = orderItemsByOrder.get(key) || [];
    group.push(item);
    orderItemsByOrder.set(key, group);
  });

  return NextResponse.json({
    customer: {
      id: String(customer._id),
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      totalOrders: Number(customer.totalOrders || 0),
      totalSpend: Number(customer.totalSpend || 0),
      wishlist: Array.isArray(customer.wishlist)
        ? customer.wishlist.map((item: unknown) => String(item || "")).filter(Boolean)
        : [],
      preferences: customer.preferences || {
        email: true,
        offers: true,
        orders: true
      },
      addresses: Array.isArray(customer.addresses)
        ? customer.addresses.map((address: Record<string, any>, index: number) => ({
            id: String(address._id || index),
            name: address.name || "",
            phone: address.phone || "",
            line1: address.line1 || "",
            line2: address.line2 || "",
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "India",
            isDefault: Boolean(address.isDefault)
          }))
        : []
    },
    wishlistProducts: wishlistProducts.map(mapProductToStorefrontProduct),
    orders: orders.map((order) => ({
      id: String(order._id),
      orderId: order.orderId,
      date: order.date,
      amount: Number(order.totalAmount || 0),
      status: order.orderStatus,
      paymentMode: order.paymentMode || "COD",
      paymentStatus: order.paymentStatus,
      shippingStatus: order.shippingStatus,
      invoiceNumber: order.invoiceNumber || "",
      trackingNumber: order.shipment?.awb || "",
      shippingAddress: order.shippingAddress || null,
      items: (orderItemsByOrder.get(String(order._id)) || []).map((item) => {
        const product = item.product as Record<string, any> | undefined;
        const storefrontProduct = product
          ? mapProductToStorefrontProduct(product)
          : null;

        return {
          id: String(item._id),
          quantity: Number(item.quantity || 0),
          name: item.name || storefrontProduct?.name || "",
          price: Number(item.price || 0),
          sku: item.sku || "",
          product: storefrontProduct
        };
      })
    }))
  });
}

export async function PATCH(request: Request) {
  await connectToDatabase();
  const session = await getCustomerSession();

  if (!session.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    name?: string;
    phone?: string;
    preferences?: Record<string, boolean>;
    addresses?: Array<Record<string, unknown>>;
  };

  const addresses = Array.isArray(body.addresses)
    ? body.addresses.map((address) => ({
        name: String(address.name || ""),
        phone: String(address.phone || ""),
        line1: String(address.line1 || ""),
        line2: String(address.line2 || ""),
        city: String(address.city || ""),
        state: String(address.state || ""),
        postalCode: String(address.postalCode || ""),
        country: String(address.country || "India"),
        isDefault: Boolean(address.isDefault)
      }))
    : undefined;

  await Customer.updateOne(
    { _id: session.id },
    {
      ...(body.name !== undefined ? { name: String(body.name || "") } : {}),
      ...(body.phone !== undefined ? { phone: String(body.phone || "") } : {}),
      ...(body.preferences ? { preferences: body.preferences } : {}),
      ...(addresses ? { addresses } : {})
    }
  );

  return NextResponse.json({ ok: true });
}
