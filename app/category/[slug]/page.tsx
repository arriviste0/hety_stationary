import { notFound } from "next/navigation";
import CategoryListing from "@/components/CategoryListing";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";
import { Product } from "@/lib/models/product";
import {
  mapCategoryToStorefrontCategory,
  mapProductToStorefrontProduct
} from "@/lib/storefront";

type Props = {
  params: { slug: string };
};

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: Props) {
  await connectToDatabase();
  const categoryRecord = (await Category.findOne({
    slug: params.slug,
    status: "Active",
    visibility: "Visible"
  }).lean()) as Record<string, any> | null;

  const category = categoryRecord ? mapCategoryToStorefrontCategory(categoryRecord) : null;
  if (!category) {
    notFound();
  }

  const productRecords = (await Product.find({
    "visibility.status": "Active",
    $or: [{ category: categoryRecord?._id }, { subcategory: categoryRecord?._id }]
  })
    .populate("category")
    .populate("brand")
    .sort({ updatedAt: -1 })
    .lean()) as Array<Record<string, any>>;

  const filtered = productRecords.map(mapProductToStorefrontProduct);

  return <CategoryListing category={category} products={filtered} />;
}
