import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import "@/lib/models/customer";
import { Product } from "@/lib/models/product";
import { Category } from "@/lib/models/category";
import { Order } from "@/lib/models/order";
import { Inventory } from "@/lib/models/inventory";
import { OrderItem } from "@/lib/models/orderItem";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [totalProducts, totalCategories, totalOrders, inventoryData, recentOrdersData, orderItemsData] =
    await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      Inventory.find().populate("product").lean() as any,
      Order.find().populate("customer").sort({ createdAt: -1 }).limit(5).lean() as any,
      OrderItem.find().sort({ createdAt: -1 }).lean() as any
    ]);

  const inventory = inventoryData as any[];
  const recentOrders = recentOrdersData as any[];
  const orderItems = orderItemsData as any[];

  const lowStockItems = inventory.filter((item) => item.stockStatus === "Low").length;
  const totalInventoryValue = inventory.reduce((sum, item) => {
    const product = item.product as { pricing?: { costPrice?: number } };
    return sum + (item.currentStock || 0) * (product?.pricing?.costPrice || 0);
  }, 0);

  const topSellingMap = new Map<string, { name: string; units: number; revenue: number }>();
  for (const item of orderItems) {
    const existing = topSellingMap.get(item.name) || {
      name: item.name,
      units: 0,
      revenue: 0
    };
    existing.units += item.quantity || 0;
    existing.revenue += (item.quantity || 0) * (item.price || 0);
    topSellingMap.set(item.name, existing);
  }
  const topSellingProducts = Array.from(topSellingMap.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const summaryCards = [
    { label: "Total Products", value: totalProducts },
    { label: "Total Categories", value: totalCategories },
    { label: "Total Orders", value: totalOrders },
    { label: "Low Stock Items", value: lowStockItems },
    { label: "Inventory Value", value: `Rs. ${totalInventoryValue.toLocaleString()}` }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 p-6 text-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/75">Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold">Stationery Admin Overview</h1>
            <p className="mt-2 text-sm text-white/80">
              Monitor catalog, inventory, orders, and operational status from one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/content"
              className="rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Content
            </Link>
            <Link
              href="/admin/catalog/products/new"
              className="rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700">Recent Orders</h2>
          <div className="mt-4 space-y-3 md:hidden">
            {recentOrders.map((order) => (
              <div
                key={order._id.toString()}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{order.orderId}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {(order.customer as { name?: string })?.name || "-"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Rs. {order.totalAmount}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600">
                  <div>
                    <p className="uppercase tracking-wide text-slate-400">Status</p>
                    <p className="mt-1 font-medium text-slate-700">{order.orderStatus}</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-wide text-slate-400">Payment</p>
                    <p className="mt-1 font-medium text-slate-700">{order.paymentStatus}</p>
                  </div>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-slate-500">No recent orders found.</p>
            )}
          </div>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Total</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id.toString()} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-700">{order.orderId}</td>
                    <td className="px-3 py-2">{(order.customer as { name?: string })?.name || "-"}</td>
                    <td className="px-3 py-2">Rs. {order.totalAmount}</td>
                    <td className="px-3 py-2">{order.orderStatus}</td>
                    <td className="px-3 py-2">{order.paymentStatus}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr className="border-t border-slate-100">
                    <td colSpan={5} className="px-3 py-4 text-center text-sm text-slate-500">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Low Stock Alerts</h2>
          <div className="mt-4 space-y-3">
            {inventory
              .filter((item) => item.stockStatus !== "In Stock")
              .slice(0, 6)
              .map((item) => (
                <div
                  key={item._id.toString()}
                  className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                >
                  <p className="font-semibold">{item.sku}</p>
                  <p>Stock: {item.currentStock}</p>
                </div>
              ))}
            {inventory.filter((item) => item.stockStatus !== "In Stock").length === 0 && (
              <p className="text-sm text-slate-500">No stock alerts.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Top Selling Products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Units Sold</th>
                <th className="px-3 py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product) => (
                <tr key={product.name} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-700">{product.name}</td>
                  <td className="px-3 py-2">{product.units}</td>
                  <td className="px-3 py-2">Rs. {product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
