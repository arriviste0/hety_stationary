import { connectToDatabase } from "@/lib/mongodb";
import { PurchaseOrder } from "@/lib/models/purchaseOrder";
import { Vendor } from "@/lib/models/vendor";
import { createPurchaseOrder, deletePurchaseOrder } from "@/lib/actions/purchases";
import ConfirmButton from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  await connectToDatabase();
  const [vendors, purchaseOrders] = await Promise.all([
    Vendor.find().sort({ supplierName: 1 }).lean() as any,
    PurchaseOrder.find().populate("vendor").sort({ createdAt: -1 }).lean() as any
  ]);
  const vendorRows = vendors as any[];
  const purchaseOrderRows = purchaseOrders as any[];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Purchases</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create purchase orders, track pending POs, and manage stock receiving workflow.
        </p>
      </div>

      <form action={createPurchaseOrder} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Create Purchase Order</h2>
          <button className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white">
            Save PO
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="poNumber" placeholder="PO Number" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select name="vendor" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">Select Vendor</option>
            {vendorRows.map((vendor) => (
              <option key={vendor._id.toString()} value={vendor._id.toString()}>
                {vendor.supplierName}
              </option>
            ))}
          </select>
          <select name="status" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Draft</option>
            <option>Pending</option>
            <option>Ordered</option>
            <option>Partially Received</option>
            <option>Received</option>
            <option>Cancelled</option>
          </select>
          <input name="expectedDate" type="date" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="totalAmount" type="number" placeholder="Total Amount" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <textarea name="notes" placeholder="Notes" className="min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Purchase Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">PO Number</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Expected Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrderRows.map((po) => (
                <tr key={po._id.toString()} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">{po.poNumber}</td>
                  <td className="px-4 py-3">{(po.vendor as { supplierName?: string })?.supplierName || "-"}</td>
                  <td className="px-4 py-3">{po.status}</td>
                  <td className="px-4 py-3">Rs. {po.totalAmount || 0}</td>
                  <td className="px-4 py-3">
                    {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={deletePurchaseOrder.bind(null, po._id.toString())}>
                      <ConfirmButton
                        type="submit"
                        message="Delete this purchase order?"
                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
