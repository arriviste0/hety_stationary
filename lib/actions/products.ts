"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";
import { Inventory } from "@/lib/models/inventory";
import { Tag } from "@/lib/models/tag";
import { slugify } from "@/lib/utils/slug";

export async function createProduct(formData: FormData) {
  await connectToDatabase();
  const name = String(formData.get("name") || "");
  const sku = String(formData.get("sku") || "");
  const slug = String(formData.get("slug") || slugify(name));
  const tagsInput = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const existingTags = tagsInput.length
    ? await Tag.find({ name: { $in: tagsInput } })
    : [];
  const existingNames = new Set(existingTags.map((tag) => tag.name));
  const newTags = tagsInput.filter((tag) => !existingNames.has(tag));
  const createdTags = newTags.length
    ? await Tag.insertMany(newTags.map((tag) => ({ name: tag, slug: slugify(tag) })))
    : [];
  const tagIds = [...existingTags, ...createdTags].map((tag) => tag._id);

  const product = await Product.create({
    name,
    sku,
    barcode: String(formData.get("barcode") || ""),
    slug,
    shortDescription: String(formData.get("shortDescription") || ""),
    description: String(formData.get("description") || ""),
    category: formData.get("categoryId") || undefined,
    subcategory: formData.get("subcategoryId") || undefined,
    brand: formData.get("brandId") || undefined,
    pricing: {
      mrp: Number(formData.get("mrp") || 0),
      sellingPrice: Number(formData.get("sellingPrice") || 0),
      costPrice: Number(formData.get("costPrice") || 0),
      discountPrice: Number(formData.get("discountPrice") || 0),
      gstPercent: Number(formData.get("gstPercent") || 0),
      hsnCode: String(formData.get("hsnCode") || ""),
      discountRules: formData.get("discountType")
        ? [
            {
              ruleType: String(formData.get("discountType") || ""),
              value: Number(formData.get("discountValue") || 0),
              minQty: Number(formData.get("discountMinQty") || 0)
            }
          ]
        : []
    },
    inventory: {
      stockQuantity: Number(formData.get("stockQuantity") || 0),
      reorderLevel: Number(formData.get("reorderLevel") || 10),
      unit: String(formData.get("unit") || "pcs"),
      minOrderQty: Number(formData.get("minOrderQty") || 1),
      maxOrderQty: Number(formData.get("maxOrderQty") || 100)
    },
    imageUrls: String(formData.get("imageUrls") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    attributes: {
      color: String(formData.get("color") || ""),
      size: String(formData.get("size") || ""),
      packSize: String(formData.get("packSize") || ""),
      paperType: String(formData.get("paperType") || ""),
      gsm: String(formData.get("gsm") || ""),
      brandName: String(formData.get("brandName") || "")
    },
    seo: {
      metaTitle: String(formData.get("metaTitle") || ""),
      metaDescription: String(formData.get("metaDescription") || "")
    },
    visibility: {
      status: String(formData.get("status") || "Active"),
      featured: formData.get("featured") === "on",
      tags: tagIds
    },
    margMapping: {
      margItemCode: String(formData.get("margItemCode") || "")
    }
  });

  await Inventory.create({
    product: product._id,
    sku: product.sku,
    currentStock: product.inventory?.stockQuantity || 0,
    reorderLevel: product.inventory?.reorderLevel || 10,
    stockStatus:
      (product.inventory?.stockQuantity || 0) === 0
        ? "Out"
        : (product.inventory?.stockQuantity || 0) <
          (product.inventory?.reorderLevel || 0)
        ? "Low"
        : "In Stock"
  });

  revalidatePath("/admin/catalog/products");
  redirect("/admin/catalog/products?toast=Product%20created");
}

export async function updateProduct(id: string, formData: FormData) {
  await connectToDatabase();
  const tagsInput = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const existingTags = tagsInput.length
    ? await Tag.find({ name: { $in: tagsInput } })
    : [];
  const existingNames = new Set(existingTags.map((tag) => tag.name));
  const newTags = tagsInput.filter((tag) => !existingNames.has(tag));
  const createdTags = newTags.length
    ? await Tag.insertMany(newTags.map((tag) => ({ name: tag, slug: slugify(tag) })))
    : [];
  const tagIds = [...existingTags, ...createdTags].map((tag) => tag._id);
  await Product.updateOne(
    { _id: id },
    {
      name: String(formData.get("name") || ""),
      sku: String(formData.get("sku") || ""),
      barcode: String(formData.get("barcode") || ""),
      slug: String(formData.get("slug") || slugify(String(formData.get("name") || ""))),
      shortDescription: String(formData.get("shortDescription") || ""),
      description: String(formData.get("description") || ""),
      category: formData.get("categoryId") || undefined,
      subcategory: formData.get("subcategoryId") || undefined,
      brand: formData.get("brandId") || undefined,
      pricing: {
        mrp: Number(formData.get("mrp") || 0),
        sellingPrice: Number(formData.get("sellingPrice") || 0),
        costPrice: Number(formData.get("costPrice") || 0),
        discountPrice: Number(formData.get("discountPrice") || 0),
        gstPercent: Number(formData.get("gstPercent") || 0),
        hsnCode: String(formData.get("hsnCode") || ""),
        discountRules: formData.get("discountType")
          ? [
              {
                ruleType: String(formData.get("discountType") || ""),
                value: Number(formData.get("discountValue") || 0),
                minQty: Number(formData.get("discountMinQty") || 0)
              }
            ]
          : []
      },
      inventory: {
        stockQuantity: Number(formData.get("stockQuantity") || 0),
        reorderLevel: Number(formData.get("reorderLevel") || 10),
        unit: String(formData.get("unit") || "pcs"),
        minOrderQty: Number(formData.get("minOrderQty") || 1),
        maxOrderQty: Number(formData.get("maxOrderQty") || 100)
      },
      imageUrls: String(formData.get("imageUrls") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      attributes: {
        color: String(formData.get("color") || ""),
        size: String(formData.get("size") || ""),
        packSize: String(formData.get("packSize") || ""),
        paperType: String(formData.get("paperType") || ""),
        gsm: String(formData.get("gsm") || ""),
        brandName: String(formData.get("brandName") || "")
      },
      seo: {
        metaTitle: String(formData.get("metaTitle") || ""),
        metaDescription: String(formData.get("metaDescription") || "")
      },
      visibility: {
        status: String(formData.get("status") || "Active"),
        featured: formData.get("featured") === "on",
        tags: tagIds
      },
      margMapping: {
        margItemCode: String(formData.get("margItemCode") || "")
      }
    }
  );

  await Inventory.updateOne(
    { sku: String(formData.get("sku") || "") },
    {
      currentStock: Number(formData.get("stockQuantity") || 0),
      reorderLevel: Number(formData.get("reorderLevel") || 10),
      stockStatus:
        Number(formData.get("stockQuantity") || 0) === 0
          ? "Out"
          : Number(formData.get("stockQuantity") || 0) <
            Number(formData.get("reorderLevel") || 0)
          ? "Low"
          : "In Stock"
    }
  );

  revalidatePath("/admin/catalog/products");
  redirect("/admin/catalog/products?toast=Product%20updated");
}

export async function deleteProduct(id: string) {
  await connectToDatabase();
  await Product.deleteOne({ _id: id });
  revalidatePath("/admin/catalog/products");
  redirect("/admin/catalog/products?toast=Product%20deleted");
}
