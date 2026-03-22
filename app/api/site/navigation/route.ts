import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import { Brand } from "@/lib/models/brand";
import { AdminSetting } from "@/lib/models/adminSetting";
import { normalizeImageUrl } from "@/lib/storefront";

export const dynamic = "force-dynamic";

function chunkItems<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export async function GET() {
  await connectToDatabase();

  const [categories, brands, settings] = await Promise.all([
    Category.find({ status: "Active", visibility: "Visible" })
      .sort({ sortOrder: 1, name: 1 })
      .lean(),
    Brand.find({ status: "Active" }).sort({ name: 1 }).lean(),
    AdminSetting.findOne().lean()
  ]);

  const categoryRows = categories as Array<Record<string, any>>;
  const brandRows = brands as Array<Record<string, any>>;
  const storefrontContent = (settings as Record<string, any> | null)?.storefrontContent || {};

  const rootCategories = categoryRows.filter((category) => !category.parent);
  const childCategories = categoryRows.filter((category) => category.parent);

  const groupedCategories =
    rootCategories.length > 0
      ? rootCategories.slice(0, 3).map((category) => {
          const children = childCategories
            .filter((child) => String(child.parent) === String(category._id))
            .slice(0, 4)
            .map((child) => ({
              label: child.name,
              href: `/category/${child.slug}`
            }));

          return {
            title: category.name,
            items:
              children.length > 0
                ? children
                : [
                    {
                      label: category.name,
                      href: `/category/${category.slug}`
                    }
                  ]
          };
        })
      : chunkItems(categoryRows.slice(0, 8), 4).map((group, index) => ({
          title: index === 0 ? "Business Segments" : "Store Demand",
          items: group.map((category) => ({
            label: category.name,
            href: `/category/${category.slug}`
          }))
        }));
  const menuCategories = groupedCategories.map((group, index) =>
    index === 0
      ? {
          ...group,
          items: [{ label: "All Categories", href: "/categories" }, ...group.items]
        }
      : group
  );

  const featuredBrands = brandRows.slice(0, 4).map((brand) => ({
    label: brand.name,
    href: "/#brands"
  }));
  const popularBrands = brandRows.slice(4, 8).map((brand) => ({
    label: brand.name,
    href: "/#brands"
  }));

  const configuredProductSections = Array.isArray(storefrontContent.productsMenuSections)
    ? storefrontContent.productsMenuSections
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
        .filter((section: { title: string; items: unknown[] }) => section.title && section.items.length > 0)
    : [];

  const menuProducts =
    configuredProductSections.length > 0
      ? configuredProductSections
      : [
          {
            title: storefrontContent.productsMenuPrimaryTitle || "Retail and Wholesale",
            items: [
              { label: "All Products", href: "/products" },
              ...categoryRows.slice(0, 4).map((category) => ({
                label: category.name,
                href: `/category/${category.slug}`
              }))
            ]
          },
          {
            title: storefrontContent.productsMenuBrandsTitle || "Featured Brands",
            items: featuredBrands
          },
          {
            title: storefrontContent.productsMenuPopularTitle || "Popular Range",
            items:
              popularBrands.length > 0
                ? popularBrands
                : featuredBrands.map((brand) => ({
                    ...brand
                  }))
          }
        ];

  const homeCategories = categoryRows.slice(0, 7).map((category) => ({
    name: category.name,
    slug: category.slug,
    image: normalizeImageUrl(category.image),
    description: category.description || ""
  }));

  const homeBrands = brandRows.map((brand) => brand.name);

  return NextResponse.json({
    megaMenus: {
      Products: menuProducts,
      Categories: menuCategories
    },
    homeCategories,
    homeBrands,
    storefrontContent: {
      brandsSectionEyebrow:
        storefrontContent.brandsSectionEyebrow || "Product Range",
      brandsSectionHeading:
        storefrontContent.brandsSectionHeading ||
        "Trusted names across writing, office, and creative supply",
      brandsSectionDescription:
        storefrontContent.brandsSectionDescription ||
        "Stationery, copier, art and craft essentials"
    }
  });
}
