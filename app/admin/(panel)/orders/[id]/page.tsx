import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/order";
import { updateOrder } from "@/lib/actions/orders";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params
}: {
  params: { id: string };
}) {
  await connectToDatabase();
  const order = (await Order.findById(params.id).populate("items").lean()) as any;

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Order</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{order.orderId}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {order.customer?.toString() || "Customer"} / {order.source}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back
          </Link>
          <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Print Packing Slip
          </button>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
            Generate Invoice PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700">Ordered Items</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Qty</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Discount</th>
                  <th className="px-3 py-2">Tax</th>
                </tr>
              </thead>
              <tbody>
                {(order.items as Array<{ name?: string; quantity?: number; price?: number; discount?: number; tax?: number }>)?.map(
                  (item, index) => (
                    <tr key={`${item.name}-${index}`} className="border-t border-slate-100">
                      <td className="px-3 py-2">{item.name}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2">Rs. {item.price}</td>
                      <td className="px-3 py-2">Rs. {item.discount}</td>
                      <td className="px-3 py-2">Rs. {item.tax}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Status Pipeline</h2>
            <form action={updateOrder.bind(null, params.id)} className="mt-4 space-y-3">
              <select
                name="orderStatus"
                defaultValue={order.orderStatus}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  )
                )}
              </select>
              <select
                name="paymentStatus"
                defaultValue={order.paymentStatus}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {["Paid", "Pending", "Failed", "Refunded"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select
                name="shippingStatus"
                defaultValue={order.shippingStatus}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {["Not Shipped", "In Transit", "Delivered"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <input
                name="invoiceNumber"
                defaultValue={order.invoiceNumber || ""}
                placeholder="Invoice Number"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Update Status
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Shipping and Payment</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>Courier: {order.shipment?.courier || "-"}</p>
              <p>AWB: {order.shipment?.awb || "-"}</p>
              <p>Status: {order.shipment?.status || "-"}</p>
              <p>Total: Rs. {order.totalAmount}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Shipping Address</h2>
            <div className="mt-3 text-sm text-slate-600">
              <p>{order.shippingAddress?.name || "-"}</p>
              <p>{order.shippingAddress?.line1}</p>
              <p>{order.shippingAddress?.line2}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
