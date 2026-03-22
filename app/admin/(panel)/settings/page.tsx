import { connectToDatabase } from "@/lib/mongodb";
import { AdminSetting } from "@/lib/models/adminSetting";
import { AdminUser } from "@/lib/models/adminUser";
import { saveAdminSettings } from "@/lib/actions/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await connectToDatabase();
  const [settings, users] = await Promise.all([
    AdminSetting.findOne().lean() as any,
    AdminUser.find().sort({ createdAt: -1 }).lean() as any
  ]);
  const userRows = users as any[];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Maintain company profile, GST, shipping, payment, invoice, and role settings.
        </p>
      </div>

      <form action={saveAdminSettings} className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Company Profile</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input name="companyName" defaultValue={settings?.companyName || ""} placeholder="Company Name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="brandName" defaultValue={settings?.brandName || ""} placeholder="Brand Name" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="gstNumber" defaultValue={settings?.gstNumber || ""} placeholder="GST Number" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="invoicePrefix" defaultValue={settings?.invoicePrefix || ""} placeholder="Invoice Prefix" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <textarea name="companyAddress" defaultValue={settings?.companyAddress || ""} placeholder="Company Address" className="min-h-[100px] rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Operations Settings</h2>
          <div className="mt-4 space-y-3">
            <textarea name="shippingPolicy" defaultValue={settings?.shippingPolicy || ""} placeholder="Shipping Settings" className="min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <input name="paymentModes" defaultValue={settings?.paymentModes?.join(", ") || ""} placeholder="Payment Modes (comma separated)" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700">
              Save Settings
            </button>
          </div>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Admin Users and Roles</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {userRows.map((user) => (
                <tr key={user._id.toString()} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-700">{user.name}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2">{user.role.replace(/_/g, " ")}</td>
                  <td className="px-3 py-2">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
