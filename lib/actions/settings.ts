"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { AdminSetting } from "@/lib/models/adminSetting";

export async function saveAdminSettings(formData: FormData) {
  await connectToDatabase();
  const existingSettings = (await AdminSetting.findOne().lean()) as Record<string, any> | null;
  const existingStorefrontContent = existingSettings?.storefrontContent || {};

  const hasField = (name: string) => formData.has(name);
  const rawMenuSections = String(formData.get("productsMenuSections") || "").trim();
  const rawBrandSectionItems = String(formData.get("brandsSectionItems") || "").trim();

  let parsedMenuSections = existingStorefrontContent.productsMenuSections || [];
  let parsedBrandSectionItems = existingStorefrontContent.brandsSectionItems || [];

  if (rawMenuSections) {
    try {
      parsedMenuSections = JSON.parse(rawMenuSections)
        .map((section: Record<string, any>) => ({
          title: String(section.title || "").trim(),
          items: Array.isArray(section.items)
            ? section.items
                .map((item: Record<string, any>) => ({
                  productId: String(item.productId || "").trim(),
                  label: String(item.label || "").trim(),
                  href: String(item.href || "/#categories").trim() || "/#categories"
                }))
                .filter((item: { label: string; productId: string }) => item.label && item.productId)
            : []
        }))
        .filter((section: { title: string; items: unknown[] }) => section.title && section.items.length > 0);
    } catch {
      parsedMenuSections = existingStorefrontContent.productsMenuSections || [];
    }
  }

  if (rawBrandSectionItems) {
    try {
      parsedBrandSectionItems = JSON.parse(rawBrandSectionItems)
        .map((item: unknown) => String(item || "").trim())
        .filter(Boolean);
    } catch {
      parsedBrandSectionItems = existingStorefrontContent.brandsSectionItems || [];
    }
  }

  await AdminSetting.findOneAndUpdate(
    {},
    {
      companyName: hasField("companyName")
        ? String(formData.get("companyName") || "")
        : existingSettings?.companyName || "",
      brandName: hasField("brandName")
        ? String(formData.get("brandName") || "")
        : existingSettings?.brandName || "",
      gstNumber: hasField("gstNumber")
        ? String(formData.get("gstNumber") || "")
        : existingSettings?.gstNumber || "",
      invoicePrefix: hasField("invoicePrefix")
        ? String(formData.get("invoicePrefix") || "")
        : existingSettings?.invoicePrefix || "",
      companyAddress: hasField("companyAddress")
        ? String(formData.get("companyAddress") || "")
        : existingSettings?.companyAddress || "",
      shippingPolicy: hasField("shippingPolicy")
        ? String(formData.get("shippingPolicy") || "")
        : existingSettings?.shippingPolicy || "",
      paymentModes: hasField("paymentModes")
        ? String(formData.get("paymentModes") || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : existingSettings?.paymentModes || [],
      storefrontContent: {
        productsMenuPrimaryTitle: hasField("productsMenuPrimaryTitle")
          ? String(formData.get("productsMenuPrimaryTitle") || "Retail and Wholesale")
          : existingStorefrontContent.productsMenuPrimaryTitle || "Retail and Wholesale",
        productsMenuBrandsTitle: hasField("productsMenuBrandsTitle")
          ? String(formData.get("productsMenuBrandsTitle") || "Featured Brands")
          : existingStorefrontContent.productsMenuBrandsTitle || "Featured Brands",
        productsMenuPopularTitle: hasField("productsMenuPopularTitle")
          ? String(formData.get("productsMenuPopularTitle") || "Popular Range")
          : existingStorefrontContent.productsMenuPopularTitle || "Popular Range",
        productsMenuSections: parsedMenuSections,
        brandsSectionEyebrow: hasField("brandsSectionEyebrow")
          ? String(formData.get("brandsSectionEyebrow") || "Product Range")
          : existingStorefrontContent.brandsSectionEyebrow || "Product Range",
        brandsSectionHeading: hasField("brandsSectionHeading")
          ? String(
              formData.get("brandsSectionHeading") ||
                "Trusted names across writing, office, and creative supply"
            )
          : existingStorefrontContent.brandsSectionHeading ||
            "Trusted names across writing, office, and creative supply",
        brandsSectionDescription: hasField("brandsSectionDescription")
          ? String(
              formData.get("brandsSectionDescription") ||
                "Stationery, copier, art and craft essentials"
            )
          : existingStorefrontContent.brandsSectionDescription ||
            "Stationery, copier, art and craft essentials",
        brandsSectionBody: hasField("brandsSectionBody")
          ? String(
              formData.get("brandsSectionBody") ||
                "Explore a practical mix of HETY-branded products, school supplies, office essentials, and art materials selected for daily use."
            )
          : existingStorefrontContent.brandsSectionBody ||
            "Explore a practical mix of HETY-branded products, school supplies, office essentials, and art materials selected for daily use.",
        brandsSectionItems: parsedBrandSectionItems
        ,
        productRangeEyebrow: hasField("productRangeEyebrow")
          ? String(formData.get("productRangeEyebrow") || "Product Range")
          : existingStorefrontContent.productRangeEyebrow || "Product Range",
        productRangeHeading: hasField("productRangeHeading")
          ? String(
              formData.get("productRangeHeading") ||
                "Everyday stationery for school, office, and creative work"
            )
          : existingStorefrontContent.productRangeHeading ||
            "Everyday stationery for school, office, and creative work",
        productRangeDescription: hasField("productRangeDescription")
          ? String(
              formData.get("productRangeDescription") ||
                "Explore a practical mix of HETY-branded products, school supplies, office essentials, and art materials selected for daily use."
            )
          : existingStorefrontContent.productRangeDescription ||
            "Explore a practical mix of HETY-branded products, school supplies, office essentials, and art materials selected for daily use."
      }
    },
    { upsert: true }
  );

  revalidatePath("/admin/settings");
  revalidatePath("/admin/content");
  revalidatePath("/");
  redirect("/admin/content?toast=Content%20saved");
}
