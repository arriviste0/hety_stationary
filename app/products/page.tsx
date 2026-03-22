import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";
import { mapProductToStorefrontProduct } from "@/lib/storefront";
import AllProductsListing from "@/components/AllProductsListing";

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  await connectToDatabase();

  const products = (await Product.find({ "visibility.status": "Active" })
    .populate("category")
    .populate("brand")
    .sort({ "visibility.featured": -1, updatedAt: -1 })
    .lean()) as Array<Record<string, any>>;

  return <AllProductsListing products={products.map(mapProductToStorefrontProduct)} />;
}
