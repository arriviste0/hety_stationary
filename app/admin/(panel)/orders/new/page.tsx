import Link from "next/link";
import { createOrder } from "@/lib/actions/orders";

export default function NewOrderPage() {
  return (
    <form action={createOrder} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Create Order</h1>
          <p className="text-sm text-slate-500">Quickly add a manual order.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
            Save Order
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="orderId" placeholder="Order ID" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="invoiceNumber" placeholder="Invoice Number" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="totalAmount" type="number" placeholder="Total Amount" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select name="paymentStatus" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Pending</option>
            <option>Paid</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
          <select name="orderStatus" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>New</option>
            <option>Confirmed</option>
            <option>Packed</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
            <option>Returned</option>
          </select>
          <select name="shippingStatus" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Not Shipped</option>
            <option>In Transit</option>
            <option>Delivered</option>
          </select>
          <select name="source" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Web</option>
            <option>Marg</option>
          </select>
        </div>
      </div>
    </form>
  );
}
