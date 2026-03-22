import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/order";
import OrdersTable from "@/components/admin/OrdersTable";
import Pagination from "@/components/admin/Pagination";
import { deleteOrder } from "@/lib/actions/orders";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams
}: {
  searchParams: { page?: string };
}) {
  await connectToDatabase();
  const page = Number(searchParams.page || 1);
  const limit = 20;
  const total = await Order.countDocuments();
  const orders = (await Order.find()
    .populate("customer")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()) as unknown as Array<Record<string, any>>;

  const rows = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    date: order.date ? order.date.toISOString() : undefined,
    customer: (order.customer as { name?: string })?.name
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor the full order pipeline with status actions.
        </p>
      </div>
      <OrdersTable orders={rows} deleteOrder={deleteOrder} />
      <Pagination page={page} total={total} limit={limit} basePath="/admin/orders" />
    </div>
  );
}
