import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";
import { Category } from "@/lib/models/category";
import { Order } from "@/lib/models/order";
import { Inventory } from "@/lib/models/inventory";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectToDatabase();

  const [
    totalProducts,
    totalCategories,
    totalOrders,
    lowStockItems,
    recentOrders,
    inventoryItems,
    topSellingProducts
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
    Inventory.countDocuments({ stockStatus: "Low" }),
    Order.find()
      .populate("customer")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Inventory.find().populate("product").lean(),
    Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "orderitems",
          localField: "items",
          foreignField: "_id",
          as: "orderItem"
        }
      },
      { $unwind: "$orderItem" },
      {
        $group: {
          _id: "$orderItem.name",
          units: { $sum: "$orderItem.quantity" },
          revenue: { $sum: { $multiply: ["$orderItem.quantity", "$orderItem.price"] } }
        }
      },
      { $sort: { units: -1 } },
      { $limit: 5 }
    ])
  ]);

  const totalInventoryValue = inventoryItems.reduce((sum, item) => {
    const product = item.product as { pricing?: { costPrice?: number } };
    return sum + (item.currentStock || 0) * (product?.pricing?.costPrice || 0);
  }, 0);

  return NextResponse.json({
    data: {
      totalProducts,
      totalCategories,
      totalOrders,
      lowStockItems,
      totalInventoryValue,
      recentOrders,
      topSellingProducts
    }
  });
}
