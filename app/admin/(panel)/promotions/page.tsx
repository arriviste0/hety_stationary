import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/lib/models/coupon";
import { createCoupon, deleteCoupon } from "@/lib/actions/coupons";
import ConfirmButton from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  await connectToDatabase();
  const coupons = (await Coupon.find().sort({ createdAt: -1 }).lean()) as unknown as Array<Record<string, any>>;
  const couponRows = coupons as any[];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Offers and Coupons</h1>
        <p className="mt-2 text-sm text-slate-500">
          Create coupon codes, define discount rules, and control coupon activity.
        </p>
      </div>

      <form action={createCoupon} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Create Coupon</h2>
          <button className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white">
            Save Coupon
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="code" placeholder="Coupon Code" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <select name="type" className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Flat</option>
            <option>Percentage</option>
          </select>
          <input name="discountValue" type="number" placeholder="Discount Value" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="minimumCartValue" type="number" placeholder="Minimum Order Value" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="maximumDiscount" type="number" placeholder="Maximum Discount" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <input name="validTo" type="date" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
            <input name="isActive" type="checkbox" />
            Enable coupon
          </label>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Coupon List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Minimum Order</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {couponRows.map((coupon) => (
                <tr key={coupon._id.toString()} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-700">{coupon.code}</td>
                  <td className="px-4 py-3">{coupon.type}</td>
                  <td className="px-4 py-3">{coupon.discountValue}</td>
                  <td className="px-4 py-3">Rs. {coupon.minimumCartValue}</td>
                  <td className="px-4 py-3">
                    {coupon.validTo ? new Date(coupon.validTo).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">{coupon.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    <form action={deleteCoupon.bind(null, coupon._id.toString())}>
                      <ConfirmButton
                        type="submit"
                        message="Delete this coupon?"
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
