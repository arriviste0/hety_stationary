"use client";

import Link from "next/link";

export default function CustomersTable({ customers }: { customers: any[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Customers</h2>
        <p className="text-sm text-slate-500">
          Track lifetime value and Marg mapping.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Total Orders</th>
              <th className="px-4 py-3">Total Spend</th>
              <th className="px-4 py-3">Last Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-700">
                  {customer.name}
                </td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.totalOrders}</td>
                <td className="px-4 py-3">₹{customer.totalSpend}</td>
                <td className="px-4 py-3">
                  {customer.lastOrderDate
                    ? new Date(customer.lastOrderDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3">{customer.status}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/customers/${customer._id}`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-sm text-slate-500" colSpan={8}>
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
