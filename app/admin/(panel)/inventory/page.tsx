import { connectToDatabase } from "@/lib/mongodb";
import { Inventory } from "@/lib/models/inventory";
import { StockMovement } from "@/lib/models/stockMovement";
import { adjustInventory } from "@/lib/actions/inventory";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  await connectToDatabase();
  const inventory = (await Inventory.find()
    .populate("product")
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean()) as unknown as Array<Record<string, any>>;
  const movements = (await StockMovement.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()) as unknown as Array<Record<string, any>>;

  const totalSkus = inventory.length;
  const lowStockItems = inventory.filter((item) => item.stockStatus === "Low");
  const outOfStockItems = inventory.filter((item) => item.stockStatus === "Out");
  const totalUnits = inventory.reduce(
    (sum, item) => sum + Number(item.currentStock || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Inventory</h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor stock levels, low stock reports, and movement logs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tracked SKUs", value: totalSkus, tone: "bg-slate-50 text-slate-700" },
          { label: "Low Stock", value: lowStockItems.length, tone: "bg-amber-50 text-amber-700" },
          { label: "Out of Stock", value: outOfStockItems.length, tone: "bg-rose-50 text-rose-700" },
          { label: "Units in Stock", value: totalUnits, tone: "bg-emerald-50 text-emerald-700" }
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
            <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-2xl font-semibold ${card.tone}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Stock overview</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Product Name</th>
                <th className="px-3 py-2">Current Stock</th>
                <th className="px-3 py-2">Reorder Level</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Warehouse</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id.toString()} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-semibold text-slate-700">{item.sku}</td>
                  <td className="px-3 py-2">
                    {(item.product as { name?: string })?.name || "-"}
                  </td>
                  <td className="px-3 py-2">{item.currentStock}</td>
                  <td className="px-3 py-2">{item.reorderLevel}</td>
                  <td className="px-3 py-2">{item.stockStatus}</td>
                  <td className="px-3 py-2">{item.warehouse || "Main"}</td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-sm text-slate-500" colSpan={6}>
                    Inventory will appear after seeding products.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Low stock report</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {lowStockItems.slice(0, 5).map((item) => (
              <div
                key={item._id.toString()}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
              >
                <span>{item.sku}</span>
                <span className="text-amber-600">Low ({item.currentStock})</span>
              </div>
            ))}
            {lowStockItems.length === 0 && <p>No low stock items.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700">Out of stock alert</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {outOfStockItems.slice(0, 5).map((item) => (
              <div
                key={item._id.toString()}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
              >
                <span>{item.sku}</span>
                <span className="text-rose-600">Out of stock</span>
              </div>
            ))}
            {outOfStockItems.length === 0 && <p>No out-of-stock items.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Stock adjustment</h2>
        <form action={adjustInventory} className="mt-4 grid gap-3 sm:grid-cols-5">
          <input
            name="sku"
            placeholder="SKU"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            name="quantityChange"
            type="number"
            placeholder="Quantity change"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            name="reason"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option>Manual correction</option>
            <option>Damage</option>
            <option>Audit</option>
            <option>Stock inward</option>
            <option>Stock outward</option>
          </select>
          <input
            name="reference"
            placeholder="Reference"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Log adjustment
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-500">
          Adjustments update live stock, product inventory, and stock movement history.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Stock movement log</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Change</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Reference</th>
                <th className="px-3 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement) => (
                <tr key={movement._id.toString()} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    {movement.createdAt
                      ? new Date(movement.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2">{movement.sku}</td>
                  <td className="px-3 py-2">
                    {movement.quantityChange > 0 ? "+" : ""}
                    {movement.quantityChange}
                  </td>
                  <td className="px-3 py-2">{movement.reason}</td>
                  <td className="px-3 py-2">{movement.reference}</td>
                  <td className="px-3 py-2">{movement.user}</td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-sm text-slate-500" colSpan={6}>
                    No stock movements yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
