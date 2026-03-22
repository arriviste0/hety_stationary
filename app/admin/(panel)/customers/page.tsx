import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import CustomersTable from "@/components/admin/CustomersTable";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  await connectToDatabase();
  const customers = (await Customer.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()) as unknown as Array<Record<string, any>>;

  const rows = customers.map((customer) => ({
    ...customer,
    _id: customer._id.toString(),
    lastOrderDate: customer.lastOrderDate
      ? customer.lastOrderDate.toISOString()
      : undefined
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor customer history, notes, and Marg sync status.
        </p>
      </div>
      <CustomersTable customers={rows} />
    </div>
  );
}
