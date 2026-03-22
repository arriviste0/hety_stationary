import { connectToDatabase } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/vendor";
import { createVendor, deleteVendor } from "@/lib/actions/vendors";
import ConfirmButton from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  await connectToDatabase();
  const vendors = (await Vendor.find().sort({ createdAt: -1 }).lean()) as unknown as Array<Record<string, any>>;
  const rows = vendors as any[];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Vendors</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage supplier details used for purchases and stock inward.
        </p>
      </div>

      <form action={createVendor} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Add Supplier</h2>
          <button className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white">
            Save Vendor
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="supplierName" placeholder="Supplier name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="contactPerson" placeholder="Contact person" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="phone" placeholder="Phone" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="email" placeholder="Email" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="gstNumber" placeholder="GST number" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select name="status" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <textarea name="address" placeholder="Address" className="min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Supplier List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Contact Person</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">GST</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((vendor) => (
                <tr key={vendor._id.toString()} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">{vendor.supplierName}</td>
                  <td className="px-4 py-3">{vendor.contactPerson}</td>
                  <td className="px-4 py-3">{vendor.phone}</td>
                  <td className="px-4 py-3">{vendor.email || "-"}</td>
                  <td className="px-4 py-3">{vendor.gstNumber || "-"}</td>
                  <td className="px-4 py-3">{vendor.status}</td>
                  <td className="px-4 py-3">
                    <form action={deleteVendor.bind(null, vendor._id.toString())}>
                      <ConfirmButton
                        type="submit"
                        message="Delete this vendor?"
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
