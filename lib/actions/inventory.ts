"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Inventory } from "@/lib/models/inventory";
import { Product } from "@/lib/models/product";
import { StockMovement } from "@/lib/models/stockMovement";

function resolveStockStatus(currentStock: number, reorderLevel: number) {
  if (currentStock <= 0) {
    return "Out";
  }

  if (currentStock <= reorderLevel) {
    return "Low";
  }

  return "In Stock";
}

export async function adjustInventory(formData: FormData) {
  await connectToDatabase();

  const sku = String(formData.get("sku") || "").trim();
  const quantityChange = Number(formData.get("quantityChange") || 0);
  const reason = String(formData.get("reason") || "Manual correction").trim();
  const reference = String(formData.get("reference") || "Manual Adjustment").trim();
  const user = String(formData.get("user") || "admin").trim();

  if (!sku || !Number.isFinite(quantityChange) || quantityChange === 0) {
    redirect("/admin/inventory?toast=Enter%20a%20valid%20SKU%20and%20quantity");
  }

  const inventory = await Inventory.findOne({ sku });

  if (!inventory) {
    redirect("/admin/inventory?toast=Inventory%20record%20not%20found");
  }

  const nextStock = Math.max(0, (inventory.currentStock || 0) + quantityChange);
  const reorderLevel = inventory.reorderLevel || 0;
  const stockStatus = resolveStockStatus(nextStock, reorderLevel);

  inventory.currentStock = nextStock;
  inventory.stockStatus = stockStatus;
  await inventory.save();

  if (inventory.product) {
    await Product.updateOne(
      { _id: inventory.product },
      {
        $set: {
          "inventory.stockQuantity": nextStock,
          "inventory.reorderLevel": reorderLevel
        }
      }
    );
  }

  await StockMovement.create({
    product: inventory.product,
    sku,
    quantityChange,
    reason,
    reference,
    user
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inventory");
  redirect("/admin/inventory?toast=Inventory%20updated");
}
