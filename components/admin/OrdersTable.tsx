"use client";

import Link from "next/link";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default function OrdersTable({
  orders,
  deleteOrder
}: {
  orders: any[];
  deleteOrder: (id: string) => Promise<void>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
          <p className="text-sm text-slate-500">
            Track order pipeline and fulfillment.
          </p>
        </div>
        <Link
          href="/admin/orders/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
        >
          Create Order
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Shipping</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-700">
                  {order.orderId}
                </td>
                <td className="px-4 py-3">
                  {order.date ? new Date(order.date).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">{order.customer || "—"}</td>
                <td className="px-4 py-3">{order.paymentStatus}</td>
                <td className="px-4 py-3">{order.orderStatus}</td>
                <td className="px-4 py-3">₹{order.totalAmount ?? 0}</td>
                <td className="px-4 py-3">{order.shippingStatus}</td>
                <td className="px-4 py-3">{order.source}</td>
                <td className="px-4 py-3">{order.invoiceNumber || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <form action={deleteOrder.bind(null, order._id)}>
                      <ConfirmButton
                        type="submit"
                        message="Delete this order?"
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={10}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
