import { connectToDatabase } from "@/lib/mongodb";
import "@/lib/models/customer";
import { Order } from "@/lib/models/order";
import { OrderItem } from "@/lib/models/orderItem";
import { Product } from "@/lib/models/product";
import { Category } from "@/lib/models/category";
import { Inventory } from "@/lib/models/inventory";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  await connectToDatabase();

  const [orders, orderItems, products, categories, inventory] = await Promise.all([
    Order.find().populate("customer").sort({ date: -1 }).lean() as Promise<Array<Record<string, any>>>,
    OrderItem.find().populate({
      path: "product",
      populate: { path: "category" }
    }).lean() as Promise<Array<Record<string, any>>>,
    Product.find().lean() as Promise<Array<Record<string, any>>>,
    Category.find().lean() as Promise<Array<Record<string, any>>>,
    Inventory.find().sort({ updatedAt: -1 }).lean() as Promise<Array<Record<string, any>>>
  ]);

  const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const deliveredSales = orders
    .filter((order) => order.orderStatus === "Delivered")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const pendingSales = orders
    .filter((order) => order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const averageOrderValue = orders.length ? totalSales / orders.length : 0;
  const activeProducts = products.filter(
    (product) => product.visibility?.status === "Active"
  ).length;
  const lowStockCount = inventory.filter((item) => item.stockStatus === "Low").length;
  const outOfStockCount = inventory.filter((item) => item.stockStatus === "Out").length;

  const productSales = new Map<
    string,
    { name: string; quantity: number; sales: number; profit: number }
  >();
  const categorySales = new Map<string, { name: string; quantity: number; sales: number }>();

  for (const item of orderItems) {
    const product = item.product as Record<string, any> | null;
    const quantity = Number(item.quantity || 0);
    const grossSales = quantity * Number(item.price || 0);
    const discount = Number(item.discount || 0);
    const netSales = grossSales - discount;
    const costPrice = Number(product?.pricing?.costPrice || 0);
    const profit = netSales - quantity * costPrice;

    const productKey = String(product?._id || item.product || item._id);
    const currentProduct = productSales.get(productKey) || {
      name: item.name || product?.name || item.sku || "Product",
      quantity: 0,
      sales: 0,
      profit: 0
    };
    currentProduct.quantity += quantity;
    currentProduct.sales += netSales;
    currentProduct.profit += profit;
    productSales.set(productKey, currentProduct);

    const categoryName =
      (product?.category as Record<string, any> | undefined)?.name || "Uncategorized";
    const currentCategory = categorySales.get(categoryName) || {
      name: categoryName,
      quantity: 0,
      sales: 0
    };
    currentCategory.quantity += quantity;
    currentCategory.sales += netSales;
    categorySales.set(categoryName, currentCategory);
  }

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
  const topCategories = Array.from(categorySales.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
  const grossProfit = Array.from(productSales.values()).reduce(
    (sum, item) => sum + item.profit,
    0
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review sales, stock health, category performance, and profit summary.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Sales", value: `Rs. ${totalSales.toFixed(2)}` },
          { label: "Average Order Value", value: `Rs. ${averageOrderValue.toFixed(2)}` },
          { label: "Gross Profit", value: `Rs. ${grossProfit.toFixed(2)}` },
          { label: "Active Products", value: `${activeProducts}/${products.length}` }
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Product-wise sales</h2>
              <p className="mt-1 text-sm text-slate-500">
                Top selling products based on recorded order items.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {orderItems.length} line items
            </span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Qty Sold</th>
                  <th className="px-3 py-2">Sales</th>
                  <th className="px-3 py-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((item) => (
                  <tr key={item.name} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-700">{item.name}</td>
                    <td className="px-3 py-2">{item.quantity}</td>
                    <td className="px-3 py-2">Rs. {item.sales.toFixed(2)}</td>
                    <td className="px-3 py-2">Rs. {item.profit.toFixed(2)}</td>
                  </tr>
                ))}
                {topProducts.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-sm text-slate-500" colSpan={4}>
                      No sales data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Sales health</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Delivered sales</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Rs. {deliveredSales.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs uppercase tracking-wide text-amber-700">Open pipeline</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Rs. {pendingSales.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Tracked categories</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{categories.length}</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-4">
              <p className="text-xs uppercase tracking-wide text-rose-700">Out of stock / Low stock</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {outOfStockCount} / {lowStockCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Category-wise sales</h2>
          <div className="mt-4 space-y-3">
            {topCategories.map((item) => (
              <div key={item.name} className="rounded-xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-700">{item.name}</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Rs. {item.sales.toFixed(2)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.quantity} units sold</p>
              </div>
            ))}
            {topCategories.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                Category sales will appear after orders are created.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Stock report</h2>
          <div className="mt-4 space-y-3">
            {inventory.slice(0, 6).map((item) => (
              <div key={String(item._id)} className="flex items-center justify-between rounded-xl border border-slate-100 p-4 text-sm">
                <div>
                  <p className="font-medium text-slate-700">{item.sku}</p>
                  <p className="text-slate-500">Reorder level: {item.reorderLevel}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{item.currentStock} units</p>
                  <p className="text-slate-500">{item.stockStatus}</p>
                </div>
              </div>
            ))}
            {inventory.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No inventory data found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
