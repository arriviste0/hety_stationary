import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Customer } from "@/lib/models/customer";
import { Order } from "@/lib/models/order";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params
}: {
  params: { id: string };
}) {
  await connectToDatabase();
  const [customer, orders] = await Promise.all([
    Customer.findById(params.id).lean() as any,
    Order.find({ customer: params.id }).sort({ date: -1 }).lean() as Promise<Array<Record<string, any>>>
  ]);

  if (!customer) {
    notFound();
  }

  const totalSpend = Number(customer.totalSpend || 0);
  const totalOrders = Number(customer.totalOrders || orders.length || 0);
  const averageOrderValue = totalOrders ? totalSpend / totalOrders : 0;
  const latestAddress = orders.find((order) => order.shippingAddress)?.shippingAddress;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{customer.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {customer.email || "-"} / {customer.phone || "-"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Orders", value: totalOrders },
          { label: "Lifetime Value", value: `Rs. ${totalSpend.toFixed(2)}` },
          { label: "Average Order", value: `Rs. ${averageOrderValue.toFixed(2)}` }
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700">Order history</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Order ID</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Payment</th>
                  <th className="px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={String(order._id)} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-700">{order.orderId}</td>
                    <td className="px-3 py-2">
                      {order.date ? new Date(order.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-3 py-2">{order.orderStatus}</td>
                    <td className="px-3 py-2">{order.paymentStatus}</td>
                    <td className="px-3 py-2">Rs. {Number(order.totalAmount || 0).toFixed(2)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-sm text-slate-500" colSpan={5}>
                      No orders found for this customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">Latest shipping address</h3>
            <div className="mt-3 rounded-xl border border-slate-100 p-6 text-sm text-slate-600">
              {latestAddress ? (
                <>
                  <p>{latestAddress.name || customer.name}</p>
                  <p>{latestAddress.line1 || "-"}</p>
                  {latestAddress.line2 ? <p>{latestAddress.line2}</p> : null}
                  <p>
                    {latestAddress.city || "-"}, {latestAddress.state || "-"}{" "}
                    {latestAddress.postalCode || ""}
                  </p>
                  <p>{latestAddress.country || "India"}</p>
                </>
              ) : (
                <p>No saved shipping address found yet.</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Customer notes</h2>
            <p className="mt-3 text-sm text-slate-600">{customer.notes || "No notes yet."}</p>
            <div className="mt-4 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
              Status: {customer.status || "Active"}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Marg Mapping</h2>
            <p className="mt-3 text-sm text-slate-600">
              Party Code: {customer.margMapping?.margPartyCode || "-"}
            </p>
            <p className="text-sm text-slate-600">
              Sync Status: {customer.margMapping?.syncStatus || "Pending"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-700">Credit balance</h2>
            <p className="mt-3 text-sm text-slate-600">Limit: Rs. {customer.creditLimit || 0}</p>
            <p className="text-sm text-slate-600">Balance: Rs. {customer.creditBalance || 0}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
